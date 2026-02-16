const userService = require('../../services/userService');
class userController {

//  [PUT] /api/user/info
    async changeInfo (req, res){ 
        try{
            // Lấy userId từ Token
            const userId = req.user.userId;

            const { username, email, birthDate } = req.body;
            
            
            const updatedUser = await userService.changeInfo( { userId, username, email, birthDate, } );

            if (updatedUser) console.log ('change success');
            
            res.json({user: updatedUser});
        }
        catch (error){
            next(error);
        }
    }

//  [PUT] /api/user/physical-detail
    async updatePhysicalDetail (req, res){
        try{
            const userId = req.user.userId;

            const data = req.body;
            
            const updatedUser = await userService.updatePhysicalDetail( { userId , data } );

            res.json (updatedUser);
        }
        catch (error){
            next (error);
        }
    }

//  [PUT] /api/user/goals
    async updateGoals (req, res) {
        
    }

//  [PUT] /api/user/password
    async changePassword (req, res){

    }
}

module.exports = new userController();