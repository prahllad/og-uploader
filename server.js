var path=require('path');
var request=require('request');
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
var compresser=require('./compresser');
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
        if(req.body.link){
            console.log(req.body.link);
            var filename=path.basename(req.body.link);
          let writer;
            request(req.body.link)
            .pipe(writer=fs.createWriteStream('uploads/'+filename));
            writer.on("finish",()=>{
                var compressResult=compresser('uploads/'+filename,'uploads/',req.body.quality);
                compressResult.then((filepath)=>{
                    console.log(path.basename(filepath));
                    var stream = fs.createReadStream(filepath);
                        var params = {Bucket: 'uploaddata123',Key:path.basename(filepath),Body:stream,ACL:"public-read",'Cache-Control':"max-age=1296000"};
                        var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
                        s3.upload(params,options,(err, data)=>{
                            console.log('error:'+err+"   data:",data);
                            if(!err){
                                fs.unlink(filepath,(err)=>{
                                    res.status(200).send({InkBlob:data});
                                });
                            }
                            else{
                                res.status(500).send("Unable to upload the file..");
                            }
                        })
                }).catch((err)=>{
                res.status(500).send('Internal Server :Unable to Compress the image');
                })
            });
            
        }
        // console.log(req.files.image,req.body.quality,req.files);
        // var file=req.files.image;
        // var compressResult=compresser(file.path,'images/',req.body.quality);
        // compressResult.then((filepath)=>{
        //     console.log(path.basename(filepath));
        //      var stream = fs.createReadStream(filepath);
        //         var params = {Bucket: 'uploaddata123',Key:path.basename(filepath),Body:stream,ACL:"public-read",'Cache-Control':"max-age=1296000"};
        //         var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
        //         s3.upload(params,options,(err, data)=>{
        //             console.log('error:'+err+"   data:",data);
        //             if(!err){
        //                 fs.unlink(filepath,(err)=>{
        //                     res.status(200).send({InkBlob:data});
        //                 });
        //             }
        //             else{
        //                  res.status(500).send("Unable to upload the file..");
        //             }
        //         })
        // }).catch((err)=>{
        //    res.status(500).send('Internal Server :Unable to Compress the image');
        // })
  
});
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(port,hostname,function(){
	console.log(`Server : http://${hostname}:${port}/`);
});
//  var stream = fs.createReadStream('big4.jpg');
// var result=compresser(stream,'images/');
// console.log(result);
// result.then((file)=>{
//     console.log('file'+file);
//     fs.unlink(file);
// });
      
    // s3.putObject(params, function (perr, pres) {
    //   if (perr) {
    //     console.log("Error uploading data: ", perr);
    //   } else {
    //                 var getParams = {
    //             Bucket: 'uploaddata123', // your bucket name,
    //             Key: file.originalFilename // path to the object you're looking for
    //         }

    //         s3.getObject(getParams, function(err, data) {
    //             // Handle any error and exit
    //             if (err)
    //                 return err;

    //         // No error happened
    //         // Convert Body from a Buffer to a String

    //                  // Use the encoding necessary
    //                 console.log("Received Data:",data);
    //                     s3.getSignedUrl('getObject', getParams, function(err, url){
    //                     console.log('the url of the image is', url);
                        
    //                 res.end("ddhd");
    //                 })
    //         });
    //   }
    // });
