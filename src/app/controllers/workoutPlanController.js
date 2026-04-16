const WorkoutPlanService = require('../../services/workoutPlanService');
const catchAsync = require('../../utils/catchAsync');

class WorkoutPlanController {

//  [POST] /api/workout-plans
    createPlan = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const data = req.body;
        const newPlan = await WorkoutPlanService.createPlan({ userId, data });
        res.status(201).json(newPlan);
    });

//  [GET] /api/workout-plans
    getAllPlans = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const plans = await WorkoutPlanService.getAllPlans({ userId });
        res.status(200).json(plans);
    });

//  [GET] /api/workout-plans/:id
    getPlanById = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const userId = req.user.userId;
        const plan = await WorkoutPlanService.getPlanById({ planId, userId });
        res.status(200).json(plan);
    });

//  [PUT] /api/workout-plans/:id
    updatePlan = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const userId = req.user.userId;
        const data = req.body;
        const updatedPlan = await WorkoutPlanService.updatePlan({ planId, userId, data });
        res.status(200).json({ msg: 'Chỉnh sửa Lịch tập thành công.', plan: updatedPlan });
    });

//  [PATCH] /api/workout-plans/:id/active
    setActivePlan = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const userId = req.user.userId;
        const activePlan = await WorkoutPlanService.setActivePlan({ planId, userId });
        res.status(200).json({ msg: 'Đã đặt Lịch này làm lịch hiện hành.', activePlan });
    });

//  [DELETE] /api/workout-plans/:id
    deletePlan = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const userId = req.user.userId;
        await WorkoutPlanService.deletePlan({ planId, userId });
        res.status(200).json({ msg: 'Xóa thành công' });
    });

//  [POST] /api/workout-plans/:id/sessions
    addSession = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const userId = req.user.userId;
        const data = req.body;
        const updatedPlan = await WorkoutPlanService.addSession({ planId, userId, data });
        res.status(201).json({ msg: 'Đã thêm buổi tập mới.', plan: updatedPlan });
    });

//  [PUT] /api/workout-plans/:id/sessions/:sessionId
    updateSession = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const sessionId = req.params.sessionId;
        const userId = req.user.userId;
        const data = req.body;
        const updatedPlan = await WorkoutPlanService.updateSession({ planId, sessionId, userId, data });
        res.status(200).json({ msg: 'Cập nhật buổi tập thành công.', plan: updatedPlan });
    });

//  [DELETE] /api/workout-plans/:id/sessions/:sessionId
    deleteSession = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const sessionId = req.params.sessionId;
        const userId = req.user.userId;
        const updatedPlan = await WorkoutPlanService.deleteSession({ planId, sessionId, userId });
        res.status(200).json({ msg: 'Xóa buổi tập thành công.', plan: updatedPlan });
    });

//  [POST] /api/workout-plans/:id/sessions/:sessionId/exercises
    addExercise = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const sessionId = req.params.sessionId;
        const userId = req.user.userId;
        const data = req.body;
        const updatedPlan = await WorkoutPlanService.addExercise({ planId, sessionId, userId, data });
        res.status(201).json({ msg: 'Thêm bài tập thành công.', plan: updatedPlan });
    });

//  [PUT] /api/workout-plans/:id/sessions/:sessionId/exercises/:exerciseObjId
    updateExercise = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const sessionId = req.params.sessionId;
        const exerciseObjectId = req.params.exerciseObjId;
        const userId = req.user.userId;
        const data = req.body;
        const updatedPlan = await WorkoutPlanService.updateExercise({ planId, sessionId, exerciseObjectId, userId, data });
        res.status(200).json({ msg: 'Sửa bài tập thành công.', plan: updatedPlan });
    });

//  [DELETE] /api/workout-plans/:id/sessions/:sessionId/exercises/:exerciseObjId
    deleteExercise = catchAsync(async (req, res, next) => {
        const planId = req.params.id;
        const sessionId = req.params.sessionId;
        const exerciseObjectId = req.params.exerciseObjId;
        const userId = req.user.userId;
        const updatedPlan = await WorkoutPlanService.deleteExercise({ planId, sessionId, exerciseObjectId, userId });
        res.status(200).json({ msg: 'Gỡ bài tập thành công.', plan: updatedPlan });
    });
}

module.exports = new WorkoutPlanController();
