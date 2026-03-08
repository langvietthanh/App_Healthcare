const User = require('../app/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');   
const HealthCalculations = require('../utils/healthCalculations');
const HealthService = require('../services/healthService');
const { passwordChecker } = require('../utils/security');
const AppError = require ('../utils/appError');

class AuthService {
    async register({userData}){
        const {username, email, password, height, weight, gender, birthDate, activityLevel, goal, weightGoal} = userData;

//      Kiem tra su ton tai cua Email
        const existingEmail = await User.findOne({ email }); 
        if (existingEmail) {
        throw new AppError('Email đã tồn tại',409);
        }

//      Kiem tra su ton tai cua User
        const existingUsername = await User.findOne({ username }); // Nhớ dùng findOne
        if (existingUsername) {
            throw new AppError('Tên đăng nhập đã tồn tại',409);
        }

//      Kiem tra mat khau
        const passwordIsValid = passwordChecker(password);
        if(!passwordIsValid) 
            throw new AppError (passwordIsValid.msg,422);

//      Ma hoa mat khau
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

//      Tinh toan chi so suc khoe
        const age = HealthCalculations.calculateAge(birthDate);
        const bmr = HealthCalculations.calculateBMR({gender, weight, height, age, });
        const tdee = HealthCalculations.calculateTDEE({bmr, activityLevel, });
        const bmi = HealthCalculations.calculateBMI({weight, height, });
        const bodyfat = HealthCalculations.calculateBodyFat({bmi, age, gender, });
        const idealWeight = HealthCalculations.calculateIdealWeight({ height, });
        let dailyCalories = HealthCalculations.calculateDailyCalories({goal, tdee, });
        const advice = HealthService.getAdvice({idealWeight, weightGoal});
        

//      Luu vao DB
        const newUser = new User({
            username,
            email,
            passwordHash,
            birthDate,
            physicalDetail:{
                height,
                weight,
                gender,
                activityLevel,
                bmi,
                bmr,
                tdee,
                bodyfat,
            },
            goals:{
                goal,
                dailyCalories,
                weightGoal: weightGoal || weight,
                weightAdvice: {
                        idealWeight,
                        advice,
                }
            }
        });
        await newUser.save();

//      Tao JWT de login luon -- doc them document/New_Knowledge 
        const payload = { userId: newUser._id, role: newUser.role};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return { token, user: newUser };
    }

    async login({data}){
        const {email, password}= data;
//      Kiem tra tai khoan ton tai hay khong
        const user  = await User.findOne({email});
        if(! user) throw new AppError('Sai thông tin đăng nhập',401);

//      Kiem tra mat khau hop le khong
        const isMacth = await bcrypt.compare(password, user.passwordHash);
        if(! isMacth) throw new AppError('Sai mật khẩu',401);

//      Kiem tra JWT 
        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '7d'});
        return {token, user}
    }

    async getMe(userId){
        return await User.findById(userId).select('-passwordHash');
    }
}

module.exports = new AuthService();

// {
//         "username" : "",
//         "email" : "",
//         "password" : "",
//         "height" : "",
//         "weight" : "",
//         "gender" : "",
//         "birthDate" : "",
//         "activityLevel" : "",
//         "goal" : "",
//         "weightGoal": 
// }