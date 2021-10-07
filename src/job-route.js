/**
 * 2021-02
 * 用于替换recruitment.js
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');
const repos = require('./job-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/biz/job/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {});
});

router.get('/biz/job', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    id: parseInt(ctx.request.query.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
    list: ctx.request.query.list || '0',
  });
});

router.put('/job/statistic', async (ctx) => {
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

router.put('/job/:id', async (ctx) => {
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

module.exports = router;
