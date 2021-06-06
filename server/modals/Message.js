const mongoose = require('mongoose');

const message = new mongoose.Schema({
    room: {
        type: String
    },
    message: {
        type: String
    },
    from: {
        type: Object
    },
    to: {
        type: Object
    },
    sender: {
        type: String
    },
    reciver: {
        type: String
    },
    active: {
        type: Boolean
    }
});

module.exports = Message = mongoose.model('message', message);
