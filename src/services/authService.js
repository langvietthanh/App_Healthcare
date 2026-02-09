const User = require('../app/models/User');
const bcrypt = require('bcryptjs');
const jwt = requijre('jsonwebtoken');   
const { calculateBMR, calculateTDEE, calculateAge, calculateDailyCalories } = require('../utils/healthCalculations');

class authService {
    async registerUser(userData){
        const {username, email, password, height, weight, gender, birthDate, activityLevel, goal, targetWeight} = userData;
        
//      Kiem tra email ton tai chua
        const existingUser = await User.find({ email });
        if (existingUser) 
            throw new Error ('Email đã tồn tại');

//      Kiem tra mat khau
        const validPassword = (password) => {
            const minLength = 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) 
                return { status: true, msg: "Mật khẩu mạnh!" };
            else 
                return { status: false, msg: "Mật khẩu chưa đủ mạnh. Cần ít nhất 8 ký tự, đủ chữ hoa, chữ thường, số và ký tự đặc biệt." };
        }
        if( !validPassword.status) 
            throw new Error (validPassword.msg);

//      Ma hoa mat khau
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

//      Tinh toan chi so suc khoe
        const age = calculateAge(birthDate);
        const bmr = calculateBMR(gender, weight, height, age);
        const tdee = calculateTDEE(bmr, activityLevel);
        let dailyCalories = calculateDailyCalories(goal, tdee);
        
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
            },
            goals:{
                dailyCalories,
                weightGoal: targetWeight || weight,
            }
        });
        await newUser.save();

//      Tao JWT de login luon -- doc them document/New_Knowledge 
        const payload = { userId: newUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return { token, user: newUser };
    }


    async loginUser(email, password){
        const user  = await User.findOne({email});
        
        if(! user) return new Error('Sai thông tin đăng nhập');

        const isMacth = await bcrypt.compare(password, user.passwordHash);

        if(! isMacth) return new Error('Sai mật khẩu');

        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
        
        return {token, user}
    }
}

module.exports = authService;

