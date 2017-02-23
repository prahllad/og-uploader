let base64 = require('base-64');
let utf8 = require('utf8');

module.exports = {
    encodingFun: (fileDetailText) => {
        let bytes = utf8.encode(fileDetailText);
        let encodeText = base64.encode(bytes);
        console.log('Encoded Hash Name: ', encodeText);
        return encodeText;
    },

    decodingFun: (hashName) => {
        let bytes = base64.decode(hashName);
        let decodeText = utf8.decode(bytes);
        console.log('Decode Text: ', decodeText);
        return decodeText;
    }
}