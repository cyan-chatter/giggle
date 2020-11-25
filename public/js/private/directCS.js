$(document).ready(()=>{
    var socket = io()
    
    const myName = $('#myNameHidden').val()
    const fName = $('#fNameHidden').val()
    const roomNamesCombined = $('#roomNamesCombined').val()

    var messageForm = $('#message_form')  
    var MessageDOM = $('#msg')
    
    const rooms = roomNamesCombined.split('.')
    const direct1 = rooms[0] + '.' + rooms[1]
    const direct2 = rooms[1] + '.' + rooms[0]
    
    socket.on('connect', ()=>{
        var rooms = {
            direct1, direct2
        }
        socket.emit('joinedDirect', rooms, ()=>{
            console.log('joined to direct room')
        })
    })

    messageForm.on('submit', function(e){
        e.preventDefault();
        
        var sendingMessageText = MessageDOM.val();
        
        if(sendingMessageText.trim().length > 0){
            var message = {
                text: sendingMessageText,
                sender: myName,
                direct: direct1
                //userPic: userPic
            }

            //encrypt and send encrypted message 

            socket.emit('newDirectMessage', message, ()=>{
                MessageDOM.val('');
                MessageDOM.focus();
                console.log('message submitted');
            });
        }
    });

    socket.on('incomingDirect', (rnm)=>{
        
        //decrypt message
        
        var messageBlock = $.trim($('#directFromServerTemplate').html());
        var newMessage = messageBlock
                            .replace(/!%!=usernameClient=!%!/ig, rnm.sender)
                            .replace(/!%!=textClient=!%!/ig, rnm.text);
        $('#messages').append(newMessage);
        //autoscroll();
    })

})