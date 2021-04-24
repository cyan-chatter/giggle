function Encrypt(word, key = 'secret key 123') {
    let encJson = CryptoJS.AES.encrypt(JSON.stringify(word), key).toString()
    let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
    return encData
}

function Decrypt(word, key = 'secret key 123') {
    let decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8)
    let bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8)
    return JSON.parse(bytes)
}


////these fns doesnt always work -- need to write RSA encrytion fns and implement DH Key exchange
///check : https://github.com/travist/jsencrypt
//logs present for debugging help


$(document).ready(()=>{

    var socket = io()
    var direct1 = $.deparam(window.location.pathname)
    var rooms = direct1.split('.')
    var direct2 = rooms[1] + '.' + rooms[0]

    var MessageDOM = $('#msg')

    var messageData = JSON.parse(localStorage.getItem("messageMainData"))
    var schat = messageData.pchat

    socket.on('connect', ()=>{
        var rooms = {
            direct1, direct2
        }

        for(var i=0; i< schat.length; ++i){
            
            const secretKey = 'secret key 123' //SECRET KEY 
            
            console.log('1') //////////////////
            console.log(schat[i].message) /////////////////

            schat[i].message = Decrypt(schat[i].message, secretKey)
            
            console.log('2') /////////////////
            
            var messageBlock = $.trim($('#chatTemplate').html())
            var newMessage = messageBlock.replace(/!!%!!=usernameClient=!!%!!/ig, schat[i].senderName).replace(/!!%!!=textClient=!!%!!/ig, schat[i].message)
            $('.savedMessages').append(newMessage)
        }
        
        socket.emit('joinedDirect', rooms, ()=>{
            console.log('client connected to direct chatroom')
        })
    })

    $('#send-message').on('click', function(e){
        e.preventDefault();
        console.log('3') ////////////////
        var sendingMessageText = MessageDOM.val();
        
        if(sendingMessageText.toString().trim().length > 0){

            const secretKey = 'secret key 123' //SECRET KEY 
            
            var ciphertext = Encrypt(sendingMessageText, secretKey)
            console.log('4') ///////////////////

            var message = {
                text: '',
                sender: rooms[0],
                receiver: rooms[1],
                direct: direct1
                //userPic: userPic
            }

            message.text = '' + ciphertext

            $.ajax({
                url:'/direct/' + direct1,
                type: 'POST',
                data: {
                    text : message.text
                },
                success: function(){
                    MessageDOM.val(''); //does not work
                    MessageDOM.focus();
                }
            })        

            socket.emit('newDirectMessage', message, ()=>{
                console.log(" message transfer success")
            });
        }
    });

    socket.on('incomingDirect', (rnm)=>{
        
        const secretKey = 'secret key 123' //SECRET KEY 

        rnm.text = Decrypt(rnm.text, secretKey)

        var messageBlock = $.trim($('#chatTemplate').html());
        var newMessage = messageBlock.replace(/!!%!!=usernameClient=!!%!!/ig, rnm.sender).replace(/!!%!!=textClient=!!%!!/ig, rnm.text);
        $('.newMessages').append(newMessage);
        //autoscroll();
    })

    socket.on('loadError', function() {
        document.querySelector('#loadError').innerHTML = "Sorry, Error in Loading Messages :("
        console.log('client error catcher')
        //location.replace("/friends")
    })

})