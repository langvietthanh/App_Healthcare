const mongoDB = require('mongoose');

async function connect () {
    try{
        await mongoDB.connect('mongodb://127.0.0.1:27017/app_healthcare');
        console.log("SUCCESS");
    }
    catch{
        console.log("ERROR")
    }
}


module.exports = { connect };

