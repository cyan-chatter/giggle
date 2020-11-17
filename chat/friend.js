
const friendRequest = (io)=>{
	
	io.on('connection', (socket)=>{
		socket.on('joinRequest', (params,callback)=>{
			socket.join(params.username)
			callback()
		})
	})

	socket.on('friendRequest', (req, callback) => {
           
		//sentRequests- username  receivedRequests- userId, username  totalRequests
 			const senderData = await User.findOne({username:req.sender})
 			senderData.sentRequests.push({"username": req.receiver})
 			await senderData.save()
 			const receiverData = await User.findOne({username: req.receiver})
 			receiverData.receivedRequests.push({"userId": senderData._id, "username": req.sender})
 			receiverData.totalRequests += 1;
 			await receiverData.save()

            io.to(req.receiver).emit('newFriendRequest', {
               from: req.sender,
               to: req.receiver
            })
            
            callback();
    })

}





module.exports = friendRequest