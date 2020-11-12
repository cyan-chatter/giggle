const notifyType = ['info', 'success', 'error']
const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
const auth = require('../middleware/autho')
const isloggedin = require('../middleware/isloggedin')
//const flash = require('connect-flash')
//const em = require('express-messages')

// router.use(flash()); 
//     router.use(function(req, res, next) {
//         res.locals.message =  em(req,res)
//          const messages = JSON.stringify(res.locals.message)
//          console.log(messages)
//         next();
//     })
  
    
//var m,mT;

//sessionStorage.SessionName = "SessionData" 
sessionStorage.getItem("m")  // i think i need to remove this line here

const routeHandlers = {
        loadIndexPage : async (req,res)=>{
            //req.flash("info", "Email sent")
            //var i=0
            //var items = []
            // Object.keys(messages).forEach((type)=>{
            //    items[i] = messages[type];
            //    ++i;
            // })
            return res.render('index', {
                test : 'Index Page', 
                message : sessionStorage.getItem("m"),
                messageType : sessionStorage.getItem("mT"),
                gotoLogin : '/login',
                login : 'Login Here',
                gotoRegister: '/signup',
                register: 'Sign Up Here'
            }) /*{ items : items }*/
        },
    //{ messages: req.flash('info') }
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
            const alreadyPresent = await User.findOne({email: req.body.email})
            
            try{
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
                    password : req.body.password
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
     loadLogin : async(req,res)=>{
        return res.render('login',{
            goto: '/login',
            message : sessionStorage.getItem("m"),
            messageType : sessionStorage.getItem("mT")
        })
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
router.post('/logout', auth('users'), routeHandlers.logout)
router.post('/logoutAll', auth('users'), routeHandlers.logoutAll )
router.get('/login', isloggedin('users'), routeHandlers.loadLogin)
router.post('/login', routeHandlers.login)
 
module.exports = router