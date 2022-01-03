import Router from '@koa/router';

import { default as resume } from './resume-repos.js';
import { default as sendin } from './send_in-repos.js';

export const router = new Router({
  prefix: '/api/complex',
});

router.get('/resume', async (ctx) => {
  const { option } = ctx.request.query;
  if (option === 'by-job_ids') {
    // 不包括岗位信息
    const { ids } = ctx.request.query;
    const sendinList = await sendin.filter('by-job', { list: ids });
    const resumeList = await resume.filter('by-id', { list: sendinList.map((current) => current.resume_id) });
    const result = sendinList.map((current) => {
      const r = resumeList.find((element) => element.id === current.resume_id);
      if (r) {
        return {
          sendin_id: current.id,
          job_id: current.recruitment_id,
          sendin_stauts: current.status,
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
        sendin_stauts: current.status,
        sendin_time: current.datime,
      };
    });
    ctx.response.body = result;
  }
  ctx.response.status = 200;
});
