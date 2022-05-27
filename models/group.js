const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    description: { type: String, required: false, default: 'The Kings' },
    sportType: { type: String, required: true },
    bannerImg: { type: String },
    iconImg: { type: String },
    usualLocation: { type: String },
    hostId: { type: String },
    city: { type: String },
    state: { type: String },
    name: { type: String },
    participantId: [],
});

module.exports = mongoose.model("Group", groupSchema);