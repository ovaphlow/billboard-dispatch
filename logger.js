const { Console } = require('console');

module.exports = new Console({
  // eslint-disable-next-line
  stdout: process.stdout,
  // eslint-disable-next-line
  stderr: process.stderr,
});
