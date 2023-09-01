const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    event: {type: Schema.Types.ObjectId, ref: 'Event'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, required: [true, 'status is required'], enum: ['YES', 'NO', 'MAYBE']},
    numRsvp: {type: Number, default: 0}
});

//collection name is stories in the database
module.exports = mongoose.model('Rsvp', rsvpSchema);