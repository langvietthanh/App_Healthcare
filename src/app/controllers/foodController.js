const FoodService = require('../../services/foodService');
const catchAsync = require('../../utils/catchAsync');

class FoodController {
//  [POST] /api/foods
    createNewFood = catchAsync (async (req, res, next) => {
        const data = req.body;
        const userId = req.user.userId;
        const role = req.user.role;
        const newFood = await FoodService.createNewFood({data, userId, role,});
        res.status(201).json(newFood);
    });

//  [GET] /api/foods
    searchFood = catchAsync (async (req, res, next ) => {
        const data = req.query;
        const userId = req.user.userId;
        const listFoods = await FoodService.searchFood({data, userId, });
        res.status(200).json(listFoods);
    })

//  [GET] /api/foods/:id
    getDetailFood = catchAsync (async (req, res, next) => {
        const data = req.params;
        const detailFood = await FoodService.getDetailFood({data});
        res.status(200).json(detailFood);
    })

//  [GET] /api/foods/my-foods
    getMyFoods = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const listFoods = await FoodService.getMyFoods({userId});
        res.status(200).json(listFoods.map( food => ({name: food.name, creatorId: food.creatorId})));
    });

//  [GET] /api/foods/pending - Lấy danh sách món chờ duyệt
    getPendingFoods = catchAsync (async (req, res, next) => { 
        // Chỉ Admin mới được vào đây (bạn cần viết middleware chặn ở Router)
        const pendingFoods = await FoodService.getPendingFoods();
        const result = pendingFoods.map( item => ({name: item.name, isPublic: item.isPublic, verifyStatus: item.verifyStatus}))
        res.status(200).json({ count: pendingFoods.length, foods: result }); 
    })

//  [PATCH] /api/foods/:id/verify 
    setVerifyStatusFood = catchAsync (async (req, res, next) => {
        const foodId = req.params.id;
        const verifiedStatus = req.body.verifyStatus;
        const food = verifiedStatus === 'approve'
        ? await FoodService.approveFood({foodId})
        : await FoodService.rejectFood({foodId})
        res.status(200).json({ msg: `Trạng thái món ăn: ${verifiedStatus}`, food });
    })

//  [PATCH] /api/foods/:id
    updateFood = catchAsync(async (req, res, next) => {
        const foodId = req.params.id;
        const userId = req.user.userId;
        const role = req.user.role;
        const data = req.body;
        const updatedFood = await FoodService.updateFood({foodId, userId, role, data});
        res.status(201).json(updatedFood);
    });

//  [DELETE] /api/foods/:id - Xóa món
    softDeleteFood = catchAsync (async (req, res, next) => {
        const {role, userId} = req.user;
        const foodId = req.params.id;
        await FoodService.softDeleteFood({foodId, userId, role});
        res.status(200).json({msg: "Xóa thành công"});
    })
}

module.exports = new FoodController();