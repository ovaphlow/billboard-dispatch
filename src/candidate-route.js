const crypto = require('crypto');

const Router = require('@koa/router');
const dayjs = require('dayjs');

const repos = require('./candidate-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/biz/candidate/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {
    date: dayjs().format('YYYY-MM-DD'),
  });
});

router.post('/biz/candidate/sign-in', async (ctx) => {
  const auth = await repos.signIn(ctx.request.body);
  if (auth.length !== 1) {
    ctx.response.status = 401;
    return;
  }
  const hmac = crypto.createHmac('sha256', auth[0].salt);
  hmac.update(ctx.request.body.password);
  const passwordSalted = hmac.digest('hex');
  if (passwordSalted !== auth[0].password) {
    ctx.response.status = 401;
    return;
  }
  delete auth[0].password;
  delete auth[0].salt;
  ctx.response.body = auth[0];
});

router.get('/biz/candidate/:id', async (ctx) => {
  const option = ctx.request.query.option || '';
  ctx.response.body = await repos.get(option, {
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.put('/biz/candidate/:id', async (ctx) => {
  const option = ctx.request.query.option || '';
  if (option === 'password') {
    const r = await repos.get('password', {
      id: parseInt(ctx.params.id, 10),
      uuid: ctx.request.body.uuid,
    });
    if (!r.password) {
      ctx.response.status = 401;
      return;
    }
    let hmac = crypto.createHmac('sha256', r.salt);
    hmac.update(ctx.request.body.current_password);
    let passwordSalted = hmac.digest('hex');
    console.log('salted', passwordSalted);
    console.log('password', r.password);
    if (passwordSalted !== r.password) {
      ctx.response.status = 401;
      return;
    }
    hmac = crypto.createHmac('sha256', r.salt);
    hmac.update(ctx.request.body.password);
    passwordSalted = hmac.digest('hex');
    console.log('new salted', passwordSalted);
    ctx.response.body = await repos.update('password', {
      id: parseInt(ctx.params.id, 10),
      uuid: ctx.request.body.uuid,
      password: passwordSalted,
    });
  }
});

router.get('/biz/candidate', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    list: ctx.request.query.list || '0',
    keyword: ctx.request.query.keyword || '',
  });
});

module.exports = router;
