/**
 * 
 * @param {Object} obj
 * @param {Number} obj.protein
 * @param {Number} obj.carbs
 * @param {Number} obj.fat
 * @param {Number} obj.weightInGram
 * @return {Number}
 */
function calculateTotalCalories({protein, carbs, fat}){
    // Đơn vị P-C-F đang tính theo gam và nằm trong amount của món ăn
    return ((protein + carbs) * 4 + fat * 8);
}

module.exports = {
    calculateTotalCalories,
}