const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const isloggedin = require('../middleware/isloggedin')
const notifyType = ['info', 'success', 'error']
const formidable = require('formidable')
const Camp = require('../db/camp')
const awsSave = require('../utils/saveaws')


const routeHandlers = {
    adminPage: async (req, res)=>{
        res.render('dashboard');
    },

    adminPostPage: async (req, res)=>{
        const newCamp = new Camp()
        newCamp.name = req.body.name
        newCamp.about = req.body.about
        newCamp.image = req.body.image
        newCamp.subject = req.body.subject
        newCamp.tags.push('giggle')

        var tagString = req.body.hashtags
        for(var i=0; i<tagString.length; ++i){
            var tag =''
            if(tagString.charAt(i) === '#' && tagString.charAt(i+1) !== ' '){
                for(var j=i+1; tagString.charAt(j) !== '#' && j < tagString.length; ++j){
                    if( tagString.charAt(j) === ' ' && ( tagString.charAt(j+1) === '#' || (j+1 >= tagString.length) ) ){
                        continue
                    }
                    tag = tag.concat(tagString.charAt(j))
                }
                newCamp.tags.push(tag)
            }
        }
        
        await newCamp.save()
        try{
            res.render('dashboard');
        }
        catch{
            console.log('Error in Creating and Saving Camp in DB')
        }
    },

    uploadFile: async function(req, res){
        console.log('reached here')
        const form = new formidable.IncomingForm();

        form.on('file', (field, file) => {
            
        })
        form.on('error', (e) => {
            console.log('Error: ' + e)
        });
        form.on('end', () => {
            console.log('Success: File Uploaded')
        });
        
        form.parse(req);
    }

}


router.get('/admins/dashboard', routeHandlers.adminPage);    
router.post('/uploadFile', awsSave.any(), routeHandlers.uploadFile);
router.post('/admins/dashboard', routeHandlers.adminPostPage);

module.exports = router