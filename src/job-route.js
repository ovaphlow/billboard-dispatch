/**
 * 2021-02
 * 用于替换recruitment.js
 */
const Router = require('@koa/router');

const repos = require('./job-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/biz/job/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {});
});

router.get('/biz/job/:id', async (ctx) => {
  ctx.response.body = await repos.get({
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.put('/biz/job/:id', async (ctx) => {
  ctx.response.body = await repos.update(ctx.request.query.option || '', {
    ...ctx.request.body,
    id: parseInt(ctx.params.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
  })
})

router.get('/biz/job', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    id: parseInt(ctx.request.query.id || 0, 10),
    uuid: ctx.request.query.uuid || '',
    list: ctx.request.query.list || '0',
    category: ctx.request.query.category || '',
    address_level2: ctx.request.query.address_level2 || '',
    industry: ctx.request.query.industry || '',
    name: ctx.request.query.name || '',
    page: parseInt(ctx.request.query.page || 1, 10),
    status: ctx.request.query.status || '',
  });
});

/**
 * 参加/退出 线上招聘会
 */
router.put('/biz/job', async (ctx) => {
  ctx.response.body = await repos.batchUpdate(ctx.request.query.option || '', {
    employer_id: parseInt(ctx.request.body.employer_id || 0, 10),
    employer_uuid: ctx.request.body.employer_uuid || '',
    fair_id: parseInt(ctx.request.body.fair_id || 0, 10),
    list: ctx.request.body.list || '0',
  });
});

module.exports = router;
