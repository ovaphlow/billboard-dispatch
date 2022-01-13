const pool = require('./mysql');

module.exports = {
  statistic: (option) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'by-qiwangzhiwei') {
        const sql = `
        select qiwangzhiwei, count(qiwangzhiwei) qty
        from resume
        where qiwanghangye != ''
          and qiwangzhiwei != ''
        group by qiwangzhiwei
        order by qty desc
        limit 10
        `;
        cnx.execute(sql, [], (err1, result) => {
          if (err1) reject(err1);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  get: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === '') {
        const sql = `
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
        cnx.execute(sql, [data.id, data.uuid], (err1, result) => {
          if (err1) reject(err1);
          resolve(result.length === 1 ? result[0] : {});
        });
      } else if (option === 'by-subscriber') {
        const sql = `
              select id
                , name
              from resume
              where common_user_id = ?
              limit 1
              `;
        cnx.execute(sql, [data.id], (err1, result) => {
          if (err1) reject(err1);
          resolve(result[0] || {});
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  update: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'status') {
        const sql = `
          update billboard.resume set status = ? where id = ?
          `;
        cnx.execute(sql, [data.status, data.id], (err1, result) => {
          if (err1) reject(err1);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  filter: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'by-id') {
        const sql = `
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
        cnx.execute(sql, [], (err1, result) => {
          if (err1) reject(err1);
          resolve(result);
        });
      } else if (option === 'by-candidate') {
        const sql = `
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
        cnx.execute(sql, [data.id], (err1, result) => {
          if (err1) reject(err1);
          resolve(result);
        });
      } else if (option === 'by-subscriber_list') {
        const sql = `
              select id
                , common_user_id
                , name
              from resume
              where common_user_id in (${data.list})
              `;
        cnx.execute(sql, [], (err1, result) => {
          if (err1) reject(err1);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),
};
