const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
    const role = req.user.role;

    if (role !== "admin") throw new AppError('Bạn không có quyền truy cập vào chức năng này!', 403);
    next();
})