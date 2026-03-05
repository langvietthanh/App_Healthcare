const User = require('../app/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');   
const healthCalculations = require('../utils/healthCalculations');
const healthService = require('../services/healthService');
const { passwordChecker } = require('../utils/security');

class authService {
    async registerUser(userData){
        const {username, email, password, height, weight, gender, birthDate, activityLevel, goal, weightGoal} = userData;

//      Kiem tra su ton tai cua Email
        const existingEmail = await User.findOne({ email }); 
        if (existingEmail) {
        throw new Error('Email đã tồn tại');
        }

//      Kiem tra su ton tai cua User
        const existingUsername = await User.findOne({ username }); // Nhớ dùng findOne
        if (existingUsername) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

//      Kiem tra mat khau
        const passwordIsValid = passwordChecker(password);
        if(!passwordIsValid) 
            throw new Error (passwordIsValid.msg);

//      Ma hoa mat khau
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

//      Tinh toan chi so suc khoe
        const age = healthCalculations.calculateAge(birthDate);
        const bmr = healthCalculations.calculateBMR({gender, weight, height, age, });
        const tdee = healthCalculations.calculateTDEE({bmr, activityLevel, });
        const bmi = healthCalculations.calculateBMI({weight, height, });
        const bodyfat = healthCalculations.calculateBodyFat({bmi, age, gender, });
        const idealWeight = healthCalculations.calculateIdealWeight({ height, });
        let dailyCalories = healthCalculations.calculateDailyCalories({goal, tdee, });
        const advice = healthService.getAdvice({idealWeight, weightGoal});
        

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
        const payload = { userId: newUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return { token, user: newUser };
    }

    async loginUser(email, password){
//      Kiem tra tai khoan ton tai hay khong
        const user  = await User.findOne({email});
        if(! user) throw new Error('Sai thông tin đăng nhập');

//      Kiem tra mat khau hop le khong
        const isMacth = await bcrypt.compare(password, user.passwordHash);
        if(! isMacth) throw new Error('Sai mật khẩu');

//      Kiem tra JWT 
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
        return {token, user}
    }

    async getMe(userId){
        return await User.findById(userId).select('-passwordHash');
    }
}

module.exports = new authService();