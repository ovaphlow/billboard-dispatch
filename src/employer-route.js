const crypto = require('crypto');

const Router = require('@koa/router');
const dayjs = require('dayjs');

const repos = require('./employer-repos');

const router = new Router({
  prefix: '/api',
});

router.post('/biz/employer/sign-in', async (ctx) => {
  const r = await repos.signIn(ctx.request.body);
  const hmac = crypto.createHmac('sha256', r.salt);
  hmac.update(ctx.request.body.password);
  const passwordSalted = hmac.digest('hex');
  if (passwordSalted !== r.password) ctx.response.status = 401;
  ctx.response.body = {
    id: r.id,
    uuid: r.uuid,
    email: r.email,
    phone: r.phone,
    name: r.name,
    ref_id: r.enterprise_id,
    ref_uuid: r.enterprise_uuid,
  };
});

router.get('/biz/employer/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {
    date: dayjs().format('YYYY-MM-DD'),
  });
});

router.get('/biz/employer/:id', async (ctx) => {
  ctx.response.body = await repos.get(ctx.request.query.option || '', {
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.put('/biz/employer/:id', async (ctx) => {
  const { id } = ctx.params;
  const { option, uuid } = ctx.request.query;
  await repos.update(option, {
    ...ctx.request.body,
    id: parseInt(id, 10),
    uuid: uuid || '',
  });
  ctx.response.status = 200;
});

router.get('/biz/employer', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    list: ctx.request.query.list || '0',
    keyword: ctx.request.query.keyword || '',
    name: ctx.request.query.name || '',
  });
});

module.exports = router;
