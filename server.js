//  E:\Apps\mongodb\bin\mongod.exe --dbpath="E:\Apps\mongodata"

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const http = require('http')
var sessionStorage = require('sessionstorage');
const session = require('express-session')
const socket = require('socket.io')
const _ = require('lodash')


require('dotenv').config()
require('./db/mongoose')


const users = require('./controllers/users')
const profile = require('./controllers/profile')
const findUser = require('./controllers/findUser')
const friends = require('./controllers/friends')
const private = require('./controllers/private')
const home = require('./controllers/home')

sessionStorage.setItem("m"," ")
sessionStorage.setItem("mT"," ")

setServer = (users)=>{

    
    //Express server setup
    const app = express()
    app.use(express.json())
    const server = http.createServer(app);
    const io = socket(server)
    
    //configure Express 
    configExpress(app)
    
    require('./chat/direct')(io)
    
    //Use the Routers 
    app.use(users)
    app.use(home)
    app.use(profile)
    app.use(findUser)
    app.use(friends) 
    app.use(private)       
    
    //Set cookie config
    app.get('/clcookie',(req,res) => {
        res.clearCookie('token')
        res.json({name:"'omaewahikarida'"})
    })

    app.get('/cookie',(req,res)=> {
        console.log(req.cookies)
        res.send("success")
    })

    app.get('*',(req,res)=>{
        res.render('error404',{
            status: '404',
            message: 'Page Not Found',
            destination: 'Login Page',
            goto: '/'
        })
    })

    
    //listen at port
    const port = process.env.PORT || 5500
    server.listen(port, ()=>{
        console.log('Server is Up on Port '+port)
    })
    
}

//Express Config
configExpress = (app)=>{
    
    //parse the html data to request body data and parse it again to json 
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:true}))
    
    //Templates -handlebars engine, partials and views
    const viewsPath = path.join(__dirname, './templates/views' )
    app.set('view engine', 'hbs')
    app.set('views', viewsPath)
    const partialsPath = path.join(__dirname, './templates/partials' )
    hbs.registerPartials(partialsPath)
    
    //register helper(if needed)
    // hbs.registerHelper("printItems", function(items) {
    //     var html = "<ul>";
    //     items.forEach(function(entry) {
    //       html += "<li>" + entry + "</li>";
    //     });
    //     html += "</ul>";
    //     return html;
    //   });

    // set public path
    const publicDirectoryPath = path.join(__dirname, './public')
    app.use(express.static(publicDirectoryPath))
    
    //parse cookies
    app.use(cookieParser())

    app.use(session({ 
        secret:'lightsession', 
        saveUninitialized: true, 
        resave: true,
        cookie : {maxAge: 3600000}
    })); 

    app.locals._ = _    
    
}

setServer(users);
