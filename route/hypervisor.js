const Router = require('@koa/router');
const grpc = require('grpc');

const config = require('../config');
const logger = require('../logger');
const stub = require('../proto/hypervisor_stub');

const gclientStaff = new stub.Staff(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const router = new Router({
  prefix: '/api/hypervisor',
});

module.exports = router;

router.post('/staff/sign-in', async (ctx) => {
  try {
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclientStaff.signIn(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const response = await gfetch({ data: ctx.request.body });
    ctx.response.body = response;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});
