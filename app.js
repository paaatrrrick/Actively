if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session');
const multer = require('multer')
const { response } = require('express');
const flash = require('connect-flash');
const User = require('./models/user.js');
const Event = require('./models/event.js');
const Sport = require('./models/sport.js');
const { isLoggedIn } = require('./utils/middleware');
const { createSportsIdArr, timeSwitch, sendText, adjustTime } = require('./utils/constructors');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError.js');
const DB_DEFAULT = 'mongodb://localhost:27017/Actively'
const db_url = process.env.DB_URL
const currentUrl = db_url
const sendTextMessages = false;
const MongoStore = require('connect-mongo');
const { constants } = require('buffer');
const Events = require('twilio/lib/rest/Events');
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




app.get('/', (req, res) => {
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

app.get('/register', (req, res) => {
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

app.get('/newEvent', isLoggedIn, (req, res) => {
    res.render('newEvent')
});


app.post('/newEvent', isLoggedIn, catchAsync(async (req, res, next) => {
    const { type, location, time, skill, description, turnout } = req.body;
    var dOrig = new Date(time);
    const d = adjustTime(dOrig)
    const id = String(req.session.currentId);
    const event = new Event({ sportType: type, description: description, location: location, level: skill, time: d, hostId: id, groupSize: turnout })
    await event.save();
    var today = new Date();
    var tomorrow = new Date();
    const dSub = adjustTime(dOrig, false);
    today = adjustTime(today, false);
    tomorrow = adjustTime(tomorrow, false);
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (sendTextMessages) {
        if (dSub.getDate() == today.getDate() & dSub > today) {
            await sendText('today', event)
        } else if (dSub.getHours() < 9 & dSub.getDate() == tomorrow.getDate()) {
            await sendText('tomorrow', event)
        }
    }
    const foundSport = await Sport.find({ type: type });
    const updatingSport = await Sport.findById(foundSport[0].id)
    updatingSport.eventId.push(event.id)
    await updatingSport.save();
    var user = await User.findById(id)
    user.hostedEvents.push(event.id)
    await user.save();
    req.flash('success', 'Successfully Created New Event');
    return res.redirect('/dashboard');
}));


app.post('/updateSportInterests', catchAsync(async (req, res, next) => {
    sportsArr = req.body.desiredSports;
    eventIdArr = [];
    for (index in sportsArr) {
        const foundSport = await Sport.find({ type: sportsArr[index] });
        eventIdArr.push(foundSport[0].id);
    }
    const user = await User.findById(req.session.currentId);
    user.sports = eventIdArr;
    await user.save();
    res.redirect('/dashboard')
}));

app.post('/event/:eventId/:userId', isLoggedIn, catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    event.participantId = event.participantId.push(req.params.userId);
    await event.save();
    const user = await User.findById(req.params.userId);
    user.enrolledEvents = user.enrolledEvents.concat([String(req.params.eventId)])
    await user.save();
    req.flash('success', 'Joined the ' + event.type);
    return res.redirect('/dashboard');
}));


app.post('/register', catchAsync(async (req, res, next) => {
    const sportsArr = await createSportsIdArr(req.body.sport)
    const { email, firstName, lastName, password, sportA, phoneNumber } = req.body.user
    const username = email
    try {
        const user = new User({ email: email, sports: sportsArr, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, username: username });
        const newUser = await User.register(user, password)
        req.session.isAuthenticated = true
        req.session.currentId = user.id
        req.flash('success', 'Successfully Created a New Account!');
        return res.redirect('../dashboard')
    } catch {
        req.flash('error', 'That email has already been taken');
        return res.redirect('./register')
    }
    await user.save();
}));

app.get('/logout', (req, res) => {
    req.session.isAuthenticated = false
    req.session.currentId = null
    req.flash('success', 'Successfully Logged Out');
    return res.redirect('/')
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


app.get('/dashboard', isLoggedIn, catchAsync(async (req, res, next) => {
    var upcomingContent = []
    var currentContent = []
    var idArr = []
    var userSports = []
    var allSports = ['PingPong', 'Tennis', 'Pickleball', 'Basketball', 'Soccer', 'Football', 'Spikeball'];
    var date = new Date();
    date = adjustTime(date, false);
    const user = await User.findById(req.session.currentId);

    for (eventIds in user.enrolledEvents) {
        const event = await Event.findById(user.enrolledEvents[eventIds]);
        const host = await User.findById(event.hostId);
        const time = adjustTime(event.time, false);
        if (!idArr.includes(event.id) & time.getTime() >= date.getTime()) {
            newTime = timeSwitch(event.time);
            arr = [(host.firstName + ' ' + host.lastName), event, newTime];
            idArr.push(event.id);
            currentContent.push(arr);
        }
    }

    for (eventIds in user.hostedEvents) {
        const event = await Event.findById(user.hostedEvents[eventIds])
        const time = adjustTime(event.time, false);
        if (!idArr.includes(event.id) & time.getTime() >= date.getTime()) {
            newTime = timeSwitch(event.time)
            arr = [(user.firstName + ' ' + user.lastName), event, newTime];
            idArr.push(event.id);
            currentContent.push(arr);
        }
    }

    for (sportIds in user.sports) {
        const sport = await Sport.findById(user.sports[sportIds]);
        userSports.push(sport.type)
        index = allSports.indexOf(sport.type);
        if (index > -1) {
            allSports.splice(index, 1);
        }
        if (sport !== null) {
            for (i in sport.eventId) {
                var event = await Event.findById(sport.eventId[i]);
                const time = adjustTime(event.time, false);
                if (!idArr.includes(event.id) & time.getTime() >= date.getTime()) {
                    const host = await User.findById(event.hostId);
                    newTime = timeSwitch(event.time)
                    arr = [(host.firstName + ' ' + host.lastName), event, newTime];
                    idArr.push(event.id);
                    upcomingContent.push(arr);
                }
            }
        }
    }
    const userId = req.session.currentId
    upcomingContent.sort(function (x, y) {
        return x[1].time - y[1].time;
    });
    currentContent.sort(function (x, y) {
        return x[1].time - y[1].time;
    });
    res.render('dashboard', { upcomingContent, currentContent, userId, userSports })
}));


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

app.get('/deleteEvents901', catchAsync(async (req, res) => {
    delIdArr = []
    var date = new Date();
    date = adjustTime(date, false);
    date.setHours(date.getHours() - 6)
    eventsArr = await Event.find({})
    for (i in eventsArr) {
        var eTime = eventsArr[i].time
        eTime = adjustTime(eTime, false);
        if (eTime.getTime() < date.getTime()) {
            delIdArr.push(eventsArr[i].id)
            await Event.findByIdAndDelete(eventsArr[i].id)
        }
    }
    await Sport.updateMany({}, { $pullAll: { eventId: delIdArr } })
    await User.updateMany({}, { $pullAll: { enrolledEvents: delIdArr, hostedEvents: delIdArr } })
    res.redirect('/')
}))

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