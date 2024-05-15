const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ballotSchema = new Schema({
    name: String,
    event_id: {type: Schema.Types.ObjectId, ref: 'Event'},
});

module.exports = mongoose.model('Ballot', ballotSchema);