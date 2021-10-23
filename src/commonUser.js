const crypto = require('crypto');

const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/common-user',
});

module.exports = router;

router.put('/review', async (ctx) => {
  try {
    let option = ctx.request.query.option || '';
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.review(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    await gfetch({
      id: parseInt(ctx.request.body.id),
      uuid: ctx.request.body.uuid,
      option,
      data: ctx.request.body,
    });
    ctx.response.status = 200;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

/**
 * 注册
 * todo: 地址修改为sign-up
 */
router.post('/sign-in', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.signIn(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const salt = crypto.randomBytes(8).toString('hex');
    const hmac = crypto.createHmac('sha256', salt);
    hmac.update(ctx.request.body.password);
    const passwordSalted = hmac.digest('hex');
    ctx.response.body = await grpcFetch({
      ...ctx.request.body,
      password: passwordSalted,
      salt,
    });
  } catch (err) {
    logger.error(err.stack);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.post('/log-in', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.logIn(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(JSON.parse(response.data));
          }
        });
      });
    const result = await grpcFetch(ctx.request.body);
    if (result.message) {
      ctx.response.body = result;
    } else {
      const hmac = crypto.createHmac('sha256', result.content.salt);
      hmac.update(ctx.request.body.password);
      const passwordSalted = hmac.digest('hex');
      if (passwordSalted !== result.content.password) {
        ctx.response.body = { message: '用户名或密码错误', content: '' };
      } else {
        result.content.salt = undefined;
        result.content.password = undefined;
        ctx.response.body = result;
      }
    }
  } catch (err) {
    logger.error(err.stack);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/recover/', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.recover(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const salt = crypto.randomBytes(8).toString('hex');
    const hmac = crypto.createHmac('sha256', salt);
    hmac.update(ctx.request.body.password);
    const passwordSalted = hmac.digest('hex');
    ctx.response.body = await grpcFetch({
      ...ctx.request.body,
      password: passwordSalted,
      salt,
    });
  } catch (err) {
    logger.error(err.stack);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/checkEmail/', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.checkEmail(body, (err, response) => {
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

router.put('/checkRecover/', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.checkRecover(body, (err, response) => {
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

router.get('/:id', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
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
    ctx.params.uuid = ctx.query.uuid;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err.stack);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/phone', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.phone(body, (err, response) => {
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

router.put('/', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.update(body, (err, response) => {
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

router.get('/journal/:user_id', async (ctx) => {
  try {
    const stub = require('./commonUser-stub');
    const gclient = new stub.CommonUser(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.journal(body, (err, response) => {
          if (err) {
            logger.error(err.stack);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.category = '个人用户';
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err.stack);
    ctx.response.body = { message: '服务器错误' };
  }
});
