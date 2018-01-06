const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const awsConfig = require('../config/aws_config.json');

aws.config.region = awsConfig.region;
aws.config.update({
    accessKeyId : awsConfig.accessKeyId,
    secretAccessKey : awsConfig.secretAccessKey
});

const s3Params = {
    Bucket : 'goodgid-s3',
    Key : null,
    ACL : 'public-read',
    Body : null
}
const s3 = new aws.S3({ params : s3Params});
const uploadService = multer({
    storage : multerS3({
        s3 : s3,
        bucket: 'goodgid-s3',
        key : (req, file, cb) => cb(null, Date.now() + '.' + file.originalname.split('.').pop()),
        metadata: (req, file, cb) => cb(null, {fieldName: file.fieldname})
    })
});

function getUploadServiceWithSize(width, height, fileName) {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: 'goodgid-s3',
            key : (req, file, cb) => cb(null, Date.now() + '.' + file.originalname.split('.').pop()),
            metadata: (req, file, cb) => cb(null, {fieldName: file.fieldname}),
            shouldTransform: function (req, file, cb) {
                cb(null, /^image/i.test(file.mimetype))
            },
            transforms: [{
                id: 'resize',
                key: function (req, file, cb) {
                    cb(null, Date.now() + '_' + fileName)
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(width, height).png());
                }
            }]
        })
    })
}

module.exports.upload = uploadService
module.exports.uploadServiceWithResize = getUploadServiceWithSize