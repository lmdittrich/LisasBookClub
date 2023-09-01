const Event = require('../models/eventModel');

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to login first');
        return res.redirect('/users/login');
    }
};

//check if user is author of the event
exports.isHost = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
    .then(event => {
        if(event) {
            if(event.host == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.isNotHost = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
    .then(event => {
        if(event) {
            if(event.host != req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource. Cannot RSVP if you are host.');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};