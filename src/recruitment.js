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
// wx-minip recruitment/KeywordSearch.jsx
router.put('/filter', async (ctx) => {
  try {
    const enums = ['', 'byCategory', 'wx-default-list'];
    const category = ctx.request.query.category || '';
    if (enums.indexOf(category) === -1) {
      ctx.response.body = [];
      return;
    }
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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

// wx-minip job-fair/Details.jsx
router.get('/job-fair/:job_fair_id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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

// wx-minip recruitment/Enterprise.jsx
router.get('/enterprise/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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

// website resume/ResumeDetails.jsx
router.put('/enterprise/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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

// wx-minip user/Report.jsx
router.get('/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(
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
    ctx.params.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

// website recruitment/Save.jsx
router.post('/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Job(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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
