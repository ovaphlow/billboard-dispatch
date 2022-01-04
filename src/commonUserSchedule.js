const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/common-user-schedule',
});

module.exports = router;

// wx-minip user/Schedule.jsx
router.get('/user/:user_id', async (ctx) => {
  try {
    const stub = require('./commonUserSchedule-stub');
    const grpcClient = new stub.CommonUserSchedule(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.user(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

// wx-minip user/User.jsx
router.get('/count/:user_id', async (ctx) => {
  try {
    const stub = require('./commonUserSchedule-stub');
    const grpcClient = new stub.CommonUserSchedule(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.count(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

// wx-minip user/Details.jsx
router.get('/user/:user_id/:campus_id', async (ctx) => {
  try {
    const stub = require('./commonUserSchedule-stub');
    const grpcClient = new stub.CommonUserSchedule(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.get(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

// wx-minip user/Details.jsx
router.post('/', async (ctx) => {
  try {
    const stub = require('./commonUserSchedule-stub');
    const grpcClient = new stub.CommonUserSchedule(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.insert(body, (err, response) => {
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

// wx-minip user/Details.jsx
router.delete('/:id', async (ctx) => {
  try {
    const stub = require('./commonUserSchedule-stub');
    const grpcClient = new stub.CommonUserSchedule(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.delete(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.common_user_id = ctx.query.u;
    ctx.params.data_id = ctx.query.d;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
