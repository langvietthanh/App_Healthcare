const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const ExerciseController = require('../app/controllers/exerciseController');
const upload = require('../middleware/uploadMiddleware');

/**
 * @route   [POST] /api/exercises
 * @desc    Tạo bài tập mới (Admin: public, User: cá nhân)
 */
router.post('/',
    authMiddleware,
    upload.single('image'),
    ExerciseController.createNewExercise
);

/**
 * @route   [GET] /api/exercises
 * @desc    Tìm kiếm danh sách bài tập (hỗ trợ query ?q=...&category=...)
 */
router.get('/',
    authMiddleware,
    ExerciseController.searchExercise
);

/**
 * @route   [GET] /api/exercises/metadata
 * @desc    Lấy danh sách các danh mục và nhóm cơ
 */
router.get('/metadata',
    ExerciseController.getMetadata
);

/**
 * @route   [GET] /api/exercises/recommendations
 * @desc    Gợi ý bài tập thông minh theo mục tiêu User
 */
router.get('/recommendations',
    authMiddleware,
    ExerciseController.getRecommendations
);

/**
 * @route   [GET] /api/exercises/favorites
 * @desc    Lấy danh sách bài tập đã lưu
 */
router.get('/favorites',
    authMiddleware,
    ExerciseController.getMyFavorites
);

/**
 * @route   [GET] /api/exercises/:id
 * @desc    Chi tiết bài tập
 */
router.get('/:id',
    authMiddleware,
    ExerciseController.getDetailExercise
);

/**
 * @route   [PUT] /api/exercises/:id
 * @desc    Sửa thông tin bài tập (Admin: public, User: cá nhân)
 */
router.put('/:id',
    authMiddleware,
    upload.single('image'),
    ExerciseController.updateExercise
);

/**
 * @route   [DELETE] /api/exercises/:id
 * @desc    Xóa bài tập (Admin: public, User: cá nhân)
 */
router.delete('/:id',
    authMiddleware,
    ExerciseController.deleteExercise
);

/**
 * @route   [POST] /api/exercises/:id/favorite
 * @desc    Lưu / Bỏ lưu bài tập (Toggle)
 */
router.post('/:id/favorite',
    authMiddleware,
    ExerciseController.toggleFavorite
);

/**
 * @route   [GET] /api/exercises/:id/related
 * @desc    Lấy danh sách bài tập liên quan
 */
router.get('/:id/related',
    authMiddleware,
    ExerciseController.getRelatedExercises
);

module.exports = router;