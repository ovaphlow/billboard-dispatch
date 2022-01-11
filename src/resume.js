const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');
const pool = require('./mysql');

const router = new Router();

module.exports = router;

const update = async (option, data) => {
  const client = pool.promise();
  if (option === 'status') {
    const sql = `
    update resume set status = ? where id = ?
    `;
    const [result] = await client.query(sql, [data.status, data.id]);
    return result;
  }
  return [];
};

router.put('/api/biz/simple/resume/:id', async (ctx) => {
  const { option } = ctx.request.query;
  if (option === 'status') {
    const { status } = ctx.request.body;
    update(option, { status, id: parseInt(ctx.params.id, 10) || 0 });
    ctx.response.status = 200;
  }
});

router.put('/api/resume/filter', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(ctx.grpc_service, grpc.credentials.createInsecure());
    const { filter } = ctx.request.query;
    if (filter === 'employer-filter') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.filter(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response.data);
            }
          });
        });
      ctx.response.body = await gfetch({ filter, param: ctx.request.body });
    } else {
      ctx.response.body = '[]';
    }
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.get('/api/resume/user/:candidate_id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.get(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await gfetch({
      option: 'by-user',
      param: {
        id: ctx.params.candidate_id,
        uuid: ctx.request.query.u_id,
      },
    });
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.get('/api/resume/:id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.get(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    const option = ctx.request.query.option || '';
    if (option === 'export') {
      const xlsx = require('node-xlsx').default;

      const resume = JSON.parse(
        await gfetch({
          option: '',
          param: {
            id: ctx.params.id,
            uuid: ctx.request.query.u_id,
            user_id: ctx.request.query.u_i,
          },
        }),
      );
      let data = [];
      data.push(
        ['姓名', resume.name],
        ['性别', resume.gender, null, null, null, '出生日期', resume.birthday],
        ['邮箱', resume.email, null, null, null, '电话号码', resume.phone],
        ['毕业院校', resume.school],
        ['专业', resume.major, null, null, null, '学历', resume.education],
        ['家庭住址', `${resume.address1} ${resume.address2} ${resume.address3}`],
        ['期望行业', resume.qiwanghangye, null, null, null, '期望职位', resume.qiwangzhiwei],
        ['意向城市', resume.yixiangchengshi],
        [null],
      );
      const range = [
        { s: { c: 1, r: 0 }, e: { c: 8, r: 0 } },
        { s: { c: 1, r: 1 }, e: { c: 4, r: 1 } },
        { s: { c: 6, r: 1 }, e: { c: 8, r: 1 } },
        { s: { c: 1, r: 2 }, e: { c: 4, r: 2 } },
        { s: { c: 6, r: 2 }, e: { c: 8, r: 2 } },
        { s: { c: 1, r: 3 }, e: { c: 8, r: 3 } },
        { s: { c: 1, r: 4 }, e: { c: 4, r: 4 } },
        { s: { c: 6, r: 4 }, e: { c: 8, r: 4 } },
        { s: { c: 1, r: 5 }, e: { c: 8, r: 5 } },
        { s: { c: 1, r: 6 }, e: { c: 4, r: 6 } },
        { s: { c: 6, r: 6 }, e: { c: 8, r: 6 } },
        { s: { c: 1, r: 7 }, e: { c: 8, r: 7 } },
      ];

      data.push(['工作经历']);
      range.push({ s: { c: 0, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
      JSON.parse(resume.career).forEach((element) => {
        const e = JSON.parse(element);
        data.push(['公司名称', e.employer]);
        range.push({ s: { c: 1, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
        data.push(['职位', e.title, null, null, null, '起止时间', `${e.date_begin} ${e.date_end}`]);
        range.push({ s: { c: 1, r: data.length - 1 }, e: { c: 4, r: data.length - 1 } });
        range.push({ s: { c: 6, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
        data.push(['工作描述', e.description]);
        range.push({ s: { c: 1, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
      });

      data.push([null]);

      data.push(['项目经验']);
      range.push({ s: { c: 0, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
      JSON.parse(resume.record).forEach((element) => {
        const e = JSON.parse(element);
        data.push(['项目名称', e.name]);
        range.push({ s: { c: 1, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
        data.push(['职位', e.title, null, null, null, '起止时间', `${e.date_begin} ${e.date_end}`]);
        range.push({ s: { c: 1, r: data.length - 1 }, e: { c: 4, r: data.length - 1 } });
        range.push({ s: { c: 6, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
        data.push(['项目描述', e.description]);
        range.push({ s: { c: 1, r: data.length - 1 }, e: { c: 8, r: data.length - 1 } });
      });

      const buffer = xlsx.build([{ name: '简历', data: data }], { '!merges': range });
      ctx.response.set(
        'content-disposition',
        `attachment; filename=${resume.uuid || resume.id}.xlsx`,
      );
      ctx.response.body = buffer;
    } else {
      ctx.response.body = await gfetch({
        option: '',
        param: {
          id: ctx.params.id,
          uuid: ctx.request.query.u_id,
          user_id: ctx.request.query.u_i,
        },
      });
    }
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

router.put('/api/resume/:candidate_id', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(ctx.grpc_service, grpc.credentials.createInsecure());
    const option = ctx.request.query.option || '';
    if (option === '') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          ...ctx.request.body,
          uuid: ctx.query.u_id,
          common_user_id: ctx.params.candidate_id,
        },
      });
      ctx.response.status = 200;
    } else if (option === 'refresh') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({ option, param: { candidate_id: ctx.params.candidate_id } });
      ctx.response.status = 200;
    } else if (option === 'status') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          ...ctx.request.body,
          candidate_id: ctx.params.candidate_id,
          uuid: ctx.request.query.uuid || '',
        },
      });
      ctx.response.status = 200;
    } else if (option === 'save-career') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    } else if (option === 'update-career') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    } else if (option === 'save-record') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    } else if (option === 'update-record') {
      const gfetch = (body) =>
        new Promise((resolve, reject) => {
          gclient.update(body, (err, response) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      await gfetch({
        option,
        param: {
          candidate_id: ctx.params.candidate_id,
          data: JSON.stringify(ctx.request.body),
        },
      });
      ctx.response.status = 200;
    }
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});

/**
 * 2021-02 变更
 * 初始化简历
 */
router.post('/api/resume/', async (ctx) => {
  try {
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(ctx.grpc_service, grpc.credentials.createInsecure());
    const gfetch = (body) =>
      new Promise((resolve, reject) => {
        gclient.init(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    await gfetch(ctx.request.body);
    ctx.response.status = 200;
  } catch (err) {
    logger.error(err);
    ctx.response.status = 500;
  }
});
