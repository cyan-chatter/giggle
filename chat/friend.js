
const friendRequest = (io)=>{
	io.on('connection', (socket)=>{
		socket.on('joinRequest', (params,callback)=>{
			socket.join(params.username)
			callback()
		})
	})
}


module.exports = friendRequest
