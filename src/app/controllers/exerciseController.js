const ExerciseService = require('../../services/exerciseService');
const catchAsync = require('../../utils/catchAsync');
const fs = require('fs');

class ExerciseController {
//  [POST] /api/exercises
    createNewExercise = catchAsync(async (req, res, next) => {
        const data = req.body;

        if (typeof data.instructions === 'string') {
            try { data.instructions = JSON.parse(data.instructions); } catch (e) {}
        }
        if (typeof data.targetMuscles === 'string') {
            try { data.targetMuscles = JSON.parse(data.targetMuscles); } catch (e) {}
        }

        if (req.file) {
            data.imgURL = `/uploads/exercise/${req.file.filename}`;
        }

        const userId = req.user.userId;
        const role = req.user.role;

        try {
            const newExercise = await ExerciseService.createNewExercise({ data, userId, role });
            res.status(201).json(newExercise);
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Lỗi xóa file rác exercise:", err);
                });
            }
            return next(error);
        }
    });

//  [GET] /api/exercises
    searchExercise = catchAsync(async (req, res, next) => {
        const data = req.query;
        const userId = req.user.userId;
        const role = req.user.role;
        const listExercises = await ExerciseService.searchExercise({ data, userId, role });
        res.status(200).json(listExercises);
    });

//  [GET] /api/exercises/:id
    getDetailExercise = catchAsync(async (req, res, next) => {
        const exerciseId = req.params.id;
        const detailExercise = await ExerciseService.getDetailExercise({ exerciseId });
        res.status(200).json(detailExercise);
    });

//  [PUT] /api/exercises/:id
    updateExercise = catchAsync(async (req, res, next) => {
        const exerciseId = req.params.id;
        const data = req.body;

        if (typeof data.instructions === 'string') {
            try { data.instructions = JSON.parse(data.instructions); } catch (e) {}
        }
        if (typeof data.targetMuscles === 'string') {
            try { data.targetMuscles = JSON.parse(data.targetMuscles); } catch (e) {}
        }

        if (req.file) {
            data.imgURL = `/uploads/exercise/${req.file.filename}`;
        }

        const userId = req.user.userId;
        const role = req.user.role;

        try {
            const updatedExercise = await ExerciseService.updateExercise({ exerciseId, userId, role, data });
            res.status(200).json(updatedExercise);
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Lỗi xóa file rác exercise:", err);
                });
            }
            return next(error);
        }
    });

//  [DELETE] /api/exercises/:id
    deleteExercise = catchAsync(async (req, res, next) => {
        const exerciseId = req.params.id;
        const userId = req.user.userId;
        const role = req.user.role;
        await ExerciseService.deleteExercise({ exerciseId, userId, role });
        res.status(200).json({ msg: "Xóa bài tập thành công" });
    });

//  [GET] /api/exercises/metadata
    getMetadata = catchAsync(async (req, res, next) => {
        const metadata = await ExerciseService.getMetadata();
        res.status(200).json(metadata);
    });

//  [GET] /api/exercises/recommendations
    getRecommendations = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const recommendations = await ExerciseService.getRecommendations({ userId });
        res.status(200).json(recommendations);
    });

//  [GET] /api/exercises/favorites
    getMyFavorites = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const favorites = await ExerciseService.getMyFavorites({ userId });
        res.status(200).json(favorites);
    });

//  [POST] /api/exercises/:id/favorite
    toggleFavorite = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const exerciseId = req.params.id;
        const result = await ExerciseService.toggleFavorite({ userId, exerciseId });
        res.status(200).json(result);
    });

//  [GET] /api/exercises/:id/related
    getRelatedExercises = catchAsync(async (req, res, next) => {
        const exerciseId = req.params.id;
        const related = await ExerciseService.getRelatedExercises({ exerciseId });
        res.status(200).json(related);
    });
}

module.exports = new ExerciseController();