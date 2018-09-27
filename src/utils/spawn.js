const execa = require('execa');

exports.default = (cmd) => {
    const [file, ...args] = cmd.split(/\s+/);
    return execa(file, args, {stdio: 'inherit'});
};
