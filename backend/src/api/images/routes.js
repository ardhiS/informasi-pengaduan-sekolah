const { uploadImageHandler, getImageHandler } = require('./handler');

module.exports = [
    {
        method: 'POST',
        path: '/upload',
        options: {
        payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            allow: 'multipart/form-data',
            maxBytes: 1024 * 1024 * 5, // 5MB
        },
        handler: uploadImageHandler
        }
    },
    {
        method: 'GET',
        path: '/images/{filename}',
        handler: getImageHandler
    }
];
