let express = require('express');
let router = express.Router();
let fs = require('fs');
let bodyparser = require('body-parser');
let uploadController = require('../controller/uploadroute');
let fetchFile = require('../controller/fetchFile');

router.use(bodyparser());

router.post('/', uploadController.uploadFile)
router.get('/:link', fetchFile.fetchFile)
router.get('/', (req, res) => res.send('Not Valid Url'))

module.exports = router;