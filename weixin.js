const Router = require('@koa/router');
const superagent = require('superagent');

const { configuration } = require('./app');
const logger = require('./logger');

const router = new Router({
  prefix: '/api/wx-minip',
});

module.exports = router;

// 测试用
router.get('/token', async (ctx) => {
  try {
    let path = [
      'https://api.weixin.qq.com/cgi-bin/token',
      '?grant_type=client_credential',
      `&appid=${configuration.weixin.appid}`,
      `&secret=${configuration.weixin.secret}`,
    ];
    let response = await superagent.get(path.join(''));
    logger.info(response.body.access_token, response.body.expires_in);
    ctx.response.body = response.body;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

// 获取openId和session_key
router.post('/sign-in', async (ctx) => {
  try {
    logger.info(ctx.request.body);
    if (!ctx.request.body.code) {
      ctx.response.status = 400;
      return;
    }
    // GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    let path = [
      'https://api.weixin.qq.com/sns/jscode2session',
      `?appid=${configuration.weixin.appid}`,
      `&secret=${configuration.weixin.secret}`,
      `&js_code=${ctx.request.body.code}`,
      '&grant_type=authorization_code',
    ];
    let response = await superagent.get(path.join(''));
    logger.info(response.text); // correct
    ctx.response.body = response.text;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

// 发送微信统一服务消息
router.post('/send', async (ctx) => {
  try {
    if (!ctx.request.body) {
      ctx.response.status = 400;
      return;
    }
    let path = [
      'https://api.weixin.qq.com',
      '/cgi-bin/message/wxopen/template/uniform_send',
      `?access_token=${configuration.weixin.access_token}`,
    ];
    let response = await superagent.post(path).send(ctx.request.body);
    logger.info(response);
    logger.info(response.text);
    logger.info(ctx.request.body);
    ctx.response.body = response.text;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});
