const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage')
const auth = require('../middleware/autho')
const Direct = require('../db/direct')
const chalk = require('chalk') 

var CryptoJS = require("crypto-js")

const routeHandlers = {
    generateDirectChat: async(req,res)=>{
        
        const myName = sessionStorage.getItem("myName")
        const fName = sessionStorage.getItem("fName")

        const action = '/direct/' + myName.replace(/ /g, "-") + '.' + fName.replace(/ /g, "-")  
        
        try{
        const fUser = await User.findOne({username:fName}) 
            const fFullname = fUser.fullname 
            const fAbout = fUser.about    
            var friendsList = []
            for(var i = 0; i< req.user.friends.length; ++i){
                if(fName !== req.user.friends[i].username){
                    var fino = req.user.friends[i].username
                    friendsList.push(fino)
                }   
            }

            var pchat1 = await Direct.find({senderName: myName, receiverName: fName })
            var pchat2 = await Direct.find({senderName: fName, receiverName: myName })
            var dchat = pchat1.concat(pchat2)
            
            var pchat = dchat.slice().sort((x, y)=>{
                return x.createdAt - y.createdAt;
            })
            
            const passedDetails = {
                    myName, 
                    fName, 
                    fAbout,
                    fFullname,
                    usernameH: req.user.username,
                    friendsList,
                    username: req.user.username,
            }            
            sessionStorage.setItem("passedDetails",JSON.stringify(passedDetails))

            const dataObj = {
                ...passedDetails,
                pchat,
                action
            }

            return res.send(JSON.stringify(dataObj))
        
    }catch(e){
        res.redirect('/friends')
    } 
    },

    linkDirectChat: async(req,res)=>{
        const x = JSON.stringify(req.body)
        const y = JSON.parse(x)
        const friendName = y.fUsername

        try{
            let q = await User.find({"friends.username" : friendName})
            console.log(chalk.redBright('friend search : ' + q))
            if(!q.length){
                res.send("NO")        
                return 
            }
            sessionStorage.setItem("fName", friendName)
            sessionStorage.setItem("myName", req.user.username)
            res.send('The Usernames are Set')        
        }catch(e){
            res.send('Database Error: '+ e)        
        }
    },

    loadDirectChat: async(req,res)=>{
        
        const passedDetails = JSON.parse(sessionStorage.getItem("passedDetails"))
        return res.render('private',passedDetails) 

    },
    saveDirectChatData: async(req,res)=>{
        
        try{
                const senderData = await User.findOne({username: req.user.username})
                const recUser = (req.params.room.split('.'))[1]
                const receiverData = await User.findOne({username: recUser})
            
                const newDirect = new Direct()
                newDirect.createdAt = new Date()
                newDirect.senderName = senderData.username
                newDirect.receiverName = receiverData.username
                newDirect.senderId = senderData._id
                newDirect.receiverId = receiverData._id


                newDirect.message = req.body.text
                
                await newDirect.save()

                for(let i=0; i<senderData.friends.length; ++i){
                    if(senderData.friends[i].username === receiverData.username){
                        senderData.friends[i].recentDirect = newDirect
                        break;
                    }
                }

                for(let i=0; i<receiverData.friends.length; ++i){
                    if(receiverData.friends[i].username === senderData.username){
                        receiverData.friends[i].recentDirect = newDirect
                        break;
                    }
                }
                
                await senderData.save(); 
                await receiverData.save();
        }catch(e){
                res.redirect('/friends')             
        }
    }
}

router.get('/private', auth('users'), routeHandlers.generateDirectChat)
router.post('/private', auth('users'), routeHandlers.linkDirectChat)    
router.get('/direct/:room', auth('users'), routeHandlers.loadDirectChat)
router.post('/direct/:room', auth('users'), routeHandlers.saveDirectChatData)

module.exports = router

