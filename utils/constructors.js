if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const User = require('../models/user.js');
const Event = require('../models/event.js');
const Sport = require('../models/sport.js');
const Group = require('../models/group.js');
const { model } = require('mongoose');
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

module.exports.createSportsIdArr = async (dict) => {
    returnArr = []
    for (let sport of dict) {
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


module.exports.updateNotification = async (user, event) => {
    telePhoneArr = []
    textStr = user.firstName + ' ' + user.lastName + " Joined your " + event.sportType + ' Match' + '\n' + 'Check it out on Actively: https://www.actively.group/login'
    for (i in event.participantId) {
        if (event.participantId[i] != user.id) {
            const participant = await User.findById(event.participantId[i])
            telePhoneArr.push(String(participant.phoneNumber))
        }
    }
    const host = await User.findById(event.hostId)
    telePhoneArr.push(String(host.phoneNumber))
    for (i in telePhoneArr) {
        client.messages.create({
            to: String(telePhoneArr[i]),
            from: '+19033213407',
            body: textStr
        })
    }
}

module.exports.deleteEventText = async (eventId) => {
    let telephoneArr = [];
    const event = await Event.findById(eventId);
    textStr = `You're upcoming ${event.sportType} match at ${event.location} was just cancelled`;
    for (i in event.participantId) {
        const participant = await User.findById(event.participantId[i])
        telephoneArr.push(String(participant.phoneNumber))
    }

    for (i in telePhoneArr) {
        client.messages.create({
            to: String(telePhoneArr[i]),
            from: '+19033213407',
            body: textStr
        })
    }
}

module.exports.sendTextToGroup = async (message, senderId, groupId) => {
    const group = await Group.findById(groupId);
    const host = await User.findById(senderId);
    console.log(message)
    const textStr = `${host.firstName} ${host.lastName}: ${message}`;
    for (i in group.participantId) {
        if (group.participantId[i] != senderId) {
            const participant = await User.findById(group.participantId[i]);
            console.log('sending text to ' + participant.phoneNumber);
            // client.messages.create({
            //     to: String(participant.phoneNumber),
            //     from: '+19033213407',
            //     body: textStr
            // })
        }
    }
}



module.exports.sendText = async (notifcation, event, allGroupId) => {
    const user = await User.findById(event.hostId);

    textStr = user.firstName + ' ' + user.lastName + " scheduled " + event.sportType + " for " + notifcation + " at the " + event.location + '.' + '\n' + 'Check it out on Actively: https://www.actively.group/login';
    var telePhoneArr = [];
    var groupIds = event.groups;
    var index = groupIds.indexOf(allGroupId);
    if (index !== -1) {
        groupIds.splice(index, 1);
    }
    const users = await User.find({
        groups: { $in: groupIds }
    });
    for (let user of users) {
        telePhoneArr.push(user.phoneNumber);
    }
    for (i in telePhoneArr) {
        client.messages.create({
            to: String(telePhoneArr[i]),
            from: '+19033213407',
            body: textStr
        })
    }

}


