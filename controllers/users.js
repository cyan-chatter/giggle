const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const router = new express.Router()
var sessionStorage = require('sessionstorage');
//const flash = require('connect-flash')
//const em = require('express-messages')

// router.use(flash()); 
//     router.use(function(req, res, next) {
//         res.locals.message =  em(req,res)
//          const messages = JSON.stringify(res.locals.message)
//          console.log(messages)
//         next();
//     })
  
const {notify, notifyType} = {
    notify : ['Email already registered', 'You have successfylly registered', 'You have logged in', 'You have logged out'],
    notifyType : ['info', 'success', 'error']
}

//var m,mT;

//sessionStorage.SessionName = "SessionData" 
sessionStorage.setItem("m",".")
sessionStorage.setItem("mT",".")
sessionStorage.getItem("m")

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
                messageType : sessionStorage.getItem("mT")
            } ) /*{ items : items }*/
        },
    //{ messages: req.flash('info') }
        loadSignUp : async (req,res)=>{
        return res.render('signup',{
            test : 'Testing Register User Page',
            Errors: 'none',
            ab : ['1','2'],
            message : sessionStorage.getItem("m"),
            messageType : sessionStorage.getItem("mT")
        })
        },
    
        loadHomePage : async (req,res)=>{
        return res.render('home',{
            test: 'Testing Home Page',
            message : sessionStorage.getItem("m"),
            messageType : sessionStorage.getItem("mT")
        })
        },
        
        register : async(req, res)=>{
            const alreadyPresent = await User.findOne({email: req.body.email})
            
            try{
                console.log('executed')
                if(alreadyPresent){
                    sessionStorage.setItem("m", notify[0])
                    sessionStorage.setItem("mT", notifyType[2]) 
                    // return res.status(400).render('error404',{
                    //     status:'400',
                    //     message: notify,
                    //     messageType: notifyType,
                    //     goto: '/signup',
                    //     destination: 'Sign Up Page'
                    // })
                    return res.redirect('/index')
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
                sessionStorage.setItem("m", notify[1])
                sessionStorage.setItem("mT", notifyType[1])
                res.redirect('/home')
            }catch(e){
                res.status(400).render('error404',{
                    status:'400 :(',
                    message: e + 'Redirecting You to the Entry Page',
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