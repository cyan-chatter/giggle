// C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data

const User = require('../db/user')
const Camp = require('../db/camp')

const express = require('express')
const router = new express.Router()

var sessionStorage = require('sessionstorage');

const jwt = require('jsonwebtoken')
const auth = require('../middleware/autho')
const isloggedin = require('../middleware/isloggedin')

const formidable = require('formidable')
const _ = require('lodash')
const notifyType = ['info', 'success', 'error']

const routeHandlers = {
    loadCampPage : async (req,res)=>{
        
        res.render('camp/discuss', {
            title: 'Camp Discussion',
            campname: req.params.name,
            username: req.user.username,
            fullname: req.user.fullname
        })
    }
    
}

///////////////

router.get('/camps/:name', auth('users'), routeHandlers.loadCampPage)
//router.post('/camps/:name',auth('users'), routeHandlers.postCampPage)

module.exports = router