'use strict;'
const _ = require('lodash')
const express = require('express')
const router = new express.Router()

const loadIndexPage = async (req,res)=>{
    return res.render('index', {test: 'Testing the Server'})
}

const loadSignUp = async (req,res)=>{
    return res.render('signup',{test : 'Testing Register User Page'})
}

router.get('/',loadIndexPage)
router.get('/signup',loadSignUp)


module.exports = router