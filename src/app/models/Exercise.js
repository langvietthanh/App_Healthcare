const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const { EXERCISE_CATEGORIES, EXERCISE_MUSCLES } = require('../../constants/exercise');

const Exercise = new Schema({
    name: { type: String, required: true, index: true },
    category: { type: String, enum: EXERCISE_CATEGORIES },
    description: { type: String, default: '' },
    targetMuscles: {
        type: [{
            muscle: {
                type: String,
                enum: EXERCISE_MUSCLES,
                required: true
            },
            rating: {
                type: Number,
                min: [1, 'Điểm đánh giá tối thiểu là 1 sao'],
                max: [5, 'Điểm đánh giá tối đa là 5 sao'],
                required: true
            },
            _id: false
        }],
        default: [] // Các môn thể thao (Sport/Cardio) có thể để mảng rỗng
    },
    instructions: {
        type: [{
            stepNumber: { type: Number, required: true },
            text: { type: String, required: true },
            imageUrl: { type: String, default: '' }, // Link ảnh minh họa cho bước này (nếu có)
            _id: false
        }],
        default: []
    },
    isPublic: { type: Boolean, default: false },
    verifyStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    creatorId: { type: ObjectId, ref: 'User', default: null },
    isDeleted: { type: Boolean, default: false },
    imgURL: { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('Exercise', Exercise);
