const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const {validateInfomationInput, validatePhysicalDetailInput, validatePasswordInput, } = require('../middleware/userMiddleware');

// @route   PUT /api/user/info
// @desc    Cập nhật thông tin cá nhân
router.put('/info', authMiddleware, validateInfomationInput, userController.changeInfo);

// @route   PUT /api/user/physical-detail
// @desc    Cập nhật thông tin thể chất
router.put('/physical-detail', authMiddleware, validatePhysicalDetailInput, userController.updatePhysicalDetail);

// // @route   PUT /api/user/goals
// // @desc    Cập nhật mục tiêu
// router.put('/goals', authMiddleware, userController.goals);

// // @route   PUT /api/user/password
// // @desc    Thay đổi mật khẩu
router.put('/password', authMiddleware, validatePasswordInput , userController.changePassword);

module.exports = router;