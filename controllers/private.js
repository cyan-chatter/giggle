const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const formidable = require('formidable')
const Camp = require('../db/camp')
const Direct = require('../db/direct')
var CryptoJS = require("crypto-js");
 

const routeHandlers = {
    generateDirectChatURI : async(req,res)=>{
        const myName1 = sessionStorage.getItem("myName").replace(/ /g, "-")
        const fName1 = sessionStorage.getItem("fName").replace(/ /g, "-")
        const action = '/direct/' + myName1 + '.' + fName1  
        return res.redirect(action)        
    },

    linkDirectChat: async(req,res)=>{
        const x = JSON.stringify(req.body)
        const y = JSON.parse(x)
        const friendName = y.fUsername
        sessionStorage.setItem("fName", friendName)
        sessionStorage.setItem("myName", req.user.username)
        res.send('The Usernames are Set')        
    
    },

    loadDirectChat: async(req,res)=>{
        const myName = sessionStorage.getItem("myName")
        const fName = sessionStorage.getItem("fName")
        
        const fUser = await User.findOne({username:fName}) 
        try{
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
            
            
            console.log('private chat messages :::: ')
            for(var i = 0; i<pchat.length; ++i ){
                
                console.log('Before Decrypt:' + pchat[i].message); // my message
                // Decrypt
                var bytes  = CryptoJS.AES.decrypt(pchat[i].message, 'secret key 123');
                pchat[i].message = bytes.toString(CryptoJS.enc.Utf8);
    
                console.log('After Decrypt:' + pchat[i].message); // my message
            }
            
            return res.render('private',{
                myName, 
                fName, 
                fAbout,
                fFullname,
                usernameH: req.user.username,
                friendsList,
                username: req.user.username,
                pchat
            })
        }catch(e){
            console.log('message loader routte: '+e)
            res.redirect('/friends')
        } 
        
    },
    saveDirectChatData: async(req,res)=>{
        
        const senderData = await User.findOne({username: req.user.username})
            try{
                const recUser = (req.params.room.split('.'))[1]
                console.log(recUser)
                const receiverData = await User.findOne({username: recUser})
             try{

                // Encrypt
                var ciphertext = CryptoJS.AES.encrypt(req.body.text, 'secret key 123').toString();
                
                //add encryption
                const newDirect = new Direct();

                newDirect.createdAt = new Date();
                newDirect.senderName = senderData.username
                newDirect.receiverName = receiverData.username
                newDirect.senderId = senderData._id
                newDirect.receiverId = receiverData._id
                newDirect.message = ciphertext;
                
                await newDirect.save();
                try{
                    console.log('message data saved to the database: ' + newDirect)
                }catch(e){
                    res.redirect('/friends')
                }
                
             }catch(e){
                res.redirect('/friends')
             }

            }catch(e){
                res.redirect('/friends')                
            }
    }
}

router.get('/private', auth('users'), routeHandlers.generateDirectChatURI)
router.post('/private', auth('users'), routeHandlers.linkDirectChat)    
router.get('/direct/:room', auth('users'), routeHandlers.loadDirectChat)
router.post('/direct/:room', auth('users'), routeHandlers.saveDirectChatData)

module.exports = router

