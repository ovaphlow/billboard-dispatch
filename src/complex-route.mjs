import dayjs from 'dayjs';
import Router from '@koa/router';

import { filterFairById } from './fair.mjs';
import { default as job } from './job-repos.js';
import { default as resume } from './resume-repos.js';
import { default as sendin } from './send_in-repos.js';

export const router = new Router({
  prefix: '/api/complex',
});

router.get('/resume', async (ctx) => {
  const { option } = ctx.request.query;
  if (option === 'by-fair') {
    // 线上招聘会
    const { fairId } = ctx.request.query;
    // 获取招聘会时间
    const fairList = await filterFairById({ id: parseInt(fairId, 10) });
    const [fairData] = fairList;
    console.log(fairData);
    const { datime } = fairData;
    console.log(datime);
    console.log(dayjs(datime).add(28, 'day').format('YYYY-MM-DD HH:mm:ss'));
    // 获取招聘会职位
    const jobList = await job.filterJobByFair({ fairId: `["${fairId}"]` });
    // 招聘会开始后的28天内投递到jobList中的记录数
    ctx.response.body = jobList;
  }
  if (option === 'by-job_ids') {
    // 不包括岗位信息
    const { ids } = ctx.request.query;
    const sendinList = await sendin.filter('by-job', { list: ids });
    const resumeList = await resume.filter('by-id', {
      list: sendinList.map((current) => current.resume_id),
    });
    const result = sendinList.map((current) => {
      const r = resumeList.find((element) => element.id === current.resume_id);
      if (r) {
        return {
          sendin_id: current.id,
          job_id: current.recruitment_id,
          sendin_status: current.status,
          sendin_time: current.datime,
          resume_id: r.id,
          resume_uuid: r.uuid,
          resume_name: r.name,
          resume_education: r.education,
          resume_school: r.school,
        };
      }
      return {
        sendin_id: current.id,
        job_id: current.recruitment_id,
        sendin_status: current.status,
        sendin_time: current.datime,
      };
    });
    ctx.response.body = result;
  }
  ctx.response.status = 200;
});
