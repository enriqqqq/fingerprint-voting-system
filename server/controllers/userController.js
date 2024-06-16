const mongoose = require('mongoose');
const User = require('../models/user');
const Voter = require('../models/voter');
const Ballot = require('../models/ballot');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs'); 
const { body, validationResult } = require('express-validator');

exports.create_post = [
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be specified.")
        .isAlphanumeric()
        .withMessage("Username has non-alphanumeric characters.")
        .custom(async(value) => {
            const user = await User.findOne({ 'username': value });
            if(user) return Promise.reject();
        })  
        .withMessage("Username already exists."),
    body("password")
        .isLength({ min: 3})
        .escape()
        .withMessage("Password must be 3 characters long."),    
    body("confirmPassword")
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage("Passwords do not match."),
    
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

        // hash password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            // if error, pass to error handler
            if(err) {
                return next(err);
            }

            // create new user
            const user = new User({
                username: req.body.username,
                password: hashedPassword
            });

            // save user
            await user.save();
            res.status(201).json(user);
        });
    })
]

exports.get_stats = asyncHandler(async (req, res, next) => {
    const voters = await Voter.aggregate([
        {
            $lookup: {
                from: 'events', // collection name in mongodb for Event model
                localField: 'event_id',
                foreignField: '_id',
                as: 'eventDetails'
            }
        },
        {
            $unwind: '$eventDetails' // unwind array returned by $lookup
        },
        {
            $match: {
                'eventDetails.user_id': new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ]);
    
    const ballots = await Ballot.aggregate([
        {
            $lookup: {
                from: 'events', // collection name in mongodb for Event model
                localField: 'event_id',
                foreignField: '_id',
                as: 'eventDetails'
            }
        },
        {
            $unwind: '$eventDetails' // unwind array returned by $lookup
        },
        {
            $match: {
                'eventDetails.user_id': new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ]);

    res.status(200).json({ voters: voters.length, ballots: ballots.length });
});