const friendRequestMethod = ()=>{
    const receiverUserName = document.querySelector("#friendRequestRecieverUsername").innerHTML
    const messageIdentifier = document.querySelector('#identifier')
    const friendBtn = document.querySelector('#addFriendBtn')
    
    friendBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        var actionURL = "/sendFriendRequest";
        if(friendBtn.innerHTML === "Send Friend Request"){
            messageIdentifier.innerHTML = "Sending...."
            friendBtn.innerHTML = "Revoke Friend Request"
            console.log('sending')
            actionURL = "/sendFriendRequest"

        }
        else if(friendBtn.innerHTML === "Revoke Friend Request"){
            messageIdentifier.innerHTML = "Revoking...."
            friendBtn.innerHTML = "Send Friend Request"
            console.log('revoking')
            actionURL = "/revokeFriendRequest"
        }
            var receiverUsername = {receiverUserName}
        $.ajax({
            url: actionURL,
            type: "POST",
            data: JSON.stringify(receiverUsername),
            contentType: 'application/json',
            success: function(res){
                console.log(JSON.stringify(res))
                messageIdentifier.innerHTML = JSON.stringify(res)
            }
        });
    })
}
