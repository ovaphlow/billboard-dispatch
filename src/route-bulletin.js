/**
 * 2021-03
 * 用于替换banner.js recommend.js, topic.js, campus.js 等
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');
const repos = require('./repos-bulletin');

const router = new Router({
  prefix: '/api',
});

router.get('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.get({
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.put('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.update({
    ...ctx.request.body,
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.delete('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.remove({
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.get('/bulletin', async (ctx) => {
  let option = ctx.request.query.option || '';
  ctx.response.body = await repos.filter(option);
});

router.post('/bulletin', async (ctx) => {
  let option = ctx.request.query.option || '';
  ctx.response.body = await repos.save(option, ctx.request.body);
});

router.put('/bulletin/notification/statistic', async (ctx) => {
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

router.get('/bulletin/notification', async (ctx) => {
  ctx.response.body = [];
});

module.exports = router;
