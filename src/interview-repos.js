const pool = require('./mysql');

module.exports = {
  statistic: (option, data) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if (option === 'qty-by-ref_id-status') {
          const sql = `
              select count(*) qty
              from offer
              where common_user_id = ?
              and position(? in status) > 0
              `;
          cnx.execute(sql, [data.ref_id, data.status], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
          });
        }
        pool.releaseConnection(cnx);
      });
    }),
};
