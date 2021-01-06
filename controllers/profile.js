const _ = require('lodash')
const express = require('express')
const User = require('../db/user')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const auth = require('../middleware/autho')
const bodyParser = require('body-parser')
const multer = require('multer')
const sharp = require('sharp')


router.get('/profile', auth('users'), async(req,res)=>{

   if(!req.user){
      throw new Error()
   }
   
   if(!req.user.avatar){
      var pic = "Profile Picture Not Uploaded"
   }else{
      var pic = req.user.avatar.toString('base64')
   }

   res.render('profile', {
      title : 'Profile',
      username : req.user.username,
      fullname : req.user.fullname,
      about: req.user.about,
      email : req.user.email,
      pic: JSON.stringify(pic),
      usernameH: req.user.username
   })
})


const uploadS = multer({
   //dest: 'avatars',
   limits: {
       fileSize: 5000000
   },
   fileFilter(req,file,cb){
      
      if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){
      return cb(new Error('File must be a an Image'))
    }
      cb(undefined, true)
   }
   
})

router.post('/profile/avatar', auth('users'), uploadS.single('avatar'), async (req,res)=>{
   
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  try{
   req.user.avatar = buffer
   
  await req.user.save() 
  res.redirect('/profile/patch')
  }
  catch{
   res.render('400',{
      message: 'Choose an image before Pressing Upload Button',
      status: '400',
      destination: 'users Profile',
      goto: '/profile/patch',
      usernameH: req.user.username
   })
  }
  
}, (error, req, res, next)=>{
   res.status(400).send(error.message)
})

router.get('/profile/avatar/delete', auth('users'), async (req,res)=>{
   req.user.avatar = undefined 
   await req.user.save()
   try{
      res.redirect('/profile/patch')
   }catch(e){
      res.render('400',{
         message: e,
         status: '400',
         destination: 'users Profile',
         goto: '/profile/patch',
         usernameH: req.user.username
      })
   } 
 }) 



router.get('/profile/patch', auth('users'), async (req,res)=>{
    try{
       res.render('update',{
          title: 'Update Profile',
          goto: '/profile/patch',
          usernameH: req.user.username
       })
    }catch(e){
       res.status(500).render(e)
    }  
  })
 
 router.post('/profile/patch', auth('users'), async (req, res)=>{
   const allowedUpdates = ['fullname','about','email','password']
   const updates = Object.keys(req.body)
   const isValidOperation = updates.every((update)=>{
      return allowedUpdates.includes(update)
   })

   if(!isValidOperation){
      return res.status(400).send({ error: 'Invalid Updates!'})
   }

   try{
     
      updates.forEach((update)=>{
        if(req.body[update]){
         req.user[update] = req.body[update]
        }
      }) 

      await req.user.save()       

      res.status(200).render('tempPage',{
         username: req.user.username,
         message: 'Profile Data Updated',
         usernameH: req.user.username
      })
   }

   catch(e){
      return res.render('error404', {
         status: '400',
         message: e + 'Unable to Update Profile Data. Please Try Again',
         usernameH: req.user.username
      })
   }
   
})

 router.get('/profile/delete', auth('users'), async (req, res)=>{
   try{
      //sendCancellationEmail(req.user.email, req.user.name)
      await req.user.remove()
      res.send(req.user)
   }catch(e){
      res.status(500).send()
   }
})

module.exports = router;