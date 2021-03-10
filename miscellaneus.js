/**
 * 2021-03
 * 用于替换 chart, email, favorite, feedback 等
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/miscellaneus',
});

module.exports = router;

router.put('/feedback/filter', async (ctx) => {
  try {
    const stub = require('./miscellaneus-stub');
    const gclient = new stub.Feedback(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.filter(body, (err, response) => {
          if (err) {
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
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

router.put('/feedback/:id', async (ctx) => {
  try {
    logger.info('wrong');
    const stub = require('./miscellaneus-stub');
    const gclient = new stub.Feedback(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.update(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const option = ctx.request.query.option || '';
    await gfetch({
      option,
      data: {
        ...ctx.request.body,
        id: parseInt(ctx.params.id),
      },
    });
    ctx.response.status = 200;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});
