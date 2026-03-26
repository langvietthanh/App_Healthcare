const ExerciseService = require('../../services/exerciseService');
const catchAsync = require('../../utils/catchAsync');

class ExerciseController {
//  [POST] /api/exercises
    createNewExercise = catchAsync(async (req, res, next) => {
        const data = req.body;
        const newExercise = await ExerciseService.createNewExercise({ data });
        res.status(201).json(newExercise);
    });

//  [GET] /api/exercises
    searchExercise = catchAsync(async (req, res, next) => {
        const data = req.query;
        const listExercises = await ExerciseService.searchExercise({ data });
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
        const updatedExercise = await ExerciseService.updateExercise({ exerciseId, data });
        res.status(200).json(updatedExercise);
    });

//  [DELETE] /api/exercises/:id
    deleteExercise = catchAsync(async (req, res, next) => {
        const exerciseId = req.params.id;
        await ExerciseService.deleteExercise({ exerciseId });
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