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
    
    socket.on('sendNewMessage', (rnm)=>{
        
        var messageBlock = $.trim($('#messageFromServerTemplate').html());
        
        var newMessage = messageBlock.replace(/!%!=usernameClient=!%!/ig, rnm.username).replace(/!%!=textClient=!%!/ig, rnm.text);
        $('#messages').append(newMessage);
        
        //add autoscroll();
        
    });

    socket.on('campersDisplay', (sender, campers)=>{
       
        var numDOM = $('#numValue')
        var campersDOM = $('#users')
        var NoCampers = campers.length
        var displayListDOM = $('#camperList');
        numDOM.text(NoCampers)

        var ListItemBlock = $.trim($('#CampersListTemplate').html());
        
        for(var i=0; i<NoCampers; ++i){
            var newCamper = ListItemBlock.replace(/!%!=usernameListed=!%!/ig, campers[i]).replace(/!%!=usernameUser=!%!/ig,sender)
            displayListDOM.append(newCamper)
        }

    })


    
});











