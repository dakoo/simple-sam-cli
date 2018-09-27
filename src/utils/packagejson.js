const fs = require('fs-extra');
const stringify = require('json-stringify-safe');

module.exports = {
    read: () => {
        const path = `${process.cwd()}/package.json`;
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    },
    write: (jsonObject) => {
        const path = `${process.cwd()}/package.json`;
        fs.writeFileSync(path, stringify(jsonObject, null, 4));
    }
};
