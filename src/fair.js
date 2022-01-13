const Router = require('@koa/router');
const grpc = require('grpc');
const logger = require('./logger');

const router = new Router({
  prefix: '/api/job-fair',
});

module.exports = router;

// wx-minip job-fair/List.jsx
router.get('/', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Fair(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) => new Promise((resolve, reject) => {
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

// wx-minip job-fair/Details.jsx
router.get('/:id', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Fair(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) => new Promise((resolve, reject) => {
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
