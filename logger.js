const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'sentinel',
  streams: [
    {
      level: 'info',
      stream: process.stdout, // eslint-disable-line
    },
    {
      level: 'error',
      path: 'billboard-error.log',
    },
  ],
});

module.exports = logger;

// const { Console } = require('console');

// module.exports = new Console({
//   // eslint-disable-next-line
//   stdout: process.stdout,
//   // eslint-disable-next-line
//   stderr: process.stderr,
// });
