const socketServer = (io)=>{

    io.on('connection', (socket)=>{
                        
        console.log('here in direct server')
        socket.on('joinedDirect', (options, callback)=>{
            
            socket.join(options.direct1)
            socket.join(options.direct2)
            callback()
        })

        socket.on('newDirectMessage', async (incoming, callback)=>{
            io.to(incoming.direct).emit('incomingDirect', {
                text : incoming.text,
                sender: incoming.sender
            })
            callback()
            //incoming -- text sender receiver direct    
        })

    })
}


module.exports = socketServer