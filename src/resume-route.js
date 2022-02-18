const Router = require('@koa/router');
const grpc = require('grpc');

const logger = require('./logger');
const repos = require('./resume-repos');

const router = new Router({
  prefix: '/api',
});

module.exports = router;

router.get('/biz/complex/resume', async (ctx) => {
  const { option } = ctx.request.query;
  if (option === '') {
    //
  }
});

router.put('/biz/simple/resume/:id', async (ctx) => {
  const { id } = ctx.params;
  const { option } = ctx.request.query;
  if (option === 'status') {
    const { status } = ctx.request.body;
    await repos.update(option, { status, id: parseInt(id, 10) || 0 });
    ctx.response.status = 200;
  }
  if (option === 'certificate') {
    const { certificate } = ctx.request.body;
    await repos.update(option, { certificate, id: parseInt(id, 10) || 0 });
    ctx.response.status = 200;
  }
  if (option === 'skill') {
    const { skill } = ctx.request.body;
    await repos.update(option, { skill, id: parseInt(id, 10) || 0 });
    ctx.response.status = 200;
  }
  if (option === 'career') {
    const { career } = ctx.request.body;
    await repos.update(option, { career, id: parseInt(id, 10) || 0 });
    ctx.response.status = 200;
  }
  if (option === 'record') {
    const { record } = ctx.request.body;
    await repos.update(option, { record, id: parseInt(id, 10) || 0 });
    ctx.response.status = 200;
  }
});

router.get('/biz/simple/resume', async (ctx) => {
  const { option } = ctx.request.query;
  if (option === 'by-education-addressLevel2-qiwanghangye-qiwangzhiwei') {
    // eslint-disable-next-line
    const { education, addressLevel2, qiwanghangye, qiwangzhiwei, page } =
      ctx.request.query;
    const result = await repos.filter(option, {
      education,
      addressLevel2,
      qiwanghangye,
      qiwangzhiwei,
      page: parseInt(page, 10) || 0,
    });
    ctx.response.body = result;
  }
});

router.get('/biz/resume/statistic', async (ctx) => {
  ctx.response.body = await repos.statistic(ctx.request.query.option || '');
});

router.get('/biz/resume/:id', async (ctx) => {
  ctx.response.body = await repos.get(ctx.request.query.option || '', {
    id: parseInt(ctx.params.id, 10),
    uuid: ctx.request.query.uuid || '',
  });
});

router.get('/biz/resume', async (ctx) => {
  ctx.response.body = await repos.filter(ctx.request.query.option || '', {
    id: parseInt(ctx.request.query.id || 0, 10),
    list: ctx.request.query.list || '0',
  });
});

// website resume/Retrieval.jsx
router.put('/resume/filter', async (ctx) => {
  try {
    // eslint-disable-next-line
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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

// wx-minip recruitment/Details.jsx
// wx-minip user/Resume.jsx
router.get('/resume/user/:candidate_id', async (ctx) => {
  try {
    // eslint-disable-next-line
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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

// wx-minip user/Resume.jsx
// website resume/Components.jsx
// website resume/ListDetails.jsx
// website resume/ResumeDetails.jsx
router.get('/resume/:id', async (ctx) => {
  try {
    // eslint-disable-next-line
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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
      // eslint-disable-next-line
      const xlsx = require('node-xlsx').default;

      const resume = await repos.get('', {
        id: parseInt(ctx.params.id, 10),
        uuid: ctx.request.query.u_id,
      });
      // const resume = JSON.parse(
      //   await gfetch({
      //     option: '',
      //     param: {
      //       id: ctx.params.id,
      //       uuid: ctx.request.query.u_id,
      //       user_id: ctx.request.query.u_i,
      //     },
      //   }),
      // );
      const data = [];
      data.push(
        ['姓名', resume.name],
        ['性别', resume.gender, null, null, null, '出生日期', resume.birthday],
        ['邮箱', resume.email, null, null, null, '电话号码', resume.phone],
        ['毕业院校', resume.school],
        ['专业', resume.major, null, null, null, '学历', resume.education],
        [
          '家庭住址',
          `${resume.address1} ${resume.address2} ${resume.address3}`,
        ],
        [
          '期望行业',
          resume.qiwanghangye,
          null,
          null,
          null,
          '期望职位',
          resume.qiwangzhiwei,
        ],
        ['意向城市', resume.yixiangchengshi],
        [null],
      );
      // 合并单元格
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

      data.push(['证书']);
      range.push({
        s: { c: 0, r: data.length - 1 },
        e: { c: 8, r: data.length - 1 },
      });
      resume.certificate.forEach((current) => {
        const e = JSON.parse(current);
        data.push(['证书', e.certificate, null, null, null, '时间', e.time]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 4, r: data.length - 1 },
        });
        range.push({
          s: { c: 6, r: data.length - 1 },
          e: { c: 8, r: data.length - 1 },
        });
      });

      data.push([null]);

      // skill: [ '{"name":"熟练掌握word PPT等办公软件","length":"12","level":"良好"}' ],
      data.push(['专业技能']);
      range.push({
        s: { c: 0, r: data.length - 1 },
        e: { c: 8, r: data.length - 1 },
      });
      resume.skill.forEach((current) => {
        const e = JSON.parse(current);
        data.push([
          '技能',
          e.name,
          null,
          null,
          null,
          '时长(月)',
          e.length,
          '熟练程度',
          e.level,
        ]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 4, r: data.length - 1 },
        });
      });

      data.push([null]);

      data.push(['工作经历']);
      range.push({
        s: { c: 0, r: data.length - 1 },
        e: { c: 8, r: data.length - 1 },
      });
      resume.career.forEach((element) => {
        const e = JSON.parse(element);
        data.push(['公司名称', e.employer]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 8, r: data.length - 1 },
        });
        data.push([
          '职位',
          e.title,
          null,
          null,
          null,
          '起止时间',
          `${e.date_begin} ${e.date_end}`,
        ]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 4, r: data.length - 1 },
        });
        range.push({
          s: { c: 6, r: data.length - 1 },
          e: { c: 8, r: data.length - 1 },
        });
        data.push(['工作描述', e.description]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 8, r: data.length - 1 },
        });
      });

      data.push([null]);

      data.push(['项目经验']);
      range.push({
        s: { c: 0, r: data.length - 1 },
        e: { c: 8, r: data.length - 1 },
      });
      resume.record.forEach((element) => {
        const e = JSON.parse(element);
        data.push(['项目名称', e.name]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 8, r: data.length - 1 },
        });
        data.push([
          '职位',
          e.title,
          null,
          null,
          null,
          '起止时间',
          `${e.date_begin} ${e.date_end}`,
        ]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 4, r: data.length - 1 },
        });
        range.push({
          s: { c: 6, r: data.length - 1 },
          e: { c: 8, r: data.length - 1 },
        });
        data.push(['项目描述', e.description]);
        range.push({
          s: { c: 1, r: data.length - 1 },
          e: { c: 8, r: data.length - 1 },
        });
      });

      const buffer = xlsx.build([{ name: '简历', data }], { '!merges': range });
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

// wx-minip components/ToBack.jsx
// wx-minip user/Resume.jsx
router.put('/resume/:candidate_id', async (ctx) => {
  try {
    // eslint-disable-next-line
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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
      await gfetch({
        option,
        param: { candidate_id: ctx.params.candidate_id },
      });
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
// wx-minip user/Resume.jsx
router.post('/resume/', async (ctx) => {
  try {
    // eslint-disable-next-line
    const stub = require('./biz-stub');
    const gclient = new stub.Resume2102(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
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
