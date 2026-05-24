const DailyLog = require('../app/models/DailyLog');
const DailyFoodEntry = require('../app/models/DailyFoodEntry');
const DailyExerciseEntry = require('../app/models/DailyExerciseEntry');
const WorkoutPlan = require('../app/models/WorkoutPlan');
const Food = require('../app/models/Food');
const AppError = require('../utils/appError');
const { convertToGram } = require('../utils/unitConverter');

class DailyLogService {
    /**
     * Lọc và Khởi tạo bản ghi DailyLog thao tác ngày
     * @param {String} userId 
     * @param {Date|String} dateString 
     * @returns {Object} bản ghi nhật ký cá nhân 
     */
    async getOrCreateDailyLog(userId, dateString) {
        let log = await DailyLog.findOne({ userId, date: dateString });
        
        if (!log) {
            log = new DailyLog({ userId, date: dateString });
            // Tạm cấp phát DailyLog Document mới nếu hệ thống chưa Index thời gian chỉ định
            await log.save();
        }
        return log;
    }

    /**
     * Lấy thống kê tổng quan ngày (Core + Các bảng vệ tinh)
     */
    async getDailyOverview({ userId, date }) {
        const log = await this.getOrCreateDailyLog(userId, date);
        const foods = await DailyFoodEntry.find({ userId, date });
        const exercises = await DailyExerciseEntry.find({ userId, date }).populate('exerciseId', 'imgURL');

        return { log, foods, exercises };
    }

    /**
     * Set cập nhật lượng nước uống trong ngày (ml/lít)
     */
    async updateWaterIntake({ userId, data }) {
        const { date, waterAmount } = data;
        const log = await this.getOrCreateDailyLog(userId, date);
        log.waterIntake = waterAmount;
        await log.save();
        return log;
    }

    // MODULE: GHI CHÉP NHẬT KÝ DINH DƯỠNG (DAILY FOOD LOGGING)
    // ----------------------------------------------------------------------

    /**
     * Ghi nhận Món ăn và Tính toán Chỉ số Macro vào Nhật ký
     * Áp dụng Transaction Pattern vi mô thông qua biến thiên $inc
     */
    async addFoodEntry({ userId, data }) {
        const { date, foodRefId, mealType, intakeAmount, intakeUnit } = data;

        const food = await Food.findById(foodRefId);
        if (!food) throw new AppError('Document tham chiếu Food gốc từ CSDL không tồn tại', 404);

        // Map cấu hình tham số dinh dưỡng theo Đơn vị Unit Base gốc (khẩu phần tiêu chuẩn 100g)
        const actualGram = convertToGram({ unit: intakeUnit, amount: intakeAmount });
        const ratio = actualGram / food.servingSize.weightInGram;

        // Trích xuất tỉ lệ tích phân Data dinh dưỡng thực tế (Actual Macronutrients)
        const actualCalories = food.nutrients.calories * ratio;
        const actualProtein = food.nutrients.protein * ratio;
        const actualCarbs = food.nutrients.carbs * ratio;
        const actualFat = food.nutrients.fat * ratio;

        const log = await this.getOrCreateDailyLog(userId, date);

        const capitalizedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase();

        // Khởi tạo Database Snapshot phục vụ lưu vết lịch sử cá nhân (Audit logs)
        const newEntry = new DailyFoodEntry({
            dailyLogId: log._id,
            userId,
            date,
            foodRefId: food._id,
            foodName: food.name,
            mealType: capitalizedMealType,
            intakeAmount,
            intakeUnit,
            calories: actualCalories,
            protein: actualProtein,
            carbs: actualCarbs,
            fat: actualFat
        });
        
        await newEntry.save();

        // Ứng dụng kỹ thuật Atomic Operators ($inc) đảm bảo dữ liệu xử lý song song không ngắt quãng
        const updatedLog = await DailyLog.findByIdAndUpdate(
            log._id,
            {
                $inc: {
                    "totals.caloriesIn": actualCalories,
                    "totals.protein": actualProtein,
                    "totals.carbs": actualCarbs,
                    "totals.fat": actualFat
                }
            },
            { new: true }
        );

        return { entry: newEntry, log: updatedLog };
    }

    /**
     * Gỡ Món ăn khỏi dữ liệu Lịch và Hoàn trả (Refund) giá trị Macro
     */
    async deleteFoodEntry({ entryId, userId }) {
        const entry = await DailyFoodEntry.findOne({ _id: entryId, userId });
        if (!entry) throw new AppError('Truy xuất bản ghi món ăn thất bại do ID hỏng', 404);

        // Triển khai Hoàn trả chỉ số Macro (Decrement Mapping) bằng cách đảo lộn giá trị (-) cho $inc
        await DailyLog.findByIdAndUpdate(
            entry.dailyLogId,
            {
                $inc: {
                    "totals.caloriesIn": -entry.calories,
                    "totals.protein": -entry.protein,
                    "totals.carbs": -entry.carbs,
                    "totals.fat": -entry.fat
                }
            }
        );

        await DailyFoodEntry.findByIdAndDelete(entryId);

        return { message: "Quá trình Roll-back và Xóa truy vết món ăn hoàn tất ổn định." };
    }

    // MODULE: GHI CHÉP NHẬT KÝ THỂ THAO CHUYÊN SÂU (DAILY WORKOUT LOGGING)
    // ----------------------------------------------------------------------

    /**
     * Cung cấp endpoint khởi tạo Lịch sử luyện tập đơn mục (Single Logging)
     */
    async addExerciseEntry({ userId, data }) {
        const { date, exerciseId, name, durationMinutes, sets, reps, weight, time } = data;
        
        const log = await this.getOrCreateDailyLog(userId, date);

        const newEntry = new DailyExerciseEntry({
            dailyLogId: log._id,
            userId,
            date,
            exerciseId,
            name,
            durationMinutes,
            sets,
            reps,
            weight,
            time
        });
        
        await newEntry.save();
        return newEntry;
    }

    /**
     * Can thiệp xóa lịch sử luyện tập đơn vị theo yêu cầu
     */
    async deleteExerciseEntry({ entryId, userId }) {
        const entry = await DailyExerciseEntry.findOneAndDelete({ _id: entryId, userId });
        if (!entry) throw new AppError('Dữ liệu không tồn tại do sai cấu hình truy xuất', 404);
        return { message: "Cập nhật dữ liệu hệ thống luyện tập thành công." };
    }

    /**
     * Khai phá dữ liệu Lịch Tập chuyển tiếp thành Bản ghi Lịch sử (Routine Execution Converter)
     */
    async importSessionFromPlan({ userId, data }) {
        const { date, workoutPlanId, sessionId } = data;

        const plan = await WorkoutPlan.findOne({ _id: workoutPlanId, userId })
            .populate('sessions.exercises.exerciseId'); 
            
        if (!plan) throw new AppError('Chỉ mục Workspace ID hệ thống không hợp lệ', 404);

        const session = plan.sessions.id(sessionId); 
        if (!session) throw new AppError('Biến tham chiếu Target Session ID thất bại', 404);

        const log = await this.getOrCreateDailyLog(userId, date);

        // Tạo mảng đối tượng Mapping chuẩn bị cho Bulk Write Transaction
        const entriesToInsert = session.exercises.map(exItem => {
            return {
                dailyLogId: log._id,
                userId,
                date,
                exerciseId: exItem.exerciseId ? exItem.exerciseId._id : null,
                name: exItem.exerciseId ? exItem.exerciseId.name : "Bài tập tự chọn",
                workoutPlanId: plan._id, 
                workoutSessionId: session._id,
                durationMinutes: exItem.targetDurationMinutes,
                sets: exItem.targetSets,                       
                reps: exItem.targetReps,
                time: new Date()
            };
        });

        // Kỹ thuật Bulk Insert tối ưu hóa cấu trúc Server Networking Overhead
        const insertedData = await DailyExerciseEntry.insertMany(entriesToInsert);

        return {
            message: `Hoạt động Import Bulk ${insertedData.length} records đã được phân luồng xử lý hoàn thiện.`,
            data: insertedData
        };
    }
}

module.exports = new DailyLogService();
