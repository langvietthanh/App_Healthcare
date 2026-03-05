const unitRate = require('../constants/unitRate');

function convertToGram({originalUnit, amount} = {originalUnit: 'g', amount: 100}){
    return  unitRate[originalUnit] * amount;
}
module.exports = {
    convertToGram,
}
