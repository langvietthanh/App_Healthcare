const User = require('../app/models/User');
const healthCalculations = require('../utils/healthCalculations');
const healthService = require('./healthService');

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
    async updatePhysicalDetail ({userId, data} = {}){

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
}


module.exports = new userService();


// "birthDate": "2006-29-08",
// "height": 180,
// "weight": 69,
// "gender": 'male',
// "activityLevel": "super_active"