const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');

const router = new Router({
  prefix: '/api/delivery',
});

module.exports = router;

router.get('/:id/', async (ctx) => {
  try {
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
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

router.get('/recruitment/:recruitment_id', async (ctx) => {
  try {
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.recruitmentList(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.recruitment_uuid = ctx.query.recruitment_uuid;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/user/:common_user_id', async (ctx) => {
  try {
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.userDeliveryList(body, (err, response) => {
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

router.get('/details/:id', async (ctx) => {
  try {
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.details(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.params.uuid = ctx.query.u_id;
    ctx.params.user_id = ctx.query.u_i;
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.get('/:common_user_id/:recruitment_id/', async (ctx) => {
  try {
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.userDelivery(body, (err, response) => {
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
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
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

router.put('/search', async (ctx) => {
  try {
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.search(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.request.body.uuid = ctx.query.u_id;
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/status/', async (ctx) => {
  try {
    const stub = require('./delivery-stub');
    const grpcClient = new stub.Delivery(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.response.body = await grpcFetch(ctx.request.body);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
