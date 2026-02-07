const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const FoodLibrary = new Schema({
    name: {type: String, required: true, index: true },
    servingSize: {
        amount: { type: Number, default: 100 },
        unit: { type: String, default: 'g' } 
    },
    nutrients: {
        calories: { type: Number, required: true },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    },
    isPublic: {type: Boolean, default: true },
    creatorId: {type: ObjectId, ref: 'User', default: null},
})

module.exports = mongoose.model('FoodLibrary', FoodLibrary);
