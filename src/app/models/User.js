const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: {type: String, required: true, unique: true},  
  email: {type: String, required: true, unique: true},  
  passwordHash: {type: String, required: true},  
  birthDate: { type: Date, required: true },
  physicalDetail: {
    height: { type: Number, required: true }, // cm
    weight: { type: Number, required: true }, // kg
    gender: { type: String, enum: ['male', 'female'], required: true },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], default: 'sedentary' }
  },  
  goals: {
    dailyCalories: { type: Number, default: 2000 },
    weightGoal: { type: Number }
  }
}, 
{ timestamps: true });

module.exports = mongoose.model('User', User);