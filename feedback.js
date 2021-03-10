/**
 * 2021-03 to-do 合并到miscellaneus中
 */
const Router = require('@koa/router');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const console = require('./logger');

const router = new Router({
  prefix: '/api/feedback',
});

module.exports = router;

router.get('/:user_category/:user_id', async (ctx) => {
  try {
    const stub = require('./miscellaneus-stub');
    const gclient = new stub.Feedback(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.list(body, (err, response) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    console.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.post('/', async (ctx) => {
  try {
    const stub = require('./miscellaneus-stub');
    const gclient = new stub.Feedback(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.insert(body, (err, response) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    console.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
