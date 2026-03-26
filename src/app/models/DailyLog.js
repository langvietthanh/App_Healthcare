const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} =  mongoose.Schema.Types;

const DailyLog = new Schema({
    userId: {type: ObjectId, ref: 'User', required: true},
    date: {type: Date, required: true},
    foodEntries: [{
        foodRefId: { type: ObjectId, ref: 'FoodLibrary' }, // Link tới món gốc (nếu cần xem chi tiết)
    
        // --- SNAPSHOT DATA (Lưu cứng để không bị đổi khi FoodLibrary đổi) ---
        foodName: String, 
        intakeAmount: Number, // Lượng ăn thực tế (VD: 200g)
        
        // Dinh dưỡng đã tính theo intakeAmount (VD: 100g=50calo thì 200g lưu 100calo)
        calories: Number, 
        protein: Number,
        carbs: Number,
        fat: Number
    }],
    exerciseEntries: [{
        exerciseId: { type: ObjectId, ref: 'Exercise' },
        name: String, // Snapshot tên bài tập
        durationMinutes: { type: Number }, // Thời gian tập
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number }, // Mức tạ (kg)
        time: Date // Thời điểm tập trong ngày
    }],
    totals: {
        caloriesIn: { type: Number, default: 0 },   // Tổng ăn
        caloriesOut: { type: Number, default: 0 },  // Tổng tập
        netCalories: { type: Number, default: 0 },  // In - Out
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    }
}, { timestamps: true });

DailyLog.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', DailyLog);
