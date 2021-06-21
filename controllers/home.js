//aws image url to be added in home.hbs 
const _ = require('lodash')
const express = require('express')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const Direct = require('../db/direct')
const User = require('../db/user')
const isloggedin = require('../middleware/isloggedin')

const routeHandlers = {
  loadHomePage : async (req,res)=>{
    try{
        const userId = await User.findOne({username: req.user.username})
        if(userId === null || userId === undefined){
          return res.render('error404', {
            status: 404,
            message: 'Please Login Again'
          })
        }
        console.log("Recent Chats")
        const curUser = await User.findOne({username : req.user.username})
        const recentDirects = []
        for(let i=0; i<curUser.friends.length; ++i){
            console.log("recent direct id: ", curUser.friends[i].recentDirect)
            const rd = await Direct.findOne({_id: curUser.friends[i].recentDirect}) 
            console.log('rd: ',rd)
            if(rd===null) continue;
            //if(rd.dtype !== 'text'){}
            const rc = {
              textMessage : rd.message,
              dtype : rd.dtype,
              isRead : rd.isRead,
              createdAt : rd.createdAt,
              friendUsername : curUser.friends[i].username,
              friendName : curUser.friends[i].fullname,
              showDate : rd.createdAt.toDateString(),
              showTime : rd.createdAt.toLocaleTimeString()
            }
            const rn = new Date()
            if(rd.createdAt.getDate() === rn.getDate() && rd.createdAt.getMonth() === rn.getMonth() && rd.createdAt.getFullYear() === rn.getFullYear()){
              rc.showDate = 'Today'
            } 
            recentDirects.push(rc)
        }

        recentDirects.sort((d1,d2)=>{
          return d2.createdAt - d1.createdAt;
        })

        for(let i=0; i<recentDirects.length; ++i){
          console.log(recentDirects[i].createdAt);
        }

        return res.render('home',{
            base: 'users',
            username: req.user.username,
            fullname: req.user.fullname,
            message : sessionStorage.getItem("m"),
            messageType : sessionStorage.getItem("mT"),
            usernameH: req.user.username,
            recentDirects
        })
    }        
    catch(e){
        console.log("Error in Loading Home Page "+ e)
    }
  }
}

router.get('/home', auth('users'), routeHandlers.loadHomePage)


module.exports = router