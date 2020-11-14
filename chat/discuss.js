const socketServer = (io)=>{
    io.on('connection', (socket)=>{        
        console.log('user connected to backend')  

        socket.on('joinCampDiscuss', (params, callback)=>{
            socket.join(params.camp)
            console.log('Socket ID: ' + socket.id)  
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