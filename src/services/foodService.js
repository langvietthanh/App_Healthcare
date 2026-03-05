const FoodLibrary = require('../app/models/FoodLibrary');
const {calculateTotalCalories} = require('../utils/caloriesCalculations');
const {
    convertToGram,
} = require('../utils/unitConverter')

class foodService{
    async createNewFood({data, userId} = {}) {
        const {name, protein, carbs, fat, unit, amount, isPublic} = data;

        const weightInGram = convertToGram({amount, unit,});
        const calories = calculateTotalCalories({protein, carbs, fat, });
        // Đơn vị P-C-F đang tính theo gam
        const nutrients = {calories ,protein, carbs, fat, };
        const servingSize = {unit, amount, weightInGram, } 

        const newFood = new FoodLibrary({
            name,
            servingSize,
            nutrients,
            isPublic,
            creatorId: userId,
            isPublic,
        });

        await newFood.save();
        return newFood;
    }
}   

module.exports = new foodService();
// {
// "name" : "Phở" ,
// "protein" : 10 ,
// "carbs" : 20 ,
// "fat" : 30 ,
// "unit" : "g" ,
// "amount" : 500 ,
// "isPublic" : "true" 
// }