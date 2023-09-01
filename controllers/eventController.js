const model = require('../models/eventModel');
const rsvp = require('../models/rsvp');
const {fileUpload} = require('../middleware/fileUpload');

//GET /events: send all events to the user
exports.index = (req, res, next) => {
    model.find()
    .then(events => {
        res.render('./events', {events})
    })
    .catch(err => next(err));
}

//GET /events/new: send html form for creating a new event
exports.new = (req, res) => {
    res.render('./events/newEvent');
}

//POST /events: create a new event
exports.create = (req, res, next) => {
    let events = new model (req.body);
    if (req.file) {
        events.image = "/images/" + req.file.filename;
    }
    events.host = req.session.user;
    events.save()
    .then(event => {
        req.flash('success', 'Event creation was successful!');
        res.redirect('./events')
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
}

//GET /events/:id: send details of event identified by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    let rsvp_ = 0;

    model.findById(id).populate('host', 'firstName lastName')
    .then(event => {
        if(event) {
            Promise.all([rsvp.find({event: id}), model.find({id: id})])
            .then(results => {
                results.forEach(result => {
                    result.forEach(r => {
                        if(r) {
                            event.rsvp += r.numRsvp;
                            rsvp_ = event.rsvp;
                        }
                    });
                })
                let startDate = event.start.toLocaleDateString();
                let startTime = event.start.toLocaleTimeString();

                let endDate = event.end.toLocaleDateString();
                let endTime = event.end.toLocaleTimeString();
                res.render('./events/event', {rsvp_, event, startDate, startTime, endDate, endTime})
            })
            .catch(err => next(err));
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//GET /events/:id/edit: send html form for editing an existing event
exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(event => {
        if(event) {
            let start = event.start.toISOString().slice(0,23);
            let end = event.end.toISOString().slice(0,23);
            res.render('./edit', {event, start, end})
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//PUT /events/:id: update the event identified by id
exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    if (req.file) {
        event.image = "/images/" + req.file.filename;
    }

    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
        if(event) {
            req.flash('success', 'Event was edited successfully!');
            res.redirect('/events/' + id)
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
}

//DELETE /events/:id: delete the event identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event => {
        if(event) {
            //rsvp.deleteOne({event: id})
            //.then(res.redirect('/events'))
            //.catch(err => next(err));
            req.flash('success', 'Event was deleted successfully!');
            res.redirect('/events')
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//RSVP
exports.rsvp = (req, res, next) => {
    let id = req.params.id;
    let newRsvp = new rsvp (req.body);

    newRsvp.user = req.session.user;
    newRsvp.event = id;
    if(newRsvp.status === 'YES'){
        newRsvp.numRsvp = newRsvp.numRsvp + 1;
    } else if(newRsvp.status === 'NO'){
        newRsvp.numRsvp = newRsvp.numRsvp - 1;
    } else {
        newRsvp.numRsvp = newRsvp.numRsvp;
    }
    newRsvp.save()
    .then(rsvp => {
        if(rsvp) {
            req.flash('success', 'RSVP was successful!');
            res.redirect(`/events/${id}`)
        } else {
            let err = new Error('Cannot find id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}