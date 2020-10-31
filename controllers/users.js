const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const router = new express.Router()

const routeHandlers = {
        loadIndexPage : async (req,res)=>{
        return res.render('index', {test: 'Testing the Server'})
        },
    
        loadSignUp : async (req,res)=>{
        return res.render('signup',{
            test : 'Testing Register User Page',
            Errors: 'none',
            ab : ['1','2']
        })
        },
    
        loadHomePage : async (req,res)=>{
        return res.render('home',{test: 'Testing Home Page'})
        },
        
        register : async(req, res)=>{
            const alreadyPresent = await User.findOne({email: req.body.email})
            try{
                console.log('executed')
                if(alreadyPresent){
                    return res.status(400).render('error404',{
                        status:'400',
                        message: 'E-mail already registered.',
                        goto: '/signup',
                        destination: 'Sign Up Page'
                    })
                }
                const user = new User({
                    username : req.body.username,
                    email : req.body.email,
                    password : req.body.password
                })

                await user.save() 
                //sendWelcomeEmail(user.email, user.name)
                console.log('data saved successfully')
                
                const token = await user.generateAuthToken()
                console.log('token generated')
                res.cookie('token',token,{
                    maxAge:1000*60*60,
                    httpOnly:true
                })
                res.redirect('/home')
            }catch(e){
                res.status(400).render('error404',{
                    status:'400 :(',
                    message: e,
                    goto: '/',
                    destination: 'Entry Page'
                })
            }

        }

}

    
router.get('/',routeHandlers.loadIndexPage)
router.get('/signup',routeHandlers.loadSignUp)
router.post('/signup',routeHandlers.register)
router.get('/home',routeHandlers.loadHomePage)

module.exports = {users : router, routeHandlers}