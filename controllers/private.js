const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const formidable = require('formidable')
const Camp = require('../db/camp');

const routeHandlers = {
    loadPrivateChat : async(req,res)=>{
        const myName = sessionStorage.getItem("myName")
        const fName = sessionStorage.getItem("fName")
        console.log('Linker: ' + myName)
        res.render('private', {test: 'yo'})
    },

    linkPrivateChat: async(req,res)=>{
        const x = JSON.stringify(req.body)
        const y = JSON.parse(x)
        const friendName = y.fUsername
        sessionStorage.setItem("fName", friendName)
        sessionStorage.setItem("myName", req.user.username)
        res.send('The Usernames are Set')        
    }
}

router.get('/private', auth('users'), routeHandlers.loadPrivateChat)
router.post('/private', auth('users'), routeHandlers.linkPrivateChat)    

module.exports = router

