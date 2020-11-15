const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
    accessKeyId : process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
})


const s3New = new aws.S3({})
const config_with_multer_Upload_AWS = multer({
    storage: multerS3({
        s3: s3New,
        bucket: process.env.BUCKET,
        acl: 'public-read', //access control list
        metadata: function(req,file,cb){   
            cb(null, {fieldName: file.fieldName})
        },
        key: function(req,file,cb){
            console.log(file.originalname)
            cb(null,Date.now().toString());
        },
        contentType: multerS3.AUTO_CONTENT_TYPE
        //contentDisposition: form-data; name="fieldName"
        // rename(fieldName, fileName){
        //     return fileName.replace(/\W+/g, '-')
        // }      
    })
})

module.exports = config_with_multer_Upload_AWS