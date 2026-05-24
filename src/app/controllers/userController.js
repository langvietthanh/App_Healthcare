const UserService = require('../../services/userService');
const catchAsync = require('../../utils/catchAsync');
class UserController {
    //  [PUT] /api/user/info
    changeInfo = catchAsync(async (req, res, next) => {
        // Lấy userId từ Token
        const userId = req.user.userId;

        const data = req.body;

        const updatedUser = await UserService.changeInfo({ userId, data, });

        res.json({ user: updatedUser });
    })

    //  [PUT] /api/user/physical-detail
    updatePhysicalDetail = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;

        const data = req.body;

        const updatedUser = await UserService.updatePhysicalDetail({ userId, data });

        res.json(updatedUser);
    })

    //  [PUT] /api/user/goals
    updateGoals = catchAsync(async (req, res, next) => {
        let userId = req.user.userId;

        let data = req.body;

        const updatedUser = await UserService.updateGoals({ userId, data, });

        res.json(updatedUser);
    })

    //  [PUT] /api/user/password
    changePassword = catchAsync(async (req, res, next) => {
        let userId = req.user.userId;

        let data = req.body;

        await UserService.changePassword({ userId, data });

        res.json({ msg: "Thay đổi mật khẩu thành công" });
    })

    //  [POST] /api/user/weight/ensure
    ensureTodayWeight = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const record = await UserService.ensureTodayWeight({ userId });
        res.json(record);
    })

    //  [PUT] /api/user/weight
    updateTodayWeight = catchAsync(async (req, res, next) => {
        const userId = req.user.userId;
        const { weight } = req.body;
        const record = await UserService.updateTodayWeight({ userId, weight: parseFloat(weight) });
        res.json(record);
    })
}

module.exports = new UserController();