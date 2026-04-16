const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const WorkoutPlan = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    sessions: [{
        name: { type: String, required: true },
        dayOfWeek: { type: String, enum: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'] },
        startTime: { type: String },
        endTime: { type: String },
        exercises: [{
            exerciseId: { type: ObjectId, ref: 'Exercise', required: true },
            targetSets: { type: Number },
            targetReps: { type: Number },
            targetDurationMinutes: { type: Number },
            restTimeSeconds: { type: Number }
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', WorkoutPlan);
