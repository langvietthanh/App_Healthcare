const {ACTIVITY_MULTIPLIERS, } = require('../constants/health');
const {passwordChecker, } = require('../utils/security');

function validateInfomationInput(req, res, next) {
    const {username, email, birthDate,} = req.body ;

    if (username) {
        let checkSpecialCharactor = /[!@#$%^&*(),.?":{}|<>]/.test(username);
        if (checkSpecialCharactor)
            throw new Error ('Tên người dùng không cho phép có kí tự đặc biệt');
    }

    if (email) {
        let checkEmail = /^\S+@\S+\.\S+$/.test(email);
        if (!checkEmail) 
            throw new Error ('Vui lòng nhập lại Email hợp lệ');
    }

    if (birthDate){
        let BOD = new Date(birthDate)
        let today = new Date();
        let minAge = 15;
        let cutoffDate = new Date();
        cutoffDate.setFullYear(today.getFullYear() - minAge);
        if(BOD > cutoffDate) throw new Error ('Bạn chưa đủ tuổi để sử dụng App');
    }
    next();
}

function validatePhysicalDetailInput(req, res, next) {
    let {height, weight, gender, activityLevel, } = req.body;

    if  ( height ) {
        if (typeof height !== 'number')
            throw new Error ('Vui lòng nhập kí tự số');
        else if (height < 100)
            throw new Error ('Chiều cao tối thiểu 100cm');
        else if (height > 300) 
            throw new Error  ('Chiều cao giới hạn 300cm');
    } 

    if ( weight ) {
        if (typeof weight !== 'number')
            throw new Error ('Vui lòng nhập kí tự số');    
        else if  (weight < 25)
            throw new Error ('Cân nặng tối thiểu 25kg');
        else if (weight > 500) 
            throw new Error  ('Cân nặng giới hạn 500kg');
    }

    if ( gender && !(['male', 'female'].includes(gender)) )
        throw new Error ('Vui lòng chọn một giới tính được đề xuất');
    
    if ( activityLevel && !( activityLevel in ACTIVITY_MULTIPLIERS ) )
        throw new Error ('Vui lòng chọn một mức độ vận động được đề xuất');

    next();
}   

function validatePasswordInput(req, res, next){
    const {oldPassword, newPassword, } = req.body;
    if ( !oldPassword ) throw new Error ("Vui lòng nhập mật khẩu cũ");
    if ( !newPassword ) throw new Error ("Vui lòng nhập mật khẩu mới");
    
    if ( oldPassword === newPassword )  throw new Error ("Vui lòng nhập lại mật khẩu mới không trùng mật khẩu cũ");

    let result = passwordChecker(newPassword);
    if ( !result.status ) throw new Error (result.msg);

    next();

}

function validateGoalsInput(req, res, next){
    const {weightGoal} = req.body;

    if (weightGoal) {
        if (typeof weightGoal !== 'number')
            throw new Error ('Vui lòng nhập kí tự số');
        else if  (weightGoal < 25)
            throw new Error ('Cân nặng tối thiểu 25kg');
        else if (weightGoal > 500) 
            throw new Error  ('Cân nặng giới hạn 500kg');
    }

    next();
}



module.exports = {validateInfomationInput, validatePhysicalDetailInput, validatePasswordInput, validateGoalsInput, };