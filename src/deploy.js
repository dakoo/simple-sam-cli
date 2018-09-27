const spawn = require('./utils/spawn').default;

const outputFile = 'serverless-output.yaml';

const samPackage = async (bucket) => {
    await spawn(`sam package --template-file merged-cfn.yml --output-template-file ${outputFile} --s3-bucket ${bucket}`);
};

const samDeploy = async (stackName, parameters, tags) => {
    let command = `sam deploy --template-file ${outputFile} --stack-name ${stackName} --capabilities CAPABILITY_IAM`;
    if (parameters) {
        command = command + ' --parameter-overrides ' + parameters;
    }
    if (tags) {
        command = command + ' --tags ' + tags;
    }
    await spawn(command);
};

exports.default = async (bucket, stackName) => {
    process.chdir('./build');
    await samPackage(bucket);
    await samDeploy(stackName);
    process.chdir('../');
};
