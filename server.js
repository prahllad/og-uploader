var path=require('path');
var bodyParser=require('body-parser');
var fs=require('fs');
var multiparty=require('connect-multiparty'),
    multipartyMiddleware=multiparty();
var AWS = require('aws-sdk');
var accessKeyId = 'AKIAIDNK5HHJQK352MMA' 
var secretAccessKey = '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';
AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});
var s3 = new AWS.S3();
var compresser=require('./helper/compresser');
var linkLoader=require('./helper/linkLoader');
var express= require('express');
var morgan = require('morgan');
var hostname = 'localhost';
var port = 3000;
var app = express();
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post('/',multipartyMiddleware,(req,res,next)=>{
        var file={};
        var quality=req.body.quality;
        var linkLoaderResult=linkLoader(req.body.link);
        linkLoaderResult.then((obj)=>{
            if(obj=='none'){
                console.log(req.files.image,req.body.quality,req.files);
                 file=req.files.image;
                 
            }
            else{
                file=obj;
            }
            var compressResult=compresser(file.path,'uploads/',quality);
                compressResult.then((filepath)=>{
                    console.log(path.basename(filepath));
                    var stream = fs.createReadStream(filepath);
                        var params = {Bucket: 'uploaddata123',Key:path.basename(filepath),Body:stream,ACL:"public-read",'Cache-Control':"max-age=1296000"};
                        var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
                        s3.upload(params,options,(err, data)=>{
                            console.log('error:'+err+"   data:",data);
                            if(!err){
                                fs.unlink(filepath,(err)=>{
                                    let blob=data;
                                    blob.filename=file.name;
                                     res.status(200).send({InkBlob:blob,status:1});
                                });
                            }
                            else{
                                res.status(500).send("Unable to upload the file..");
                            }
                        })
                }).catch((err)=>{
                     res.status(500).send('Internal Server :Unable to Compress the image');
                })

        })
        
});
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.listen(port,hostname,function(){
	console.log(`Server : http://${hostname}:${port}/`);
});
