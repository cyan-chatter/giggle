            var checkForAccept = [], checkForReject = [];
            
            var senderUsernameDOM = document.querySelectorAll('.friendRequestSenderUsername')
            var messageIdentifier1 = document.querySelectorAll('.identifier1')
            var acceptBtn = document.querySelectorAll('.acceptFriendBtn')
            var rejectBtn = document.querySelectorAll('.rejectFriendBtn')
            
            // const disablebuttons = (Button)=>{    
            //     Button.btn1.disabled = true
            //     Button.btn2.disabled = true
            //     Button.btn1.style.display = 'none'
            //     Button.btn2.style.display = 'none'
            // }

            for(var i=0; i<senderUsernameDOM.length; ++i){
                checkForAccept[i] = 0
                checkForReject[i] = 0
            }            

            for(var i=0; i<senderUsernameDOM.length; ++i){

                const senderUserName = senderUsernameDOM[i].innerHTML
                  
                acceptBtn[i].addEventListener('click', (e)=>{
                    e.preventDefault()
                    //disablebuttons({btn1: acceptBtn[i], btn2: rejectBtn[i]})
                    // var acceptBtn1 = document.querySelectorAll('.acceptFriendBtn')
                    // var rejectBtn1 = document.querySelectorAll('.rejectFriendBtn')
            
                    // acceptBtn1[i].disabled = true 
                    // rejectBtn1[i].disabled = true

                    if(checkForReject[i] !== 1 && checkForAccept[i] !== 1){
                        //messageIdentifier1[i].innerHTML = '....'
                        var actionURL = "/acceptFriendRequest";
                        var senderUsername = {senderUserName}
                        $.ajax({
                            url: actionURL,
                            type: "POST",
                            data: JSON.stringify(senderUsername),
                            contentType: 'application/json',
                            success: function(res){
                                console.log(JSON.stringify(res))
                                //messageIdentifier1[i].innerHTML = JSON.stringify(res)
                            }
                        })
                        checkForAccept.push(1) 
                        checkForReject.push(1)
                    }
            
                })
    
                 rejectBtn[i].addEventListener('click', (e)=>{
                    e.preventDefault()
                    //disablebuttons({btn1: acceptBtn[i], btn2: rejectBtn[i]})
                    if(checkForReject[i] !== 1 && checkForAccept[i] !== 1){
                        //messageIdentifier1[i].innerHTML = '....'
                        var actionURL = "/rejectFriendRequest";
                        var senderUsername = {senderUserName}
                        $.ajax({
                            url: actionURL,
                            type: "POST",
                            data: JSON.stringify(senderUsername),
                            contentType: 'application/json',
                            success: function(res){
                                console.log(JSON.stringify(res))
                                //messageIdentifier1[i].innerHTML = JSON.stringify(res)
                            }
                        })
                        checkForReject.push(1)
                        checkForAccept.push(1)
                    } 
                })
            }


            