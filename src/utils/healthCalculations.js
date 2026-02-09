// Hệ số vận động (Activity Multipliers)
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,        // Ít vận động
  light: 1.375,          // Nhẹ (1-3 ngày/tuần)
  moderate: 1.55,        // Vừa (3-5 ngày/tuần)
  active: 1.725,         // Năng động (6-7 ngày/tuần)
  very_active: 1.9       // Rất năng động (2 lần/ngày)
};

// 1. Tính BMR (Basal Metabolic Rate) - Công thức Mifflin-St Jeor
const calculateBMR = (gender, weight, height, age) => {
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  
  if (gender === 'male') 
    bmr += 5;
  else 
    bmr -= 161;
  return Math.round(bmr);
};

// 2. Tính TDEE (Total Daily Energy Expenditure)
const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

// 3. Tính tuổi từ ngày sinh
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const calculateDailyCalories = (goal, tdee) => {
  if (goal === 'lose_weight') return tdee - 500;
  else if (goal === 'gain_muscle') return tdee + 300;
  return tdee;
}

module.exports = { calculateBMR, calculateTDEE, calculateAge, calculateDailyCalories };