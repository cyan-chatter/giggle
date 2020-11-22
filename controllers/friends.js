const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const formidable = require('formidable')
const Camp = require('../db/camp');

const searchInsertAtIndex = (element,key)=>{
            
    var start = 0
    var end = element.length-1;
    var mid;
    while(start<=end)
    {
        mid = start + (end-start)/2;
        if(element[mid]===key)
            return mid;
        else if(element[mid]<key)
            start = mid+1;
        else
            end = mid-1;
    }
    return start;
}
    

routeHandlers = {
    sendFriendRequest: async (req,res)=>{

        const senderData = await User.findOne({username: req.user.username})
         try{
            const receivername = JSON.stringify(req.body)
            const receiverName = JSON.parse(receivername)
            const receiver = receiverName.receiverUserName
            
            const receiverData = await User.findOne({username: receiver})
            try{
                if(!receiverData){
                    const restr = {str: 'This User Does Not Exist :(', act: 'e'}
                    return res.send('This User Does Not Exist :(')
                }

                for(var i=0; i<senderData.sentRequests.length; ++i){
                    if(Object.values(senderData.sentRequests[i]) === receiver){
                        return res.send('Friend Request Already Sent. The Friend Request Sent Earlier Has Not Been Accepted Yet :(')
                    }
                }
                for(var i=0; i<req.user.friends.length; ++i){
                    if(Object.values(req.user.friends[i]) === receiver){
                        return res.send('This Person is Your Friend Already')
                    }   
                }
                senderData.sentRequests.push({"username": receiver})
                await senderData.save()
                try{
                    receiverData.receivedRequests.push({"userId": senderData._id, "username": senderData.username, "timing": new Date()})
                    receiverData.totalRequests += 1;
                    await receiverData.save()
                    try{
                        console.log(receiverData)
                        return res.send('Friend Request Sent')
                    }catch(e){
                        return res.send('Error in Sending Friend Request: ' + e)
                    }
                }catch(e){
                    return res.send('Error: '+ e +'Sorry, There is some error with your account. Try to Login Again. :O')
                }
                
            }catch(e){
                return res.send('This User Does Not Exist :(')
            }
  
         }catch(e){
             console.log('Error in Sending Friend Request: ' + e)
             return res.send('Error in Sending Friend Request')
         }    
            
    },
    cancelFriendRequest: async (req,res)=>{
        const senderData = await User.findOne({username: req.user.username})
         try{
            const receivername = JSON.stringify(req.body)
            const receiverName = JSON.parse(receivername)
            const receiver = receiverName.receiverUserName
            
            const receiverData = await User.findOne({username: receiver})
            try{
                if(!receiverData){
                    return res.send('This User Does Not Exist :(')
                }
    
                const checkParams = (params)=>{
                    console.log('Params: Sent Requests FR: ' + params)
                    return params.username === receiver
                }
                
                const i = senderData.sentRequests.findIndex(checkParams)
                if(i !== -1)
                senderData.sentRequests.splice(i, 1)

                await senderData.save()
                try{
                    const checkParams2 = (params)=>{
                        console.log('Params: Received Requests FR: ' + params)
                        return params.username === senderData.username                
                    }   
                    const j = receiverData.receivedRequests.findIndex(checkParams2)
                     receiverData.receivedRequests.splice(j, 1)
                     receiverData.totalRequests -= 1;
                    await receiverData.save()
                    try{
                        return res.send('Friend Request Revoked')
                    }catch(e){
                        return res.send('Error in saving receiver data: '+ e)
                    }
                }catch(e){
                    return res.send('Error in saving sender data: '+ e)
                }
                 
            }catch(e){
                return res.send('This User Does Not Exist :(')
            }
            
         }catch(e){
             console.log('Error in Friend Request Mechanism: ' + e)
         }    
    },
    loadFriendRequest: async(req,res)=>{
        
        var fr = []
        if(req.user.totalRequests === 0){
            return res.render('friendRequests', {
                requesters: fr,
                totalRequests: req.user.totalRequests,
                message: '' 
            })
        }
        
        for(var i=0; i<req.user.totalRequests; ++i){
            if(!req.user.receivedRequests[i]){
                return res.render('friendRequests', {
                    requesters: fr,
                    totalRequests: req.user.totalRequests,
                    message: 'No New Friend Requests'
                })
            }
            var d = req.user.receivedRequests[i].timing.getTime()
            const index = searchInsertAtIndex(fr, d)
            fr.splice(index,0,req.user.receivedRequests[i])
            ++i;
        }
        fr.reverse()
        console.log(fr)

        return res.render('friendRequests', {
            requesters: fr,
            totalRequests: req.user.totalRequests,
            message: ''
        })
    },
    acceptFriendRequest: async (req,res)=>{
        const sendername = JSON.stringify(req.body)
        const senderName = JSON.parse(sendername)
        const username = senderName.senderUserName
        console.log('Accept: '+username)
        const sender = await User.findOne({username})
        try{
            if(!sender){
                return res.send('This Sender Does Not Exist :(')
            }    
            req.user.friends.push({userId: sender._id , username: sender.username})
            sender.friends.push({userId: req.user._id, username: req.user.username})
            
            var i,i2;
            var flag = 0, flag2 =0;
            for(i=0; i<req.user.receivedRequests.length; ++i){
                if(req.user.receivedRequests[i].username === username){
                    flag = 1;
                    break;
                }    
            }
            if(flag === 1){
                req.user.receivedRequests.splice(i,1)
            }
    
            for(i2=0; i2<sender.sentRequests.length; ++i2){
                if(sender.sentRequests[i].username === req.user.username){
                    flag2 = 1;
                    break;
                }    
            }
            if(flag2 === 1){
                sender.sentRequests.splice(i,1)
            }
    
            await req.user.save()
            try{
                await sender.save()
                try{
                    res.send('Friend Request Accepted. ' + sender.username + ' is a Friend now.')
                }catch(e){
                  return res.send('Error. Friend Request Not Accepted. Sender data cannot be saved' + e)       
                }
            }catch(e){
                return res.send('Error. Friend Request Not Accepted.' + e)
            }
            
        }catch(e){
            return res.send('The Sender has Deleted His Account :(')
        }
            
    },
    rejectFriendRequest: async (req,res)=>{
        const sendername = JSON.stringify(req.body)
        const senderName = JSON.parse(sendername)
        const username = senderName.senderUserName
        console.log('Reject: '+username)
        const sender = await User.findOne({username})
        try{
            if(!sender){
                return res.send('The Sender Does Not Exist, might have Deleted His Account :(')
            }
            var i,i2;
            var flag = 0, flag2 =0;
            for(i=0; i<req.user.receivedRequests.length; ++i){
                if(req.user.receivedRequests[i].username === username){
                    flag = 1;
                    break;
                }    
            }
            if(flag === 1){
                req.user.receivedRequests.splice(i,1)
            }
    
            for(i2=0; i2<sender.sentRequests.length; ++i2){
                if(sender.sentRequests[i].username === req.user.username){
                    flag2 = 1;
                    break;
                }    
            }
            if(flag2 === 1){
                sender.sentRequests.splice(i,1)
            }
    
            await req.user.save()
            try{
                await sender.save()
                try{
                    return res.send('Friend Request Rejected.')        
                }catch(e){
                    res.send('Error in saving sender data: ' + e)
                }
            }catch(e){
                return res.send('Error: '+ e +'Sorry, There is some error with your account. Try to Login Again. :O')
            }
        }catch(e){
            return res.send('The Sender has Deleted His Account :(')
        }
    }
}

router.post('/sendFriendRequest', auth('users'), routeHandlers.sendFriendRequest)
router.post('/revokeFriendRequest', auth('users'), routeHandlers.cancelFriendRequest)
router.get('/loadFriendRequests', auth('users'), routeHandlers.loadFriendRequest)
router.post('/acceptFriendRequest', auth('users'), routeHandlers.acceptFriendRequest)
router.post('/rejectFriendRequest', auth('users'), routeHandlers.rejectFriendRequest)

module.exports = router