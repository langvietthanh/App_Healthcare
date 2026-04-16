const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const FavoriteFood = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true, index: true },
    foodId: { type: ObjectId, ref: 'Food', required: true }
}, { timestamps: true });

// Đảm bảo một User chỉ có thể favorite 1 món ăn 1 lần duy nhất
FavoriteFood.index({ userId: 1, foodId: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteFood', FavoriteFood);
