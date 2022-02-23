const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'billboard-dispatch',
  streams: [
    {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      stream: process.stdout,
    },
    {
      level: 'info',
      path: 'billboard-dispatch-logbook.log',
    },
  ],
});

module.exports = logger;
