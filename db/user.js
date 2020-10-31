const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    fullname: {type: String, default: 'lazy person'},
    email: {
        type: String, 
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {type: String, default: ''},
    userImage: {type: String, default: 'defaultPic.png'},
    facebook: {type: String, default: ''},
    fbTokens: Array,
    google: {type: String, default: ''},
    sentRequest: [{
        username: {type: String, default: ''}
    }],
    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        friendName: {type: String, default: ''}
    }],
    totalRequest: {type: Number, default: 0},
    country: {type: String, default: ''},
    mantra: {type: String, default: ''},
});

userSchema.methods.encryptPassword = function(password){
    console.log('encrypt called')
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function(password){
    console.log('decrypt called')
    return bcrypt.compareSync(password, this.password);
};


// userSchema.pre('save',async function(next){
//     const user = this
//     if(user.isModified('password')){
//         user.password = await bcrypt.hash(user.password, 8)
//     }
//     next()
// })



module.exports = mongoose.model('User', userSchema);
