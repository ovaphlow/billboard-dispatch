const pool = require('./mysql');

module.exports = {
  statistic: async (option) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('to-certificate-qty' === option) {
          let sql = `
              select count(*) as qty
              from enterprise
              where status = '待认证'
                and yingyezhizhao_tu is not null
              `;
          cnx.execute(sql, (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
          });
        }
      });
    });
  },
};
