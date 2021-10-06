const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/journal',
});

module.exports = router;

router.put('/filter', async (ctx) => {
  try {
    const option = ctx.request.query.option || '';
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
    if (option === 'logbook') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          grpcClient.filter(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response.data);
            }
          });
        });
      const resp = await gfetch({ option, param: { list: ctx.request.body } });
      ctx.response.body = resp;
    }
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.get('/edit/:category/:id', async (ctx) => {
  try {
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.editList(body, (err, response) => {
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

router.post('/edit', async (ctx) => {
  try {
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.insertEdit(body, (err, response) => {
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

router.get('/login/:category/:id', async (ctx) => {
  try {
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.loginList(body, (err, response) => {
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

router.get('/:common_user_id', async (ctx) => {
  try {
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.list(body, (err, response) => {
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

router.get('/:common_user_id/:data_id/:category/', async (ctx) => {
  try {
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
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

router.delete('/:common_user_id/:data_id/:category/', async (ctx) => {
  try {
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.post('/', async (ctx) => {
  try {
    const stub = require('./journal-stub');
    const grpcClient = new stub.Journal(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.request.body.uuid = ctx.query.uuid;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
