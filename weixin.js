const os = require("os");

const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const superagent = require("superagent");

const logger = require("./logger");
const { Certificate } = require("crypto");

const app = new Koa();

app.env = "production";

app.use(
  bodyParser({
    jsonLimit: "8mb",
  })
);

const configuration = {
  weixin: {
    appid: "wxbf9bb377ed519ed8",
    secret: "042dd07bb366dcdab45b03cfb0824fc0",
  },
};

const router = new Router({
  prefix: "/api/wx-minip",
});

router.post("/token", async (ctx) => {
  try {
    let path = [
      "https://api.weixin.qq.com/cgi-bin/token",
      "?grant_type=client_credential",
      `&appid=${configuration.weixin.appid}`,
      `&secret=${configuration.weixin.secret}`,
    ];
    let response = await superagent.get(path.join(""));
    logger.info(response.body.access_token, response.body.expires_in);
    let access_token = response.body.access_token;
    let _path = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${access_token}`;
    let _response = await superagent.post(_path).send(ctx.request.body);
    logger.info(_response);
    logger.info(_response.text);
    // ctx.response.body = _response.text;
    // ctx.response.body = response.body;
    ctx.response.status = 200;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
  // try {
  //   if (!ctx.request.body) {
  //     ctx.response.status = 400;
  //     return;
  //   }
  //   let path = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${access_token}`;
  //   let response = await superagent.post(path).send(ctx.request.body);
  //   logger.info(response);
  //   logger.info(response.text);
  //   ctx.response.body = response.text;
  // } catch (err) {
  //   logger.error(err.stack);
  //   ctx.response.status = 500;
  // }
});

router.post("/sign-in", async (ctx) => {
  try {
    logger.info(ctx.request.body);
    if (!ctx.request.body.code) {
      ctx.response.status = 400;
      return;
    }
    // GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    let path = [
      "https://api.weixin.qq.com/sns/jscode2session",
      `?appid=${configuration.weixin.appid}`,
      `&secret=${configuration.weixin.secret}`,
      `&js_code=${ctx.request.body.code}`,
      "&grant_type=authorization_code",
    ];
    let response = await superagent.get(path.join(""));
    logger.info(response);
    logger.info(response.text); // correct
    ctx.response.body = response.text;
  } catch (err) {
    logger.error(err.stack);
    ctx.response.status = 500;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
