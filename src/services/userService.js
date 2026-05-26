const User = require('../app/models/User');
const BodyMetricHistory = require('../app/models/BodyMetricHistory');
const AppError = require('../utils/appError');
const HealthCalculations = require('../utils/healthCalculations');
const HealthService = require('./healthService');
const bcrypt = require('bcryptjs');

class UserService {
    async changeInfo({ userId, data, } = {}) {
        const { username, email, birthDate, } = data;
        const update = {
            $set: {
                username,
                email,
                birthDate
            }
        };
        const option = {
            new: true,
            runValidators: true,
        };

        const user = await User.findByIdAndUpdate(userId, update, option).select('-passwordHash');
        if (!user) throw new AppError('User không tồn tại', 401);

        if (birthDate) {
            const newStats = {
                birthDate: birthDate,
                height: user.physicalDetail.height,
                weight: user.physicalDetail.weight,
                gender: user.physicalDetail.gender,
                activityLevel: user.physicalDetail.activityLevel,
            };
            user.physicalDetail = HealthCalculations.calculatePhysicalDetail(newStats);

            let { tdee } = user.physicalDetail;

            let dailyCalories = HealthCalculations.calculateDailyCalories({ goal: user.goals.goal, tdee, });

            user.goals.dailyCalories = dailyCalories;

            await user.save();
        }

        return user;
    }
    // ->
    async updatePhysicalDetail({ userId, data, } = {}) {
        const user = await User.findById(userId);
        if (!user) throw new AppError('User không tồn tại', 401);
        const { height, weight, activityLevel, gender, birthDate, } = data;
        const newStats = {
            birthDate: birthDate || user.birthDate,
            height: height || user.physicalDetail.height,
            weight: weight || user.physicalDetail.weight,
            gender: gender || user.physicalDetail.gender,
            activityLevel: activityLevel || user.physicalDetail.activityLevel,
        };

        user.physicalDetail = HealthCalculations.calculatePhysicalDetail(newStats);

        let idealWeight = HealthCalculations.calculateIdealWeight({ height: user.physicalDetail.height, });
        let advice = HealthService.getAdvice({ idealWeight, weightGoal: user.goals.weightGoal, });
        let dailyCalories = HealthCalculations.calculateDailyCalories({ goal: user.goals.goal, tdee: user.physicalDetail.tdee, });
        let weightAdvice = { idealWeight, advice, };
        user.goals.weightAdvice = weightAdvice;
        user.goals.dailyCalories = dailyCalories;

        await user.save();

        // Lưu lịch sử cân nặng vào BodyMetricHistory (phục vụ biểu đồ Reports)
        const finalWeight = weight || user.physicalDetail.weight;
        await new BodyMetricHistory({ userId, weight: finalWeight }).save();

        // Trả về kết quả
        return user;
    }

    async changePassword({ userId, data, } = {}) {
        const user = await User.findById(userId);
        if (!user) throw new AppError('User không tồn tại', 401);

        let { oldPassword, newPassword, } = data;

        let isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) throw new AppError("Sai mật khẩu", 401);

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        user.passwordHash = newPasswordHash;
        await user.save();
    }

    async updateGoals({ userId, data, } = {}) {
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) throw new AppError('User không tồn tại', 401);


        let { goal, weightGoal, } = data;
        let { tdee, } = user.physicalDetail;

        let dailyCalories = HealthCalculations.calculateDailyCalories({ goal, tdee, });
        let idealWeight = user.goals.weightAdvice.idealWeight;
        let advice = HealthService.getAdvice({ idealWeight, weightGoal, });
        let weightAdvice = { idealWeight, advice, };

        user.goals = { goal, dailyCalories, weightGoal, weightAdvice, };

        await user.save();

        return user;
    }

    /**
     * Đảm bảo hôm nay luôn có bản ghi cân nặng trong BodyMetricHistory.
     * - Nếu đã có bản ghi hôm nay → không làm gì, return bản ghi đó
     * - Nếu chưa có → lấy bản ghi gần nhất, nếu không có thì dùng physicalDetail.weight
     */
    async ensureTodayWeight({ userId }) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Kiểm tra đã có bản ghi hôm nay chưa
        const existingToday = await BodyMetricHistory.findOne({
            userId,
            dateRecorded: { $gte: startOfToday, $lte: endOfToday }
        });
        if (existingToday) return existingToday;

        // Tìm bản ghi gần nhất trước hôm nay
        const lastRecord = await BodyMetricHistory.findOne({ userId })
            .sort({ dateRecorded: -1 })
            .limit(1);

        let weight;
        if (lastRecord) {
            weight = lastRecord.weight;
        } else {
            // Chưa có bất kỳ bản ghi nào → lấy từ profile
            const user = await User.findById(userId).select('physicalDetail.weight');
            if (!user) throw new AppError('User không tồn tại', 401);
            weight = user.physicalDetail.weight;
        }

        const newRecord = await new BodyMetricHistory({ userId, weight, dateRecorded: new Date() }).save();
        return newRecord;
    }

    /**
     * Upsert cân nặng cho hôm nay.
     * - Nếu đã có bản ghi hôm nay → update weight
     * - Nếu chưa có → tạo mới
     * - Đồng thời cập nhật user.physicalDetail.weight
     */
    async updateTodayWeight({ userId, weight }) {
        if (!weight || weight <= 0) throw new AppError('Cân nặng không hợp lệ', 400);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Upsert bản ghi hôm nay
        const record = await BodyMetricHistory.findOneAndUpdate(
            { userId, dateRecorded: { $gte: startOfToday, $lte: endOfToday } },
            { $set: { weight, dateRecorded: new Date() } },
            { upsert: true, new: true }
        );

        // Đồng bộ user.physicalDetail.weight
        await User.findByIdAndUpdate(userId, { $set: { 'physicalDetail.weight': weight } });

        return record;
    }

    /**
     * Lấy danh sách user 
     */
    async getAllUser() {
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        return users;
    }

    /**
     * Xóa user
     */
    async deleteUser({ userId }) {
        const user = await User.findById(userId);
        if (!user) throw new AppError('User không tồn tại', 404);
        if (user.role === 'admin') throw new AppError('Không được phép xóa tài khoản Quản trị viên (Admin)', 403);
        
        await User.findByIdAndDelete(userId);
        
        // Clean up related data (BodyMetricHistory, DailyLogs, etc.) if needed
        await BodyMetricHistory.deleteMany({ userId });
        
        return { message: 'Xóa người dùng thành công' };
    }
}

module.exports = new UserService();