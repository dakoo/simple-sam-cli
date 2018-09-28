const logger = require('./utils/colorLogger');
const spawn = require('./utils/spawn').default;

const outputFile = 'serverless-output.yaml';

const samPackage = async (bucket) => {
    logger.info('making and uploading the package...');
    const command = `sam package --template-file merged-cfn.yml --output-template-file ${outputFile} --s3-bucket ${bucket}`;
    logger.debug(command);
    await spawn(command);
};

const samDeploy = async (stackName, parameters, tags) => {
    logger.info(`creating the ${stackName}...`);
    let command = `sam deploy --template-file ${outputFile} --stack-name ${stackName} --capabilities CAPABILITY_IAM`;
    if (parameters) {
        command = command + ' ' + parameters;
    }
    if (tags) {
        command = command + ' ' + tags;
    }
    logger.debug(command);
    await spawn(command);
};

exports.default = async (bucket, stackName, parameters, tags) => {
    process.chdir('./build');
    await samPackage(bucket);
    await samDeploy(stackName, parameters, tags);
    process.chdir('../');
};
