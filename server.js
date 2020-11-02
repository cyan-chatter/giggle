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
//const MongoStore = require('connect-mongo')(session)
require('./db/mongoose')
//const flash = require('connect-flash')


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
    const port = 3000
    app.listen(port, ()=>{
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

    
    // req.flash("info", "Email sent");
    // req.flash("error", "Email delivery failed");          
    
    // app.get('/flash', function(req, res){
    //     // Set a flash message by passing the key, followed by the value, to req.flash().
    //     req.flash('info', 'Flash is back!')
    //     req.flash('test', 'i am testing flash')
    //     req.flash('success_msg', 'Flash is here!')
    //     req.flash('error_msg', 'Flash is Not here!')
    //     req.flash('error', 'This is an error!')
        
        
    //     res.redirect('/');
    // });

    
    //
    // app.use(session({
    //     secret: 'omaewahikarida',
    //     resave: false,
    //     saveUninitialized: false,
    //     store: new MongoStore({mongooseConnection: mongoose.connection})
    // }))
    
    // express flash messages
    //app.use(flash())

    // need to use passport session function after the use of express session function
    
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
    
