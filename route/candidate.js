const Router = require('@koa/router');
const grpc = require('grpc');

const config = require('../config');
const logger = require('../logger');
const stub = require('../proto/biz_stub');

const gclient = new stub.Candidate(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const router = new Router({
  prefix: '/api/candidate',
});

module.exports = router;

router.put('/statistic', async (ctx) => {
  try {
    const option = ctx.request.query.option || '';
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
    const response = await gfetch({ option, data: ctx.request.body });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

router.put('/filter', async (ctx) => {
  try {
    const option = ctx.request.query.option || '';
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
    const response = await gfetch({ option, data: ctx.request.body });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

router.get('/:id', async (ctx) => {
  try {
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.get(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const response = await gfetch({
      id: parseInt(ctx.params.id),
      uuid: ctx.request.query.uuid,
    });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});
