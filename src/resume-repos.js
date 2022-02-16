const pool = require('./mysql');

module.exports = {
  statistic: (option) =>
    new Promise((resolve, reject) => {
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

  get: (option, data) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if (option === '') {
          const sql = 'select * from resume where id = ?  and uuid = ?';
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

  update: (option, data) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if (option === 'status') {
          const sql = 'update resume set status = ? where id = ?';
          cnx.execute(sql, [data.status, data.id], (err1, result) => {
            if (err1) reject(err1);
            resolve(result);
          });
        }
        if (option === 'certificate') {
          const sql = 'update resume set certificate = ? where id = ?';
          cnx.execute(
            sql,
            [data.certificate, data.id],
            (errExecute, result) => {
              if (errExecute) reject(errExecute);
              resolve(result);
            },
          );
        }
        if (option === 'skill') {
          const sql = 'update resume set skill = ? where id = ?';
          cnx.execute(sql, [data.skill, data.id], (errExecute, result) => {
            if (errExecute) reject(errExecute);
            resolve(result);
          });
        }
        if (option === 'career') {
          const sql = 'update resume set career = ? where id = ?';
          cnx.execute(sql, [data.career, data.id], (errExecute, result) => {
            if (errExecute) reject(errExecute);
            resolve(result);
          });
        }
        if (option === 'record') {
          const sql = 'update resume set record = ? where id = ?';
          cnx.execute(sql, [data.record, data.id], (errExecute, result) => {
            if (errExecute) reject(errExecute);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    }),

  filter: (option, data) =>
    new Promise((resolve, reject) => {
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
        select id, common_user_id, name
        from resume
        where common_user_id in (${data.list})
        `;
          cnx.execute(sql, [], (err1, result) => {
            if (err1) reject(err1);
            resolve(result);
          });
        }
        if (option === 'by-education-addressLevel2-qiwanghangye-qiwangzhiwei') {
          const skip = data.page > 0 ? data.page * 20 : 0;
          cnx.execute(
            `
        select *
        from resume
        where education = ?
            and status != '保密'
            and status != '在职，暂不找工作'
            and position(? in address2) > 0
            and position(? in qiwanghangye) > 0
            and position(? in qiwangzhiwei) > 0
        order by date_update desc
        limit ${skip}, 20
        `,
            [
              data.education,
              data.addressLevel2,
              data.qiwanghangye,
              data.qiwangzhiwei,
            ],
            (errResult, result) => {
              if (errResult) reject(errResult);
              resolve(result);
            },
          );
        }
        pool.releaseConnection(cnx);
      });
    }),
};
