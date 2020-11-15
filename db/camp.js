const mongoose = require('mongoose');

const campSchema = mongoose.Schema({
    name: {type: String, required: true},
    about: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    subject: {type: String, required: true},
    tags: { type: [String], index: true },
    lancers: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
});
const Camp = mongoose.model('Camp', campSchema)

module.exports = Camp;

