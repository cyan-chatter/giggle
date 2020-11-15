const {Campers} = require('../utils/camper')
const campersInDiscuss = new Campers()

const socketServer = (io)=>{
    io.on('connection', (socket)=>{        
        console.log('user connected to backend')  

        socket.on('joinCampDiscuss', (params, callback)=>{
            socket.join(params.camp)
            campersInDiscuss.putCamper(socket.id, params.username, params.camp)
            io.to(params.camp).emit('campers', campersInDiscuss.getCampers(params.camp))   
            callback()
        })
 
        socket.on('createNewMessage', (message, callback)=>{
            console.log(message)
            io.to(message.camp).emit('sendNewMessage', {
                text: message.text,
                camp: message.camp,
                username: message.username
            })    
            callback()
        })
    
    
    })
}

//Client - Request - socket.emit ->
//Server - Recieves request and Triggers - socket.on ->
//Server - Responds - io.emit ->
//Client - Recieves response - socket.on 

module.exports =  socketServer