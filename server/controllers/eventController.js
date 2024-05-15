const Event = require('../models/event');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.create_post = [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Title must be specified.")
        .isAlpha()
        .withMessage("Title has non-alphabetic characters."),
    body("description")
        .trim()
        .escape(),
    body("event_id")
        .isMongoId()
        .withMessage("SSomething went wrong. Please try again."),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const firstErrors = {};
            errors.array().forEach((error) => {
                if(!firstErrors[error.param]) {
                    firstErrors[error.param] = error.msg;
                }
            });

            res.status(400).json({ errors: firstErrors });
            return;
        }

        const event = new Event({
            user_id: req.user._id,
            title: req.body.title,
            description: req.body.description
        });

        event.save((err) => {
            if(err) {
                return next(err);
            }

            res.status(201).json(event);
        });
    })
]

exports.list_get = asyncHandler(async (req, res, next) => {
    const events = await Event.find({ user_id: req.user._id });
    res.json(events);
});