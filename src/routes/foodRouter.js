const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const FoodController = require('../app/controllers/foodController');

/**
 * @route   [POST] /api/foods
 * @desc    Tạo món mới (Tạo tùng món)
 */
router.post('/', 
    authMiddleware, 
    FoodController.createNewFood
);

/**
 * @route   [GET] /api/foods
 * @desc    Tìm món ăn
 */
router.get('/', 
    authMiddleware, 
    FoodController.searchFood
);

/**
 * @route   [GET] /api/foods/pending
 * @desc    Lấy danh sách món chờ duyệt
 */
router.get('/pending', 
    authMiddleware, 
    requireAdmin, 
    FoodController.getPendingFoods
);

/**
 * @route   [GET] /api/foods/my-foods
 * @desc    Lấy danh sách do người dùng tạo ra
 */
router.get('/my-foods',
    authMiddleware,
    FoodController.getMyFoods
);

/**
 * @route   [GET] /api/foods/:id
 * @desc    Chi tiết món 
 */
router.get('/:id',
    authMiddleware, 
    FoodController.getDetailFood
);

/**
 * @route   [PATCH] /api/foods/:id
 * @desc    Admin thay đổi trạng thái xác thực (approve/reject)
 */
router.patch('/:id/verify', 
    authMiddleware, 
    requireAdmin, 
    FoodController.setVerifyStatusFood
);

/**
 * @route   [PUT] /api/foods/:id
 * @desc    Sửa/Cập nhật thông tin món ăn
 */
router.patch('/:id', 
    authMiddleware, 
    FoodController.updateFood
);

/**
 * @route   [DELETE] /api/foods/:id
 * @desc    Xóa các món 
 */
router.delete('/:id', 
    authMiddleware, 
    FoodController.deleteFood
);

module.exports = router;