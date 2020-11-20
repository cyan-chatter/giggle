const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const formidable = require('formidable')
const Camp = require('../db/camp');

const searchInsertAtIndex = (nums,target)=>{
            
    var low = 0
    var high = nums.length-1;
    var mid;
    while(low<=high)
    {
        mid = low + (high-low)/2;
        if(nums[mid]===target)
            return mid;
        else if(nums[mid]<target)
            low = mid+1;
        else
            high = mid-1;
    }
    return low;
}
    

routeHandlers = {
    sendFriendRequest: async (req,res)=>{

        const senderData = await User.findOne({username: req.user.username})
         try{
            const receivername = JSON.stringify(req.body)
            const receiverName = JSON.parse(receivername)
            const receiver = receiverName.receiverUserName
            
            senderData.sentRequests.push({"username": receiver})
            await senderData.save()

 			const receiverData = await User.findOne({username: receiver})
             
            receiverData.receivedRequests.push({"userId": senderData._id, "username": senderData.username})
            receiverData.totalRequests += 1;
            await receiverData.save()
            console.log(receiverData)
            return res.send('Friend Request Sent')
               

         }catch(e){
             console.log('Error in Friend Request Mechanism: ' + e)
         }    
            
    },
    cancelFriendRequest: async (req,res)=>{
        const senderData = await User.findOne({username: req.user.username})
         try{
            
            const receivername = JSON.stringify(req.body)
            const receiverName = JSON.parse(receivername)
            const receiver = receiverName.receiverUserName
            
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
            
            return res.send('Friend Request Revoked')

         }catch(e){
             console.log('Error in Friend Request Mechanism: ' + e)
         }    
    },
    loadFriendRequest: async(req,res)=>{
        var fr = []
        var smol = 0
        if(totalRequests === 0){
            return res.render('friendRequests', {
                requesters: fr,
                totalRequests,
                activator: 'no'
            })
        }
        
        for(var i=0; i<req.user.totalRequests; ++i){
            var d = req.user.receivedRequests[i].timing.getTime()
            console.log(d)
            const index = searchInsertAtIndex(f, d)
            fr.splice(index,0,req.user.receivedRequests[i])
            ++i;
        }
        fr.reverse()

        return res.render('friendRequests', {
            requesters: fr,
            totalRequests,
            activator: 'yes'
        })
    }

}


router.post('/sendFriendRequest', auth('users'), routeHandlers.sendFriendRequest)
router.post('/revokeFriendRequest', auth('users'), routeHandlers.cancelFriendRequest)
router.post('/loadFriendRequest', auth('users'), routeHandlers.loadFriendRequest)

module.exports = router