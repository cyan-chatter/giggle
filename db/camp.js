const mongoose = require('mongoose');

const campSchema = mongoose.Schema({
    name: {type: String, unique: true, required: true},
    about: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    subject: {type: String, required: true},
    tags: { type: [String], index: true },
    members: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }],
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
});
const Camp = mongoose.model('Camp', campSchema)

module.exports = Camp;

