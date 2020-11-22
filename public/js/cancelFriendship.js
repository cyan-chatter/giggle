function cancelFriendshipBtnWork (e){
    const messageN = document.querySelector(".messageN")
    e.parentNode.style.display = 'none'
    const friendUsername = e.parentNode.childNodes[3].innerHTML
    console.log(e.parentNode.childNodes)
    $.ajax({
        url: '/friends/remove',
        type: "POST",
        data: JSON.stringify(friendUsername),
        contentType: 'application/json',
        success: function(res){
            const s = JSON.stringify(res)
            const d = JSON.parse(s)            
            setTimeout(function(){ alert(d.str); }, 3000);
        }
    })
}