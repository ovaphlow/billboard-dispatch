const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');
// const repos = require('./')

const router = new Router({
  prefix: '/api',
});

// wx-minip job-fair/Details.jsx
router.get('/enterprise/job-fair/:job_fair_id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(
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
// wx-minip user/Report.jsx
// website enterprise/Revise.jsx
// website enterprise/Update.jsx
router.get('/enterprise/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(
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

// website resume/ListDetails.jsx
// website resume/ResumeDetails.jsx
router.get('/enterprise/check/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.check(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.uuid = ctx.query.uuid;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

// website enterprise/Revise.jsx
// website enterprise/Update.jsx
router.put('/enterprise/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const grpcClient = new stub.Employer(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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
    ctx.request.body.id = ctx.params.id;
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

module.exports = router;
