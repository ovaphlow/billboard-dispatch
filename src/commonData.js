const Router = require('@koa/router');
const grpc = require('grpc');

const console = require('./logger');

const router = new Router({
  prefix: '/api/common-data',
});

module.exports = router;

// wx-minip user/Resume.jsx
// website components/InputField.jsx
router.get('/hangye/', async (ctx) => {
  try {
    const stub = require('./commonData-stub');
    const gclient = new stub.CommonData(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = () =>
      new Promise((resolve, reject) => {
        gclient.hangye({ data: JSON.stringify({}) }, (err, response) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch();
  } catch (err) {
    console.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
