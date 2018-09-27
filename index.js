#!/usr/bin/env node

const _ = require('lodash');
const build = require('./src/build').default;
const clean = require('./src/clean').default;
const logger = require('./src/utils/colorLogger');
const packagejson = require('./src/utils/packagejson');
const prepare = require('./src/prepare').default;
const deploy = require('./src/deploy').default;

const help = () => {
    logger.info('');
    logger.info('Examples:');
    logger.info('');
    logger.info('    $ simple-sam-cli prepare -b <bucket-name> -r <s3-region>');
    logger.info('    $ simple-sam-cli build -f <cloudformation-folder>');
    logger.info('    $ simple-sam-cli deploy -b <bucket-name> -s <cloud-foramtion-stack-name>');
    logger.info('    $ simple-sam-cli clean');
    logger.info('    $ simple-sam-cli all -b <bucket-name> -r <s3-region> -f <cloudformation-folder> -s <cloud-formation-stack-name>');
    logger.info('Once you provide the parameters, the package.json contains the values and you don\'t have to provide them again');
    logger.info('');
};

const getParameter = (argv, flag) => {
    const index = argv.findIndex(word => word === flag);
    if (index < 0) {
        return undefined;
    }
    return argv[index + 1];
};

const run = async () => {
    const argv = process.argv.concat([]);
    argv.shift();
    argv.shift();
    const command = argv.shift();
    const jsonObject = packagejson.read();
    switch (command) {
        case 'prepare': {
            let bucket = getParameter(argv, '-b');
            let region = getParameter(argv, '-r');
            if (!bucket) {
                bucket = _.get(jsonObject, 'simple-sam-cli.bucket');
            } else {
                _.set(jsonObject, 'simple-sam-cli.bucket', bucket);
            }
            if (!region) {
                region = _.get(jsonObject, 'simple-sam-cli.region');
            } else {
                _.set(jsonObject, 'simple-sam-cli.region', region);
            }
            if (!bucket || !region) {
                help();
                process.exit(1);
            } else {
                packagejson.write(jsonObject);
            }
            await prepare(bucket, region);
            break;
        }
        case 'build': {
            let folder = getParameter(argv, '-f');
            if (!folder) {
                folder = _.get(jsonObject, 'simple-sam-cli.cloudformation-template-folder');
            } else {
                _.set(jsonObject, 'simple-sam-cli.cloudformation-template-folder', folder);
            }
            if (!folder) {
                help();
                process.exit(1);
            } else {
                packagejson.write(jsonObject);
            }
            await build(folder);
            break;
        }
        case 'deploy': {
            let bucket = getParameter(argv, '-b');
            let stackName = getParameter(argv, '-s');
            if (!bucket) {
                bucket = _.get(jsonObject, 'simple-sam-cli.bucket');
            } else {
                _.set(jsonObject, 'simple-sam-cli.bucket', bucket);
            }
            if (!stackName) {
                stackName = _.get(jsonObject, 'simple-sam-cli.stack');
            } else {
                _.set(jsonObject, 'simple-sam-cli.stack', stackName);
            }
            if (!stackName) {
                stackName = _.get(jsonObject, 'name');
                _.set(jsonObject, 'simple-sam-cli.stack', stackName);
            }
            if (!bucket || !stackName) {
                help();
                process.exit(1);
            } else {
                packagejson.write(jsonObject);
            }
            await deploy(bucket, stackName);
            break;
        }
        case 'clean': {
            await clean();
            break;
        }
        case 'all': {
            let bucket = getParameter(argv, '-b');
            let region = getParameter(argv, '-r');
            let folder = getParameter(argv, '-f');
            let stackName = getParameter(argv, '-s');
            if (!bucket) {
                bucket = _.get(jsonObject, 'simple-sam-cli.bucket');
            } else {
                _.set(jsonObject, 'simple-sam-cli.bucket', bucket);
            }
            if (!region) {
                region = _.get(jsonObject, 'simple-sam-cli.region');
            } else {
                _.set(jsonObject, 'simple-sam-cli.region', region);
            }
            if (!folder) {
                folder = _.get(jsonObject, 'simple-sam-cli.cloudformation-template-folder');
            } else {
                _.set(jsonObject, 'simple-sam-cli.cloudformation-template-folder', folder);
            }
            if (!stackName) {
                stackName = _.get(jsonObject, 'simple-sam-cli.stack');
            } else {
                _.set(jsonObject, 'simple-sam-cli.stack', stackName);
            }
            if (!stackName) {
                stackName = _.get(jsonObject, 'name');
                _.set(jsonObject, 'simple-sam-cli.stack', stackName);
            }
            if (!bucket || !region || !folder || !stackName) {
                help();
                process.exit(1);
            } else {
                packagejson.write(jsonObject);
            }
            await prepare(bucket, region);
            await build(folder);
            await deploy(bucket, stackName);
            await clean();
            break;
        }
        default: {
            help();
            process.exit(1);
        }
    }
};

run();
