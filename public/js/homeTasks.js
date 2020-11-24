function addToMyCamps(e){
console.log('this ran')
var message = document.querySelector('#message')
e.style.display = "none"
const campNameDOM = e.parentNode.childNodes[1]
const campName = campNameDOM.innerHTML

    $.ajax({
        url: "/home/addToMyCamps",
        type: "POST",
        data: JSON.stringify({campName}),
        contentType: 'application/json',
        success: function(res){
            const x = JSON.stringify(res)
            const y = JSON.parse(x)
            message.innerHTML = y.name
        }
    })

    
}