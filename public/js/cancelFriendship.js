function cancelFriendshipBtnWork (e){
    const messageN = document.querySelector('.messageN')
    e.parentNode.style.display = 'none'
    const friendUsername = e.parentNode.childNodes[3].textContent
    const pJ = document.querySelector('#punyJudge') 
    $.ajax({
        url: '/friends/remove',
        type: "POST",
        data: JSON.stringify({friendUsername}),
        contentType: 'application/json',
        success: function(res){
            console.log('res: ' + res)
            const s = JSON.stringify(res)
            console.log('stringified: '+s)
            const d = JSON.parse(s) 
            console.log('parsed: '+d.str);
            if(d.act === 'n'){
                messageN.innerHTML = d.str
            } 
            else if(d.act === 'y'){
                pJ.innerHTML = 'You don\'t have any Friends here anymore. :( Try Sending a Friend Request'
            }
             
        }
    })
}