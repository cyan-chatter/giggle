'use strict;'
const _ = require('lodash')
const express = require('express')
const router = new express.Router()

const loadIndexPage = async (req,res)=>{
    return res.render('index', {test: 'Testing the Server'})
}

router.get('/',loadIndexPage)

module.exports = router