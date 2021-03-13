const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/recruitment',
});

module.exports = router;

/**
 * 2020-11-09
 * 微信小程序列表及查询，带分页
 * 用于之后的接口整合，候选代码。
 * url 参数：?category=@PARAM
 */
router.put('/filter', async (ctx) => {
  try {
    const enums = ['', 'byCategory', 'wx-default-list'];
    const category = ctx.request.query.category || '';
    if (enums.indexOf(category) === -1) {
      ctx.response.body = [];
      return;
    }
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.response.body = await gfetch({
      category,
      param: ctx.request.body,
    });
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.get('/job-fair/ent/:job_fair_id/:ent_id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.jobFairEntList(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch({
      ...ctx.params,
      ent_uuid: ctx.query.ent_uuid,
    });
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/job-fair/:job_fair_id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.jobFairList(body, (err, response) => {
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

router.get('/subject/:subject', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.subject(body, (err, response) => {
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

router.get('/enterprise/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.enterpriseList(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/enterprise/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.enterpriseSearch(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.request.body.enterprise_id = ctx.params.id;
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/status/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.status(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.request.body.id = ctx.params.id;
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.params.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

/**
 * 2021-02
 * 添加update2接口，用于刷新岗位时间及后续的接口整合
 */
router.put('/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const option = ctx.request.query.option || '';
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.update(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    await grpcFetch({
      option,
      data: {
        ...ctx.request.body,
        id: parseInt(ctx.params.id),
        uuid: ctx.query.uuid,
      },
    });
    ctx.response.status = 200;
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.post('/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.save(body, (err, response) => {
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
