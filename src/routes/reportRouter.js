const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const ReportController = require('../app/controllers/reportController');

// =====================================================================
// USER REPORTS (Authenticated)
// =====================================================================

/**
 * @route   [GET] /api/reports/weight
 * @desc    Biểu đồ cân nặng theo khoảng thời gian
 * @query   ?from=YYYY-MM-DD&to=YYYY-MM-DD (optional)
 */
router.get('/weight',
    authMiddleware,
    ReportController.getWeightReport
);

/**
 * @route   [GET] /api/reports/weekly
 * @desc    Thống kê tổng hợp 7 ngày gần nhất (auto)
 */
router.get('/weekly',
    authMiddleware,
    ReportController.getWeeklyReport
);

/**
 * @route   [GET] /api/reports/nutrition
 * @desc    Phân tích dinh dưỡng chi tiết theo ngày
 * @query   ?date=YYYY-MM-DD
 */
router.get('/nutrition',
    authMiddleware,
    ReportController.getNutritionReport
);

/**
 * @route   [GET] /api/reports/summary
 * @desc    Tổng hợp báo cáo theo khoảng thời gian tùy chỉnh
 * @query   ?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
router.get('/summary',
    authMiddleware,
    ReportController.getSummaryReport
);

/**
 * @route   [GET] /api/reports/exercise
 * @desc    Thống kê hoạt động thể thao theo khoảng thời gian
 * @query   ?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
router.get('/exercise',
    authMiddleware,
    ReportController.getExerciseReport
);

// =====================================================================
// ADMIN REPORTS (Admin Only: authMiddleware → requireAdmin)
// =====================================================================

/**
 * @route   [GET] /api/reports/admin/dashboard
 * @desc    Dashboard tổng quan hệ thống
 */
router.get('/admin/dashboard',
    authMiddleware,
    requireAdmin,
    ReportController.getAdminDashboard
);

/**
 * @route   [GET] /api/reports/admin/moderation
 * @desc    Báo cáo kiểm duyệt content (Food + Exercise)
 * @query   ?from=YYYY-MM-DD&to=YYYY-MM-DD (optional)
 */
router.get('/admin/moderation',
    authMiddleware,
    requireAdmin,
    ReportController.getModerationReport
);

/**
 * @route   [GET] /api/reports/admin/user-activity
 * @desc    Phân tích hoạt động người dùng toàn hệ thống
 * @query   ?from=YYYY-MM-DD&to=YYYY-MM-DD (optional)
 */
router.get('/admin/user-activity',
    authMiddleware,
    requireAdmin,
    ReportController.getUserActivityReport
);

module.exports = router;
