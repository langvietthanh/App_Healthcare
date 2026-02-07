const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/app_healthcare');
        console.log('success');
    } catch {
        console.log('error');
    }
}

module.exports = { connect };