const Voter = require('../models/voter');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.create_post = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Name must be specified.")
        .isAlpha()
        .withMessage("Name has non-alphabetic characters."),
    body("fingerprint")
        .isArray({ min: 512, max: 512 })
        .withMessage("Fingerprint template file is not valid"),
    
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

        const voter = new Voter({
            name: req.body.name,
            fingerprint: req.body.fingerprint,
        });

        voter.save((err) => {
            if(err) {
                return next(err);
            }

            res.status(201).json(voter);
        });
    })
]