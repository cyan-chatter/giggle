$(document).ready(function(){
    
    $('.upload-btn').on('click', function(){ 
        $('#upload-input').click();
     });
    
    $('#upload-input').on('change', function(){
        console.log('reaching inside')
        var uploadInput = $('#upload-input');
        
        if(uploadInput.val() != ''){
            var formData = new FormData();
            formData.append('upload', uploadInput[0].files[0]);
            console.log(uploadInput[0].files[0])
            console.log('FormData:')
            console.log(formData)
            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    uploadInput.val('');
                }
            });
        }
    });
});
