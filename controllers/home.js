// C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data
//aws image url to be added in home.hbs 
const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const isloggedin = require('../middleware/isloggedin')
const formidable = require('formidable')
const notifyType = ['info', 'success', 'error']
const Camp = require('../db/camp')

const routeHandlers = {
  loadHomePage : async (req,res)=>{
        
    const foundCamps = await Camp.find({})
    try{
        const rowNum = 2
        var campTents = []
        for(var t=0; t<foundCamps.length; t += rowNum){
            const tent = foundCamps.slice(t, t + rowNum)
            campTents.push(tent)
        } 
        
        const filterSubjects = await Camp.aggregate([{
            $group: {
                _id: "$subject"
            }    
        }])
        
        const filterSubjectsLexico = _.sortBy(filterSubjects, '_id')
        // use own DFS on Trie (Radix Tree) Algo 

        return res.render('home',{
            camps: campTents,
            base: 'users',
            username: req.user.username,
            fullname: req.user.fullname,
            subjects: filterSubjectsLexico,
            message : sessionStorage.getItem("m"),
            messageType : sessionStorage.getItem("mT")
        })
    }        
    catch(e){
        console.log("Error in Loading Camps: "+ e)
    }
  }
}

router.get('/home',auth('users'), routeHandlers.loadHomePage)


module.exports = router