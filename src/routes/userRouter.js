const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const {
    validateInfomationInput,
    validatePhysicalDetailInput,
    validatePasswordInput,
    validateGoalsInput,
} = require('../middleware/validate');

/**
 * @route   [PUT] /api/user/info
 * @desc    Cập nhật thông tin cá nhân
 */
router.put('/info',
    authMiddleware,
    validateInfomationInput,
    UserController.changeInfo
);

/**
 * @route   [PUT] /api/user/physical-detail
 * @desc    Cập nhật thông tin thể chất
 */
router.put('/physical-detail',
    authMiddleware,
    validatePhysicalDetailInput,
    UserController.updatePhysicalDetail
);

/**
 * @route   [PUT] /api/user/goals
 * @desc    Cập nhật mục tiêu
 */
router.put('/goals',
    authMiddleware,
    validateGoalsInput,
    UserController.updateGoals
);

/**
 * @route   [PUT] /api/user/password
 * @desc    Thay đổi mật khẩu
 */
router.put('/password',
    authMiddleware,
    validatePasswordInput,
    UserController.changePassword
);

/**
 * @route   [POST] /api/user/weight/ensure
 * @desc    Đảm bảo hôm nay có bản ghi cân nặng (auto-fill từ bản ghi gần nhất nếu cần)
 */
router.post('/weight/ensure',
    authMiddleware,
    UserController.ensureTodayWeight
);

/**
 * @route   [PUT] /api/user/weight
 * @desc    Cập nhật cân nặng hôm nay (upsert BodyMetricHistory + đồng bộ physicalDetail)
 * @body    { weight: number }
 */
router.put('/weight',
    authMiddleware,
    UserController.updateTodayWeight
);

/**
 * @route [GET] /api/user/admin/all
 * @desc  Lấy tất cả user
 * @access Private
 */
router.get('/admin/all',
    authMiddleware,
    requireAdmin,
    UserController.getAllUser
);

/**
 * @route [DELETE] /api/user/admin/:id
 * @desc  Xóa user (chỉ Admin)
 * @access Private/Admin
 */
router.delete('/admin/:id',
    authMiddleware,
    requireAdmin,
    UserController.deleteUser
);

module.exports = router;