const authService = require('../../services/authService');

class authController{

//  POST /api/auth/register
    async register(req, res){
        try{
            const result = await authService.registerUser(req.body);
            res.status(201).json(result)
        }
        catch (err) {

            if (err == 'Email đã tồn tại') res.status(400).json({msg: err.message});

            console.error(err);

            res.status(500).send('Server Error');
        }
    }

//  POST /api/auth/login
    async login(req, res){
        try{
            const { email, password } = req.body;
            const result = await authService.loginUser(email, password);
            res.json(result);
        }
        catch (err){

            if(err === 'Sai thông tin đăng nhập') res.status(400).json({msg: err.message});

            console.error(err);

            res.status(500).send('Server Error');
        }
    }
}


module.exports = new authController();