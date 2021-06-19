const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')


const routeHandlers = {  
    loadFindUserPage: async(req,res)=>{
    
    username = ''
    fullname = ''
    about = ''
    activate = 'no'
        
    return res.render('findUserPost',{
        username,
        fullname,
        about,
        activate,
        usernameH: req.user.username 
    })
  },
  
    findUserLoad : async (req,res)=>{
        
    const searchedUser = req.body.sUsername
    try{
        const foundUser = await User.find({username: searchedUser})
        if(!foundUser[0]){
            return res.render('tempPage',{
                username: req.user.username,
                message: 'There is No User with that Username',
                usernameH: req.user.username
            })
        }
        return res.render('findUserPost',{
            username: foundUser[0].username,
            fullname: foundUser[0].fullname,
            about: foundUser[0].about,
            activate : 'yes',
            usernameH: req.user.username
        })
    }        
    catch(e){
        console.log("Error in Loading User: "+ e)
    }
  },
  findUserProfile : async(req,res)=>{
    try{
        const username = req.params.user
        const user = await User.findOne({username})
        
            res.render('publicProfile', {
                username: user.username,
                about: user.about,
                fullname: user.fullname,
                email: user.email,
                usernameH: req.user.username
                
            })
        
    }catch(e){
        console.log("Error in fishing user profile: " + e)
    }
 }

}

router.get('/findUser', auth('users'), routeHandlers.loadFindUserPage)
router.post('/findUser', auth('users'), routeHandlers.findUserLoad)
router.get('/findUser/:user', auth('users'), routeHandlers.findUserProfile)
module.exports = router