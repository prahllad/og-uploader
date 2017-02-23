let got = require('got');
let fs = require('fs');
let path = require('path');
let hashFun = require('./hashFunction');
let extCheckingFun = require('./checkExtension');

module.exports = {
    findName: (link) => {
        console.log('Link is: ', link);
        link = link.split('/');
        console.log('File Name: ', link[link.length - 1]);
        return link[link.length - 1];
    },

    fileUpload: (link, fileName, folderName, directoryPath) => {
        console.log('In URL Upload function');
        return new Promise((resolve, reject) => {
            let ext = path.extname(fileName);
            got(link).then(response => {
                    console.log('This Link Valid');
                    if (extCheckingFun(ext)) {
                        let uploadPath = path.resolve(__dirname, directoryPath + '/' + folderName + '/images/');
                        uploadPath = uploadPath + '/' + fileName;
                        got.stream(link).pipe(fs.createWriteStream(uploadPath));
                        resolve({
                            'fileName': fileName,
                            'fileType': ext,
                        });
                    } else {
                        hashText = folderName + '/documents/' + ':' + (new Date().getTime()).toString() + ':' + fileName;
                        let uploadPath = path.resolve(__dirname, directoryPath + '/' + folderName + '/documents/');
                        uploadPath = uploadPath + '/' + fileName;
                        got.stream(link).pipe(fs.createWriteStream(uploadPath));
                        resolve({
                            'fileName': fileName,
                            'fileType': ext,
                        });
                    }
                })
                .catch(err => reject(err))
        })
    }
}