const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');
const {isLoggedIn} = require('../middleware/auth');
const {isHost, isNotHost} = require('../middleware/auth');
const {validateId} = require('../middleware/validator');
const {validateEvent, validateResult, validateRsvp} = require('../middleware/validator');

//GET /events: send all events to the user
router.get('/', controller.index);

//GET /events/new: send html form for creating a new story
router.get('/new', isLoggedIn, controller.new);

//POST /events: create a new story
router.post('/', isLoggedIn, fileUpload, validateEvent, validateResult, controller.create);

//GET /events/:id: send details of events identified by id
router.get('/:id', validateId, controller.show);

//GET /events/:id/edit: send html form for editing an existing event
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//PUT /events/:id: update the event identified by id
router.put('/:id', validateId, isLoggedIn, fileUpload, isHost, validateEvent, validateResult, controller.update);

//DELETE /events/:id: delete the event identified by id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

//RSVP
router.post('/:id/rsvp', validateId, isLoggedIn, isNotHost, validateRsvp, validateResult, controller.rsvp);

module.exports = router;