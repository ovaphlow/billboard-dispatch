const pool = require('./mysql');

module.exports = {
  statistic: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('all' === option) {
          let sql = 'select count(*) as qty from delivery';
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || {});
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },

  filter: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('by-job-id-and-date' === option) {
          let sql = `
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
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};
