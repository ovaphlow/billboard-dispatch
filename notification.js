const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/recommend',
});

module.exports = router;

router.put('/filter', async (ctx) => {
  try {
    const enums = ['wx-default-list'];
    const filter = ctx.request.query.filter || '';
    if (enums.indexOf(filter) === -1) {
      ctx.response.body = [];
      return;
    }
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Notification(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.filter(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await gfetch({
      filter,
      param: ctx.request.body,
    });
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.put('/', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Notification(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/:id', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const grpcClient = new stub.Notification(ctx.grpc_service, grpc.credentials.createInsecure());
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
