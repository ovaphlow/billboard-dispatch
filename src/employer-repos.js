const dayjs = require('dayjs');

const pool = require('./mysql');

module.exports = {
  signIn: (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        let sql = `
            select *
            from enterprise_user
            where phone = ?
              or email = ?
            `;
        cnx.execute(sql, [data.username, data.username], (err, result) => {
          if (err) reject(err);
          resolve(result[0] || {});
        });
        pool.releaseConnection(cnx);
      });
    });
  },

  statistic: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('qty-by-total-today' === option) {
          let sql = `
              select (select count(*) from enterprise) total
              , (select count(*) from enterprise where position(? in date) > 0) today
              `;
          cnx.execute(sql, [dayjs().format('YYYY-MM-DD')], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || { total: 0, today: 0 });
          });
        } else if ('to-certificate-qty' === option) {
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
          pool.releaseConnection(cnx);
        }
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
                , date
                , faren
                , id
                , industry
                , intro
                , name
                , phone
                , status
                , subject
                , url
                , uuid
                , yingyezhizhao
                , yingyezhizhao_tu
                , yuangongshuliang
                , zhuceriqi
                , zhuziguimo
              from enterprise
              where id = ?
                and uuid = ?
              limit 1
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result.length === 1 ? result[0] : {});
          });
        } else if ('user-by-employer' === option) {
          let sql = `
              select
                email
                , id
                , name
                , phone
                , uuid
              from enterprise_user
              where id = ?
                and uuid = ?
              limit 1
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || {});
          });
        } else if ('user-by-employer1' === option) {
          let sql = `
              select id
                , name
                , phone
                , email
                , enterprise_id
              from enterprise_user
              where enterprise_id = ?
                and enterprise_uuid = ?
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
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
        if ('' === option) {
          let sql = `
              select
                faren
                , id
                , name
                , phone
                , uuid
              from enterprise
              where position(? in name) > 0
                or position(? in phone) > 0
              order by id desc
              limit 100
              `;
          cnx.execute(sql, [data.keyword, data.keyword], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('user-by-user-id-list' === option) {
          let sql = `
              select
                email
                , enterprise_id
                , id
                , name
                , phone
                , uuid
              from enterprise_user
              where id in (${data.list})
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('filter-user-by-id-list' === option) {
          let sql = `
              select
                email
                , enterprise_id
                , id
                , name
                , phone
                , uuid
              from enterprise_user
              where enterprise_id in (${data.list})
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
