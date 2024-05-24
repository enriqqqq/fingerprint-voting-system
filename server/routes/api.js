const express = require('express');
const router = express.Router();

const EventController = require('../controllers/eventController');
const UserController = require('../controllers/userController');
const { isAuth } = require('../lib/authMiddleware');

/* ---------------------------
    EVENTS ROUTE 
--------------------------- */

// POST request for creating an event
router.post('/events', isAuth, EventController.create_post);

// GET request for getting single event
router.get('/events/:id', isAuth, EventController.get_event);

// GET request for getting all events
router.get('/events', isAuth, EventController.list_get);

// PUT request for updating an event
router.put('/events/:id/update', isAuth, EventController.update_event); 

// DELETE request for deleting an event
router.delete('/events/:id/delete', isAuth, EventController.delete_event);

/* ---------------------------
    USERS ROUTE
--------------------------- */

// POST request for creating/registering a user
router.post('/users', UserController.create_post);

module.exports = router;