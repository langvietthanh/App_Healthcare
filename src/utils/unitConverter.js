const unitRate = require('../constants/unitRate');

function convertToGram({unit, amount} = {unit: 'g', amount: 100}){
    return unitRate[unit] * amount;
}
module.exports = {
    convertToGram,
}
