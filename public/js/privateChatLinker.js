function privateChatLinkage(e){

    const fUsername = e.parentNode.childNodes[3].textContent
    const userDOM = document.querySelector('#myUsername')
    const Username = userDOM.innerHTML
    $.ajax({
        url: '/private',
        type: "POST",
        data: JSON.stringify({Username, fUsername}),
        contentType: 'application/json',
        success: function(res){
            location.replace("/private/")
        }
    })

}