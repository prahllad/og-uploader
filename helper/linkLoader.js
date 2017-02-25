var path=require('path');
var request=require('request');
var fs=require('fs');
module.exports=function(link){
    return new Promise((resolve,reject)=>{
            if(link){
                var filename=path.parse(link);
                var base64 = require('base-64');
                var utf8 = require('utf8');
                var bytes = utf8.encode(filename.name);
                var encoded = base64.encode(bytes);
                let writer;
                request(link)
                .pipe(writer=fs.createWriteStream('uploads/'+encoded+filename.ext));
                writer.on("finish",()=>{
                    resolve({path:'uploads/'+encoded+filename.ext,name:filename.name+filename.ext})
                });
                
            }
            else{
                resolve('none');
            }
    })
}