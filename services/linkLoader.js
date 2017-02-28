var path=require('path');
var request=require('request');
var fs=require('fs');
var base64 = require('base-64');
var utf8 = require('utf8');
module.exports=function(link){
    return new Promise((resolve,reject)=>{
            if(link){
                console.log("In Link statement");
                var filename=path.parse(link);
                let timeStamp=new Date();
                var bytes = utf8.encode(filename.name+timeStamp.getTime().toString());
                var encoded = base64.encode(bytes);
                let writer;
                request(link)
                .pipe(writer=fs.createWriteStream('uploads/'+encoded+filename.ext));
                writer.on("finish",()=>{
                    resolve({path:'uploads/'+encoded+filename.ext,originalFilename:filename.name+filename.ext})
                });
                
            }
            else{
                console.log("Without Link");
                resolve({path:'none'});
            }
    })
}