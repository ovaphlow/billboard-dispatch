/**
 * 2021-03
 * 用于替换banner.js recommend.js, topic.js, campus.js 等
 */
const Router = require('@koa/router');
const grpc = require('grpc');
const dayjs = require('dayjs');

const logger = require('./logger');
const repos = require('./bulletin-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/bulletin/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {
    date: dayjs().format('YYYY-MM-DD'),
  });
});

router.get('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.get(ctx.request.query.option || '', {
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.put('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.update(ctx.request.query.option || '', {
    ...ctx.request.body,
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.delete('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.remove(ctx.request.query.option || '', {
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.get('/bulletin', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    title: ctx.request.query.title || '',
    date: ctx.request.query.date || '',
    category: ctx.request.query.category || '',
    status: ctx.request.query.status || '',
    id_list: ctx.request.query.id_list || '0',
  });
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
