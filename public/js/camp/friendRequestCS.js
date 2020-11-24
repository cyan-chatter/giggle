$(document).ready(function(){
	var socket = io()

	var campNameDOM = $('#campName')
    var userNameDOM = $('#userName')
    var userImageDOM = $('#name-image')
    
    var camp = campNameDOM.val()
    var username = userNameDOM.val()
    
	socket.on('connect', function(){
		var params = {
			username
		}
		socket.emit('joinRequest', params, ()=>{
			console.log('I am in')
		})
	
	})

    const addFriend = $('#add_friend')

    addFriend.on('submit', function(e){
        e.preventDefault()
        
        var receiver = $('#receiverName').val()
        
        $.ajax({
            url: '/camp/'+ camp,
            type: 'POST',
            data: {
                receiver
            },
            success: function(){
                socket.emit('friendRequest', 
                {
                    receiver,
                    sender: username
                }, 
                function(){
                    console.log('Friend Request Sent')
                })
            }
        })
    })

    socket.on('newFriendRequest', function(friend){
        
        $('#reload').load(location.href + ' #reload');
        
        $(document).on('click', '#accept_friend', function(){
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();

            $.ajax({
                url: '/camp/'+camp,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success: function(){
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + ' #reload');
    }); 

    })
})
