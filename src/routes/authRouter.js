const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Đăng nhập & lấy token
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại (Test token)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;