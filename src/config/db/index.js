
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/app_healthcare');
        console.log('\n-----Kết nối thành công với DB-----\n');
    } catch {
        console.log('\n-----Kết nối thất bại với DB-----\n');
    }
}

module.exports = { connect };
