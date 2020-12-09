const protoLoader = require('@grpc/proto-loader');
const Router = require('@koa/router');
const grpc = require('grpc');

const config = require('../config');
const logger = require('../logger');

// 2020-12 根据官方示例更新 -->
const packageDefinition = protoLoader.loadSync(
  `${__dirname}/../proto/campus.proto`,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);
const campus_proto = grpc.loadPackageDefinition(packageDefinition).campus;
const grpcClient = new campus_proto.Campus(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure(),
);
// 2020-12 根据官方示例更新 <--

const router = new Router({
  prefix: '/api/campus',
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
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

router.put('/', async (ctx) => {
  const grpcFetch = (body) =>
    new Promise((resolve, reject) => {
      grpcClient.search(body, (err, response) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(JSON.parse(response.data));
        }
      });
    });
  try {
    ctx.response.body = await grpcFetch({ filter: ctx.request.body });
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
