const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Exercise = new Schema({
    name: { type: String, required: true, index: true },
    met: { type: Number, required: true }, // Metabolic Equivalent of Task
    category: { type: String, enum: ['Cardio', 'Strength', 'Flexibility', 'Sport'] }
});

module.exports = mongoose.model('Exercise', Exercise);
