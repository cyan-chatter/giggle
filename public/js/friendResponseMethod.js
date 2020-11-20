            const v = document.querySelector('#activator').innerHTML
            var checkForAccept = 0, checkForReject = 0;
            
            if(v === 'no'){
                 document.getElementById('foundUsers').style.display = "none"
            }
            
            //attach a unique id to each element div(2 buttons + 1 info) of the loop
            //listen to events on the basis of class
            //but as event starts, extract the id of the button group (accept+reject) clicked and operate effects only on them

            const senderUserName = document.querySelector(".friendRequestSenderUsername").innerHTML
            const messageIdentifier1 = document.querySelector('.identifier1')
            const acceptBtn = document.querySelector('.acceptFriendBtn')
            const rejectBtn = document.querySelector('.rejectFriendBtn')
            
            const disablebuttons = ()=>{
                
                acceptBtn.disabled = true
                rejectBtn.disabled = true
                acceptBtn.style.display = 'none'
                rejectBtn.style.display = 'none'
                
            }

            
            acceptBtn.addEventListener('click', (e)=>{
                e.preventDefault()
                disablebuttons()
                
                if(checkForReject === 0 && checkForAccept === 0){
                    messageIdentifier1.innerHTML = '....'
                    var actionURL = "/acceptFriendRequest";
                    var senderUsername = {senderUserName}
                    $.ajax({
                        url: actionURL,
                        type: "POST",
                        data: JSON.stringify(senderUsername),
                        contentType: 'application/json',
                        success: function(res){
                            console.log(JSON.stringify(res))
                            messageIdentifier1.innerHTML = JSON.stringify(res)
                        }
                    })
                    checkForAccept = 1
                    
                }
            })

             rejectBtn.addEventListener('click', (e)=>{
                e.preventDefault()
                disablebuttons()
                
                if(checkForReject === 0 && checkForAccept === 0){
                    messageIdentifier1.innerHTML = '....'
                    var actionURL = "/rejectFriendRequest";
                    var senderUsername = {senderUserName}
                    $.ajax({
                        url: actionURL,
                        type: "POST",
                        data: JSON.stringify(senderUsername),
                        contentType: 'application/json',
                        success: function(res){
                            console.log(JSON.stringify(res))
                            messageIdentifier1.innerHTML = JSON.stringify(res)
                        }
                    })
                    checkForReject = 1
                    
                }
            })
