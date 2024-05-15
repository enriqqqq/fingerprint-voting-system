const mongoose = require('mongoose');
const event = require('./event');
const schema = mongoose.Schema;

const voterSchema = new schema({
    name: String,
    fingerprint: [Number], // 512 1 byte numbers (template file)
    event_id : {type: schema.Types.ObjectId, ref: 'Event'},
    choice: {type: schema.Types.ObjectId, ref: 'Ballot', default: null},
});

module.exports = mongoose.model('Voter', voterSchema);