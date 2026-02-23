const User = require('../app/models/User');
const healthCalculations = require('../utils/healthCalculations');
const bcrypt = require('bcryptjs');

/**
 * @class
 */
class userService{
    /**
     * @param {Object} obj 
     * @param {ObjectId} obj.userId
     * @param {string} obj.username
     * @param {string} obj.avatar
     * @returns {Object}
     */
    async changeInfo ({userId, username, email, birthDate, } = {}){
        const update = {
            $set:{
                username,
                email,
                birthDate
            }
        };
        const option = {
            new: true,
            runValidators: true, 
        };

        const user = await User.findByIdAndUpdate(userId, update, option).select('-passwordHash'); 
         // for (let k in user.physicalDetail) console.log(`${k}: ${user.physicalDetail[k]}`);
        
        if (birthDate){
            const newStats = {
                birthDate: birthDate,
                height: user.physicalDetail.height,
                weight: user.physicalDetail.weight,
                gender: user.physicalDetail.gender,
                activityLevel: user.physicalDetail.activityLevel,
            }; 
            user.physicalDetail = healthCalculations.calculatePhysicalDetail( newStats );
            await user.save();
        }

        if(!user) throw new Error('User không tồn tại');
        return user;
    }

    /**
     * @param {Object} obj
     * @param {ObjectId} obj.userId 
     * @param {number} obj.height
     * @param {number} obj.weight 
     * @returns {Object}
     */
    async updatePhysicalDetail ({userId, data, } = {}){
        const user = await User.findById( userId );
        if (!user) throw new Error ('User không tồn tại');
        const {height, weight, activityLevel, gender, birthDate, } = data;
        const newStats = {
            birthDate: birthDate || user.birthDate,
            height: height || user.physicalDetail.height,
            weight: weight || user.physicalDetail.weight,
            gender: gender || user.physicalDetail.gender,
            activityLevel: activityLevel || user.physicalDetail.activityLevel,
        }; 
        
        user.physicalDetail = healthCalculations.calculatePhysicalDetail( newStats );
        
        await user.save();
        // Trả về kết quả
        return user;
    }
    /**
     * @param {Object} obj
     * @param {ObjectId} obj.userId
     * @param {Object} obj.data
     * @return {Object}
    */
    async changePassword ({userId, data, } = {}){
        const user = await User.findById( userId );

        let {oldPassword, newPassword, } = data;

        let isMatch = await bcrypt.compare (oldPassword, user.passwordHash);
        if ( !isMatch ) throw new Error ("Sai mật khẩu");

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        user.passwordHash = newPasswordHash;
        await user.save();
    } 
}


module.exports = new userService();
