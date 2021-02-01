const Router = require('@koa/router');
const grpc = require('grpc');

const recommend_proto = require('../proto/recommend_stub');
const config = require('../config');
const logger = require('../logger');

// const proto = grpc.loadPackageDefinition(
//   // eslint-disable-next-line
//   protoLoader.loadSync(`${__dirname}/../proto/recommend.proto`, {
//     keepCase: true,
//     longs: String,
//     enums: String,
//     defaults: true,
//     oneofs: true,
//   }),
// ).recommend;

const grpcClient = new recommend_proto.Recommend(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);

const router = new Router({
  prefix: '/api/recommend',
});

module.exports = router;

router.put('/filter', async (ctx) => {
  const enums = ['wx-default-list'];
  const filter = ctx.request.query.filter || '';
  if (enums.indexOf(filter) === -1) {
    ctx.response.body = [];
    return;
  }
  const gfetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.filter(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      })
    })
  try {
    ctx.response.body = await gfetch({
      filter,
      param: ctx.request.body,
    });
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
})

router.put('/', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.list(body, (err, response) => {
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
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
