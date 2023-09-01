const express = require('express');
const mrouter = express.Router();
const mcontroller = require('../controllers/mainController');

//GET /
mrouter.get('/', mcontroller.index);

//GET /events: send all events to the user
mrouter.get('/about', mcontroller.about);

//GET /events/new: send html form for creating a new story
mrouter.get('/contact', mcontroller.contact);

module.exports = mrouter;