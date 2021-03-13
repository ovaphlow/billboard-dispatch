const Router = require('@koa/router');
const grpc = require('grpc');
const logger = require('./logger');

const router = new Router({
  prefix: '/api/job-fair',
});

module.exports = router;

router.get('/', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Fair(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.list(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch({});
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/:id', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Fair(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/edit/', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Fair(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.response.body = await grpcFetch({
      job_fair_id: ctx.request.body.job_fair_id,
      ent_id: ctx.request.body.ent_id,
      ent_uuid: ctx.request.body.ent_uuid,
      recruitment_id: JSON.stringify(ctx.request.body.recruitment_id),
    });
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/:ent_id', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Fair(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.search(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch({
      ent_id: ctx.params.ent_id,
      ent_uuid: ctx.query.ent_uuid,
    });
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
