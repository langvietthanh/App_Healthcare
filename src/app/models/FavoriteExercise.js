const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const FavoriteExercise = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true, index: true },
    exerciseId: { type: ObjectId, ref: 'Exercise', required: true }
}, { timestamps: true });

// Đảm bảo một User chỉ có thể favorite 1 bài tập 1 lần duy nhất
FavoriteExercise.index({ userId: 1, exerciseId: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteExercise', FavoriteExercise);