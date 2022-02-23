/**
 * 2021-01
 * send-in: 原投递简历(delivery)
 */
const Router = require('@koa/router');

const repos = require('./send_in-repos');

const router = new Router({
  prefix: '/api',
});

router.get('/biz/send-in/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '', {});
});

router.get('/biz/send-in', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    id: parseInt(ctx.request.query.job_id || 0, 10),
    date: ctx.request.query.date || '',
    date2: ctx.request.query.date2 || '',
    list: ctx.request.query.list || '0',
  });
});

module.exports = router;
