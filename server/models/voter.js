const mongoose = require('mongoose');

const schema = mongoose.Schema;

const voterSchema = new schema({
    name: String,
    fingerprint: [Number], // 512 1 byte numbers (template file)
    user_id: {type: schema.Types.ObjectId, ref: 'User'},
    event_id : {type: schema.Types.ObjectId, ref: 'Event'},
    choice: {type: schema.Types.ObjectId, ref: 'Ballot', default: null},
    created_at: {type: Date}
});

module.exports = mongoose.model('Voter', voterSchema);