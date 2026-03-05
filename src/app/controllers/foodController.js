const foodService = require('../../services/foodService');

class foodController {
//  [POST] /api/foods
    async createNewFood (req, res, next){
        try{
            const data = req.body;
            const userId = req.user.userId;
            const newFood = await foodService.createNewFood({data, userId});
            res.status(200).json(newFood);
        }
        catch (err){
            next(err);
        }
    }

//  [GET] /api/foods
    async searchFood (req, res, next, ) {
        try{
            
        }
        catch (err){
            next(err);
        }
    }

}

module.exports = new foodController();  