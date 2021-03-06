/**
 * 2021-02
 * 用于替换recruitment.js
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/job',
});

module.exports = router;

router.put('/statistic', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const option = ctx.request.query.option || '';
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
    const response = await gfetch({ option, data: ctx.request.body });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.put('/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const option = ctx.request.query.option || '';
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.update(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    await gfetch({
      option,
      data: {
        ...ctx.request.body,
        id: ctx.params.id,
      },
    });
    ctx.response.status = 200;
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});
