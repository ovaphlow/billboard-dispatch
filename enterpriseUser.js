const crypto = require('crypto');

const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/ent-user',
});

const getSalted = (password, salt) => {
  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(password);
  return hmac.digest('hex');
};

module.exports = router;

router.post('/log-in/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.signIn(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const result = await grpcFetch(ctx.request.body);
    if (result.message) {
      ctx.response.body = result;
    } else {
      const passwordSalted = getSalted(ctx.request.body.password, result.content.salt);
      if (passwordSalted !== result.content.password) {
        ctx.response.body = { message: '用户名或密码错误', content: '' };
      } else {
        result.content.salt = undefined;
        result.content.password = undefined;
        ctx.response.body = result;
      }
    }
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

// 注册：拼写错误，应为sign-up
router.post('/sign-in', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.signUp(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const salt = crypto.randomBytes(8).toString('hex');
    const passwordSalted = getSalted(ctx.request.body.password, salt);
    ctx.response.body = await grpcFetch({
      ...ctx.request.body,
      password: passwordSalted,
      salt,
    });
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/updatePassword/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.upPasswordCheck(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const updatePasswordFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.updatePassword(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.request.body.id = ctx.params.id;
    const result = await grpcFetch(ctx.request.body);
    if (result.message) {
      ctx.response.body = result;
    } else {
      const passwordSalted = getSalted(ctx.request.body.old_password, result.content.salt);
      if (passwordSalted !== result.content.password) {
        ctx.response.body = { message: '密码错误' };
      } else {
        const salt = crypto.randomBytes(8).toString('hex');
        const passwordSalted1 = getSalted(ctx.request.body.password1, salt);
        ctx.response.body = await updatePasswordFetch({
          id: result.content.id,
          uuid: result.content.uuid,
          password: passwordSalted1,
          salt,
        });
      }
    }
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/checkEmail/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.checkEmail(body, (err, response) => {
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

router.put('/checkPhone/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.checkPhone(body, (err, response) => {
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

router.put('/checkRecover/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.checkRecover(body, (err, response) => {
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

router.put('/recover/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.recover(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const updatePasswordFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.updatePassword(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const result = await grpcFetch(ctx.request.body);
    if (result.message) {
      ctx.response.body = result;
    } else {
      const salt = crypto.randomBytes(8).toString('hex');
      const passwordSalted = getSalted(ctx.request.body.password, salt);
      await updatePasswordFetch({
        id: result.content.id,
        uuid: result.content.uuid,
        password: passwordSalted,
        salt,
      });
      ctx.response.body = { content: true };
    }
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.updateUser(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.request.body.uuid = ctx.query.uuid;
    ctx.request.body.id = ctx.params.id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
