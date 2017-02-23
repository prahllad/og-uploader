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
                        hashText = folderName + '/images/' + ':' + (new Date().getTime()).toString() + ':' + fileName;
                        console.log('hashText: ', hashText);
                        hashName = hashFun.encodingFun(hashText);
                        console.log('HashCode: ', hashName);
                        let uploadPath = path.resolve(__dirname, directoryPath + '/' + folderName + '/images/');
                        hashName = hashName + ext;
                        uploadPath = uploadPath + '/' + hashName;
                        got.stream(link).pipe(fs.createWriteStream(uploadPath));
                        resolve({
                            'fileName': hashName,
                            'fileType': ext,
                            'actualFileName': fileName
                        });
                    } else {
                        hashText = folderName + '/documents/' + ':' + (new Date().getTime()).toString() + ':' + fileName;
                        console.log('hashText: ', hashText);
                        hashName = hashFun.encodingFun(hashText);
                        console.log('HashCode: ', hashName);
                        let uploadPath = path.resolve(__dirname, directoryPath + '/' + folderName + '/documents/');
                        hashName = hashName + ext;
                        uploadPath = uploadPath + '/' + hashName;
                        got.stream(link).pipe(fs.createWriteStream(uploadPath + hashName));
                        resolve({
                            'fileName': hashName,
                            'fileType': ext,
                            'actualFileName': fileName
                        });
                    }
                })
                .catch(err => reject(err))
        })
    }
}