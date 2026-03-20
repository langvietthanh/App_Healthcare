const Food = require('../app/models/Food');
const AppError = require('../utils/appError');
const {
    calculateTotalCalories,
} = require('../utils/caloriesCalculations');
const {
    convertToGram,
} = require('../utils/unitConverter')

class FoodService{
    async createNewFood({data, userId, role}) {
        const {name, protein, carbs, fat, unit, amount, isPublic} = data;
        // Xử lý logic kiểm duyệt
        let finalIsPublic = false;
        let finalVerifyStatus = 'none';

        if (isPublic === true) {
            if (role === 'admin') {
                // Nếu là Admin đăng -> Duyệt luôn, public luôn
                finalIsPublic = true;
                finalVerifyStatus = 'approved';
            } 
            else {
                // Nếu là User thường xin public -> Vào hàng chờ duyệt
                finalIsPublic = false; // Tạm khóa public
                finalVerifyStatus = 'pending'; 
            }
        }

        const weightInGram = convertToGram({amount, unit,});
        const calories = calculateTotalCalories({protein, carbs, fat, });
        const nutrients = {calories ,protein, carbs, fat, };
        const servingSize = {unit, amount, weightInGram, } 
        
        const newFood = new Food({
            name,
            servingSize,
            nutrients,
            creatorId: userId,
            isPublic : finalIsPublic,
            verifyStatus : finalVerifyStatus
        });

        await newFood.save();
        return newFood;
    }
    
    async searchFood({data, userId}){
        const keyword = data.q;
        // 1. Điều kiện CỐ ĐỊNH: Chỉ lấy món Public HOẶC món do chính tôi tạo
        const query = {
            $or: [
                { isPublic: true },
                { creatorId: userId }
            ],
            isDeleted: false
        };

        // 2. Điều kiện THÊM: Nếu có gõ từ khóa tìm kiếm thì thêm vào query
        // Mặc định MongoDB sẽ nối các thuộc tính bằng toán tử AND
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        } 
        const publicListFoods = await Food.find(query).limit(50);
        return publicListFoods;
    }
 
    async getPendingFoods(){
        const pendingFoods = await Food.find({ verifyStatus: 'pending', isDeleted: false });
        return pendingFoods;
    }
        
    async getMyFoods({userId}){
        const query = {creatorId: userId, isDeleted: false}
        const listFoods = await Food.find(query).sort({createdAt: -1});
        return listFoods;
    }
       
    async getDetailFood({data}){
        const foodId = data.id;
        const detailFood = await Food.findOne({ _id: foodId, isDeleted: false });
        if (!detailFood) throw new AppError('Không tìm thấy món ăn', 404);
        return detailFood;
    }

    async approveFood({foodId}){
        const food = await Food.findByIdAndUpdate(
            foodId, 
            { isPublic: true, verifyStatus: 'approved' },
            { new: true } // Trả về data mới sau khi update
        );
        if (!food) throw new AppError('Không tìm thấy món ăn', 404);
        return food;
    }
    
    async rejectFood({foodId}){
        const food = await Food.findByIdAndUpdate(
            foodId, 
            { isPublic: false, verifyStatus: 'rejected' },
            { new: true }
        );
        if (!food) throw new AppError('Không tìm thấy món ăn', 404);
        return food;
    }

    async updateFood({foodId, userId, role, data}){
        const updateData = data;

        const food = await Food.findById(foodId);
        if(!food) throw new AppError('Không tìm thấy món ăn', 404);

        const {
            creatorId, 
            isPublic,
        } = food;

        if (isPublic && role !== 'admin') 
            throw new AppError('Món ăn đã chia sẻ cho cộng đồng. Chỉ Admin mới được phép chỉnh sửa!', 403);

        else {
            if(creatorId.toString() !== userId && role !== 'admin') 
                throw new AppError ('Bạn không có quyền sửa món ăn của người khác!', 403);
        }

        // Xử lý kịch bản: User thường sửa món và muốn xin Public
        if (updateData.isPublic === true && role !== 'admin') {
            updateData.isPublic = false;
            updateData.verifyStatus = 'pending'; // Lại ném vào hàng chờ duyệt
        }
        const {name, protein, carbs, fat, unit, amount} = data;
        const calories = calculateTotalCalories({
            protein : protein || food.nutrients.protein, 
            carbs : carbs || food.nutrients.carbs, 
            fat : fat || food.nutrients.fat 
        });

        const weightInGram = convertToGram({
            unit : unit || food.servingSize.unit ,
            amount : amount || food.servingSize.amount 
        });

        const nutrients = {
            protein : protein || food.nutrients.protein, 
            carbs : carbs || food.nutrients.carbs, 
            fat : fat || food.nutrients.fat ,
            calories
        } 

        const servingSize = {
            unit : unit || food.servingSize.unit ,
            amount : amount || food.servingSize.amount ,
            weightInGram
        }
        // Tiến hành update
        const updatedData = {
            ...(name && { name }), 
            nutrients,
            servingSize,
            ...(updateData.isPublic !== undefined && { isPublic: updateData.isPublic }),
            ...(updateData.verifyStatus !== undefined && { verifyStatus: updateData.verifyStatus })
        }

        const updatedFood = await Food.findByIdAndUpdate(foodId, updatedData, { new: true });

        return updatedFood;
    }

    async softDeleteFood({foodId, userId, role}){
        const food = await Food.findById(foodId);
        if (!food) {
            throw new AppError('Không tìm thấy món ăn',404);
        }
        // 2. Kiểm tra quyền Xóa
        if (food.isPublic === true) {
            // MỘT KHI ĐÃ PUBLIC: Chỉ Admin mới được can thiệp
            if (role !== 'admin') {
                throw new AppError ('Món ăn đã được chia sẻ cho cộng đồng. Chỉ Admin mới có quyền xóa!', 403);
            }
        } 
        else {
            // MÓN CÁ NHÂN: Chỉ chủ sở hữu (hoặc Admin) mới được xóa
            if (food.creatorId.toString() !== userId && role !== 'admin') {
                throw new AppError ('Bạn không có quyền xóa món ăn của người khác!', 403);
            }
        }
        // Xóa mềm 
        food.isDeleted = true;

        await food.save();
    }
}   

module.exports = new FoodService();

// {
//     "name" : "Cơm",
//     "protein" : 1,
//     "carbs" : 1,
//     "fat" : 1,
//     "unit" : "g",
//     "amount" : 100,
// }