var express = require('express');
const app=express();
const fileupload = require('express-fileupload')
app.use(fileupload({
    createParentPath: true
}))
class USERDATABASE 
{
    async getphoto(data){
        let avatar = data.files.avatar
        avatar.mv('./UserCRUDData/' + avatar.name);
        return {
              status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            }
    }
}

module.exports=USERDATABASE


//https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/
//https://www.twilio.com/blog/handle-file-uploads-node-express
//https://www.bezkoder.com/node-js-express-file-upload/
//https://attacomsian.com/blog/uploading-files-nodejs-express














