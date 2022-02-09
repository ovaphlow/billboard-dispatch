const dayjs = require('dayjs');

const pool = require('./mysql');

module.exports = {
  statistic: (option) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'qty-by-total-today') {
        cnx.execute(`
        select (select count(*) from delivery) total
            , (select count(*) from delivery where position(? in datime) > 0) today
        `, [dayjs().format('YYYY-MM-DD')], (errResult, result) => {
          if (errResult) reject(errResult);
          resolve(result[0] || { total: 0, today: 0 });
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  filter: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'by-job-id-and-date') {
        cnx.execute(`
        select datime, id, recruitment_id, recruitment_uuid, resume_id, resume_uuid, status
        from delivery
        where recruitment_id in (${data.id}) and datime between ? and ?
        `, [data.date, data.date2], (errResult, result) => {
          if (errResult) reject(errResult);
          resolve(result);
        });
      } else if (option === 'by-job') {
        cnx.execute(`
        select id, datime, recruitment_id, recruitment_uuid, resume_id, resume_uuid, status
        from delivery
        where recruitment_id in (${data.list})
        order by datime desc
        `, [], (errResult, result) => {
          if (errResult) reject(errResult);
          resolve(result);
        });
      } else if (option === 'qty-by-job_list') {
        cnx.execute(`
        select recruitment_id, count(*) qty
        from billboard.delivery
        where recruitment_id in (${data.list})
        group by recruitment_id
        `, [], (errResult, result) => {
          if (errResult) reject(errResult);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),
};
