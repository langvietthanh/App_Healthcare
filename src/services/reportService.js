const DailyLog = require('../app/models/DailyLog');
const DailyFoodEntry = require('../app/models/DailyFoodEntry');
const DailyExerciseEntry = require('../app/models/DailyExerciseEntry');
const BodyMetricHistory = require('../app/models/BodyMetricHistory');
const User = require('../app/models/User');
const Food = require('../app/models/Food');
const Exercise = require('../app/models/Exercise');
const AppError = require('../utils/appError');

class ReportService {

    // =====================================================================
    // USER REPORTS
    // =====================================================================

    /**
     * Biểu đồ cân nặng theo khoảng thời gian
     * Query BodyMetricHistory sort theo ngày tăng dần
     */
    async getWeightReport({ userId, from, to }) {
        const filter = { userId };

        if (from || to) {
            filter.dateRecorded = {};
            if (from) filter.dateRecorded.$gte = new Date(from);
            if (to) filter.dateRecorded.$lte = new Date(to + 'T23:59:59.999Z');
        }

        const records = await BodyMetricHistory.find(filter)
            .sort({ dateRecorded: 1 })
            .select('dateRecorded weight -_id');

        return {
            totalRecords: records.length,
            data: records
        };
    }

    /**
     * Thống kê tổng hợp 7 ngày gần nhất
     * Aggregate DailyLog + DailyExerciseEntry
     */
    async getWeeklyReport({ userId }) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Lấy DailyLog 7 ngày
        const logs = await DailyLog.find({
            userId,
            date: { $gte: sevenDaysAgo, $lte: today }
        }).sort({ date: 1 });

        // Đếm số bài tập theo từng ngày
        const exerciseCounts = await DailyExerciseEntry.aggregate([
            {
                $match: {
                    userId: require('mongoose').Types.ObjectId.createFromHexString(userId),
                    date: { $gte: sevenDaysAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Map exercise count theo ngày
        const exerciseMap = {};
        exerciseCounts.forEach(item => {
            exerciseMap[item._id] = item.count;
        });

        // Xây dựng dailyData
        const dailyData = logs.map(log => {
            const dateKey = new Date(log.date).toISOString().split('T')[0];
            return {
                date: dateKey,
                caloriesIn: log.totals.caloriesIn,
                protein: log.totals.protein,
                carbs: log.totals.carbs,
                fat: log.totals.fat,
                waterIntake: log.waterIntake,
                exerciseCount: exerciseMap[dateKey] || 0
            };
        });

        // Tính trung bình
        const count = dailyData.length || 1;
        const averages = {
            calories: Math.round(dailyData.reduce((sum, d) => sum + d.caloriesIn, 0) / count),
            protein: Math.round(dailyData.reduce((sum, d) => sum + d.protein, 0) / count * 10) / 10,
            carbs: Math.round(dailyData.reduce((sum, d) => sum + d.carbs, 0) / count * 10) / 10,
            fat: Math.round(dailyData.reduce((sum, d) => sum + d.fat, 0) / count * 10) / 10,
            water: Math.round(dailyData.reduce((sum, d) => sum + d.waterIntake, 0) / count)
        };

        // So sánh với mục tiêu calo
        const user = await User.findById(userId).select('goals.dailyCalories');
        const dailyCaloriesGoal = user?.goals?.dailyCalories || 2000;
        const tolerance = 0.1; // ±10%
        const daysOnTarget = dailyData.filter(d => {
            const diff = Math.abs(d.caloriesIn - dailyCaloriesGoal);
            return diff <= dailyCaloriesGoal * tolerance;
        }).length;

        return {
            dailyData,
            averages,
            goalComparison: {
                daysOnTarget,
                dailyCaloriesGoal
            }
        };
    }

    /**
     * Phân tích dinh dưỡng chi tiết theo 1 ngày
     * Group theo mealType, tính % macro, so sánh mục tiêu
     */
    async getNutritionReport({ userId, date }) {
        if (!date) throw new AppError('Vui lòng truyền query ?date=YYYY-MM-DD', 400);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const entries = await DailyFoodEntry.find({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        // Tổng macro
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
        entries.forEach(e => {
            totalCalories += e.calories || 0;
            totalProtein += e.protein || 0;
            totalCarbs += e.carbs || 0;
            totalFat += e.fat || 0;
        });

        // Tính phần trăm macro (theo gram → % calo)
        const proteinCal = totalProtein * 4;
        const carbsCal = totalCarbs * 4;
        const fatCal = totalFat * 9;
        const totalMacroCal = proteinCal + carbsCal + fatCal || 1;

        const macroBreakdown = {
            proteinPercent: Math.round(proteinCal / totalMacroCal * 100),
            carbsPercent: Math.round(carbsCal / totalMacroCal * 100),
            fatPercent: Math.round(fatCal / totalMacroCal * 100)
        };

        // Group theo bữa ăn
        const mealMap = {};
        entries.forEach(e => {
            const meal = e.mealType || 'Snack';
            if (!mealMap[meal]) {
                mealMap[meal] = { mealType: meal, totalCalories: 0, items: [] };
            }
            mealMap[meal].totalCalories += e.calories || 0;
            mealMap[meal].items.push({
                foodName: e.foodName,
                calories: e.calories,
                protein: e.protein,
                carbs: e.carbs,
                fat: e.fat,
                intakeAmount: e.intakeAmount,
                intakeUnit: e.intakeUnit
            });
        });
        const byMeal = Object.values(mealMap);

        // So sánh với mục tiêu
        const user = await User.findById(userId).select('goals.dailyCalories');
        const target = user?.goals?.dailyCalories || 2000;

        return {
            date,
            totalCalories: Math.round(totalCalories),
            totalProtein: Math.round(totalProtein * 10) / 10,
            totalCarbs: Math.round(totalCarbs * 10) / 10,
            totalFat: Math.round(totalFat * 10) / 10,
            macroBreakdown,
            byMeal,
            goalComparison: {
                actual: Math.round(totalCalories),
                target,
                difference: Math.round(totalCalories - target)
            }
        };
    }

    /**
     * Tổng hợp báo cáo theo khoảng thời gian tùy chỉnh
     * Tính consistency, averages, totals, bestDay/worstDay
     */
    async getSummaryReport({ userId, from, to }) {
        if (!from || !to) throw new AppError('Vui lòng truyền query ?from=YYYY-MM-DD&to=YYYY-MM-DD', 400);

        const startDate = new Date(from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);

        // Tính tổng số ngày trong khoảng
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        const logs = await DailyLog.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        const loggedDays = logs.length;
        const consistency = totalDays > 0 ? Math.round(loggedDays / totalDays * 100) : 0;

        // Tính totals và averages
        let sumCalories = 0, sumProtein = 0, sumCarbs = 0, sumFat = 0, sumWater = 0;
        logs.forEach(log => {
            sumCalories += log.totals.caloriesIn;
            sumProtein += log.totals.protein;
            sumCarbs += log.totals.carbs;
            sumFat += log.totals.fat;
            sumWater += log.waterIntake;
        });

        const divisor = loggedDays || 1;
        const averages = {
            calories: Math.round(sumCalories / divisor),
            protein: Math.round(sumProtein / divisor * 10) / 10,
            carbs: Math.round(sumCarbs / divisor * 10) / 10,
            fat: Math.round(sumFat / divisor * 10) / 10,
            water: Math.round(sumWater / divisor)
        };

        const totals = {
            calories: Math.round(sumCalories),
            protein: Math.round(sumProtein * 10) / 10,
            carbs: Math.round(sumCarbs * 10) / 10,
            fat: Math.round(sumFat * 10) / 10
        };

        // Tìm bestDay / worstDay (dựa vào độ lệch so với mục tiêu calo)
        const user = await User.findById(userId).select('goals.dailyCalories');
        const dailyGoal = user?.goals?.dailyCalories || 2000;

        let bestDay = null, worstDay = null;
        let minDiff = Infinity, maxDiff = 0;

        logs.forEach(log => {
            const diff = Math.abs(log.totals.caloriesIn - dailyGoal);
            const dateStr = new Date(log.date).toISOString().split('T')[0];

            if (diff < minDiff) {
                minDiff = diff;
                bestDay = { date: dateStr, caloriesIn: Math.round(log.totals.caloriesIn), difference: Math.round(diff) };
            }
            if (diff > maxDiff) {
                maxDiff = diff;
                worstDay = { date: dateStr, caloriesIn: Math.round(log.totals.caloriesIn), difference: Math.round(diff) };
            }
        });

        return {
            period: { from, to, totalDays, loggedDays, consistency },
            averages,
            totals,
            bestDay,
            worstDay
        };
    }

    /**
     * Thống kê hoạt động thể thao theo khoảng thời gian
     * Aggregate DailyExerciseEntry → phân bố category, top exercises
     */
    async getExerciseReport({ userId, from, to }) {
        if (!from || !to) throw new AppError('Vui lòng truyền query ?from=YYYY-MM-DD&to=YYYY-MM-DD', 400);

        const startDate = new Date(from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);

        const userObjId = require('mongoose').Types.ObjectId.createFromHexString(userId);

        const matchStage = {
            $match: {
                userId: userObjId,
                date: { $gte: startDate, $lte: endDate }
            }
        };

        // Thống kê tổng quan
        const [overview] = await DailyExerciseEntry.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    totalDuration: { $sum: { $ifNull: ['$durationMinutes', 0] } },
                    activeDays: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSessions: 1,
                    totalDuration: 1,
                    activeDays: { $size: '$activeDays' }
                }
            }
        ]);

        // Phân bố theo category (cần populate exerciseId)
        const byCategory = await DailyExerciseEntry.aggregate([
            matchStage,
            {
                $lookup: {
                    from: 'exercises',
                    localField: 'exerciseId',
                    foreignField: '_id',
                    as: 'exerciseInfo'
                }
            },
            { $unwind: { path: '$exerciseInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ['$exerciseInfo.category', 'Không xác định'] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $project: { _id: 0, category: '$_id', count: 1 } }
        ]);

        // Top 5 bài tập thường xuyên nhất
        const topExercises = await DailyExerciseEntry.aggregate([
            matchStage,
            {
                $group: {
                    _id: '$name',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, name: '$_id', count: 1 } }
        ]);

        return {
            totalSessions: overview?.totalSessions || 0,
            totalDuration: overview?.totalDuration || 0,
            activeDays: overview?.activeDays || 0,
            byCategory,
            topExercises
        };
    }

    // =====================================================================
    // ADMIN REPORTS
    // =====================================================================

    /**
     * Dashboard tổng quan hệ thống (Admin Only)
     * Snapshot: users, foods, exercises, pending items
     */
    async getAdminDashboard() {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            totalUsers,
            newUsers7d,
            newUsers30d,
            totalFoods,
            totalExercises,
            pendingFoods,
            pendingExercises
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            Food.countDocuments({ isDeleted: false }),
            Exercise.countDocuments({ isDeleted: false }),
            Food.countDocuments({ verifyStatus: 'pending', isDeleted: false }),
            Exercise.countDocuments({ verifyStatus: 'pending', isDeleted: false })
        ]);

        return {
            totalUsers,
            newUsers7d,
            newUsers30d,
            totalFoods,
            totalExercises,
            pendingItems: {
                foods: pendingFoods,
                exercises: pendingExercises,
                total: pendingFoods + pendingExercises
            }
        };
    }

    /**
     * Báo cáo kiểm duyệt content (Admin Only)
     * Phân bố trạng thái verify + Top contributors
     */
    async getModerationReport({ from, to }) {
        const dateFilter = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) dateFilter.$lte = new Date(to + 'T23:59:59.999Z');

        const hasDateFilter = from || to;
        const matchCondition = hasDateFilter 
            ? { isDeleted: false, createdAt: dateFilter }
            : { isDeleted: false };

        // Phân bố trạng thái cho Food
        const foodStatus = await Food.aggregate([
            { $match: matchCondition },
            { $group: { _id: '$verifyStatus', count: { $sum: 1 } } }
        ]);

        // Phân bố trạng thái cho Exercise
        const exerciseStatus = await Exercise.aggregate([
            { $match: matchCondition },
            { $group: { _id: '$verifyStatus', count: { $sum: 1 } } }
        ]);

        // Format status breakdown
        const formatStatus = (arr) => {
            const result = { none: 0, pending: 0, approved: 0, rejected: 0 };
            arr.forEach(item => { result[item._id] = item.count; });
            return result;
        };

        // Top contributors (người đóng góp nhiều nhất)
        const topContributors = await Food.aggregate([
            { $match: { ...matchCondition, creatorId: { $ne: null } } },
            { $group: { _id: '$creatorId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    username: '$userInfo.username',
                    count: 1
                }
            }
        ]);

        return {
            statusBreakdown: {
                foods: formatStatus(foodStatus),
                exercises: formatStatus(exerciseStatus)
            },
            topContributors
        };
    }

    /**
     * Phân tích hoạt động người dùng (Admin Only)
     * Biểu đồ DailyLog + phân bố mục tiêu
     */
    async getUserActivityReport({ from, to }) {
        const dateFilter = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) dateFilter.$lte = new Date(to + 'T23:59:59.999Z');
        const hasDateFilter = from || to;

        // Số DailyLog tạo mỗi ngày
        const logMatchCondition = hasDateFilter ? { date: dateFilter } : {};
        const dailyLogCount = await DailyLog.aggregate([
            { $match: logMatchCondition },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: '$_id', count: 1 } }
        ]);

        // Phân bố mục tiêu người dùng
        const goalDistribution = await User.aggregate([
            {
                $group: {
                    _id: '$goals.goal',
                    count: { $sum: 1 }
                }
            },
            { $project: { _id: 0, goal: '$_id', count: 1 } }
        ]);

        // Tính phần trăm
        const totalUsers = goalDistribution.reduce((sum, g) => sum + g.count, 0) || 1;
        const goalDistributionWithPercent = goalDistribution.map(g => ({
            ...g,
            percent: Math.round(g.count / totalUsers * 100)
        }));

        return {
            dailyLogCount,
            goalDistribution: goalDistributionWithPercent
        };
    }
}

module.exports = new ReportService();
