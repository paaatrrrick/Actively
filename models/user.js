const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    sports: [],
    enrolledEvents: [],
    hostedEvents: [],
    friends: [],
    firstName: String,
    lastName: String,
    phoneNumber: String,
    profileImg: { type: String, required: false, default: 'https://ucarecdn.com/a0411345-97eb-44ba-be97-1a1ac4ec79d9/' },
    profileBio: { type: String, required: false },
    mainLocation: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    instagramLink: { type: String, required: false },
    facebookLink: { type: String, required: false },
    publicSocials: { type: Boolean, required: false, default: true },
    notifcations: { type: Boolean, required: false, default: true },
    age: { type: Number, required: false },
}
)

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)