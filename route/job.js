/**
 * 2021-02
 * 用于替换recruitment.js
 */
const Router = require('@koa/router');
const grpc = require('grpc');

const config = require('../config');
const logger = require('../logger');
const stub = require('../proto/biz_stub');

const gclient = new stub.Job(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const router = new Router({
  prefix: '/api/job',
});

module.exports = router;

router.put('/:id', async (ctx) => {
  try {
    const option = ctx.request.query.option || '';
    if (option === 'refresh') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response.data);
            }
          });
        });
      await gfetch({
        option: 'refresh',
        param: ctx.request.body,
      });
      ctx.response.status = 200;
    }
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});
