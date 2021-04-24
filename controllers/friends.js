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

        try{
            const senderData = await User.findOne({username: req.user.username})

            const receivername = JSON.stringify(req.body)
            const receiverName = JSON.parse(receivername)
            const receiver = receiverName.receiverUserName
            
            if(receiver === req.user.username){
                const restr = {str: 'So... You Want to be a friend of yourself? Good luck with that' , act: 'e'}
                return res.send(restr)
            }

                const receiverData = await User.findOne({username: receiver})
                
                if(!receiverData){
                    const restr = {str: 'This User Does Not Exist :(', act: 'e'}
                    return res.send(restr)
                }

                for(var i=0; i<senderData.sentRequests.length; ++i){
                    if(Object.values(senderData.sentRequests[i]) === receiver){
                        const restr = { str: 'Friend Request Already Sent. The Friend Request Sent Earlier Has Not Been Accepted Yet :(', act: 'e'}
                        return res.send(restr)
                    }
                }
                for(var i=0; i<req.user.friends.length; ++i){
                    if(Object.values(req.user.friends[i]) === receiver){
                        const restr = { str: 'This Person is Your Friend Already', act: 'e'}
                        return res.send(restr)
                    }   
                }
                senderData.sentRequests.push({"username": receiver})
                    
                    await senderData.save()
                
                    receiverData.receivedRequests.push({"userId": senderData._id, "username": senderData.username, "timing": new Date()})
                    receiverData.totalRequests += 1;
                    
                        await receiverData.save()
            
                        console.log(receiverData)
                        const restr = { str: 'Friend Request Sent', act: 's'}
                        return res.send(restr)
                 
        }
        catch(e){
             console.log('Error in Sending Friend Request: ' + e)
             const restr = { str: 'Error in Sending Friend Request: ' + e, act: 'e'}            
             return res.send(restr)
        }    
            
    },
    cancelFriendRequest: async (req,res)=>{
        try{
            const senderData = await User.findOne({username: req.user.username})
            const receivername = JSON.stringify(req.body)
            const receiverName = JSON.parse(receivername)
            const receiver = receiverName.receiverUserName
            const receiverData = await User.findOne({username: receiver})
            const checkParams3 = (params)=>{
                params.username.normalize() === receiver.normalize() 
            }
            const alreadyF = req.user.friends.findIndex(checkParams3)
            if(alreadyF >= 0 && alreadyF < req.user.friends.length){
                const restr = { str: 'Can\'t Revoke Request Now as the User has already Accepted the Request', act:'e' }        
                return res.send(restr)
            }
            if(!receiverData){
                const restr = { str: 'This User Does Not Exist :(', act:'e' }        
                return res.send(restr)
            }
    
                    const checkParams = (params)=>{
                        return params.username === receiver
                    }
                    const i = senderData.sentRequests.findIndex(checkParams)
                    if(i !== -1)
                    senderData.sentRequests.splice(i, 1)
                    await senderData.save()

                    const checkParams2 = (params)=>{
                        return params.username === senderData.username                
                    }   
                    const j = receiverData.receivedRequests.findIndex(checkParams2)
                    receiverData.receivedRequests.splice(j, 1)
                    receiverData.totalRequests -= 1;
                    await receiverData.save()
                    const restr = { str: 'Friend Request Revoked', act: 's'}    
                    return res.send(restr)
            
        }catch(e){
            const restr = { str: 'Error in Friend Request Mechanism: ' + e, act: 'e'}
             return res.send(restr)
         }    
    },
    loadFriendRequest: async(req,res)=>{
        
        var fr = []
        if(req.user.receivedRequests.length === 0){
            return res.render('friendRequests', {
                requesters: fr,
                totalRequests: req.user.totalRequests,
                message: 'You Don\'t have any Friend Requests',
                usernameH: req.user.username
            })
        }
        
        for(var i=0; i<req.user.receivedRequests.length; ++i){
            if(!req.user.receivedRequests[i]){
                return res.render('friendRequests', {
                    requesters: fr,
                    totalRequests: req.user.totalRequests,
                    message: 'No New Friend Requests',
                    usernameH: req.user.username
                })
            }
            var d = req.user.receivedRequests[i].timing.getTime()
            const index = searchInsertAtIndex(fr, d)
            fr.splice(index,0,req.user.receivedRequests[i])
            ++i;
        }
        fr.reverse()
        
        return res.render('friendRequests', {
            requesters: fr,
            totalRequests: req.user.totalRequests,
            message: '',
            usernameH: req.user.username
        })
    },
    acceptFriendRequest: async (req,res)=>{
        const sendername = JSON.stringify(req.body)
        const senderName = JSON.parse(sendername)
        const username = senderName.senderUserName
        try{
        const sender = await User.findOne({username})
            if(!sender){
                const restr = { str: 'This Sender Does Not Exist :(', act: 'e'}
                return res.send(restr)
            }   

            req.user.friends.push({userId: sender._id , username: sender.username, fullname: sender.fullname})
            sender.friends.push({userId: req.user._id, username: req.user.username, fullname: req.user.fullname})
            
            const checkParams = (params)=>{
                return params.username === sender.username
            }
            
            const i1 = req.user.receivedRequests.findIndex(checkParams)

            if(i1 !== -1){
                req.user.receivedRequests.splice(i1,1)
            }
            req.user.totalRequests -= 1
            
            const checkParams2 = (params)=>{
                return params.username === req.user.username
            }
            
            const i2 = sender.sentRequests.findIndex(checkParams2)

            if(i2 !== -1){
                sender.sentRequests.splice(i2,1)
            }
    
            await req.user.save()
            await sender.save()
                
            const restr = { str: ('Friend Request Accepted. ' + sender.username + ' is a Friend now.'), act: 's'}
            res.send(restr)
                
        }catch(e){
            const restr = { str: 'Friend Request Not Accepted. Error: + ' + e, act: 'e'}
            console.log(e)            
            return res.send(restr)
        }
            
    },
    rejectFriendRequest: async (req,res)=>{
        const sendername = JSON.stringify(req.body)
        const senderName = JSON.parse(sendername)
        const username = senderName.senderUserName
        console.log('Reject: '+username)
        try{
        const sender = await User.findOne({username})
            if(!sender){
                const restr = { str: 'The Sender Does Not Exist, might have Deleted His Account :(', act: 'e'}            
                return res.send(restr)
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
            req.user.totalRequests -= 1
            
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
            
            await sender.save()
                
            const restr = { str: 'Friend Request Rejected.', act: 's'}
                        
            return res.send(restr)        
                
        }catch(e){
            const restr = { str: 'The Request could not be Rejected :( + Error: ' + e, act: 'e'}
            return res.send(restr)
        }
    },
    loadFriendsList : async(req,res)=>{
        try{
            if(req.user.friends.length === 0){
                return res.render('friends',{
                    message: 'So Empty Here. Try To Find a Person and Send a Friend Request',
                    usernameH: req.user.username
                })
            }
            var punyJudge, sugg;
            const len = req.user.friends.length;
            if(len <= 3 && len > 0){
                punyJudge = 'a few'
                sugg = ' Try making some more.'
            }
            else if(len <= 20 && len > 3){
                punyJudge = 'some'
                sugg = ' Good Going'
            }
            else{
                punyJudge = 'a lot of'
                sugg = ' Wow!'
            }

            return res.render('friends', {
                message : ('You have ' + punyJudge + ' friends here' + sugg),
                friends : req.user.friends,
                usernameH: req.user.username,
                myUsername: req.user.username
            })

        }catch(e){
            return res.render('friends',{
                message: 'Cannot Display Friends. Something Wrong Happenned. Error: ' + e,
                usernameH: req.user.username
            })
        }
    },
    removeFriend : async (req,res)=>{
        const rf = JSON.stringify(req.body)
        const cancelFriendUsername = JSON.parse(rf).friendUsername
        try{
            const notAFriend = await User.findOne({username : cancelFriendUsername})
            const notFriendUsername = notAFriend.username
            console.log('NotAFriend: ' + notAFriend.friends)
            console.log('User: ' + req.user.friends) 
            var i = 0, flag = 0;
            for(i=0; i<req.user.friends.length; ++i){
                if(notFriendUsername.normalize() === req.user.friends[i].username.normalize()){
                    req.user.friends.splice(i,1)
                    flag = 1;
                    break;
                }
            }
            console.log('i: ' + i)
            var j = 0, f = 0;
            for(j=0; j<notAFriend.friends.length; ++j){
                if(req.user.username.normalize() === notAFriend.friends[i].username.normalize()){
                    notAFriend.friends.splice(j,1)
                    f = 1;
                    break;
                }
            }
            console.log('j: ' + j)    
            if(f === 0 || flag === 0){
                const restr = {str: 'Friendship has already been Terminated!', act: 'n'}
                return res.send(restr)
            }

            
            console.log('User Friends: ' + req.user.friends)
            console.log('notAFriend Friends: ' + notAFriend.friends)

            await notAFriend.save()
            await req.user.save()

            
            const restr = {str: 'Friendship has been removed', act: 'n'}
            if(req.user.friends.length === 0){
                restr.act = 'y'
            }
            return res.send(restr)
           
        }catch(e){
            const restr = {str: 'Friendship cannot be Removed. Please Login and Try Again', act: 'n'}
            return res.send(restr)
        }
        
    }    

}

router.post('/sendFriendRequest', auth('users'), routeHandlers.sendFriendRequest)
router.post('/revokeFriendRequest', auth('users'), routeHandlers.cancelFriendRequest)
router.get('/loadFriendRequests', auth('users'), routeHandlers.loadFriendRequest)
router.post('/acceptFriendRequest', auth('users'), routeHandlers.acceptFriendRequest)
router.post('/rejectFriendRequest', auth('users'), routeHandlers.rejectFriendRequest)
router.get('/friends', auth('users'), routeHandlers.loadFriendsList)
router.post('/friends/remove', auth('users'), routeHandlers.removeFriend)
module.exports = router


    