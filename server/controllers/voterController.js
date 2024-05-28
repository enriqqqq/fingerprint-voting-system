const Voter = require('../models/voter');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.create_post = [
    
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Name must be specified.")
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage("Name must be alphanumeric and can contain spaces."),
    body("fingerprint")
        .isArray({ min: 512, max: 512 })
        .withMessage("Fingerprint template file is not valid"),
    body("event_id")
        .isMongoId()
        .withMessage("Event ID is not valid"),
    
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

        const voter = new Voter({
            name: req.body.name,
            fingerprint: req.body.fingerprint,
            user_id: req.user._id,
            event_id: req.body.event_id
        });
        
        await voter.save();
        res.status(201).json(voter);
    })
];

exports.list_get_event = asyncHandler(async (req, res, next) => {
    const voters = await Voter.find({ user_id : req.user._id, event_id: req.params.event_id });
    res.status(200).json({ voters });
});

exports.list_get = asyncHandler(async (req, res, next) => {
    const voters = await Voter.find({ user_id: req.user._id });
    res.status(200).json({ voters });
})