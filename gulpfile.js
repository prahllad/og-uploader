
const imageminJpegoptim = require('imagemin-jpegoptim');
 const imageminMozjpeg = require('imagemin-mozjpeg');
 const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
var gulp=require('gulp'),
    imagemin=require('gulp-imagemin');
gulp.task('image',function(){
    return gulp.src('images/*')
    .pipe(imagemin({
        optimizationLevel:7,
        use:[
           imageminJpegoptim(),
            imageminPngquant({quality: '65-80'})
        ],
    }))
    .pipe(gulp.dest('images/'))
})
gulp.task('watch',function(){
    console.log("jsj");
    gulp.watch('images/**',['image']);
})