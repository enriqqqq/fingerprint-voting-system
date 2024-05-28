const Event = require('../models/event');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.create_post = [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Title must be specified.")
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage("Title must be alphanumeric and can contain spaces."),
    body("description")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const firstErrors = {};
            errors.array().forEach((error) => {
                if(!firstErrors[error.path]) {
                    firstErrors[error.path] = error.msg;
                }
            });

            res.status(400).json({ errors: firstErrors });
            return;
        }

        const event = new Event({
            title: req.body.title,
            description: req.body.description,
            user_id: req.user._id
        }); 

        await event.save();
        res.status(201).json(event);
    })
]

exports.list_get = asyncHandler(async (req, res, next) => {
    const events = await Event.find({ user_id: req.user._id });
    res.status(200).json(events);
});

exports.get_event = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if(!event) {
        res.status(404).json({ message: 'Event not found.' });
        return;
    }
    res.status(200).json(event);
});

exports.update_event = [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Title must be specified.")
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage("Title must be alphanumeric and can contain spaces."),
    body("description")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const firstErrors = {};
            errors.array().forEach((error) => {
                if(!firstErrors[error.path]) {
                    firstErrors[error.path] = error.msg;
                }
            });

            res.status(400).json({ errors: firstErrors });
            return;
        }

        const event = await Event.findById(req.params.id);
        event.title = req.body.title;
        event.description = req.body.description;

        await event.save();
        res.status(200).json(event);
    })
];

exports.delete_event = asyncHandler(async (req, res, next) => {
    const result = await Event.findByIdAndDelete(req.params.id);

    if(!result) {
        res.status(404).json({ message: 'Event not found.' });
        return;
    }
    res.status(200).json({ message: 'Event deleted successfully.' });
});

