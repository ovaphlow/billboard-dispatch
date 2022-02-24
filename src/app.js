const cluster = require('cluster');
const http = require('http');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();

const logger = require('./logger');

const app = new Koa();

app.env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

app.use(
  bodyParser({
    jsonLimit: '8mb',
  }),
);

app.use(async (ctx, next) => {
  logger.debug(`--> ${ctx.request.method} ${ctx.request.url}`);
  await next();
  logger.debug(`<-- ${ctx.request.method} ${ctx.request.url}`);
});

app.on('error', (err, ctx) => {
  logger.error(`server error: [${ctx.request.method}] ${ctx.request.url}`);
  logger.error(err.stack);
  ctx.response.status = 500;
});

(() => {
  const Router = require('@koa/router');

  const router = new Router({
    prefix: '/api',
  });

  router.post('/configuration', async (ctx) => {
    try {

      if (ctx.request.body.token !== process.env.SECRET_TOKEN) {
        ctx.response.status = 200;
        return;
      }

      ctx.response.body = {
        persistence_host: process.env.DB_HOST,
        persistence_port: process.env.DB_PORT,
        persistence_user: process.env.DB_USERNAME,
        persistence_password: process.env.DB_PASSWORD,
        persistence_database: 'billboard',
      };
    } catch (err) {
      logger.error(err);
      ctx.response.status = 500;
    }
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
})();

/**
 * 设定grpc服务地址
 */
app.use(async (ctx, next) => {
  ctx.grpc_service = process.env.GRPC_SERVICE;
  await next();
});

(() => {
  const router = require('./bulletin-route');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./candidate-route');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./commonUser');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./enterpriseUser');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./resume-route');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./banner');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./job-route');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./recruitment');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./favorite');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./send_in-route');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./delivery');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./employer-route');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./enterprise');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./interview');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./campus');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./commonUserSchedule');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./commonData');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./email');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./fair');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./staff');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./weixin');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

import('./complex-route.mjs')
  .then((module) => {
    const { router } = module;
    app.use(router.routes());
    app.use(router.allowedMethods());
  })
  .catch((err) => {
    logger.error(err);
  });

module.exports = app;

if (require.main === module) {
  const port = parseInt(process.env.PORT, 10) || 8080;
  if (cluster.isMaster) {
    logger.info(`主进程 PID:${process.pid}`);

    for (let i = 0; i < parseInt(process.env.PROC || 1, 10); i += 1) {
      cluster.fork();
    }

    cluster.on('online', (worker) => {
      logger.info(`子进程 PID:${worker.process.pid}, 端口:${port}`);
    });

    cluster.on('exit', (worker, code, signal) => {
      logger.error(
        `子进程 PID:${worker.process.pid}终止，错误代码:${code}，信号:${signal}`,
      );
      logger.info(`由主进程(PID:${process.pid})创建新的子进程`);
      cluster.fork();
    });
  } else {
    http.createServer(app.callback()).listen(port);
  }
}
