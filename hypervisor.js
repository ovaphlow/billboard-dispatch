const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/hypervisor',
});

module.exports = router;

router.post('/staff/sign-in', async (ctx) => {
  try {
    const stub = require('./hypervisor-stub');
    const gclientStaff = new stub.Staff(ctx.grpc_service, grpc.credentials.createInsecure());
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
