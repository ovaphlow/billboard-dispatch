const pool = require('./mysql');

module.exports = {
  filter: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('by-id' === option) {
          let sql = `
              select
                address1
                , address2
                , address3
                , category
                , date
                , date_refresh
                , description
                , education
                , enterprise_id
                , enterprise_uuid
                , id
                , industry
                , job_fair_id
                , name
                , position
                , qty
                , requirement
                , salary1
                , salary2
                , status
                , uuid
              from recruitment
              where id in (${data.list})
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('list-by-employer-id' === option) {
          let sql = `
              select
                address1
                , address2
                , address3
                , category
                , date
                , date_refresh
                , description
                , education
                , enterprise_id
                , enterprise_uuid
                , id
                , industry
                , job_fair_id
                , name
                , position
                , qty
                , requirement
                , salary1
                , salary2
                , status
                , uuid
              from recruitment
              where enterprise_id = ?
                and enterprise_uuid = ?
              limit 100
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};
