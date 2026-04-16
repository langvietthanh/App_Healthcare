const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const DailyFoodEntry = new Schema({
    dailyLogId: { type: ObjectId, ref: 'DailyLog', required: true, index: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    foodRefId: { type: ObjectId, ref: 'Food' },
    foodName: { type: String },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
    intakeAmount: { type: Number },
    intakeUnit: { type: String },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('DailyFoodEntry', DailyFoodEntry);
