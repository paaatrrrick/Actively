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

module.exports.adjustTime = (time, add = true) => {
    const offset = time.getTimezoneOffset();
    changeAmount = 300 - offset
    minutes = changeAmount % 60
    hours = (changeAmount - minutes) / 60
    if (add) {
        time.setHours(time.getHours() + hours)
        time.setMinutes(time.getMinutes() + minutes)
    } else {
        time.setHours(time.getHours() - hours)
        time.setMinutes(time.getMinutes() - minutes)
    }
    return time
}

module.exports.timeSwitch = (date) => {
    var hours = date.getHours()
    var str = 'AM'
    if (hours > 11) {
        str = 'PM'
        hours = hours - 12
    }
    if (hours == 0) {
        hours = 12
    }
    var minutes = String(date.getMinutes())
    if (String(minutes).length == 1) {
        minutes = '0' + minutes
    }
    const returnStr = String(String(hours) + ':' + minutes + ' ' + str + ' on ' + String(date.toDateString()).slice(0, 10))
    return returnStr
}


module.exports.sendText = async (dateStr = 'today', event) => {
    const time = this.adjustTime(event.time)
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
    // for (i in telePhoneArr) {
    //     client.messages.create({
    //         to: String(telePhoneArr[i]),
    //         from: '+19033213407',
    //         body: textStr
    //     })
    // }
}


