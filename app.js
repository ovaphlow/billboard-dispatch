const cluster = require('cluster');
const http = require('http');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const logger = require('./logger');

const app = new Koa();

let configuration;

// configuration
(() => {
  const fs = require('fs');

  const yaml = require('js-yaml');

  const configuration_template = require('./configuration_template');

  const conf_path = './configuration.yaml';

  const saveConfig = (conf_path, config) => {
    fs.writeFileSync(conf_path, config, (err) => {
      if (err) {
        logger.error(`写入配置文件(${conf_path})失败`);
        logger.error(err);
      }
    });
  };

  if (fs.existsSync(conf_path)) {
    configuration = yaml.load(fs.readFileSync(conf_path, 'utf8'));
  } else {
    logger.info(`首次运行`);
    const template = yaml.dump(configuration_template, { sortKeys: true });
    logger.info('读取配置文件模板');
    logger.info(template);
    saveConfig(conf_path, template);
    logger.info(`生成配置文件 ${conf_path}`);
    logger.info('请编辑配置文件后再次运行');
    process.exit(0);
  }
})();

module.exports.configuration = configuration;

app.env = configuration.env;

app.use(
  bodyParser({
    jsonLimit: '8mb',
  }),
);

app.use(async (ctx, next) => {
  logger.info(`--> ${ctx.request.method} ${ctx.request.url}`);
  await next();
  logger.info(`<-- ${ctx.request.method} ${ctx.request.url}`);
});

app.on('error', (err, ctx) => {
  logger.error('server error', err, ctx);
});

(() => {
  const Router = require('@koa/router');

  const router = new Router({
    prefix: '/api',
  });

  router.post('/configuration', async (ctx) => {
    try {
      /**
       * 启用需要同时修改所有router中初始化gRPC客户端部分的代码
       */
      // const target = ctx.request.body.host.split(':');
      // configuration.grpc_service = `${target[0] || '127.0.0.1'}:${target[1] || '50051'}`;

      if (ctx.request.body.token !== configuration.app.token) {
        ctx.response.status = 200;
        return;
      }

      ctx.response.body = {
        persistence_host: configuration.persistence.host,
        persistence_port: configuration.persistence.port,
        persistence_user: configuration.persistence.user,
        persistence_password: configuration.persistence.password,
        persistence_database: configuration.persistence.database,
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
  ctx.grpc_service = configuration.grpc_service;
  await next();
});

(() => {
  const router = require('./route/enterpriseUser');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./candidate');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./commonUser');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/commonUserFile');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/resume');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./banner');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/job');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/recruitment');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/journal');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/favorite');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/send-in');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./delivery');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/report');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./miscellaneus');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./feedback');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/message');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/employer');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/enterprise');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/offer');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/topic');
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
  const router = require('./bulletin');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/recommend');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/email');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./chart');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/job-fair');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

(() => {
  const router = require('./route/hypervisor');
  app.use(router.routes());
  app.use(router.allowedMethods());
})();

module.exports = app;

if (require.main === module) {
  if (cluster.isMaster) {
    logger.info(`主进程 PID:${process.pid}`); // eslint-disable-line

    for (let i = 0; i < configuration.app.numChildProcesses; i += 1) {
      cluster.fork();
    }

    cluster.on('online', (worker) => {
      // eslint-disable-next-line
      logger.info(`子进程 PID:${worker.process.pid}, 端口:${configuration.app.port}`);
    });

    cluster.on('exit', (worker, code, signal) => {
      // eslint-disable-next-line
      logger.info(`子进程 PID:${worker.process.pid}终止，错误代码:${code}，信号:${signal}`);
      // eslint-disable-next-line
      logger.info(`由主进程(PID:${process.pid})创建新的子进程`);
      cluster.fork();
    });
  } else {
    http.createServer(app.callback()).listen(configuration.app.port);
  }
}
