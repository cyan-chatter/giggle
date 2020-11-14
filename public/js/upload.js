$(document).ready(function(){
    
    var uploadButton = $('.upload-btn');
    var fileUpload = $('#upload-input');
    
    uploadButton.on('click', function(){ 
         fileUpload.click();
     });
    
      fileUpload.on('change', function(){
        console.log('reaching inside')
        if(fileUpload.val() != ''){
            var formData = new FormData();
            formData.append('upload', fileUpload[0].files[0]);
            console.log(fileUpload[0].files[0])
            console.log('FormData:')
            console.log(formData)
            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    fileUpload.val('');
                }
            });
        }
    });
});
