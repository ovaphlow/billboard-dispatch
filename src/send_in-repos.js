const dayjs = require('dayjs');

const pool = require('./mysql');

module.exports = {
  statistic: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'qty-by-total-today') {
        const sql = `
              select (select count(*) from delivery) total
                , (select count(*) from delivery where position(? in datime) > 0) today
              `;
        cnx.execute(sql, [dayjs().format('YYYY-MM-DD')], (err, result) => {
          if (err) reject(err);
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
        const sql = `
              select
                datime
                , id
                , recruitment_id
                , recruitment_uuid
                , resume_id
                , resume_uuid
                , status
              from delivery
              where recruitment_id in (${data.id})
                and datime between ? and ?
              `;
        cnx.execute(sql, [data.date, data.date2], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      } else if (option === 'by-job') {
        const sql = `
              select id
                , datime
                , recruitment_id
                , recruitment_uuid
                , resume_id
                , resume_uuid
                , status
              from delivery
              where recruitment_id in (${data.list})
              `;
        cnx.execute(sql, [], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      } else if (option === 'qty-by-job_list') {
        const sql = `
              select recruitment_id
                , count(*) qty
              from billboard.delivery
              where recruitment_id in (${data.list})
              group by recruitment_id
              `;
        cnx.execute(sql, [], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),
};
