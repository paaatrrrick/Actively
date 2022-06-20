if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


// const methodOverride = require('method-override');
// const LocalStrategy = require('passport-local')
// const engine = require('ejs-mate');
// const session = require('express-session');
// const flash = require('connect-flash');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const User = require('./models/user.js');
const Event = require('./models/event.js');
const Sport = require('./models/sport.js');
const Group = require('./models/group.js');
const { isLoggedIn, } = require('./utils/middleware');
const { sendText, updateNotification, createSportsIdArr } = require('./utils/constructors');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError.js');


// const MongoStore = require('connect-mongo');
const Events = require('twilio/lib/rest/Events');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { UserList } = require('twilio/lib/rest/ipMessaging/v2/service/user');
const user = require('./models/user.js');

//Change For Going Live
const db_url = process.env.DB_URL;
const HostedPublicGroupId = "6290cfb510c085dfcda128d3"

//Local Host
const DB_DEFAULT = 'mongodb://0.0.0.0:27017/Actively';
const PUBLIC_ID_DEFAULT = "628d3cfc990d3f409b7ca4f7";

//Update Proxy on client
const currentUrl = db_url; //SET to db_url
const sendTextMessages = true; //SET to true
const allGroupId = HostedPublicGroupId; //Set to Hosted


mongoose.connect(currentUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: false }))
// app.use(cors({ origin: process.env.FRONT_END_URL }));
app.use(cors({}));

app.use(passport.initialize());

// ALSO FOR HOSTING
// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:

// END


// app.use(cookieParser());
// app.use(express.json());

const baseController = express.Router();

baseController.post('/addFriend', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne(
        { _id: res.ActivelyUserId },
        { $push: { friends: req.body.id } }
    )
    return res.send(JSON.stringify('success'))
}));

baseController.post('/removeFriend', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne({ _id: res.ActivelyUserId }, { $pull: { friends: { $eq: req.body.id } } })
    return res.send(JSON.stringify('success'))
}));


baseController.post('/joingroup', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne(
        { _id: res.ActivelyUserId },
        { $push: { groups: req.body.id } }
    )
    await Group.updateOne(
        { _id: req.body.id },
        { $push: { participantId: res.ActivelyUserId } }
    )
    return res.send(JSON.stringify('success'))
}));

baseController.post('/leavegroup', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne({ _id: res.ActivelyUserId }, { $pull: { groups: { $eq: req.body.id } } })
    await Group.updateOne({ _id: req.body.id }, { $pull: { participantId: { $eq: res.ActivelyUserId } } })
    return res.send(JSON.stringify('success'))
}));


baseController.post('/addFriend', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne(
        { _id: res.ActivelyUserId },
        { $push: { friends: req.body.id } }
    )
    return res.send(JSON.stringify('success'))
}));

baseController.post('/removeFriend', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne({ _id: res.ActivelyUserId }, { $pull: { friends: { $eq: req.body.id } } })
    return res.send(JSON.stringify('success'))
}));

baseController.post('/findFriends', isLoggedIn, catchAsync(async (req, res) => {
    var returnData = []
    const users = await User.find({ firstName: req.body.first, lastName: req.body.last })
    const currentUser = await User.findById(res.ActivelyUserId);
    for (let i = 0; i < users.length; i++) {
        returnData.push({
            first: users[i].firstName,
            last: users[i].lastName,
            id: users[i].id,
            icon: users[i].profileImg,
            isFriend: (currentUser.friends.includes(users[i].id))
        })
    }
    return res.send(JSON.stringify(returnData))
}));

baseController.get('/profile', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(res.ActivelyUserId);
    const img = 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/'
    navbarData = await navbarPreLoad(res.ActivelyUserId)
    return res.json({ user, img, navbarData })
}));

baseController.post('/profileinfo', isLoggedIn, catchAsync(async (req, res) => {
    var { description, instagram, facebook, age, shareNumber, notifcation, idUrl } = req.body;
    const user = await User.findByIdAndUpdate({ _id: String(res.ActivelyUserId) }, { profileBio: description, age: age, instagramLink: instagram, profileImg: idUrl, facebookLink: facebook, publicSocials: shareNumber, notifcations: notifcation })
    return res.send(JSON.stringify('success'))
}));

baseController.get('/profile/:id', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(res.ActivelyUserId);
    const isFriend = (currentUser.friends.includes(user.id)) ? true : false;
    navbarData = await navbarPreLoad(res.ActivelyUserId);
    res.send(JSON.stringify({ user: user, ifFriend: isFriend, navbarData: navbarData }))
}));

baseController.post('/newEvent', isLoggedIn, catchAsync(async (req, res, next) => {
    const { type, location, time, skill, description, turnout, notifcation, groups } = req.body;
    var newGroup = []
    if (groups.label) {
        newGroup.push(groups.value)
    } else {
        for (let group of groups) {
            newGroup.push(group.value)
        }
    }
    const id = String(res.ActivelyUserId);
    var user = await User.findById(id)
    const event = new Event({ sportType: type, description: description, location: location, level: skill, time: time, hostId: id, groupSize: turnout, city: user.city, state: user.state, groups: newGroup })
    await event.save();
    if (notifcation !== 'nothing' & sendTextMessages) {
        console.log('notifcation will be getting sent')
        await sendText(notifcation, event, allGroupId)
    }
    const foundSport = await Sport.find({ type: type });
    const updatingSport = await Sport.findById(foundSport[0].id)
    updatingSport.eventId.push(event.id)
    await updatingSport.save();
    user.hostedEvents.push(event.id)
    await user.save();
    return res.send(JSON.stringify('success'))
}));


baseController.get('/newEvent', isLoggedIn, catchAsync(async (req, res, next) => {
    var groupArr = [{ label: "Share Publicly", value: allGroupId }];
    const user = await User.findById(res.ActivelyUserId);
    for (let groupids of user.groups) {
        if (groupids !== allGroupId) {
            const group = await Group.findById(groupids)
            groupArr.push({ label: group.name, value: group.id })
        }
    }
    navbarData = await navbarPreLoad(res.ActivelyUserId);
    res.send(JSON.stringify({ groups: groupArr, navbarData: navbarData }))
}));


baseController.post('/updateSportInterests', isLoggedIn, catchAsync(async (req, res, next) => {
    sportsArr = req.body.desiredSports;
    eventIdArr = [];
    for (index in sportsArr) {
        const foundSport = await Sport.find({ type: sportsArr[index] });
        eventIdArr.push(foundSport[0].id);
    }
    var state = '';
    var city = '';
    if (req.body.city != '' & req.body.state != '') {
        state = req.body.state;
        city = req.body.city;
    } else {
        const user = await User.findById(res.ActivelyUserId);
        state = user.state;
        city = user.city;
    }
    await User.updateOne(
        { _id: res.ActivelyUserId },
        { $set: { sports: eventIdArr, state: state, city: city } }
    )
    return res.send(JSON.stringify('success'))
}));

baseController.post('/event/:eventId/:userId', isLoggedIn, catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    event.participantId = event.participantId.concat([String(res.ActivelyUserId)])
    await event.save();
    const user = await User.findById(res.ActivelyUserId);
    user.enrolledEvents = user.enrolledEvents.concat([String(res.ActivelyUserId)])
    await user.save();
    if (sendTextMessages) {
        updateNotification(user, event)
    }
    return res.send(JSON.stringify('success'))
}));


baseController.post('/register', async (req, res, next) => {
    const sportsArr = await createSportsIdArr(req.body.sports)
    const { state, city, first, last, email, password, phone, age, groups } = req.body
    const username = email
    var newGroups = groups
    newGroups.push(allGroupId)
    const checkEmail = await User.find({ email: email });
    if (checkEmail.length === 0) {
        const user = new User({
            email: email, sports: sportsArr,
            firstName: first, lastName: last, age: age,
            phoneNumber: phone, username: username,
            state: state, city: city, groups: newGroups
        });
        const newUser = await User.register(user, password)
        await user.save();
        const token = jwt.sign({ _id: user.id, }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30d" });
        for (let group of newGroups) {
            await Group.updateOne(
                { _id: group },
                { $push: { participantId: user.id } }

            )
        }
        return res.send(JSON.stringify({ token }))
    } else {
        return res.send(JSON.stringify('taken'))
    }
});


baseController.post('/login', catchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.authenticate()(email, password)
        if (user.user.email == null) {
            return res.send("Invalid Email or Password");
        } else {
            const token = jwt.sign({ _id: user.user._id, }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30d" });
            console.log('token: ' + token)
            return res.send(JSON.stringify({ user: user, token: token }))
        }

    } catch {
        return res.send("Invalid Email or Password");
    }
}));


baseController.post('/getProfiles', isLoggedIn, catchAsync(async (req, res) => {
    const event = await Event.findById(req.body.id);
    var users = []
    for (let i = 0; i < event.participantId.length; i++) {
        try {
            const user = await User.findById(event.participantId[i]);
            users.push([user.profileImg, user.id, user.firstName, user.lastName]);
        } catch {

        }
    }
    const host = await User.findById(event.hostId);
    const hostid = (host.id) ? host.id : 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/'
    users.push([host.profileImg, hostid, host.firstName, host.lastName, event.sportType]);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ key: users }))
}));

baseController.get('/isLoggedIn', isLoggedIn, async (req, res, next) => {
    navbarData = await navbarPreLoad(res.ActivelyUserId)
    res.send(JSON.stringify(navbarData))
});

baseController.get('/dashboard', isLoggedIn, catchAsync(async (req, res, next) => {
    var content = []
    var date = new Date();
    const userId = res.ActivelyUserId;
    const user = await User.findById(res.ActivelyUserId);

    var userGroups = user.groups
    var index = userGroups.indexOf(allGroupId);
    if (index !== -1) {
        userGroups.splice(index, 1);
    }
    var sportNames = []
    const iconImg = 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/';
    for (sportIds of user.sports) {
        const sport = await Sport.findById(sportIds, { type: 1 })
        sportNames.push(sport.type)
    }
    var events = await Event.find({
        city: user.city,
        state: user.state,
        sportType: { $in: sportNames }
    })
    const joinedEvents = await Event.find({
        participantId: { $in: user.id }
    })
    const groupEvents = await Event.find({
        groups: { $in: userGroups }
    })
    const hostedEvents = await Event.find({
        hostId: user.id
    })
    events = events.concat(hostedEvents);
    events = events.concat(joinedEvents);
    events = events.concat(groupEvents);
    const uniqueValuesSet = new Set();
    const allEvents = events.filter((obj) => {
        const isPresentInSet = uniqueValuesSet.has(obj.id);
        uniqueValuesSet.add(obj.id);
        return !isPresentInSet;
    });
    for (eachMatch of allEvents) {
        if (eachMatch.time.getTime() >= date.getTime()) {
            const host = await User.findById(eachMatch.hostId);
            const iconUrl = (host.profileImg) ? (host.profileImg) : iconImg;
            arr = [(host.firstName + ' ' + host.lastName), eachMatch, eachMatch.time, iconUrl];
            content.push(arr);
        }
    }
    content.sort(function (x, y) {
        return x[1].time - y[1].time;
    });

    navbarData = await navbarPreLoad(res.ActivelyUserId)
    return res.json({ content, userId, navbarData })
}));

const groupController = express.Router();

groupController.post('/creategroup', isLoggedIn, catchAsync(async (req, res) => {
    const { name, description, sportType, bannerImg, iconImg, usualLocation } = req.body
    const user = await User.findById(res.ActivelyUserId);
    const group = new Group({ name: name, description: description, sportType: sportType, bannerImg: bannerImg, iconImg: iconImg, usualLocation: usualLocation, participantId: [res.ActivelyUserId], hostId: res.ActivelyUserId, state: user.state, city: user.city });
    await group.save();
    await User.updateOne(
        { _id: res.ActivelyUserId },
        { $push: { groups: group.id } }
    )
    return res.send(JSON.stringify({ id: group.id }))
}));

groupController.get('/group/:groupId', isLoggedIn, catchAsync(async (req, res) => {
    var returnData = []
    const currentGroup = await Group.findById(req.params.groupId);
    for (let i = 0; i < currentGroup.participantId.length; i++) {
        const user = await User.findById(currentGroup.participantId[i]);
        returnData.push({
            first: user.firstName,
            last: user.lastName,
            id: user.id,
            icon: user.profileImg,
            isFriend: (user.friends.includes(res.ActivelyUserId))
        })
    }
    const currentId = res.ActivelyUserId;
    const navbarData = await navbarPreLoad(currentId)
    return res.json({ returnData, currentGroup, navbarData, currentId })
}));

groupController.get('/grouplist', isLoggedIn, catchAsync(async (req, res) => {
    var returnData = []
    const user = await User.findById(res.ActivelyUserId);
    for (let i = 0; i < user.groups.length; i++) {
        if (user.groups[i] !== allGroupId) {
            const group = await Group.findById(user.groups[i]);
            returnData.push({
                name: group.name,
                sport: group.sportType,
                icon: group.iconImg,
                id: group.id
            })
        }
    }
    const navbarData = await navbarPreLoad(res.ActivelyUserId);
    return res.json({ returnData, navbarData })
}));

groupController.get('/findgroups', isLoggedIn, catchAsync(async (req, res) => {
    var returnData = []
    const user = await User.findById(res.ActivelyUserId);
    const groups = await Group.find({});
    for (let i = 0; i < groups.length; i++) {
        if (!user.groups.includes(groups[i].id)) {
            returnData.push({
                name: groups[i].name,
                sport: groups[i].sportType,
                icon: groups[i].iconImg,
                id: groups[i].id
            })
        }
    }
    const navbarData = await navbarPreLoad(res.ActivelyUserId);
    return res.json({ returnData, navbarData })
}));

groupController.post('/register/groups', catchAsync(async (req, res) => {
    var returnData = []
    const groups = await Group.find({});
    for (let i = 0; i < groups.length; i++) {
        if (returnData.length === 4) {
            break;
        } else {
            if (req.body.sports.includes(groups[i].sportType) && groups[i].id !== allGroupId) {
                returnData.push({
                    name: groups[i].name,
                    sport: groups[i].sportType,
                    icon: groups[i].iconImg,
                    location: groups[i].usualLocation,
                    city: groups[i].city,
                    state: groups[i].state,
                    id: groups[i].id
                })
            }
        }
    }
    return res.send(JSON.stringify({ groups: returnData }))
}));

app.use('/api', [baseController, groupController]);

async function navbarPreLoad(userId) {
    var userSports = []
    const iconImg = 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/';
    const users = await User.find({});
    const user = await User.findById(userId);
    const userImg = (user.profileImg) ? (user.profileImg) : iconImg;
    const userCity = user.city
    const userState = user.state
    for (sportIds in user.sports) {
        const sport = await Sport.findById(user.sports[sportIds]);
        userSports.push(sport.type)
    }
    return { userSports, userImg, userCity, userState }
}

// // app.get('/yomakesports', catchAsync(async (req, res) => {
// //     console.log('here')
// //     const sport1 = new Sport({ type: 'Tennis', expectedPeople: 4 })
// //     await sport1.save()
// //     const sport2 = new Sport({ type: 'Pickleball', expectedPeople: 4 })
// //     await sport2.save()
// //     const sport3 = new Sport({ type: 'Basketball', expectedPeople: 6 })
// //     await sport3.save()
// //     const sport4 = new Sport({ type: 'Soccer', expectedPeople: 8 })
// //     await sport4.save()
// //     const sport5 = new Sport({ type: 'Football', expectedPeople: 8 })
// //     await sport5.save()
// //     const sport6 = new Sport({ type: 'Spikeball', expectedPeople: 4 })
// //     await sport6.save()
// //     const sport7 = new Sport({ type: 'PingPong', expectedPeople: 4 })
// //     await sport7.save()
// //     res.redirect('/')
// // }))

// // app.get('/delEvent', catchAsync(async (req, res) => {
// //     id = '625848bd0b9493f608716b4f'
// //     delIdArr = [id]
// //     await Event.findByIdAndDelete(id)
// //     await Sport.updateMany({}, { $pullAll: { eventId: delIdArr } })
// //     await User.updateMany({}, { $pullAll: { enrolledEvents: delIdArr, hostedEvents: delIdArr } })
// //     res.redirect('/')
// // }))

// // app.get('/deldeldel', async (req, res, next) => {
// //     await User.deleteMany({})
// //     await Sport.deleteMany({})
// //     await Event.deleteMany({})
// //     return res.redirect('./');
// // });

// app.get('/standardizedUsers', async (req, res, next) => {
// await User.updateMany({}, { $set: { friends: [], state: 'Iowa', city: 'Iowa City', notifcations: true, publicSocials: true, profileImg: 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/', age: 18 } })
// return res.redirect('./');
// console.log('stra')
// const group = new Group({ name: "Public", description: "Public", sportType: "PingPong" });
// await group.save();
// console.log('strandrat')
// await User.updateMany({}, { $set: { groups: [allGroupId] } })
// });

// // app.get('/deleteEvents901', catchAsync(async (req, res) => {
// //     delIdArr = []
// //     var date = new Date();
// //     date.setHours(date.getHours() - 6)
// //     eventsArr = await Event.find({})
// //     for (i in eventsArr) {
// //         var eTime = eventsArr[i].time
// //         if (eTime.getTime() < date.getTime()) {
// //             delIdArr.push(eventsArr[i].id)
// //             await Event.findByIdAndDelete(eventsArr[i].id)
// //         }
// //     }
// //     await Sport.updateMany({}, { $pullAll: { eventId: delIdArr } })
// //     await User.updateMany({}, { $pullAll: { enrolledEvents: delIdArr, hostedEvents: delIdArr } })
// //     res.redirect('/')
// // }))

// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })

// app.use((err, req, res, next) => {
//     // console.log('at error handler')
//     return res.send(JSON.stringify("ERROR"));
// })

app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

let PORT = process.env.PORT

if (PORT == null || PORT == "") {
    PORT = 5000
}
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
})

