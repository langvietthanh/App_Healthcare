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

    async searchFood({data, userId} = {}){
        const keyword = data.q;
        // 1. Điều kiện CỐ ĐỊNH: Chỉ lấy món Public HOẶC món do chính tôi tạo
        const query = {
            $or: [
                { isPublic: true },
                { creatorId: userId }
            ]
        };

        // 2. Điều kiện THÊM: Nếu có gõ từ khóa tìm kiếm thì thêm vào query
        // Mặc định MongoDB sẽ nối các thuộc tính bằng toán tử AND
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        } 

        const publicListFoods = await FoodLibrary.find(query).limit(50);
        return publicListFoods;
    }
}   

module.exports = new foodService();