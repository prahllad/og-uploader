module.exports = (ext) => {
    console.log('In Check Extension Function...');
    if (ext == ".jpg" || ext == '.png' || ext == '.jpeg' || ext == '.jifi' || ext == ".exif" || ext == '.tiff' || ext == '.gif' || ext == 'bmp' ||
        ext == ".bpg" || ext == ".bat" || ext == ".heif" || ext == ".webp" || ext == ".ppm" || ext == ".pgm" || ext == ".pbm" || ext == ".pnm") {
        return 1;
    } else return 2;
}