const pool = require('./mysql');

module.exports = {
  get: (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        let sql = `
            select
              address1
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
              select
                address1
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
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};
