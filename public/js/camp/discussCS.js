$(document).ready(function(){
    var socket = io();

    var campNameDOM = $('#campName')
    var userNameDOM = $('#userName')
    var userImageDOM = $('#name-image')
    
    var camp = campNameDOM.val();
    var username = userNameDOM.val();
    var avatar = userImageDOM.val();
    var messageForm = $('#message-form') 
    var MessageDOM = $('#msg')
        
    //var userPic = $('#name-image').val();
    
    socket.on('connect', function(){
        console.log('user connected at frontend')

        var params = {
            camp,
            username
        }
     
         socket.emit('joinCampDiscuss',params, function(){
             console.log('user has joined this camp');
         });
    });
    
    messageForm.on('submit', function(e){
        e.preventDefault();
        
        var SendingMessageText = MessageDOM.val();
        var message = {
            text: SendingMessageText,
            camp,
            username
            //userPic: userPic
        }
        
        socket.emit('createNewMessage', message, function(){
            MessageDOM.val('');
            MessageDOM.focus();
            console.log('message submitted');
        });
    
    });
    
    socket.on('sendNewMessage', (RecievingNewMessage)=>{
        
        var messageBlock = $('#messageFromServerTemplate').html();
        var newMessage = Mustache.render(messageBlock, {
            textClient: RecievingNewMessage.text,
            usernameClient: RecievingNewMessage.username,
            campClient: RecievingNewMessage.camp
        });
        console.log(RecievingNewMessage);
        $('#messages').append(newMessage);
        //add autoscroll();
    });




    // socket.on('usersList', function(users){
    //     var ol = $('<ol></ol>');
        
    //     for(var i = 0; i < users.length; i++){
    //         ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
    //     }
        
    //     $(document).on('click', '#val', function(){
    //         $('#name').text('@'+$(this).text());
    //         $('#receiverName').val($(this).text());
    //         $('#nameLink').attr("href", "/profile/"+$(this).text());
    //     });
        
    //     $('#numValue').text('('+users.length+')');
    //     $('#users').html(ol);
    // });
    
    
    
    
        
        
        // $.ajax({
        //     url: '/group/'+room,
        //     type: 'POST',
        //     data: {
        //         message: msg,
        //         groupName: room
        //     },
        //     success: function(){
        //         $('#msg').val('');
        //     }
        // })
        
    
    
});











