const Ballot = require('../models/ballot');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.create_post = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Name must be specified.")
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage("Name must be alphanumeric and can contain spaces."),

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

        const ballot = new Ballot({
            name: req.body.name,
            event_id: req.body.event_id,
        }); 

        await ballot.save();
        res.status(201).json(ballot);
    })
];

exports.list_get_event = asyncHandler(async (req, res, next) => {
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
                'event_id': new mongoose.Types.ObjectId(req.params.event_id),
                'eventDetails.user_id': new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ]);

    res.status(200).json({ballots});
});

exports.list_get = asyncHandler(async (req, res, next) => {
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

    res.status(200).json({ballots});
});

exports.delete_post = asyncHandler(async (req, res, next) => {
    const deletedBallot = await Ballot.findByIdAndDelete(req.params.ballot_id);
    if(!deletedBallot) {
        res.status(404).json({ message: "Ballot not found" });
        return;
    }
    res.status(200).json(deletedBallot);
});

exports.update_post = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Name must be specified.")
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage("Name must be alphanumeric and can contain spaces."),

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

        const ballot = await Ballot.findById(req.params.ballot_id);
        if(!ballot) {
            res.status(404).json({ message: "Ballot not found" });
            return;
        }

        ballot.name = req.body.name;
        await ballot.save();
        res.status(200).json(ballot);
    })
];