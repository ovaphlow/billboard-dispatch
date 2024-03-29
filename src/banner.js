const grpc = require('grpc');
const Router = require('@koa/router');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/banner',
});

module.exports = router;

// wx-minip banner.jsx
router.get('/detail/:id', async (ctx) => {
  try {
    const stub = require('./bulletin-stub');
    const gclient = new stub.Banner(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.detail(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.uuid = ctx.query.uuid;
    ctx.response.body = await gfetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
