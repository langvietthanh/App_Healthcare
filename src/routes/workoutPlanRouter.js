const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const WorkoutPlanController = require('../app/controllers/workoutPlanController');

// -----------------------------------------------------
// Tầng 1: LỊCH TẬP (WORKOUT PLAN)
// -----------------------------------------------------

router.post('/', authMiddleware, WorkoutPlanController.createPlan);
router.get('/', authMiddleware, WorkoutPlanController.getAllPlans);
router.get('/:id', authMiddleware, WorkoutPlanController.getPlanById);
router.put('/:id', authMiddleware, WorkoutPlanController.updatePlan);
router.patch('/:id/active', authMiddleware, WorkoutPlanController.setActivePlan);
router.delete('/:id', authMiddleware, WorkoutPlanController.deletePlan);

// -----------------------------------------------------
// Tầng 2: BUỔI TẬP (SESSIONS) 
// -----------------------------------------------------

router.post('/:id/sessions', authMiddleware, WorkoutPlanController.addSession);
router.put('/:id/sessions/:sessionId', authMiddleware, WorkoutPlanController.updateSession);
router.delete('/:id/sessions/:sessionId', authMiddleware, WorkoutPlanController.deleteSession);

// -----------------------------------------------------
// Tầng 3: BÀI TẬP (EXERCISES)
// -----------------------------------------------------

router.post('/:id/sessions/:sessionId/exercises', authMiddleware, WorkoutPlanController.addExercise);
router.put('/:id/sessions/:sessionId/exercises/:exerciseObjId', authMiddleware, WorkoutPlanController.updateExercise);
router.delete('/:id/sessions/:sessionId/exercises/:exerciseObjId', authMiddleware, WorkoutPlanController.deleteExercise);

module.exports = router;
