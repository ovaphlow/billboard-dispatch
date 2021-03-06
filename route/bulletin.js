/**
 * 2021-03
 * 用于替换recommend.js, topic.js, campus.js 等
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const config = require('../config');
const logger = require('../logger');
const stub = require('../proto/bulletin_stub');

const gclientNotification = new stub.Notification(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const router = new Router({
  prefix: '/api/bulletin',
});

module.exports = router;

router.put('/notification/statistic', async (ctx) => {
  try {
    const option = ctx.request.query.option || '';
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclientNotification.statistic(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const response = await gfetch({ option, data: ctx.request.body });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});
