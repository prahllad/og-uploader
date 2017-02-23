let fs = require('fs');
let path = require('path');

module.exports = (filePath) => {
    let newPath = path.resolve(__dirname, filePath);
    console.log('New Path is: ', newPath);
    if (fs.existsSync(newPath)) return 1
    else return 0
}