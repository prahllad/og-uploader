require('./env');
require('./AWS/bucketOps');
var Promise=require('bluebird');

var express= require('express');
var morgan = require('morgan');
var hostname = 'localhost';
var port = 3000;
var app = express();
var path=require('path');
var bodyParser=require('body-parser');
var fs=require('fs');
var multiparty=require('connect-multiparty'),
    multipartyMiddleware=multiparty();
var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY
});
var s3 = new AWS.S3();
var s3Async=Promise.promisifyAll(s3);
var compresser=require('./services/compresser');
var linkLoader=require('./services/linkLoader');
var co=require('co');
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post('/',multipartyMiddleware,(req,res,next)=>{
        
        var file={};
        console.log(req.body.link);
        var quality=req.body.quality;
        co(function *(){
            var obj=yield linkLoader(req.body.link);
            (obj.path=='none')?file=req.files.image:file=obj;
            console.log(file);
            var filepath=yield compresser(file.path,'uploads/',quality);
            console.log(filepath);
            var stream = fs.createReadStream(filepath);
            var params = {Bucket: process.env.BUCKET_NAME,Key:path.basename(filepath),Body:stream,ACL:"public-read",'Cache-Control':"max-age=1296000"};
            var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
            var result =yield s3Async.uploadAsync(params,options);
            var Blob=result;
            Blob.name=file.originalFilename;
            fs.unlinkSync(filepath,(err)=>{
                if(err)
                    console.log("Error while unlinking file");
            });
            return Blob;
        }).then((Blob)=>{
                res.status(200).send({InkBlob:Blob,status:1});
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send({error:"Error while uploading make sure you are passing required attributes",status:0});
        })       
});
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.listen(port,hostname,function(){
	console.log(`Server : http://${hostname}:${port}/`);
});
