const jwt = require('jsonwebtoken')
const cookieParser= require('cookie-parser')
const User = require('./db/admin');
const secretKey = process.env.JWT_SECRET || 'MazeRunner'
// app.use((req,res,next)=>{
//     if(req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE'){
//         res.status(503).end('Request Temporarily Disabled. Server is Under Maintainance')
//     } else{
//        next()
//     }

// })

const auth = (type)=>{
    console.log("\nAuth Called\n")

    return async(req, res, next)=>{
        try{ 
            const token = req.cookies.token
            const decoded = jwt.verify(token, secretKey)
            let user;
            if(type === 'user'){
                user = await User.findOne({_id: decoded._id, 'tokens.token':token})
            }
            // else if(type === 'teachers'){
            //     user = await Teacher.findOne({_id: decoded._id, 'tokens.token':token})
            // }
            else if(type === 'admins'){
                user = await Admin.findOne({_id: decoded._id, 'tokens.token':token})
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
                destination: 'Home Page'
             })
        }
    }
} 

module.exports = auth