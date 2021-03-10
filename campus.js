const grpc = require('grpc');
const Router = require('@koa/router');

const config = require('./config');
const logger = require('./logger');

const router = new Router({
  prefix: '/api/campus',
});

module.exports = router;

router.get('/:id', async (ctx) => {
  try {
    const stub = require('./campus-stub');
    const gclient = new stub.Campus(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.get(body, (err, response) => {
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

router.put('/', async (ctx) => {
  try {
    const stub = require('./campus-stub');
    const gclient = new stub.Campus(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.search(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(JSON.parse(response.data));
          }
        });
      });
    ctx.response.body = await grpcFetch({ filter: ctx.request.body });
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
