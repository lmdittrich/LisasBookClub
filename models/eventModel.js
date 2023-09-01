const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    category: {type: String, required: [true, 'category is required'], enum: ['Reading', 'Discussion', 'Movie', 'Bookstore', 'Signing', 'Other']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    start: {type: Date, required: [true, 'start time is required']},
    end: {type: Date, required: [true, 'end time is required']},
    details: {type: String, required: [true, 'details are required']},
    location: {type: String, required: [true, 'location is required']},
    image: {type: String, required: [true, 'image is required']},
    rsvp: {type: Number, default: 0, required: [true, 'rsvp is required']}
});

//collection name is stories in the database
module.exports = mongoose.model('Event', eventSchema);