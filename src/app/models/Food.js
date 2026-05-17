const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const Food = new Schema({
    name: { type: String, required: true, index: true },
    servingSize: {
        amount: { type: Number, default: 100 },
        unit: { type: String, default: 'g', enum: ['g', 'ml', 'lb', 'oz'] },
        weightInGram: { type: Number }
    },
    nutrients: {
        calories: { type: Number, required: true },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    },
    isPublic: { type: Boolean, default: false },
    verifyStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    creatorId: { type: ObjectId, ref: 'User', default: null },
    isDeleted: { type: Boolean, default: false },
    imgURL: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Food', Food);
