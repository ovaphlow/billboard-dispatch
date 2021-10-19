const crypto = require('crypto');

const Router = require('@koa/router');
const grpc = require('grpc');
const dayjs = require('dayjs');

const logger = require('./logger');
const repos = require('./employer-repos');

const router = new Router({
  prefix: '/api',
});

router.post('/biz/employer/sign-in', async (ctx) => {
  let r = await repos.signIn(ctx.request.body);
  let hmac = crypto.createHmac('sha256', r.salt);
  hmac.update(ctx.request.body.password);
  let passwordSalted = hmac.digest('hex');
  if (passwordSalted !== r.password) ctx.response.status = 401;
  ctx.response.body = {
    id: r.id,
    uuid: r.uuid,
    email: r.email,
    phone: r.phone,
    name: r.name,
    ref_id: r.enterprise_id,
    ref_uuid: r.enterprise_uuid,
  };
});

router.get('/biz/employer/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {
    date: dayjs().format('YYYY-MM-DD'),
  });
});

router.get('/biz/employer/:id', async (ctx) => {
  ctx.response.body = await repos.get(ctx.request.query.option || '', {
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.get('/biz/employer', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    list: ctx.request.query.list || '0',
    keyword: ctx.request.query.keyword || '',
  });
});

router.put('/employer/statistic', async (ctx) => {
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

router.put('/employer/filter', async (ctx) => {
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

router.put('/employer/filter-user', async (ctx) => {
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

module.exports = router;
