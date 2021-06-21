const mongoose = require('mongoose');

const directSchema = mongoose.Schema({
    message: {type: String},
    dtype: {type: String, default: 'text', required: true, trim: true, lowercase: true},
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    senderName: {type: String},
    receiverName: {type: String},
    userImage: {type: String},
    isRead: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}

});
const Direct = mongoose.model('Direct', directSchema)

module.exports = Direct;

