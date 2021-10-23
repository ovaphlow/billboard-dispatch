const crypto = require('crypto');

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
  let option = ctx.request.query.option || '';
  ctx.response.body = await repos.get(option, {
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.put('/biz/candidate/:id', async (ctx) => {
  let option = ctx.request.query.option || '';
  if ('password' === option) {
    let r = await repos.get('password', {
      id: parseInt(ctx.params.id, 10),
      uuid: ctx.request.body.uuid,
    });
    if (!r.password) {
      ctx.response.status = 401;
      return;
    }
    let hmac = crypto.createHmac('sha256', r.salt);
    hmac.update(ctx.request.body.current_password);
    let passwordSalted = hmac.digest('hex');
    console.log('salted', passwordSalted)
    console.log('password', r.password);
    if (passwordSalted !== r.password) {
      ctx.response.status = 401;
      return;
    }
    hmac = crypto.createHmac('sha256', r.salt);
    hmac.update(ctx.request.body.password);
    passwordSalted = hmac.digest('hex');
    console.log('new salted', passwordSalted);
    ctx.response.body = await repos.update('password', {
      id: parseInt(ctx.params.id, 10),
      uuid: ctx.request.body.uuid,
      password: passwordSalted,
    });
  }
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
