const pool = require('./mysql');

module.exports = {
  statistic: (option) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('by-qiwangzhiwei' === option) {
          let sql = `
              select qiwangzhiwei, count(qiwangzhiwei) qty
              from resume
              where qiwanghangye != ''
                and qiwangzhiwei != ''
              group by qiwangzhiwei
              order by qty desc
              limit 10
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },

  get: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('' === option) {
          let sql = `
            select address1
              , address2
              , address3
              , address4
              , birthday
              , career
              , common_user_id
              , date_begin
              , date_create
              , date_end
              , date_update
              , education
              , email
              , gender
              , id
              , major
              , name
              , phone
              , qiwanghangye
              , qiwangzhiwei
              , record
              , school
              , status
              , uuid
              , yixiangchengshi
              , ziwopingjia
            from resume
            where id = ?
              and uuid = ?
            limit 1
            `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result.length === 1 ? result[0] : {});
          });
        } else if ('by-subscriber' === option) {
          let sql = `
              select id
                , name
              from resume
              where common_user_id = ?
              limit 1
              `;
          cnx.execute(sql, [data.id], (err, result) => {
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
              select address1
                , address2
                , address3
                , address4
                , birthday
                , common_user_id
                , date_begin
                , date_create
                , date_end
                , date_update
                , education
                , gender
                , id
                , major
                , name
                , qiwanghangye
                , qiwangzhiwei
                , school
                , uuid
                , yixiangchengshi
              from resume
              where id in (${data.list})
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('by-candidate' === option) {
          let sql = `
              select address1
                , address2
                , address3
                , address4
                , birthday
                , common_user_id
                , date_begin
                , date_create
                , date_end
                , date_update
                , education
                , gender
                , id
                , major
                , name
                , qiwanghangye
                , qiwangzhiwei
                , school
                , uuid
                , yixiangchengshi
              from resume
              where common_user_id = ?
              `;
          cnx.execute(sql, [data.id], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('by-subscriber_list' === option) {
          let sql = `
              select id
                , common_user_id
                , name
              from resume
              where common_user_id in (${data.list})
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};