const Router = require('@koa/router');
const grpc = require('grpc');

const config = require('../config');
const logger = require('../logger');
const stub = require('../proto/resume_stub');
const stub_resume2102 = require('../proto/resume2102_stub');

const grpcClient = new stub.Resume(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const gclient = new stub_resume2102.Resume2102(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const router = new Router({
  prefix: '/api/resume',
});

module.exports = router;

router.get('/:id', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.get(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      });
    });
  try {
    ctx.params.uuid = ctx.query.u_id;
    ctx.params.user_id = ctx.query.u_i;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/user/:common_user_id', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.user(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      });
    });
  try {
    ctx.params.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

/**
 * 2021-02
 * to-do: remove
 */
router.put('/retrieval/', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.retrieval(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      });
    });
  try {
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

/**
 * 2021-02
 * to-do: remove
 */
router.put('/recommend/', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.recommend(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      });
    });
  try {
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.post('/status/:id/', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.status(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      });
    });
  try {
    ctx.request.body.id = ctx.params.id;
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/filter', async (ctx) => {
  try {
    const { filter } = ctx.request.query;
    if (filter === 'employer-filter') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.filter(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response.data);
            }
          });
        });
      ctx.response.body = await gfetch({ filter, param: ctx.request.body });
    } else {
      ctx.response.body = '[]';
    }
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.put('/:common_user_id', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.update(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      });
    });
  try {
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.request.body.common_user_id = ctx.params.common_user_id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

/**
 * 2021-02 变更
 * 初始化简历
 */
// router.post('/init', async (ctx) => {
router.post('/', async (ctx) => {
  try {
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.init(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    await gfetch(ctx.request.body);
    ctx.response.status = 200;
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
  // const grpcFetch = (body) =>
  //   new Promise((resolve, reject) => {
  //     grpcClient.init(body, (err, response) => {
  //       if (err) {
  //         logger.error(err);
  //         reject(err);
  //       } else {
  //         resolve(JSON.parse(response.data));
  //       }
  //     });
  //   });
  // try {
  //   ctx.request.body.uuid = ctx.query.u_id;
  //   ctx.response.body = await grpcFetch(ctx.request.body);
  // } catch (err) {
  //   logger.error(err);
  //   ctx.response.body = { message: '服务器错误' };
  // }
});
