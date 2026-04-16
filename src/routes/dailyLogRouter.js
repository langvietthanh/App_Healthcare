const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const DailyLogController = require('../app/controllers/dailyLogController');

/**
 * @route   [PUT] /api/daily-logs/water
 * @desc    Cập nhật lượng nước uống trong ngày
 */
router.put('/water',
    authMiddleware,
    DailyLogController.updateWaterIntake
);

/**
 * @route   [POST] /api/daily-logs/foods
 * @desc    Ghi nhận món ăn vào Nhật ký (Tính Macro & Calo)
 */
router.post('/foods',
    authMiddleware,
    DailyLogController.addFoodEntry
);

/**
 * @route   [DELETE] /api/daily-logs/foods/:entryId
 * @desc    Gỡ món ăn khỏi Nhật ký (Khấu trừ Macro)
 */
router.delete('/foods/:entryId',
    authMiddleware,
    DailyLogController.deleteFoodEntry
);

/**
 * @route   [POST] /api/daily-logs/exercises
 * @desc    Ghi nhận Bài tập tự do (Single Exercise)
 */
router.post('/exercises',
    authMiddleware,
    DailyLogController.addExerciseEntry
);

/**
 * @route   [DELETE] /api/daily-logs/exercises/:entryId
 * @desc    Xóa bài tập tự do
 */
router.delete('/exercises/:entryId',
    authMiddleware,
    DailyLogController.deleteExerciseEntry
);

/**
 * @route   [POST] /api/daily-logs/sessions/import
 * @desc    Kế thừa mảng Buổi tập vào Nhật ký theo Lô (Bulk Import)
 */
router.post('/sessions/import',
    authMiddleware,
    DailyLogController.importSessionFromPlan
);

/**
 * @route   [GET] /api/daily-logs/:date
 * @desc    Xem tổng quan thông số và trạng thái nhật ký 1 ngày
 */
router.get('/:date',
    authMiddleware,
    DailyLogController.getDailyOverview
);

module.exports = router;
