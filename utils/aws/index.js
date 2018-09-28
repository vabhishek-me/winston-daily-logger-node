const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('../../config/index');
const logger = require('../logger/index');

const s3 = new AWS.S3({
  accessKeyId: config.aws.AWS_ACCESS_KEY,
  secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY
});

const s3Upload = (objectDetails, callback) => {
  const params = {
    Bucket: objectDetails.Bucket,
    Key: objectDetails.Key,
    Body: objectDetails.Body,
    ACL: 'private',
  };

  s3.putObject(params, (err, data) => {
    if(err) {
      logger.error("s3.putObject S3 File upload error", params);
      callback(false);
    } else {
      callback(true);
    }
  });
};

module.exports = {
  s3: {
    upload: s3Upload,
  }
}