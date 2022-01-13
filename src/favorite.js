/**
 * 2021-03 to-do 合并至miscellaneus中
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/favorite',
});

module.exports = router;

// wx-minip recruitment/Details.jsx
router.put('/search/one/', async (ctx) => {
  try {
    const stub = require('./miscellaneus-stub');
    const grpcClient = new stub.Favorite(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) => new Promise((resolve, reject) => {
      grpcClient.searchOne(body, (err, response) => {
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
