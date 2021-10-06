const pool = require('./mysql');

module.exports = {
  filter: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('by-id-list' === option) {
          let sql = `
              select email
                , id
                , name
                , phone
                , uuid
              from common_user
              where id in (${data.list})
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
          pool.releaseConnection(cnx);
        }
      });
    });
  },
};
