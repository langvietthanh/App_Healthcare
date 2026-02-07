const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const History = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    dateRecorded: { type: Date, default: Date.now },
    weight: { type: Number, required: true } // kg
})

module.exports = mongoose.model('BodyMetricHistory', History);
