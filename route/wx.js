const Router = require('@koa/router');
// const fetch = require('node-fetch');

// const config = require('../config');
// const logger = require('../logger');
// const { wx } = require('../config');

const router = new Router({
  prefix: '/api/wx',
});

module.exports = router;

router.get('/token/', async (ctx) => {
  // const wxApi = () => new Promise((resolve, reject) => {
  //  fetch(`${config.wx.getTokenApi}appid=${config.wx.appid}&secret=${config.wx.appSecret}`)
  //  .then(res => res.json())
  //  .then(res => resolve(res))
  //  .catch(err => reject(err))
  // });
  // try {
  //  ctx.response.body = await wxApi()
  // } catch (err) {
  //  logger.error(err);
  //  ctx.response.body = { message: '服务器错误' };
  // }
  ctx.response.body = { message: '服务器错误' };
});

router.get('/ticket/:token', async (ctx) => {
  // const wxApi = (token) => new Promise((resolve, reject) => {
  //  logger.info(config.wx.getTokenApi.replace('TOKEN',token))
  //  fetch(`${config.wx.getTicketApi.replace('TOKEN',token)}`)
  //  .then(res => res.json())
  //  .then(res => resolve(res))
  //  .catch(err => reject(err))
  // });
  // try {
  //  ctx.response.body = await wxApi(ctx.params.token)
  // } catch (err) {
  //  logger.error(err);
  //  ctx.response.body = { message: '服务器错误' };
  // }
  ctx.response.body = { message: '服务器错误' };
});
