const User = require('../models/user.js');
const Event = require('../models/event.js');
const Sport = require('../models/sport.js');

module.exports.createSportsIdArr = async (dict) => {
    returnArr = []
    for (let sport in dict) {
        const foundSport = await Sport.find({ type: String(sport) });
        returnArr.push(String(foundSport[0].id))
    }
    return returnArr;
}


module.exports.timeSwitch = (date) => {
    const day = String(date.toGMTString()).slice(0, 11)
    const dateString = String(date.toLocaleTimeString()).slice(0, String(date.toLocaleTimeString()).length - 6)
    const hours = date.getHours()
    var str = 'AM'
    if (hours > 11) {
        str = 'PM'
    }
    const returnStr = String(day + " at " + dateString + " " + str)
    return returnStr
}


module.exports.subtractMonths = (numOfMonths, date) => {
    date.setMonth(date.getMonth() - numOfMonths);
    return date;
}



