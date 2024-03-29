const Router = require('@koa/router');

const pool = require('./mysql');

const router = new Router({
  prefix: '/api/biz/simple',
});

router.post('/staff/sign-in', async (ctx) => {
  const client = pool.promise();
  const sql = `
  select id , username , detail->>'$.name' name , detail->>'$.uuid' uuid
  from ovaphlow.subscriber
  where username = ?
    and detail->>'$.password' = ?
  `;
  const [result] = await client.execute(sql, [
    ctx.request.body.username,
    ctx.request.body.password,
  ]);
  ctx.response.body = result.length === 1 ? result[0] : {};
});

router.get('/staff/:id', async (ctx) => {
  const client = pool.promise();
  const sql = `
  select id, username, detail->>'$.name' name, detail->>'$.uuid' uuid
  from ovaphlow.subscriber
  where id = ?
    and detail->>'$.uuid' = ?
  `;
  const [result] = await client.execute(sql, [
    parseInt(ctx.params.id, 10),
    ctx.request.execute.uuid,
  ]);
  ctx.response.body = result.length === 1 ? result[0] : {};
});

router.put('/staff/:id', async (ctx) => {
  const client = pool.promise();
  const sql = `
  update ovaphlow.subscriber
  set username = ?
    , detail = json_set(detail, '$.name', ?)
  where id = ?
    and detail->>'$.uuid' = ?
  `;
  const [result] = await client.execute(sql, [
    ctx.request.body.username,
    ctx.request.body.name,
    parseInt(ctx.params.id, 10),
    ctx.request.execute.uuid,
  ]);
  ctx.response.body = result;
});

router.delete('/staff/:id', async (ctx) => {
  const client = pool.promise();
  const sql = `
  delete from ovaphlow.subscriber
  where id = ?
    and detail->>'$.uuid' = ?
  `;
  const [result] = await client.execute(sql, [
    parseInt(ctx.params.id, 10),
    ctx.request.execute.uuid || '',
  ]);
  ctx.response.body = result;
});
router.get('/staff', async (ctx) => {
  const client = pool.promise();
  const option = ctx.request.execute.option || '';
  if (option === 'tag') {
    const sql = `
    select id , username , detail->>'$.name' name , detail->>'$.uuid' uuid
    from ovaphlow.subscriber
    where detail->>'$.tag' = ?
    order by id desc
    limit 20
    `;
    const [result] = await client.execute(sql, [ctx.request.execute.tag]);
    ctx.response.body = result;
  } else ctx.response.body = [];
});

router.post('/staff', async (ctx) => {
  const client = pool.promise();
  let sql = `
  select count(*) qty
  from ovaphlow.subscriber
  where username = ?
  `;
  let [result] = await client.execute(sql, [ctx.request.body.username]);
  if (result[0].qty !== 0) {
    ctx.response.status = 401;
    return;
  }
  sql = `
  insert into ovaphlow.subscriber (username, detail)
    values(?, ?)
  `;
  [result] = await ctx.db_client.execute(sql, [
    ctx.request.body.username,
    JSON.stringify({
      uuid: uuidv5(
        ctx.request.body.username,
        Buffer.from(configuration.SECRET),
      ),
      name: ctx.request.body.name,
      password: ctx.request.body.password,
      tag: ctx.request.body.tag,
    }),
  ]);
  ctx.response.body = result;
});

module.exports = router;
