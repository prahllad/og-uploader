let multer = require('multer');
let path = require('path');
let fs = require('fs');
let directoryClass = require('../helper/directory');
let extensionCheck = require('../services/checkExtension');
let directoryFun = new directoryClass('', '');
let hashFun = require('../services/hashFunction');
let urlUpload = require('../services/uploadFromUrl');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('In destination...');
        let ext = path.extname(file.originalname);
        ext = ext.toLowerCase();
        console.log('Extension: ', ext);
        let val = extensionCheck(ext);
        if (val == 1) {
            fileUrl = directoryFun.folderName + '/images/';
            console.log('File Url: ', fileUrl);
            console.log('Image Upload Path: ', path.resolve(__dirname, directoryFun.directoryPath + '/' + directoryFun.folderName + '/images/'))
            fileType = ext;
            cb(null, path.resolve(__dirname, directoryFun.directoryPath + '/' + directoryFun.folderName + '/images/'));
        } else {
            fileUrl = directoryFun.folderName + '/documents/';
            console.log('File Url: ', fileUrl);
            fileType = ext;
            console.log('Document Upload Path: ', path.resolve(__dirname, directoryFun.directoryPath + '/' + directoryFun.folderName + '/documents/'))
            cb(null, path.resolve(__dirname, directoryFun.directoryPath + '/' + directoryFun.folderName + '/documents/'));
        }
    },
    filename: (req, file, cb) => {
        actualName = file.originalname;
        fileSize = file.size;
        console.log('Filname: ', actualName);
        console.log('fileSize: ', fileSize);
        cb(null, actualName);
    }
});

var uploadFile = multer({
    storage: storage,
}).any();

module.exports = {
    uploadFile: (req, res, next) => {
        console.log('In Upload Router');
        let date = new Date();
        directoryFun.folderName = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString();
        console.log('Folder Name: ', directoryFun.folderName);
        directoryFun.directoryPath = path.resolve(__dirname, '../public/uploads');
        console.log('directoryPath: ', directoryFun.directoryPath);
        directoryFun.createDirectory();
        console.log('Data: ', req.body.link);
        if (req.body.link) {
            let url = req.body.link;
            let linkFileName = urlUpload.findName(url);
            console.log('Now File Name From Url: ', linkFileName);
            urlUpload.fileUpload(url, linkFileName, directoryFun.folderName, directoryFun.directoryPath)
                .then(data => res.status(200).send({ 'status': 1, 'data': data }))
                .catch(err => {
                    console.log('Internal Error: ', err);
                    if (err.statusCode == 404) res.status(404).send({ 'status': 1, 'err': 'Link is Invalid' })
                    else res.status(200).send('Internal Error')
                })
        } else {
            uploadFile(req, req.body.file, function(err, data) {
                if (err) {
                    console.log('Error due to upload', err);
                    res.send(err);
                } else {
                    let data = {
                        'fileName': actualName,
                        'fileType': fileType,
                        'fileSize': fileSize,
                    };
                    console.log('Successfully Uploaded: ', data);
                    res.status(200).send({
                        'status': 1,
                        'data': data
                    })
                }
            });
        }
    }
}