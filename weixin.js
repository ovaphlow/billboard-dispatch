const Router = require('@koa/router');
const superagent = require('superagent');

const { configuration } = require('./app');
const logger = require('./logger');

const router = new Router({
  prefix: '/api/weixin',
});

module.exports = router;

router.get('/token', async (ctx) => {
  const path = [
    'https://api.weixin.qq.com/cgi-bin/token',
    '?grant_type=client_credential',
    `&appid=${configuration.weixin.appid}`,
    `&secret=${configuration.weixin.secret}`,
  ];
  superagent
    .get(path.join(''))
    .then((response) => {
      logger.info(response.body.access_token, response.body.expires_in);
    })
    .catch((err) => {
      logger.error(err.stack);
    });
  ctx.response.status = 200;
});
