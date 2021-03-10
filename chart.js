const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/chart',
});

module.exports = router;

router.get('/ent-home/', async (ctx) => {
  try {
    const stub = require('./miscellaneus-stub');
    const gclient = new stub.Chart(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.entHome(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err.stack);
    ctx.response.body = { message: '服务器错误' };
  }
});
