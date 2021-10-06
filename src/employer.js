const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/employer',
});

module.exports = router;

router.put('/statistic', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
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
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

router.put('/filter', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.filter(body, (err, response) => {
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
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

router.put('/filter-user', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.filterUser(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const option = ctx.request.query.option || '';
    const response = await gfetch({
      option,
      data: ctx.request.body,
    });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});
