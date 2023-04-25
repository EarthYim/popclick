const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    timestamp: Date,
    ip: String,
});

module.exports = mongoose.model('ChoiceA', voteSchema);
module.exports = mongoose.model('ChoiceB', voteSchema);