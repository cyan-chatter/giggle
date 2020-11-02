const jwt = require('jsonwebtoken')
const cookieParser= require('cookie-parser')
const User = require('../db/user');
const secretKey = process.env.JWT_SECRET || 'MazeRunner'

const auth = (type)=>{
    return async(req, res, next)=>{
        try{ 
            const token = req.cookies.token
            const decoded = jwt.verify(token, secretKey)
            let user;
            if(type === 'users'){
                user = await User.findOne({_id: decoded._id, 'tokens.token':token})
            }

            if (!user) {
            throw new Error()
            }
        req.token = token
        req.user = user
        next()
    
        }catch(e){
            res.status(401).render('error404',{
                status:'401 :(',
                message: 'Please Authenticate Properly',
                goto: '/',
                destination: 'Entry Page'
             })
        }
    }
} 

module.exports = auth