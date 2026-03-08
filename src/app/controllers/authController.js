const AuthService = require('../../services/authService');
const catchAsync = require('../../utils/catchAsync');

class AuthController{

//  POST /api/auth/register
    register = catchAsync(async (req, res, next) => {
        const userData = req.body;
        const result = await AuthService.register({userData});
        res.status(201).json(result)
    })

//  POST /api/auth/login
    login = catchAsync(async (req, res, next) => {
        const data = req.body;
        const result = await AuthService.login({data});
        res.json(result);
    })

//  GET /api/auth/me
    getMe = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const user = await AuthService.getMe(userId);
        res.json(user);
    })
}

module.exports = new AuthController();