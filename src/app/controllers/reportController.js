const ReportService = require('../../services/reportService');
const catchAsync = require('../../utils/catchAsync');

class ReportController {

    // =====================================================================
    // USER REPORTS
    // =====================================================================

    // [GET] /api/reports/weight?from=...&to=...
    getWeightReport = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const { from, to } = req.query;
        const result = await ReportService.getWeightReport({ userId, from, to });
        res.status(200).json(result);
    });

    // [GET] /api/reports/weekly
    getWeeklyReport = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const result = await ReportService.getWeeklyReport({ userId });
        res.status(200).json(result);
    });

    // [GET] /api/reports/nutrition?date=YYYY-MM-DD
    getNutritionReport = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const { date } = req.query;
        const result = await ReportService.getNutritionReport({ userId, date });
        res.status(200).json(result);
    });

    // [GET] /api/reports/summary?from=...&to=...
    getSummaryReport = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const { from, to } = req.query;
        const result = await ReportService.getSummaryReport({ userId, from, to });
        res.status(200).json(result);
    });

    // [GET] /api/reports/exercise?from=...&to=...
    getExerciseReport = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const { from, to } = req.query;
        const result = await ReportService.getExerciseReport({ userId, from, to });
        res.status(200).json(result);
    });

    // =====================================================================
    // ADMIN REPORTS
    // =====================================================================

    // [GET] /api/reports/admin/dashboard
    getAdminDashboard = catchAsync(async (req, res, next) => {
        const result = await ReportService.getAdminDashboard();
        res.status(200).json(result);
    });

    // [GET] /api/reports/admin/moderation?from=...&to=...
    getModerationReport = catchAsync(async (req, res, next) => {
        const { from, to } = req.query;
        const result = await ReportService.getModerationReport({ from, to });
        res.status(200).json(result);
    });

    // [GET] /api/reports/admin/user-activity?from=...&to=...
    getUserActivityReport = catchAsync(async (req, res, next) => {
        const { from, to } = req.query;
        const result = await ReportService.getUserActivityReport({ from, to });
        res.status(200).json(result);
    });
}

module.exports = new ReportController();
