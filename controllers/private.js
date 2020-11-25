const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const formidable = require('formidable')
const Camp = require('../db/camp');

const routeHandlers = {
    generatePrivateChatURI : async(req,res)=>{
        const myName1 = sessionStorage.getItem("myName").replace(/ /g, "-")
        const fName1 = sessionStorage.getItem("fName").replace(/ /g, "-")
        
        const action = '/direct/' + myName1 + '.' + fName1  
        
        return res.redirect(action)        
        
    },

    linkPrivateChat: async(req,res)=>{
        const x = JSON.stringify(req.body)
        const y = JSON.parse(x)
        const friendName = y.fUsername
        sessionStorage.setItem("fName", friendName)
        sessionStorage.setItem("myName", req.user.username)
        res.send('The Usernames are Set')        
    },

    loadPrivateChat: async(req,res)=>{
        const myName = sessionStorage.getItem("myName")
        const fName = sessionStorage.getItem("fName")
        const roomNamesCombined = req.params.room
        console.log('server: '+ roomNamesCombined)
        const fUser = await User.findOne({username:fName})  
        const fFullname = fUser.fullname 
        const fAbout = fUser.about    
        return res.render('private',{
            myName, 
            fName, 
            fAbout,
            fFullname,
            usernameH: req.user.username,
            roomNamesCombined
        })
    }
}

router.get('/private', auth('users'), routeHandlers.generatePrivateChatURI)
router.post('/private', auth('users'), routeHandlers.linkPrivateChat)    
router.get('/direct/:room', auth('users'), routeHandlers.loadPrivateChat)
module.exports = router

