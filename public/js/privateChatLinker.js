import {directLinker} from './directLinker.js'
$(function(){
    localStorage.setItem("messageMainData",null);
    function privateChatLinker(e){ 
        e.preventDefault()
        console.log(e);   
        const fUsername = e.target.parentNode.childNodes[3].textContent
        const userDOM = document.querySelector('#myUsername')
        const Username = userDOM.innerHTML
        var message = document.getElementById('punyJudge')
        directLinker(fUsername,Username,message)
    };
    document.querySelector("#directChatBtn").addEventListener('click',privateChatLinker)
});