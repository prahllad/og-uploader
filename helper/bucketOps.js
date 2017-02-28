require('../env');
var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY
});
var s3 = new AWS.S3();
s3.listBuckets(function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else  {
        console.log(data.Buckets); 
        console.log(data.Buckets.findIndex(fun));
        if(data.Buckets.findIndex(fun)==-1){
           var params = {
                Bucket: process.env.BUCKET_NAME, /* required */
                ACL: 'public-read',
            };
            s3.createBucket(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            }); 
        }
  }             // successful response
});
function fun(ele,index,array){
    return ele.Name==process.env.BUCKET_NAME;
    
}
