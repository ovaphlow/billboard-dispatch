/**
 * 2021-01
 * send-in: 原投递简历(delivery)
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');
const repos = require('./send_in-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/biz/send-in/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {});
});

router.get('/biz/send-in', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    id: parseInt(ctx.request.query.job_id || 0, 10),
    date: ctx.request.query.date || '',
    date2: ctx.request.query.date2 || '',
    list: ctx.request.query.list || '0',
  });
});

router.put('/send-in/statistic', async (ctx) => {
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
    logger.error(err);
    ctx.response.status = 500;
  }
});

module.exports = router;
