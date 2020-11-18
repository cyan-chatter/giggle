//C:/Users/DELL/mongo-4/mongodb/bin/mongod.exe --dbpath=C:/Users/DELL/mongo-4/mongodb-data
//D:\sayan\mongodb\bin\mongod.exe --dbpath=D:\sayan\mongodata
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const http = require('http')
var sessionStorage = require('sessionstorage');
const session = require('express-session')
const socket = require('socket.io')
const validator = require('express-validator')
const _ = require('lodash')
const {Campers} = require('./utils/camper')
//const MongoStore = require('connect-mongo')(session)

///////////////////////////////////////////////
require('./db/mongoose')
const Camp = require('./db/camp')




///////////////////////////////////////////////
const users = require('./controllers/users')
const admins = require('./controllers/admins')
const home = require('./controllers/home')
const camps = require('./controllers/camps')
const profile = require('./controllers/profile')



////////////////////////////////////////////

sessionStorage.setItem("m"," ")
sessionStorage.setItem("mT"," ")

////////////////////////////////////////////

setServer = (users)=>{

    ///////////////////////////
    //Create this a server -Express server setup
    const app = express()
    app.use(express.json())
    const server = http.createServer(app);
    const io = socket(server)
    
    ////////////////////////////////
    configExpress(app)
    //configure Express here  
    
    require('./chat/discuss')(io)
    //require('./chat/friend')(io)
    
    
    ////////////////////////////////
    //Use the Routers created -Express Routing
    app.use(users)
    app.use(admins) 
    app.use(home) 
    app.use(camps) 
    app.use(profile)
    
    
    ///////////////////////////////
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

    

    ////////////////////////////////
    
    const port = process.env.PORT || 5500
    server.listen(port, ()=>{
        console.log('Server is Up on Port '+port)
    })
    //app.listen->server.listen
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
    // hbs.registerHelper("printItems", function(items) {
    //     var html = "<ul>";
    //     items.forEach(function(entry) {
    //       html += "<li>" + entry + "</li>";
    //     });
    //     html += "</ul>";
    //     return html;
    //   });

    // public path
    const publicDirectoryPath = path.join(__dirname, './public')
    app.use(express.static(publicDirectoryPath))
    
    //parse out the cookie 
    app.use(cookieParser())

    app.use(session({ 
        secret:'lightsession', 
        saveUninitialized: true, 
        resave: true,
        cookie : {maxAge: 3600000}
    })); 

    app.locals._ = _    


    // need to use passport session function after the use of express session function
    
}

setServer(users);
////////////////////////////////


    
