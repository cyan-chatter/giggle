const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET || 'MazeRunner'
const validator = require('validator')


const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, lowercase:true},
    fullname: {type: String, required: true},
    email: {
        type: String, 
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('E-mail is invalid')
                                
            }
        }
    },
    password: {
        type: String, 
        default: '',
        validate(value){
            if(value.length<8){
                throw new Error('Password must have atleast 8 characters')
            }
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain the Word : password')
            }
        }
    },
    about: {type: String, default: 'Hello :) I am Available'},
    userImage: {type: String, default: 'defaultPic.png'},
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    receivedRequests: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''},
        timing: {type: Date}
    }],
    totalRequests: {type: Number, default: 0},
    friends: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''},
        fullname: {type: String, default: ''},
        recentDirect: {type: mongoose.Schema.Types.ObjectId, ref: 'Direct'}
    }],
    sentRequests: [{
        username: {type: String, default: ''}
    }],

});

userSchema.statics.findByCredentials = async (email, password) =>{
    //console.log('Find by Credentials called')
    const user = await User.findOne({ email })
    //console.log('Find by Credentials finds User')
    if(!user){
        throw new Error('E-mail not registered')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Incorrect Password')
    }

    return user
}


// userSchema.methods.encryptPassword = function(password){
//     console.log('encrypt called')
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
// };

// userSchema.methods.validUserPassword = function(password){
//     console.log('decrypt called')
//     return bcrypt.compareSync(password, this.password);
// };

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},secretKey)
    user.tokens = user.tokens.concat({token})
    await user.save()
    console.log('token generated')
    return token 
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User;
