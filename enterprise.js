const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/enterprise',
});

module.exports = router;

router.get('/subject/:name', async (ctx) => {
  try {
    const stub = require('./enterprise-stub');
    const grpcClient = new stub.Enterprise(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.subject(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.request.body.name = ctx.params.name;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/job-fair/:job_fair_id', async (ctx) => {
  try {
    const stub = require('./enterprise-stub');
    const grpcClient = new stub.Enterprise(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.JobFairList(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/:id', async (ctx) => {
  try {
    const stub = require('./enterprise-stub');
    const grpcClient = new stub.Enterprise(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.get(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/check/:id', async (ctx) => {
  try {
    const stub = require('./enterprise-stub');
    const grpcClient = new stub.Enterprise(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.check(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.uuid = ctx.query.uuid;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/:id', async (ctx) => {
  try {
    const stub = require('./enterprise-stub');
    const grpcClient = new stub.Enterprise(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.update(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.request.body.id = ctx.params.id;
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
