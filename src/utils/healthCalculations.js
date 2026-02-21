// Hệ số vận động (Activity Multipliers)
const {ACTIVITY_MULTIPLIERS, } = require('../constants/health');

/**
 * @class
 */
class healthCalculations{
  /**
   * 1. Tính BMR (Basal Metabolic Rate) - Công thức Mifflin-St Jeor
   * @param {Object} option
   * @param {string} option.gender
   * @param {number} option.weight
   * @param {number} option.height
   * @param {number} option.age
   * @returns {number}
   */
  calculateBMR({gender, weight, height, age}){
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    
    if (gender === 'male') 
      bmr += 5;
    else 
      bmr -= 161;
    return Math.round(bmr);
  };
  
  /**
   * @param {Object} option 
   * @param {number} option.weight 
   * @param {number} option.height 
   * @returns {number}
   */
  calculateBMI({ weight, height,}){
    const met = height/100;
    return weight / (met * met);
  }
  
  /**
   * @param {Object} option
   * @param {number} option.bmi
   * @param {number} option.height
   * @returns {number}
   */
  calculateIdealWeight({height,} = {}){
    const met = height/100;
    return 22.0 * met * met ;
  }
  
  /**
   * @param {Object} option
   * @param {number} option.bmi
   * @param {number} option.age
   * @param {string} option.gender
   * @returns 
   */
  calculateBodyFat({ bmi, age, gender, }){
    return gender === 'male' 
    ? (1.2 * bmi + 0.23 * age - 16.2)
    : (1.2 * bmi + 0.23 * age - 5.4) ;
  }
  
  /**
   * 2. Tính TDEE (Total Daily Energy Expenditure)
   * @param {Object} option
   * @param {number} options.bmr
   * @param {string} options.activityLevel
   * @returns {number}
   */
  calculateTDEE({bmr, activityLevel} = {}){
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  };
  
  /**
   * 3. Tính tuổi từ ngày sinh
   * @param {number} birthDate
   * @returns {number}
   */
  calculateAge(birthDate){
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  
  /**
   * 4. Tính lượng calo hằng ngày
   * @param {Object} option 
   * @param {string} option.goal
   * @param {number} option.tdee
   * @returns {number}
   */
  calculateDailyCalories({goal = 'balance', tdee} = {}){
    if (goal === 'lose_weight') return tdee - 500;
    else if (goal === 'gain_muscle') return tdee + 300;
    return tdee;
  }

  /**
   * @param {Object} option
   * @param {number} option.height
   * @param {number} option.weight
   * @param {date} option.birthDate
   * @param {string} option.activityLevel
   * @param {string} option.gender
   * @returns {Object} updatedPhysicalDetail
   */
  calculatePhysicalDetail({height, weight, birthDate, activityLevel, gender} ){
    let age = this.calculateAge(birthDate, );
    let bmr = this.calculateBMR({
        height,
        weight,
        gender,
        age,
    }); 
    let bmi = this.calculateBMI({ 
        weight,
        height,
    });
    let bodyfat = this.calculateBodyFat({ 
      bmi, 
      age, 
      gender ,
    });
    let tdee = this.calculateTDEE({ 
        bmr, 
        activityLevel,
    });
    let updatedPhysicalDetail = {
      height, 
      weight, 
      gender, 
      activityLevel, 
      bodyfat, 
      bmi, 
      bmr, 
      tdee, 
    };
    return updatedPhysicalDetail;
  }
}

module.exports = new healthCalculations();

// birthDate -> age -> {bmr,bodyfat,calculatePhysicalDetail}