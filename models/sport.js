const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sportSchema = new Schema({
    type: { type: String, unique: true, required: true },
    expectedPeople: Number,
    eventId: []
});

module.exports = mongoose.model("Sport", sportSchema);