            var checkForAccept = [], checkForReject = [];
            
            var senderUsernameDOM = document.querySelectorAll('.friendRequestSenderUsername')
            var messageIdentifier1 = document.querySelector('.identifier1')
            var acceptBtn = document.querySelectorAll('.acceptFriendBtn')
            var rejectBtn = document.querySelectorAll('.rejectFriendBtn')
            

            for(var i=0; i<senderUsernameDOM.length; ++i){
                checkForAccept[i] = 0
                checkForReject[i] = 0
            }            

            for(var i=0; i<senderUsernameDOM.length; ++i){

                const senderUserName = senderUsernameDOM[i].innerHTML
                          
                function acceptBtnWork (e){

                     e.disabled = true
                     
                    if(checkForReject[i] !== 1 && checkForAccept[i] !== 1){
                        messageIdentifier1.innerHTML = '....'
                        var actionURL = "/acceptFriendRequest"
                        var senderUsername = {senderUserName}
                        e.style.display = 'none' 
                        $.ajax({
                            url: actionURL,
                            type: "POST",
                            data: JSON.stringify(senderUsername),
                            contentType: 'application/json',
                            success: function(res){
                                messageIdentifier1.innerHTML = JSON.stringify(res)
                            }
                        })
                        checkForAccept.push(1) 
                        checkForReject.push(1)
                    }
            
                }

                
                 function rejectBtnWork(e){
                       
                    e.disabled = true
                    
                    if(checkForReject[i] !== 1 && checkForAccept[i] !== 1){
                        messageIdentifier1.innerHTML = '....'
                        var actionURL = "/rejectFriendRequest"
                        var senderUsername = {senderUserName}
                        e.style.display = 'none'
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
                        checkForReject.push(1)
                        checkForAccept.push(1)
                    } 
                }
            }


            