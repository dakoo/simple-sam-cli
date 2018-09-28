const AWS = require('aws-sdk');
const logger = require('./utils/colorLogger');
const spawn = require('./utils/spawn').default;
const s3 = new AWS.S3();

const checkBucket = async (bucket) => {
    const params = {
        Bucket: bucket
    };
    try {
        await s3.headBucket(params).promise();
        logger.debug(`the S3 bucket ${bucket} exists.`);
        return true;
    } catch (err) {
        logger.debug(`the S3 bucket ${bucket} doesn't exist.`);
        return false;
    }
};

const createBucket = async (bucket, region) => {
    logger.debug('creating bucket...');
    const command = `aws s3api create-bucket --bucket ${bucket} --region ${region}`;
    return spawn(command);
};

exports.default = async (bucket, region) => {
    logger.debug('make an S3 bucket for deployment...');
    try {
        const exists = await checkBucket(bucket);
        if (!exists) {
            await createBucket(bucket, region);
            logger.debug('Succedded to create bucket...');
        }
    } catch (err) {
        throw 'Failed to create bucket:' + err;
    }
};
