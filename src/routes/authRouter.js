const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');
const authMiddleware = require('../middleware/auth');
const User = require('../app/models/User');


// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Đăng nhập & lấy token
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại (Test token)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;