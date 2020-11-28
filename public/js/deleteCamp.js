function deleteCamp(e){
    console.log(e.parentNode.childNodes[1].innerHTML);
    const campToDelName = e.parentNode.childNodes[1].innerHTML
    $.ajax({
        url: '/mycamps/delete',
        type: "POST",
        data: JSON.stringify({campToDelName}),
        contentType: 'application/json',
        success: function(res){
            location.replace('/mycamps')
            console.log('Camp Deleted');
        }
    })
}

