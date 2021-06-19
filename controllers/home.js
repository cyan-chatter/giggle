//aws image url to be added in home.hbs 
const _ = require('lodash')
const express = require('express')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const isloggedin = require('../middleware/isloggedin')

const routeHandlers = {
  loadHomePage : async (req,res)=>{
    try{
        return res.render('home',{
            base: 'users',
            username: req.user.username,
            fullname: req.user.fullname,
            message : sessionStorage.getItem("m"),
            messageType : sessionStorage.getItem("mT"),
            usernameH: req.user.username
        })
    }        
    catch(e){
        console.log("Error in Loading Home Page "+ e)
    }
  }
}

router.get('/home', auth('users'), routeHandlers.loadHomePage)


module.exports = router