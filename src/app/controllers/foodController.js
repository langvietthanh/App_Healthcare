const FoodService = require('../../services/foodService');
const catchAsync = require('../../utils/catchAsync');
const fs = require('fs');

class FoodController {
//  [POST] /api/foods
    createNewFood = catchAsync (async (req, res, next) => {
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);
        
        const data = req.body;
        
        if (req.file) {
            const type = req.query.type || 'others';
            data.imgURL = `/uploads/${type}/${req.file.filename}`;
        }

        // Ép kiểu các trường từ FormData (string) sang đúng định dạng
        if (data.amount) data.amount = Number(data.amount);
        if (data.protein) data.protein = Number(data.protein);
        if (data.carbs) data.carbs = Number(data.carbs);
        if (data.fat) data.fat = Number(data.fat);
        if (data.isPublic === 'false') data.isPublic = false;
        if (data.isPublic === 'true') data.isPublic = true;

        const userId = req.user.userId;
        const role = req.user.role;

        try {
            const newFood = await FoodService.createNewFood({data, userId, role});
            res.status(201).json(newFood);
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Lỗi xóa file rác food:", err);
                });
            }
            return next(error);
        }
    });

//  [GET] /api/foods
    searchFood = catchAsync (async (req, res, next ) => {
        const data = req.query;
        const userId = req.user.userId;
        const role = req.user.role;
        const listFoods = await FoodService.searchFood({data, userId, role});
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
        res.status(200).json(listFoods);
    });

    getPendingFoods = catchAsync (async (req, res, next) => { 
        const pendingFoods = await FoodService.getPendingFoods();
        res.status(200).json(pendingFoods); 
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

        if (req.file) {
            const type = req.query.type || 'others';
            data.imgURL = `/uploads/${type}/${req.file.filename}`;
        }

        // Ép kiểu
        if (data.amount) data.amount = Number(data.amount);
        if (data.protein) data.protein = Number(data.protein);
        if (data.carbs) data.carbs = Number(data.carbs);
        if (data.fat) data.fat = Number(data.fat);
        if (data.calories) data.calories = Number(data.calories);
        if (data.isPublic === 'false') data.isPublic = false;
        if (data.isPublic === 'true') data.isPublic = true;

        try {
            const updatedFood = await FoodService.updateFood({foodId, userId, role, data});
            res.status(200).json(updatedFood);
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Lỗi xóa file rác food update:", err);
                });
            }
            return next(error);
        }
    });

//  [DELETE] /api/foods/:id - Xóa món
    softDeleteFood = catchAsync (async (req, res, next) => {
        const {role, userId} = req.user;
        const foodId = req.params.id;
        await FoodService.softDeleteFood({foodId, userId, role});
        res.status(200).json({msg: "Xóa thành công"});
    })

    // -------------------------------------------------------------
    // CHỨC NĂNG MÓN ĂN YÊU THÍCH (FAVORITE)
    // -------------------------------------------------------------

//  [GET] /api/foods/favorites
    getFavoriteFoods = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const favorites = await FoodService.getFavoriteFoods({ userId });
        res.status(200).json(favorites);
    });

//  [POST] /api/foods/favorites
    addFavoriteFood = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const data = req.body; // Payload JSON yêu cầu chứa mảng { "foodId": "..." }
        const newFavorite = await FoodService.addFavoriteFood({ userId, data });
        res.status(201).json({ msg: "Đã thêm vào danh sách yêu thích", data: newFavorite });
    });

//  [DELETE] /api/foods/favorites/:foodId
    removeFavoriteFood = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const foodId = req.params.foodId;
        const result = await FoodService.removeFavoriteFood({ userId, data: { foodId } });
        res.status(200).json(result);
    });
}

module.exports = new FoodController();