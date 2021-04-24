function directChatLinkage(e){

    const fUsername = e.innerHTML
    const userDOM = document.querySelector('#myUsername')
    const Username = userDOM.innerHTML

    $.ajax({
        url: '/private',
        type: "POST",
        data: JSON.stringify({Username, fUsername}),
        contentType: 'application/json',
        success: function(res){
            //to work here
            location.replace("/private/")
        }
    })

}