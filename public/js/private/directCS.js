$(document).ready(()=>{
    var socket = io()
    
    var messageForm = $('#message_form')  
    var MessageDOM = $('#msg')
    
    var direct1 = $.deparam(window.location.pathname);
    var rooms = direct1.split('.')
    var direct2 = rooms[1] + '.' + rooms[0]
    
    socket.on('connect', ()=>{
        var rooms = {
            direct1, direct2
        } 
        socket.emit('joinedDirect', rooms, ()=>{
            console.log('direct client')
        })
    })

    messageForm.on('submit', function(e){
        e.preventDefault();
        
        var sendingMessageText = MessageDOM.val();
        
        if(sendingMessageText.trim().length > 0){
            var message = {
                text: sendingMessageText,
                sender: rooms[0],
                direct: direct1,
                //userPic: userPic
            }

            //encrypt and send encrypted message 

            socket.emit('newDirectMessage', message, ()=>{
                MessageDOM.val('');
                MessageDOM.focus();
            });
        }
    });

    socket.on('incomingDirect', (rnm)=>{
        
        //decrypt message
        //direct2      
        var messageBlock = $.trim($('#directFromServerTemplate').html());
        var newMessage = messageBlock.replace(/!%!=usernameClient=!%!/ig, rnm.sender).replace(/!%!=textClient=!%!/ig, rnm.text);
        $('#messages').append(newMessage);
        //autoscroll();
    })

})