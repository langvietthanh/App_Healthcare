const express = require('express');
const router = express.Router();
const foodController = require('../app/controllers/foodController');
// const foodMiddleware = require('../middleware/foodMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/foods
// @desc    Tạo món mới (Tạo tùng món)
router.post('/', authMiddleware, foodController.createNewFood);

// @route   GET /api/foods
// @desc    Tìm món ăn
// router.get('/search', foodController.searchFood);

// @route   GET /api/foods/:id
// @desc    Chi tiết món 
// router.post('/:id', foodController.getDetailFood);

// @route   POST /api/foods/my-new-food
// @desc    Thêm món mới vào bữa ăn trong ngày
// router.post('/:id', foodController.addNewFood);

module.exports = router;