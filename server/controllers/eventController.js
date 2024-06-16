const Event = require('../models/event');
const Ballot = require('../models/ballot');
const Voter = require('../models/voter');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
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
    // for every event, get the voter and the ballot count
    const events = await Event.aggregate([
        {
            $lookup: {
                from: 'voters',
                localField: '_id',
                foreignField: 'event_id',
                as: 'voters'
            }
        },
        {
            $lookup: {
                from: 'ballots',
                localField: '_id',
                foreignField: 'event_id',
                as: 'ballots'
            }
        },
        {
            $match: {
                user_id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $sort: {
                created_at: -1
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                voterCount: { $size: '$voters' },
                candidateCount: { $size: '$ballots' },
            }
        },
    ]);

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

exports.start_event = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if(!event.user_id.equals(req.user._id)) {
        res.status(403).json({ 
            message: 'You do not have permission to start this event.',
            code: 0x01 
        });
        return;
    }

    if(!event) {
        res.status(404).json({ 
            message: 'Event not found.',
            code: 0x02
        });
        return;
    }

    const voters = await Voter.find({ event_id: event._id });

    if(voters.length === 0) {
        res.status(400).json({ 
            message: 'No voters have been added to this event.',
            code: 0x03 
        });
        return;
    }

    const ballots = await Ballot.find({ event_id: event._id });

    if(ballots.length < 2) {
        res.status(400).json({ 
            message: 'You need at least 2 ballots to start the voting event.',
            code: 0x04 
        });
        return;
    }

    event.last_started = new Date();
    await event.save();

    res.status(200).json({ 
        message: 'Event started successfully, starting to load fingerprints', 
        code: 0x00,    
        voters 
    });
});

exports.get_results = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if(!event) {
        res.status(404).json({ message: 'Event not found.' });
        return;
    }

    if(!event.user_id.equals(req.user._id)) {
        res.status(403).json({ message: 'You do not have permission to view this event.' });
        return;
    }

    const ballots = await Ballot.find({ event_id: event._id });

    if(!ballots.length > 1) {
        res.status(400).json({ message: 'No results available.' });
        return;
    }

    const voters = await Voter.find({ event_id: event._id });

    if(voters.length === 0) {
        res.status(400).json({ message: 'No voters have been added to this event.' });
        return;
    }

    const results = [];

    for(let i = 0; i < ballots.length; i++) {
        const votes = await Voter.find({ event_id: event._id, choice: ballots[i]._id });
        results.push({...ballots[i]._doc, votes: votes});
    }

    res.status(200).json({ results, voters, event });
});

exports.get_latest_started = asyncHandler(async(req,res,next)=> {
    const lastStartedEvent = await Event.find({ user_id: req.user._id, last_started: { $ne: null } }).sort({ last_started: -1 }).limit(1);
    res.status(200).json(lastStartedEvent);
    return;
})

