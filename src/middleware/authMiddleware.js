const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync (async (req, res, next) => {
    const token = req.header('x-auth-token');
    if ( !token ) throw new AppError('Không có token, từ chối truy cập',401);

//  Giải mã để lấy PAYLOAD
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
})