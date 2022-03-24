if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const User = require('../models/user.js');
const Event = require('../models/event.js');
const Sport = require('../models/sport.js');
const user = require('../models/user.js');
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

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


module.exports.sendText = async (dateStr = 'today', event) => {
    const timeStr = String(event.time.toLocaleTimeString()).slice(0, String(event.time.toLocaleTimeString()).length - 6)
    var amPm = 'AM'
    if (event.time.getHours() > 11) {
        amPm = 'PM'
    }
    const user = await User.findById(event.hostId)
    textStr = user.firstName + ' ' + user.lastName + " scheduled " + event.sportType + " for " + dateStr + ' at ' + timeStr + " " + amPm + " at the " + event.location + '.' + '\n' + 'Check it out on Actively: www.actively.group'
    const sport = await Sport.find({ type: event.sportType })
    const sportId = sport[0].id
    usersArr = await User.find({})
    telePhoneArr = []
    for (i in usersArr) {
        if (usersArr[i].sports.includes(sportId)) {
            telePhoneArr.push(String(usersArr[i].phoneNumber))
        }
    }
    for (i in telePhoneArr) {
        console.log('sending')
        client.messages.create({
            to: String(telePhoneArr[i]),
            from: '+19033213407',
            body: textStr
        })
    }
}



