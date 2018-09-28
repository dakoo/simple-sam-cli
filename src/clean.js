const logger = require('./utils/colorLogger');
const fs = require('fs-extra');

const clean = async () => {
    logger.debug('Cleaning the build folder...');
    fs.removeSync('./build');
};

exports.default = async () => {
    await clean();
};
