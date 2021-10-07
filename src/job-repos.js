const pool = require('./mysql');

module.exports = {
  statistic: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('all' === option) {
          let sql = `
              select count(*) as qty from recruitment
              `;
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
        } else if ('by-fair-id' === option) {
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
              where json_search(job_fair_id, "one", ?)
              order by id desc
              `;
          cnx.execute(sql, [data.id], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};
