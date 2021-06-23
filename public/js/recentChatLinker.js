import {directLinker} from './directLinker.js'
$(function(){
    localStorage.setItem("messageMainData",null);
    function recentChatLinker(e){ 
        e.preventDefault()
        console.log(e)
        console.log(e.path[0].innerText)
        const fUsername = e.path[0].innerText
        const userDOM = document.querySelector('#myUsername')
        const Username = userDOM.innerHTML
        console.log(fUsername,Username)
        directLinker(fUsername,Username,null)
    };
    document.querySelectorAll(".recentChatBlock").forEach(item => {
        item.addEventListener('click',recentChatLinker)
    }) 
});