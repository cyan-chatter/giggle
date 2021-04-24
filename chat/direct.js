const socketServer = (io)=>{

    io.on('connection', (socket)=>{
                        
        console.log('here in direct server')
        socket.on('joinedDirect', (options, callback)=>{
            
            socket.join(options.direct1)
            socket.join(options.direct2)
            callback()
        })

        socket.on('newDirectMessage', async (message, callback)=>{
            io.to(message.direct).emit('incomingDirect', {
                text : message.text,
                sender: message.sender
            })
            callback()
        })
    })
}


module.exports = socketServer