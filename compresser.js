
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
 
function compresser(src,dest){
    return new Promise((resolve,reject)=>{
        imagemin([src], dest, {
            plugins: [
                imageminMozjpeg(),
                imageminPngquant({quality: '65-80'})
            ]
        }).then(files => {
            files.forEach((file)=>{
                
                resolve(file.path);
            })
        }).catch((err)=>{
            reject(err);
        });
    });
    
}
module.exports=compresser;