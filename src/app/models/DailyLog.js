const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} =  mongoose.Schema.Types;

const DailyLog = new Schema({
    userId: {type: ObjectId, ref: 'User', required: true},
    date: {type: Date, required: true},
    waterIntake: { type: Number, default: 0 },
    // Bảng này hiện đóng vai trò chứa Totals và Nước tổng quan
    totals: {
        caloriesIn: { type: Number, default: 0 }, 
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    }
}, { timestamps: true });

DailyLog.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', DailyLog);
