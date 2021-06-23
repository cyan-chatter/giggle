import {directLinker} from './directLinker.js'
$(function(){
    localStorage.setItem("messageMainData",null);
    function directChatLinker(e){ 
        e.preventDefault()
        console.log(e);   
        const fUsername = e.target.innerHTML
        const userDOM = document.querySelector('#myUsername')
        const Username = userDOM.innerHTML
        directLinker(fUsername,Username,null)
    };
    document.querySelector(".directChatLinkerBtn").addEventListener('click',directChatLinker)
});
