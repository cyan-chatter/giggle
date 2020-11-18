// C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data
//D:\sayan\mongodb\bin\mongod.exe --dbpath=D:\sayan\mongodata
const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const formidable = require('formidable')
const Camp = require('../db/camp');
const { Greengrass } = require('aws-sdk');

const routeHandlers = {
  loadFindFriendsPage : async (req,res)=>{
        
    const foundUsersByUsername = await User.find({username})
    const foundUsers = await User.find({fullname})
    
    const rowNumHere = 2
        var found = []
        for(var t=0; t<foundUsers.length; t += rowNumHere){
            const g = foundUsers.slice(t, t + rowNumHere)
            found.push(g)
        } 
        
        const filterUsers = await User.aggregate([{
            $group: {
                _id: "$fullname"
            }    
        }])
        
        const filterUsersLexico = _.sortBy(filterUsers, '_id')
        // use own DFS on Trie (Radix Tree) Algo
        
        console.log(filterUsersLexico)

    

    try{
        
        return res.render('findFriends',{
            users: foundUsers
        })
    }        
    catch(e){
        console.log("Error in Loading Camps: "+ e)
    }
  }
}

router.get('/home',auth('users'), routeHandlers.loadFindFriendsPage)


module.exports = router