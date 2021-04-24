localStorage.setItem("messageMainData",null)

function privateChatLinkage(e){
    
    const fUsername = e.parentNode.childNodes[3].textContent
    const userDOM = document.querySelector('#myUsername')
    const Username = userDOM.innerHTML
    var message = document.getElementById('punyJudge')

    $.ajax({
        url: '/private',
        type: "POST",
        data: JSON.stringify({Username, fUsername}),
        contentType: 'application/json',
        success: function(res){
            var x = JSON.stringify(res)
            x = JSON.parse(x)
            console.log('res: ' + x)
            if(x == "NO"){
                message.innerText =  'Can\'t Chat as The friendship has been removed recently. Please Refresh the Page to see changes'
            }else{
                fetch("/private")
                .then((resStream)=>{
                    return resStream.json()
                })
                .then((data)=>{
                    localStorage.setItem("messageMainData",JSON.stringify(data))
                    location.replace(data.action)
                })
            }
        }
    })
}

