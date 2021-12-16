const Router = require('@koa/router');

const router = new Router({
  prefix: '/api/biz/simple',
});

router.post('/staff/sign-in', async (ctx) => {
  let sql = `
  select id , username , detail->>'$.name' name , detail->>'$.uuid' uuid
  from ovaphlow.subscriber
  where username = ?
    and detail->>'$.password' = ?
  `;
  let [result] = await ctx.db_client.query(sql, [
    ctx.request.body.username,
    ctx.request.body.password,
  ]);
  ctx.response.body = result.length === 1 ? result[0] : {};
});

module.exports = router;
