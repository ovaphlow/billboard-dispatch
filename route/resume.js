const Router = require('@koa/router');
const grpc = require('grpc');

const config = require('../config');
const logger = require('../logger');
const stub = require('../proto/resume_stub');
const stub_biz = require('../proto/biz_stub');

const grpcClient = new stub.Resume(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const gclient = new stub_biz.Resume2102(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const router = new Router({
  prefix: '/api/resume',
});

module.exports = router;

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

router.get('/user/:candidate_id', async (ctx) => {
  try {
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.get(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await gfetch({
      option: 'by-user',
      param: {
        id: ctx.params.candidate_id,
        uuid: ctx.request.query.u_id,
      },
    });
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.get('/:id', async (ctx) => {
  try {
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.get(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await gfetch({
      option: '',
      param: {
        id: ctx.params.id,
        uuid: ctx.request.query.u_id,
      },
    });
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.put('/:candidate_id', async (ctx) => {
  try {
    const option = ctx.request.query.option || '';
    if (option === '') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          ...ctx.request.body,
          uuid: ctx.query.u_id,
          common_user_id: ctx.params.candidate_id,
        },
      });
      ctx.response.status = 200;
    } else if (option === 'refresh') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              loogger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({ option, param: { candidate_id: ctx.params.candidate_id } });
      ctx.response.status = 200;
    } else if (option === 'status') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          uuid: ctx.request.query.u_id,
        },
      });
      ctx.response.status = 200;
    } else if (option === 'save-career') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    } else if (option === 'update-career') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    } else if (option === 'save-record') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    } else if (option === 'update-record') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    }
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

/**
 * 2021-02 变更
 * 初始化简历
 */
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
});
