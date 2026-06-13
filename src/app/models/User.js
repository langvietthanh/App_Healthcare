const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'locked'], default: 'active' },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  birthDate: { type: Date, required: true },
  physicalDetail: {
    height: { type: Number, required: true, min: [100, 'Chiều cao không được âm'], max: [300, 'Chiều cao không hợp lệ (quá cao)'] },
    weight: { type: Number, required: true, min: [25, 'Cân nặng phải lớn hơn 10'], max: [500, 'Cân nặng không hợp lệ'] },
    gender: { type: String, enum: ['male', 'female'], required: true },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], default: 'sedentary' },
    bodyfat: { type: Number },
    bmi: { type: Number },
    bmr: { type: Number },
    tdee: { type: Number },
  },
  goals: {
    goal: { type: String, enum: ['lose_weight', 'balance', 'gain_muscle'], default: 'balance' },
    dailyCalories: { type: Number, default: 2000 },
    weightGoal: { type: Number },
    weightAdvice: {
      idealWeight: { type: Number },
      advice: { type: String },
    }
  },
  imgURL: { type: String, default: '' }
},
  { timestamps: true });

module.exports = mongoose.model('User', User);

// {height, weight, gender, activityLevel, bodyfat, bmi, bmr, tdee, }
