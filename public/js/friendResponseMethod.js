            const v = document.querySelector('#activator').innerHTML
            var checkForAccept = [0], checkForReject = [0];
            
            if(v === 'no'){
                 document.getElementById('foundUsers').style.display = "none"
            }
            
            //attach a unique id to each element div(2 buttons + 1 info) of the loop
            //listen to events on the basis of class
            //but as event starts, extract the id of the button group (accept+reject) clicked and operate effects only on them

            const senderUsernameDOM = document.querySelectorAll(".friendRequestSenderUsername")
            const messageIdentifier1 = document.querySelectorAll('.identifier1')
            const acceptBtn = document.querySelectorAll('.acceptFriendBtn')
            const rejectBtn = document.querySelectorAll('.rejectFriendBtn')
            
            const disablebuttons = (Btn1, Btn2)=>{    
                Btn1.disabled = true
                Btn2.disabled = true
                Btn1.style.display = 'none'
                Btn2.style.display = 'none'
            }

            for(var i=0; i<senderUsernameDOM.length; ++i){

                const senderUserName = senderUsernameDOM[i].innerHTML
                
                acceptBtn[i].addEventListener('click', (e)=>{
                    e.preventDefault()
                    disablebuttons(acceptBtn[i], rejectBtn[i])
                    
                    if(checkForReject[i] === 0 && checkForAccept[i] === 0){
                        messageIdentifier1[i].innerHTML = '....'
                        var actionURL = "/acceptFriendRequest";
                        var senderUsername = {senderUserName}
                        $.ajax({
                            url: actionURL,
                            type: "POST",
                            data: JSON.stringify(senderUsername),
                            contentType: 'application/json',
                            success: function(res){
                                console.log(JSON.stringify(res))
                                messageIdentifier1[i].innerHTML = JSON.stringify(res)
                            }
                        })
                        checkForAccept[i] = 1
                        
                    }
                })
    
                 rejectBtn[i].addEventListener('click', (e)=>{
                    e.preventDefault()
                    disablebuttons(acceptBtn[i], rejectBtn[i])
                   const senderUserName =  senderUsernameDOM[i].innerHTML
                    if(checkForReject[i] === 0 && checkForAccept[i] === 0){
                        messageIdentifier1[i].innerHTML = '....'
                        var actionURL = "/rejectFriendRequest";
                        var senderUsername = {senderUserName}
                        $.ajax({
                            url: actionURL,
                            type: "POST",
                            data: JSON.stringify(senderUsername),
                            contentType: 'application/json',
                            success: function(res){
                                console.log(JSON.stringify(res))
                                messageIdentifier1[i].innerHTML = JSON.stringify(res)
                            }
                        })
                        checkForReject[i] = 1
                        
                    }
                })
    
            }


            