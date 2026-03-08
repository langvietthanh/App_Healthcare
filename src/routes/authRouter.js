const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {
    validateInfomationInput, 
    validatePhysicalDetailInput, 
    validateGoalsInput, 
} = require('../middleware/validate');

/** 
 * @route   POST /api/auth/register
 * @desc    Đăng ký người dùng mới
*/
router.post('/register', 
    validateInfomationInput, 
    validatePhysicalDetailInput, 
    validateGoalsInput, 
    AuthController.register
);

/** 
 * @route   POST /api/auth/login
 * @desc    Đăng nhập & lấy token
*/
router.post('/login', 
    AuthController.login
);

/** 
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user hiện tại (Test token)
*/
router.get('/me', 
    authMiddleware, 
    AuthController.getMe
);

module.exports = router;