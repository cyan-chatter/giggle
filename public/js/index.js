function ready(callback){
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });

}

const execute = (linker,actionpath) => {
    console.log(linker)
    linker.onclick = () => {
        location.replace(actionpath)
    }
}

ready(function(){
    let loginlink = document.querySelector('#login-btn-link')
    let registerlink = document.querySelector('#register-btn-link')

    if(loginlink !== null) execute(loginlink,'/')
    if(registerlink !== null) execute(registerlink,'/signup') 
    
});

