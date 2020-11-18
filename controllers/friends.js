// post req on /friendRequests from Add Friend Button

const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const formidable = require('formidable')
const Camp = require('../db/camp');

routeHandlers = {
    sendFriendRequest: async (req,res)=>{
        const senderData = await User.findOne({username: req.user.username})
         try{
            const receiver = req.body.friendRequestRecieverUsername
            senderData.sentRequests.push({"username": receiver})
 			await senderData.save()
 			const receiverData = await User.findOne({username: receiver})
 			receiverData.receivedRequests.push({"userId": senderData._id, "username": senderData.username})
 			receiverData.totalRequests += 1;
             await receiverData.save()
             res.redirect('/loadAddFriendRequest')

         }catch(e){
             console.log('Error in Friend Request Mechanism: ' + e)
         }    
            
    },
    cancelFriendRequest: async (req,res)=>{
        const senderData = await User.findOne({username: req.user.username})
         try{
            
            const receiver = req.body.friendRequestRecieverUsername
            const checkParams = (params)=>{
                const paramsVal = Object.values(params)
                console.log(paramsVal[0])
                return paramsVal[0] === receiver
            }
            const i = senderData.sentRequests.findIndex(checkParams)
            if(i !== -1)
            senderData.sentRequests.splice(i, 1)
            await senderData.save()
             
            const receiverData = await User.findOne({username: receiver})
            const checkParams2 = (params)=>{
                const paramsVal = Object.values(params)
                console.log(paramsVal[1])
                return paramsVal[1] === senderData.username                
            }
            const j = receiverData.receivedRequests.findIndex(checkParams2)
 			receiverData.receivedRequests.splice(j, 1)
 			receiverData.totalRequests -= 1;
             await receiverData.save()
             res.redirect('/loadCancelFriendRequest')

         }catch(e){
             console.log('Error in Friend Request Mechanism: ' + e)
         }    
    },

    loadAddFriendRequest: async (req,res)=>{
        return true
    },
    
    loadCancelFriendRequest: async (req,res)=>{
        return true
    }
}


router.post('/addFriendRequest', auth('users'), routeHandlers.sendFriendRequest)
router.post('/cancelFriendRequest', auth('users'), routeHandlers.cancelFriendRequest)
router.get('/loadAddFriendRequest', auth('users'), routeHandlers.loadAddFriendRequest)
router.get('/loadCancelFriendRequest', auth('users'), routeHandlers.loadCancelFriendRequest)

module.exports = router