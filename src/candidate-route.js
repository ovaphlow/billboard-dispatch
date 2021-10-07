const Router = require('@koa/router');
const grpc = require('grpc');
const dayjs = require('dayjs');

const logger = require('./logger');
const repos = require('./candidate-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/biz/candidate/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {
    date: dayjs().format('YYYY-MM-DD'),
  });
});

router.get('/biz/candidate/:id', async (ctx) => {
  ctx.response.body = await repos.get({
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.get('/biz/candidate', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    list: ctx.request.query.list || '0',
    keyword: ctx.request.query.keyword || '',
  });
});

router.put('/candidate/statistic', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Candidate(ctx.grpc_service, grpc.credentials.createInsecure());
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

router.put('/candidate/filter', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Candidate(ctx.grpc_service, grpc.credentials.createInsecure());
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

router.get('/candidate/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Candidate(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.get(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const response = await gfetch({
      id: parseInt(ctx.params.id),
      uuid: ctx.request.query.uuid,
    });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

module.exports = router;
