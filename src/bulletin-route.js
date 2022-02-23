/**
 * 2021-03
 * 用于替换banner.js recommend.js, topic.js, campus.js 等
 */
const Router = require('@koa/router');
const dayjs = require('dayjs');

const repos = require('./bulletin-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/bulletin/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {
    date: dayjs().format('YYYY-MM-DD'),
  });
});

router.get('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.get(ctx.request.query.option || '', {
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.put('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.update(ctx.request.query.option || '', {
    ...ctx.request.body,
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.delete('/bulletin/:id', async (ctx) => {
  ctx.response.body = await repos.remove(ctx.request.query.option || '', {
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.get('/bulletin', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    title: ctx.request.query.title || '',
    date: ctx.request.query.date || '',
    category: ctx.request.query.category || '',
    tag: ctx.request.query.tag || '',
    status: ctx.request.query.status || '',
    id_list: ctx.request.query.id_list || '0',
    limit: ctx.request.query.limit || '5',
    address_level2: ctx.request.query.address_level2 || '',
    keyword: ctx.request.query.keyword || '',
    page: parseInt(ctx.request.query.page || 1, 10),
  });
});

router.post('/bulletin', async (ctx) => {
  const option = ctx.request.query.option || '';
  ctx.response.body = await repos.save(option, ctx.request.body);
});

router.get('/bulletin/notification', async (ctx) => {
  ctx.response.body = [];
});

module.exports = router;
