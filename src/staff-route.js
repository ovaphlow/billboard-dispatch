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

router.get('/staff/:id', async (ctx) => {
  let sql = `
  select id, username, detail->>'$.name' name, detail->>'$.uuid' uuid
  from ovaphlow.subscriber
  where id = ?
    and detail->>'$.uuid' = ?
  `;
  let [result] = await ctx.db_client.query(sql, [
    parseInt(ctx.params.id, 10),
    ctx.request.query.uuid,
  ]);
  ctx.response.body = result.length === 1 ? result[0] : {};
});

router.put('/staff/:id', async (ctx) => {
  let sql = `
  update ovaphlow.subscriber
  set username = ?
    , detail = json_set(detail, '$.name', ?)
  where id = ?
    and detail->>'$.uuid' = ?
  `;
  let [result] = await ctx.db_client.query(sql, [
    ctx.request.body.username,
    ctx.request.body.name,
    parseInt(ctx.params.id, 10),
    ctx.request.query.uuid,
  ]);
  ctx.response.body = result;
});

router.delete('/staff/:id', async (ctx) => {
  let sql = `
  delete from ovaphlow.subscriber
  where id = ?
    and detail->>'$.uuid' = ?
  `;
  let [result] = await ctx.db_client.query(sql, [
    parseInt(ctx.params.id, 10),
    ctx.request.query.uuid || '',
  ]);
  ctx.response.body = result;
});
router.get('/staff', async (ctx) => {
  let option = ctx.request.query.option || '';
  if ('tag' === option) {
    let sql = `
    select id , username , detail->>'$.name' name , detail->>'$.uuid' uuid
    from ovaphlow.subscriber
    where detail->>'$.tag' = ?
    order by id desc
    limit 20
    `;
    let [result] = await ctx.db_client.query(sql, [ctx.request.query.tag]);
    ctx.response.body = result;
  } else ctx.response.body = [];
});

router.post('/staff', async (ctx) => {
  let sql = `
  select count(*) qty
  from ovaphlow.subscriber
  where username = ?
  `;
  let [result] = await ctx.db_client.query(sql, [ctx.request.body.username]);
  if (result[0].qty !== 0) {
    ctx.response.status = 401;
    return;
  }
  sql = `
  insert into ovaphlow.subscriber (username, detail)
    values(?, ?)
  `;
  [result] = await ctx.db_client.query(sql, [
    ctx.request.body.username,
    JSON.stringify({
      uuid: uuidv5(ctx.request.body.username, Buffer.from(configuration.SECRET)),
      name: ctx.request.body.name,
      password: ctx.request.body.password,
      tag: ctx.request.body.tag,
    }),
  ]);
  ctx.response.body = result;
});

module.exports = router;
