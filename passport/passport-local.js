'use strict';
const passport = require('passport')
const User = require('../db/user')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, ok) => {
    console.log('serialized')
    ok(null, user.id)
});

passport.deserializeUser((id, ok) => {
    console.log('serialized')
    User.findById(id, (err, user) => {
        ok(err, user)
    })
})

passport.use('localSignup', 
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },  async (req,email,password,ok)=>{
            const user = await User.findOne({'email': email})
             if(user){
                 return ok(null, false, req.flash('error', 'The email is already registered'))
             }
             console.log('Signup Strategy is Running')
             const newUser = new User()
             newUser.username = req.body.username
             newUser.fullname = req.body.fullname
             newUser.email = req.body.email
             newUser.password = newUser.encryptPassword(req.body.password)
             //encrypt here and then save password
             newUser.save((err) => {
                 ok(null, newUser)
             })
         
        })
)




