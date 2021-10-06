/**
 * 2021-03
 * 用于替换bannder.js recommend.js, topic.js, campus.js 等
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/bulletin',
});

module.exports = router;

router.put('/notification/statistic', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const gclient = new stub.Notification(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.statistic(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const option = ctx.request.query.option || '';
    const response = await gfetch({ option, data: ctx.request.body });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});
