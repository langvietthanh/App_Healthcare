const {ACTIVITY_MULTIPLIERS, } = require('../constants/health');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {passwordChecker, } = require('../utils/security');

const validateInfomationInput = catchAsync (async (req, res, next) => {
    const {username, email, birthDate,} = req.body ;

    if (username) {
        let checkSpecialCharactor = /[!@#$%^&*(),.?":{}|<>]/.test(username);
        if (checkSpecialCharactor)
            throw new AppError ('Tên người dùng không cho phép có kí tự đặc biệt', 422);
    }

    if (email) {
        let checkEmail = /^\S+@\S+\.\S+$/.test(email);
        if (!checkEmail) 
            throw new AppError ('Vui lòng nhập lại Email hợp lệ', 422);
    }

    if (birthDate){
        let BOD = new Date(birthDate)
        let today = new Date();
        let minAge = 15;
        let cutoffDate = new Date();
        cutoffDate.setFullYear(today.getFullYear() - minAge);
        if(BOD > cutoffDate) throw new AppError ('Bạn chưa đủ tuổi để sử dụng App', 422);
    }
    next();
})

const validatePhysicalDetailInput = catchAsync (async (req, res, next) => {
    let {height, weight, gender, activityLevel, } = req.body;

    if  ( height ) {
        if (typeof height !== 'number')
            throw new AppError ('Vui lòng nhập kí tự số', 422);
        else if (height < 100)
            throw new AppError ('Chiều cao tối thiểu 100cm', 422);
        else if (height > 300) 
            throw new AppError  ('Chiều cao giới hạn 300cm', 422);
    } 

    if ( weight ) {
        if (typeof weight !== 'number')
            throw new AppError ('Vui lòng nhập kí tự số', 422);
        else if  (weight < 25)
            throw new AppError ('Cân nặng tối thiểu 25kg', 422);
        else if (weight > 500) 
            throw new AppError  ('Cân nặng giới hạn 500kg', 422);
    }

    if ( gender && !(['male', 'female'].includes(gender)) )
        throw new AppError ('Vui lòng chọn một giới tính được đề xuất', 422);
    
    if ( activityLevel && !( activityLevel in ACTIVITY_MULTIPLIERS ) )
        throw new AppError ('Vui lòng chọn một mức độ vận động được đề xuất', 422);

    next();
})

const validatePasswordInput = catchAsync (async (req, res, next) => {
    const {oldPassword, newPassword, } = req.body;
    if ( !oldPassword ) throw new AppError ("Vui lòng nhập mật khẩu cũ");
    if ( !newPassword ) throw new AppError ("Vui lòng nhập mật khẩu mới");
    
    if ( oldPassword === newPassword )  throw new AppError ("Vui lòng nhập lại mật khẩu mới không trùng mật khẩu cũ");

    let result = passwordChecker(newPassword);
    if ( !result.status ) throw new AppError (result.msg);

    next();

})

const validateGoalsInput = catchAsync (async (req, res, next) => {
    const {weightGoal} = req.body;

    if (weightGoal) {
        if (typeof weightGoal !== 'number')
            throw new AppError ('Vui lòng nhập kí tự số');
        else if  (weightGoal < 25)
            throw new AppError ('Cân nặng tối thiểu 25kg');
        else if (weightGoal > 500) 
            throw new AppError  ('Cân nặng giới hạn 500kg');
    }

    next();
})

module.exports = {validateInfomationInput, validatePhysicalDetailInput, validatePasswordInput, validateGoalsInput, };