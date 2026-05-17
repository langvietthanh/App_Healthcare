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
}

module.exports = new UserService();