const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const hbs = require('hbs')
const http = require('http')
//const container = require('./container')
//const socketio = require('socket.io')

///////////////////////////////////////////////
const _ = require('lodash')
const users = require('./controllers/users')


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
    
}

///////////////////////////

///////////////////////////
//sayan
//saiyan
setServer(users);
////////////////////////////////
    
