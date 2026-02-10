const User = require('../app/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');   
const { calculateBMR, calculateTDEE, calculateAge, calculateDailyCalories } = require('../utils/healthCalculations');
const { passwordChecker } = require('../utils/security');

class authService {
    async registerUser(userData){
        const {username, email, password, height, weight, gender, birthDate, activityLevel, goal, targetWeight} = userData;
        
//      Kiem tra email ton tai chua
        console.log(`🔍 Đang tìm kiếm: ${email}`);

        // Đảm bảo là findOne
        const existingEmail = await User.findOne({ email }); 

        // --- DÒNG QUAN TRỌNG NHẤT: IN RA XEM NÓ LÀ CÁI QUÁI GÌ ---
        console.log('👉 GIÁ TRỊ EXISTING USER LÀ:', existingEmail); 
        console.log('👉 KIỂU DỮ LIỆU:', typeof existingEmail);
        console.log('👉 CÓ PHẢI MẢNG KHÔNG:', Array.isArray(existingEmail));

        if (existingEmail) {
        console.log('❌ Code đang nhảy vào IF (nghĩa là nó coi existingUser là True)');
        throw new Error('Email đã tồn tại');
        } else {
        console.log('✅ Code đã bỏ qua IF (nghĩa là existingUser là Null)');
        }

//      Kiem tra User ton tai chua
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

// ...
console.log('--- BẮT ĐẦU DEBUG ENV ---');

// 1. In ra tất cả các Key có chữ JWT để xem bạn có gõ nhầm tên không
const allKeys = Object.keys(process.env);
const jwtKeys = allKeys.filter(key => key.includes('JWT') || key.includes('SECRET'));
console.log('👉 Các biến tìm thấy trong ENV:', jwtKeys);

// 2. In thử giá trị (Nếu key trên kia in ra khác, bạn sửa lại theo nó)
console.log('👉 Giá trị chính xác:', process.env[jwtKeys[0]]); 

console.log('--- KẾT THÚC DEBUG ---');

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return { token, user: newUser };
    }


    async loginUser(email, password){
//      Kiem tra tai khoan ton tai hay khong
        const user  = await User.findOne({email});
        if(! user) return new Error('Sai thông tin đăng nhập');

//      Kiem tra mat khau hop le khong
        const isMacth = await bcrypt.compare(password, user.passwordHash);
        if(! isMacth) return new Error('Sai mật khẩu');

//      Kiem tra JWT 
        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
        return {token, user}
    }
}

module.exports = new authService();