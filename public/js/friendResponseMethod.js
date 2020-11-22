            var checkForAccept = [], checkForReject = [];
            
            var senderUsernameDOM = document.querySelectorAll('.friendRequestSenderUsername')
            var messageIdentifier1 = document.querySelector('.identifier1')
            var acceptBtn = document.querySelectorAll('.acceptFriendBtn')
            var rejectBtn = document.querySelectorAll('.rejectFriendBtn')
            

            for(var i=0; i<senderUsernameDOM.length; ++i){
                checkForAccept[i] = 0
                checkForReject[i] = 0
            }            

            var senderUserName = []
            for(var i=0; i<senderUsernameDOM.length; ++i){

                 senderUserName[i] = senderUsernameDOM[i].innerHTML
            }      

                function acceptBtnWork (e){

                     e.disabled = true
                     e.parentNode.childNodes[5].disabled = true;
                     senderUserName = e.parentNode.childNodes[1].innerHTML;

                    if(checkForReject[i] !== 1 && checkForAccept[i] !== 1){
                        messageIdentifier1.innerHTML = '....'
                        var actionURL = "/acceptFriendRequest"
                        var senderUsername = {senderUserName}
                        e.style.display = 'none'
                        e.parentNode.childNodes[5].style.display = 'none';
                        $.ajax({
                            url: actionURL,
                            type: "POST",
                            data: JSON.stringify(senderUsername),
                            contentType: 'application/json',
                            success: function(res){
                                const x = JSON.stringify(res)
                                const y = JSON.parse(x)
                                messageIdentifier1.innerHTML = y.str
                            }
                        })
                        checkForAccept.push(1) 
                        checkForReject.push(1)
                    }
            
                }

                 function rejectBtnWork(e){
                       
                    e.disabled = true
                    console.log(e.parentNode.childNodes)
                    e.parentNode.childNodes[3].disabled = true;
                    senderUserName = e.parentNode.childNodes[1].innerHTML;
                     
                    if(checkForReject[i] !== 1 && checkForAccept[i] !== 1){
                        messageIdentifier1.innerHTML = '....'
                        var actionURL = "/rejectFriendRequest"
                        var senderUsername = {senderUserName}
                        e.style.display = 'none'
                        e.parentNode.childNodes[3].style.display = 'none'
                        $.ajax({
                            url: actionURL,
                            type: "POST",
                            data: JSON.stringify(senderUsername),
                            contentType: 'application/json',
                            success: function(res){
                                const x = JSON.stringify(res)
                                const y = JSON.parse(x)
                                messageIdentifier1.innerHTML = y.str
                            }
                        })
                        checkForReject.push(1)
                        checkForAccept.push(1)
                    } 
                }
            


            