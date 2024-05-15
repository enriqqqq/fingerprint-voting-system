const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: {type: String, default: ''},
});

module.exports = mongoose.model('Event', eventSchema);