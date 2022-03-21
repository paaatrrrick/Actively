const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    sportType: { type: String, required: true },
    description: { type: String, required: false, default: 'This will definetly be a good time' },
    location: { type: String, required: true },
    level: { type: String, required: true, default: 'Anyone' },
    time: { type: Date, required: true },
    hostId: { type: String, required: true },
    groupSize: { type: Number, required: false },
    participantId: []
});

module.exports = mongoose.model("Event", eventSchema);