const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const http = require('http')
//const container = require('./container')
//const socketio = require('socket.io')
const session = require('express-session')
const validator = require('express-validator')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')


///////////////////////////////////////////////
const _ = require('lodash')
const {users, routeHandlers} = require('./controllers/users')


//////////////////////////////////////////////

setServer = (users)=>{

    ///////////////////////////
    //Create this a server -Express server setup
    const app = express()
    app.use(express.json())
    //->const server = http.createServer(app);
    //->const io = socketio(server)
    
    
    
    ////////////////////////////////
    configExpress(app)
    //configure Express here
    
    
    ////////////////////////////////
    //Use the Routers created -Express Routing
    app.use(users)



    ////////////////////////////////
    const port = 3000
    app.listen(port, ()=>{
        console.log('Server is Up on Port '+port)
    })
    //app.listen->server.listen
}

//Express Config
configExpress = (app)=>{
    
    

    //parse out the cookie 
    app.use(cookieParser())

    //parse the html data to request body data and parse it again to json 
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:true}))
    
    //Templates -handlebars engine, partials and views
    const viewsPath = path.join(__dirname, './templates/views' )
    app.set('view engine', 'hbs')
    app.set('views', viewsPath)
    //const partialsPath = path.join(__dirname, '../templates/partials' )
    //hbs.registerPartials(partialsPath)

    // public path
    const publicDirectoryPath = path.join(__dirname, './public')
    app.use(express.static(publicDirectoryPath))
    
    //
    app.use(session({
        secret: 'thisisalottoexploreinuranus',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    }))
    
    // express flash messages
    app.use(flash());

    // need to use passport session function after the use of express session function
    app.use(passport.initialize())
    app.use(passport.session())
    require('./passport/passport-local')

}

///////////////////////////
//saving in memchached (Memory Cache Saver and Loader) via connect-memcached
// var express      = require('express');
// var session      = require('express-session');
// var cookieParser = require('cookie-parser');
// var app          = express();
// var MemcachedStore = require('connect-memcached')(session);
 
// app.use(cookieParser());
// app.use(session({
//       secret  : 'some-private-key',
//       key     : 'test',
//       proxy   : 'true',
//       store   : new MemcachedStore({
//         hosts: ['127.0.0.1:11211'], //this should be where your Memcached server is running
//         secret: 'memcached-secret-key' // Optionally use transparent encryption for memcache session data 
//     })
// }));
///////////////////////////


setServer(users);
////////////////////////////////
    
