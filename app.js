if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const engine = require('ejs-mate');
const session = require('express-session');
const multer = require('multer')
const { response } = require('express');
const flash = require('connect-flash');
const User = require('./models/user.js');
const Event = require('./models/event.js');
const Sport = require('./models/sport.js');
const { isLoggedIn } = require('./utils/middleware');
const { createSportsIdArr, timeSwitch, sendText, adjustTime, updateNotification } = require('./utils/constructors');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError.js');
const DB_DEFAULT = 'mongodb://localhost:27017/Actively'
const db_url = process.env.DB_URL;
const currentUrl = db_url;
const sendTextMessages = true;
const MongoStore = require('connect-mongo');
const { constants } = require('buffer');
const Events = require('twilio/lib/rest/Events');
const user = require('./models/user.js');
const { match } = require('assert');
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)


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
app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoStore({
    mongoUrl: currentUrl, secret: process.env.SESSION_SECRET
})

store.on('error', function (e) {
    console.log('session store error', e)
})

app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/home', (req, res) => {
    const isLoggedIn = req.session.isAuthenticated
    res.render('home', { isLoggedIn })
});

app.get('/login', (req, res) => {
    if (req.session.isAuthenticated) {
        res.redirect('/dashboard');
    } else {
        res.render('auth/login')
    }
});

app.get('/', (req, res) => {
    if (req.session.isAuthenticated) {
        res.redirect('/dashboard');
    } else {
        res.render('auth/register')
    }
});

app.get('/resources', (req, res) => {
    res.render('resources')
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.get('/friends', isLoggedIn, catchAsync(async (req, res) => {
    navbarData = await navbarPreLoad(req.session.currentId)
    res.render('friends', { navbarData })
}));

app.post('/addFriend', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne(
        { _id: req.session.currentId },
        { $push: { friends: req.body.id } }
    )
    res.sendStatus(200);
}));

app.post('/removeFriend', isLoggedIn, catchAsync(async (req, res) => {
    await User.updateOne({ _id: req.session.currentId }, { $pull: { friends: { $eq: req.body.id } } })
    res.sendStatus(200);
}));

app.post('/findFriends', isLoggedIn, async (req, res) => {
    var returnData = []
    const users = await User.find({ firstName: req.body.first, lastName: req.body.last })
    const currentUser = await User.findById(req.session.currentId);
    for (let i = 0; i < users.length; i++) {
        returnData.push({
            first: users[i].firstName,
            last: users[i].lastName,
            id: users[i].id,
            icon: users[i].profileImg,
            isFriend: (currentUser.friends.includes(users[i].id))
        })
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ key: returnData }))
})

app.get('/newEvent', isLoggedIn, catchAsync(async (req, res) => {
    navbarData = await navbarPreLoad(req.session.currentId)
    res.render('newEvent', { navbarData })
}));

app.get('/profile', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.session.currentId);
    const img = 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/'
    navbarData = await navbarPreLoad(req.session.currentId)
    res.render('profile', { user, img, navbarData })
}));

app.post('/profilephoto', isLoggedIn, catchAsync(async (req, res) => {
    await User.findByIdAndUpdate({ _id: String(req.session.currentId) }, { profileImg: req.body.idUrl })
    return '123'
}));

app.post('/profileinfo', isLoggedIn, catchAsync(async (req, res) => {
    var { location, description, instagram, facebook, age, shareNumber, notifcations } = req.body;
    let number = false
    let showNotifications = false
    if (shareNumber === 'on') {
        number = true
    }
    if (notifcations === 'on') {
        showNotifications = true
    }
    const user = await User.findByIdAndUpdate({ _id: String(req.session.currentId) }, { profileBio: description, age: age, instagramLink: instagram, facebookLink: facebook, publicSocials: number, notifcations: showNotifications })
    res.redirect('/profile');

}));

app.get('/profile/:id', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    const img = 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/'
    const currentUser = await User.findById(req.session.currentId)
    const isFriend = (currentUser.friends.includes(user.id)) ? true : false;
    navbarData = await navbarPreLoad(req.session.currentId)
    res.render('viewprofile', { user, img, isFriend, navbarData })
}));

app.post('/newEvent', isLoggedIn, catchAsync(async (req, res, next) => {
    console.log('a new event has been made')
    const { type, location, time, skill, description, turnout, notifcation } = req.body;
    const id = String(req.session.currentId);
    var user = await User.findById(id)
    const event = new Event({ sportType: type, description: description, location: location, level: skill, time: time, hostId: id, groupSize: turnout, city: user.city, state: user.state })
    await event.save();
    console.log(notifcation)
    console.log(sendTextMessages)
    if (notifcation !== 'nothing' & sendTextMessages) {
        console.log('her her her')
        await sendText(notifcation, event)
    }
    const foundSport = await Sport.find({ type: type });
    const updatingSport = await Sport.findById(foundSport[0].id)
    updatingSport.eventId.push(event.id)
    await updatingSport.save();
    user.hostedEvents.push(event.id)
    await user.save();
    // req.flash('success', 'Successfully Created New Event');
    res.redirect('/dashboard');
}));


app.post('/updateSportInterests', catchAsync(async (req, res, next) => {
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
        const user = await User.findById(req.session.currentId);
        state = user.state;
        city = user.city;
    }
    await User.updateOne(
        { _id: req.session.currentId },
        { $set: { sports: eventIdArr, state: state, city: city } }
    )
    res.redirect('/dashboard')
}));

app.post('/event/:eventId/:userId', isLoggedIn, catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    event.participantId = event.participantId.concat([String(req.params.userId)])
    await event.save();
    const user = await User.findById(req.params.userId);
    user.enrolledEvents = user.enrolledEvents.concat([String(req.params.eventId)])
    await user.save();
    if (sendTextMessages) {
        updateNotification(user, event)
    }
    req.flash('success', 'Successfully Joined the ' + event.sportType + ' Match');
    return res.redirect('/dashboard');
}));


app.post('/register', catchAsync(async (req, res, next) => {
    const sportsArr = await createSportsIdArr(req.body.sport)
    const { email, firstName, lastName, password, sportA, phoneNumber } = req.body.user
    const username = email
    const user = new User({ email: email, sports: sportsArr, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, username: username, state: req.body.state, city: req.body.city });
    const newUser = await User.register(user, password)
    await user.save();
    req.session.isAuthenticated = true
    req.session.currentId = user.id
    req.flash('success', 'Successfully Created a New Account!');
    res.redirect('../dashboard')
}));


app.get('/logout', (req, res) => {
    req.session.isAuthenticated = false
    req.session.currentId = null
    req.flash('success', 'Successfully Logged Out');
    return res.redirect('/home')
});

app.post('/login', catchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body.user;
        const user = await User.authenticate()(email, password)
        if (user.user.email == null) {
            req.session.isAuthenticated = false
            req.flash('error', 'No Account Found with that Information');
            return res.redirect('./login')
        } else {
            req.session.isAuthenticated = true
            req.session.currentId = user.user.id
        }
        res.redirect('../dashboard')
    } catch {
        req.session.isAuthenticated = false
        req.flash('error', 'No Account Found with that Information');
        return res.redirect('./login')
    }
}));


app.post('/getProfiles', isLoggedIn, catchAsync(async (req, res) => {
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


app.get('/dashboard', isLoggedIn, async (req, res, next) => {
    var upcomingContent = []
    var currentContent = []
    var date = new Date();
    const user = await User.findById(req.session.currentId)
    var sportNames = []
    const userId = user.id
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
    const hostedEvents = await Event.find({
        hostId: user.id
    })
    events = events.concat(hostedEvents)
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
            if (eachMatch.participantId.includes(user.id) || eachMatch.hostId === user.id) {
                currentContent.push(arr);
            } else {
                upcomingContent.push(arr)
            }
        }
    }
    upcomingContent.sort(function (x, y) {
        return x[1].time - y[1].time;
    });
    currentContent.sort(function (x, y) {
        return x[1].time - y[1].time;
    });
    navbarData = await navbarPreLoad(req.session.currentId)
    res.render('dashboard', { upcomingContent, currentContent, userId, navbarData })
});

async function navbarPreLoad(userId) {
    var userSports = []
    const iconImg = 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/';
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

// app.get('/yomakesports', catchAsync(async (req, res) => {
//     console.log('here')
//     const sport1 = new Sport({ type: 'Tennis', expectedPeople: 4 })
//     await sport1.save()
//     const sport2 = new Sport({ type: 'Pickleball', expectedPeople: 4 })
//     await sport2.save()
//     const sport3 = new Sport({ type: 'Basketball', expectedPeople: 6 })
//     await sport3.save()
//     const sport4 = new Sport({ type: 'Soccer', expectedPeople: 8 })
//     await sport4.save()
//     const sport5 = new Sport({ type: 'Football', expectedPeople: 8 })
//     await sport5.save()
//     const sport6 = new Sport({ type: 'Spikeball', expectedPeople: 4 })
//     await sport6.save()
//     const sport7 = new Sport({ type: 'PingPong', expectedPeople: 4 })
//     await sport7.save()
//     res.redirect('/')
// }))

// app.get('/delEvent', catchAsync(async (req, res) => {
//     id = '625848bd0b9493f608716b4f'
//     delIdArr = [id]
//     await Event.findByIdAndDelete(id)
//     await Sport.updateMany({}, { $pullAll: { eventId: delIdArr } })
//     await User.updateMany({}, { $pullAll: { enrolledEvents: delIdArr, hostedEvents: delIdArr } })
//     res.redirect('/')
// }))

// app.get('/deldeldel', async (req, res, next) => {
//     await User.deleteMany({})
//     await Sport.deleteMany({})
//     await Event.deleteMany({})
//     return res.redirect('./');
// });

app.get('/standardizedUsers', async (req, res, next) => {
    await User.updateMany({}, { $set: { friends: [], state: 'Iowa', city: 'Iowa City', notifcations: true, publicSocials: true, profileImg: 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/', age: 18 } })
    return res.redirect('./');
});

// app.get('/deleteEvents901', catchAsync(async (req, res) => {
//     delIdArr = []
//     var date = new Date();
//     date.setHours(date.getHours() - 6)
//     eventsArr = await Event.find({})
//     for (i in eventsArr) {
//         var eTime = eventsArr[i].time
//         if (eTime.getTime() < date.getTime()) {
//             delIdArr.push(eventsArr[i].id)
//             await Event.findByIdAndDelete(eventsArr[i].id)
//         }
//     }
//     await Sport.updateMany({}, { $pullAll: { eventId: delIdArr } })
//     await User.updateMany({}, { $pullAll: { enrolledEvents: delIdArr, hostedEvents: delIdArr } })
//     res.redirect('/')
// }))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Well... we aren't exacly sure what happened. Sorry!"
    res.status(statusCode).render('error', { err })
})

let PORT = process.env.PORT

if (PORT == null || PORT == "") {
    PORT = 3000
}
app.listen(PORT, () => {
    console.log('Serving on port 3000')
})

