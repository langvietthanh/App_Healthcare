const userService = require('../../services/userService');
class userController {

//  [PUT] /api/user/info
    async changeInfo (req, res, next, ){ 
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
    async updatePhysicalDetail (req, res, next){
        try{
            const userId = req.user.userId;

            const data = req.body;

            const updatedUser = await userService.updatePhysicalDetail( { userId, data } );

            res.json (updatedUser);
        }
        catch (error){
            next (error);
        }
    }

//  [PUT] /api/user/goals
    async updateGoals (req, res, next) {
        try{

        }
        catch (err){
            next(err);
        }
    }

//  [PUT] /api/user/password
    async changePassword (req, res, next){
        try{
            let userId = req.user.userId;

            let data = req.body;

            await userService.changePassword( { userId, data } );

            res.json( {msg: "Thay đổi mật khẩu thành công"} );
        }
        catch (err){
            next (err);
        }
    }
}

module.exports = new userController();