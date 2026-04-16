const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const DailyExerciseEntry = new Schema({
    dailyLogId: { type: ObjectId, ref: 'DailyLog', required: true, index: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    exerciseId: { type: ObjectId, ref: 'Exercise' },
    name: { type: String },
    workoutPlanId: { type: ObjectId, ref: 'WorkoutPlan' },
    workoutSessionId: { type: ObjectId }, // Nội vi mảng session
    durationMinutes: { type: Number },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    time: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('DailyExerciseEntry', DailyExerciseEntry);
