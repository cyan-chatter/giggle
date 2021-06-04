const notifyType = ['info', 'success', 'error']
const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const isloggedin = require('../middleware/isloggedin')

sessionStorage.getItem("m") 

const routeHandlers = {
        loadIndexPage : async (req,res)=>{
            return res.render('index', {
                test : 'Index Page', 
                message : sessionStorage.getItem("m"),
                messageType : sessionStorage.getItem("mT"),
                gotoLogin : '/login',
                goto: '/login',
                login : 'Login Here',
                gotoRegister: '/signup',
                register: 'Sign Up Here'
            }) 
        },
        loadSignUp : async (req,res)=>{
        return res.render('signup',{
            goto: '/register',
            Errors: 'none',
            ab : ['1','2'],
            message : sessionStorage.getItem("m"),
            messageType : sessionStorage.getItem("mT")
        })
        },
    
        
        register : async(req, res)=>{
            
            try{
                const alreadyPresent = await User.findOne({email: req.body.email})
                console.log('executed')
                if(alreadyPresent){
                    sessionStorage.setItem("m", 'Email already registered')
                    sessionStorage.setItem("mT", notifyType[2]) 
                    // return res.status(400).render('error404',{
                    //     status:'400',
                    //     message: notify,
                    //     messageType: notifyType,
                    //     goto: '/signup',
                    //     destination: 'Sign Up Page'
                    // })
                    return res.redirect('/signup')
                }
                const user = new User({
                    username : req.body.username,
                    email : req.body.email,
                    password : req.body.password,
                    fullname : req.body.fullname
                })

                    await user.save()
                    //sendWelcomeEmail(user.email, user.name)
                    console.log('data saved successfully')
                    const token = await user.generateAuthToken()
                    
                    res.cookie('token',token,{
                        maxAge:1000*60*60,
                        httpOnly:true
                    })

                    sessionStorage.setItem("m", 'You have successfully registered')
                    sessionStorage.setItem("mT", notifyType[1])
                    return res.redirect('/home')
                
            }catch(e){
                    sessionStorage.setItem("m", e)
                    sessionStorage.setItem("mT", notifyType[2])
                    return res.redirect('/signup')     
            }

        },
        logout:  async (req,res)=>{
            try{
               req.user.tokens = req.user.tokens.filter((t)=>{
                  return t.token !== req.token
               })
               await req.user.save()
               res.clearCookie('token')
               sessionStorage.setItem("m", "You have Logged out successfully")
               sessionStorage.setItem("mT", notifyType[1])
               return res.redirect('/')
                
            }catch(e){
                sessionStorage.setItem("m", e)
                sessionStorage.setItem("mT", notifyType[2])
                return res.redirect(500,'/')
            }
         },

      logoutAll : async(req,res)=>{
        try{
           req.user.tokens = []
           await req.user.save()
           res.clearCookie('token')
            sessionStorage.setItem("m", "You have Logged out from all the devices successfully")
            sessionStorage.setItem("mT", notifyType[1])
           return res.redirect('/')
        }catch(e){
            sessionStorage.setItem("m", e)
            sessionStorage.setItem("mT", notifyType[2])
            return res.redirect(500,'/')
        }
     },

     login : async(req,res)=>{
        try{    
            const user = await User.findByCredentials(req.body.email, req.body.password)  
            const token = await user.generateAuthToken()
            res.cookie('token',token,{
               maxAge:3600000,
               httpOnly:true
            })
            sessionStorage.setItem("m", "You have Logged in successfully")
            sessionStorage.setItem("mT", notifyType[1])
            return res.redirect('/home')
          }catch(e){ 
            sessionStorage.setItem("m", e)
            sessionStorage.setItem("mT", notifyType[2])
            return res.redirect('/')
          }
     }
}
    
router.get('/', isloggedin('users'), routeHandlers.loadIndexPage)
router.get('/signup', routeHandlers.loadSignUp)
router.post('/signup',routeHandlers.register)
router.get('/logout', auth('users'), routeHandlers.logout)
router.post('/logoutAll', auth('users'), routeHandlers.logoutAll )
router.post('/login', routeHandlers.login)
 
module.exports = router