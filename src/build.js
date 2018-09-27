#!/usr/bin/env node

const _ = require('lodash');
const fs = require('fs-extra');
const logger = require('./utils/colorLogger');
const merge = require('cloudformation-yml-merger').default;
const packagejson = require('./utils/packagejson');
const spawn = require('./utils/spawn').default;

const createDir = (dir) => {
    logger.info(`creating ${dir}...`);
    fs.mkdirSync(dir);
};

const deleteDir = (dir) => {
    logger.info(`deleting ${dir}...`);
    fs.removeSync(dir);
};

const moveDir = (source, target) => {
    logger.info(`moving ${source} to ${target}...`);
    fs.moveSync(source, target);
};

const copyFile = (source, target) => {
    logger.info(`copying ${source} to ${target}...`);
    fs.copySync(source, target);
};

const updatePackageJsonForDeployment = (templateFolderName) => {
    logger.info('updating package.json...');
    const jsonObject = packagejson.read();
    //get rid of node modules for test
    if (_.get(jsonObject, 'devDependencies')) {
        delete jsonObject.devDependencies;
    }
    //get rid of the aws-sdk which is provided by AWS.
    if (_.get(jsonObject, 'devDependencies[aws-sdk]')) {
        delete jsonObject.dependencies['aws-sdk'];
    }
    packagejson.write(jsonObject);
};

const runNpmInstall = async () => {
    logger.info('installing node modules based on rewritten package.json...');
    await spawn('npm install');
};


const mergeCloudFormation = async (templateFolderPath, mergeFilePath) => {
    logger.info('merging the cloudformation templates...');
    merge(templateFolderPath, mergeFilePath);
};

exports.default = async (templateFolderName) => {
    logger.debug('build...');
    const currentPath = process.cwd();
    deleteDir(currentPath + '/build');
    createDir(currentPath + '/build');
    createDir(currentPath + '/build/backup');
    createDir(currentPath + '/build/src');
    copyFile(currentPath + '/package.json', currentPath + '/build/backup/package.json');
    moveDir(currentPath + '/node_modules', currentPath + '/build/backup/node_modules');
    updatePackageJsonForDeployment(templateFolderName);
    await runNpmInstall();
    moveDir(currentPath + '/node_modules', currentPath + '/build/node_modules');
    copyFile(currentPath + '/build/backup/package.json', currentPath + '/package.json');
    moveDir(currentPath + '/build/backup/node_modules', currentPath + '/node_modules');
    deleteDir(currentPath + '/build/backup');
    await mergeCloudFormation(currentPath + '/' + templateFolderName, currentPath + '/build/merged-cfn.yml');
};
