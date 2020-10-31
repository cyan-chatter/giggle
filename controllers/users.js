'use strict';
const _ = require('lodash')
const express = require('express')
const passport = require('passport')

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
        }

}

    
router.get('/',routeHandlers.loadIndexPage)
router.get('/signup',routeHandlers.loadSignUp)
router.post('/signup',passport.authenticate('localSignup',{
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
    }))
router.get('/home',routeHandlers.loadHomePage)

module.exports = {users : router, routeHandlers}