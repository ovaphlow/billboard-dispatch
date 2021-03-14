const Router = require('@koa/router');
const grpc = require('grpc');
const nodemailer = require('nodemailer');

const { configuration } = require('app');
const logger = require('./logger');

const router = new Router({
  prefix: '/api/email',
});

module.exports = router;

router.put('/check/', async (ctx) => {
  try {
    const stub = requrie('./miscellaneus-stub');
    const grpcClient = new stub.Email(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.code(body, (err, response) => {
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

router.put('/checkRecover/', async (ctx) => {
  try {
    const stub = requrie('./miscellaneus-stub');
    const grpcClient = new stub.Email(ctx.grpc_service, grpc.credentials.createInsecure());
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.checkRecover(body, (err, response) => {
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

router.put('/', async (ctx) => {
  try {
    const math = parseInt(Math.floor(Math.random() * (999999 - 100000 + 1) + 100000), 10);
    const code = math.toString();
    const transporter = nodemailer.createTransport(configuration.email);
    const mailOptions = {
      from: config.email.auth.user,
      to: ctx.request.body.email,
      subject: '学子就业网邮箱验证',
      html: `您的验证码是:<br/>
      <h1>${code}</h1>
    `,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        logger.info(error);
      } else {
        logger.info(`发送邮件到${ctx.request.body.email}`);
      }
    });

    const stub = requrie('./miscellaneus-stub');
    const grpcClient = new stub.Email(ctx.grpc_service, grpc.credentials.createInsecure());
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
    ctx.response.body = await grpcFetch({
      ...ctx.request.body,
      code,
    });
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
