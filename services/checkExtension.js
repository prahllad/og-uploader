module.exports = (ext) => {
    let extensionArray = [".jpg", '.png', '.jpeg', '.jifi', ".exif", '.tiff', '.gif', '.bmp', 'jpe', ".bpg", ".bat", ".heif", ".webp", ".ppm", ".pgm", ".pbm", ".pnm"];
    console.log('In Check Extension Function...');
    if (extensionArray.indexOf(ext) == -1) {
        return 2;
    } else return 1;
}