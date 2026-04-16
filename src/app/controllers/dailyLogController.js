const DailyLogService = require('../../services/dailyLogService');
const catchAsync = require('../../utils/catchAsync');

class DailyLogController {

    // [GET] /api/daily-logs/:date
    getDailyOverview = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const date = req.params.date;
        const result = await DailyLogService.getDailyOverview({ userId, date });
        res.status(200).json(result);
    });

    // [PUT] /api/daily-logs/water
    updateWaterIntake = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const data = req.body; // Gồm: date, waterAmount
        const result = await DailyLogService.updateWaterIntake({ userId, data });
        res.status(200).json({ msg: 'Cập nhật lượng nước thành công', data: result });
    });

    // [POST] /api/daily-logs/foods
    addFoodEntry = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const data = req.body; 
        const result = await DailyLogService.addFoodEntry({ userId, data });
        res.status(201).json({ msg: 'Ghi log món ăn thành công', data: result });
    });

    // [DELETE] /api/daily-logs/foods/:entryId
    deleteFoodEntry = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const entryId = req.params.entryId;
        const result = await DailyLogService.deleteFoodEntry({ entryId, userId });
        res.status(200).json(result);
    });

    // -------------------------------------------------------------
    // TÍCH HỢP BÀI TẬP (EXERCISES)
    // -------------------------------------------------------------

    // [POST] /api/daily-logs/exercises
    addExerciseEntry = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const data = req.body; 
        const result = await DailyLogService.addExerciseEntry({ userId, data });
        res.status(201).json({ msg: 'Ghi log thể thao thành công', data: result });
    });

    // [DELETE] /api/daily-logs/exercises/:entryId
    deleteExerciseEntry = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const entryId = req.params.entryId;
        const result = await DailyLogService.deleteExerciseEntry({ entryId, userId });
        res.status(200).json(result);
    });

    // [POST] /api/daily-logs/sessions/import
    importSessionFromPlan = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const data = req.body; // Gồm: date, workoutPlanId, sessionId
        const result = await DailyLogService.importSessionFromPlan({ userId, data });
        res.status(201).json(result);
    });

}

module.exports = new DailyLogController();
