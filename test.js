var compresser=require('./compresser');
var result=compresser('images/IMG_0418.jpg','images');
console.log(result);
result.then((file)=>{
    console.log('file'+file);
})