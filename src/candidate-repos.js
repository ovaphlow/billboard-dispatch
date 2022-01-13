const dayjs = require('dayjs');

const pool = require('./mysql');

module.exports = {
  statistic: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'qty-by-total-today') {
        const sql = `
              select (select count(*) from common_user) total
                , (select count(*) from common_user where position(? in date_create) > 0) today
              `;
        cnx.execute(sql, [dayjs().format('YYYY-MM-DD')], (err, result) => {
          if (err) reject(err);
          resolve(result[0] || { total: 0, today: 0 });
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  signIn: (data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      const sql = `
            select id, uuid, email, name, phone, wx_openid, password, salt
            from common_user
            where email = ?
              or phone = ?
            `;
      cnx.execute(sql, [data.username, data.username], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }),

  get: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === '') {
        const sql = `
            select
              email
              , id
              , name
              , phone
              , uuid
            from common_user
            where id = ?
              and uuid = ?
            limit 1
            `;
        cnx.execute(sql, [data.id, data.uuid], (err, result) => {
          if (err) reject(err);
          resolve(result.length === 1 ? result[0] : {});
        });
      } else if (option === 'password') {
        const sql = `
              select password, salt
              from common_user
              where id = ?
                and uuid = ?
              limit 1`;
        cnx.execute(sql, [data.id, data.uuid], (err, result) => {
          if (err) reject(err);
          resolve(result.length === 1 ? result[0] : {});
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  update: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'password') {
        const sql = `
              update common_user
              set password = ?
              where id = ?
                and uuid = ?
              `;
        cnx.execute(sql, [data.password, data.id, data.uuid], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  filter: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'by-id-list') {
        const sql = `
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
      } else if (option === 'by-keyword') {
        const sql = `
              select
                email
                , id
                , name
                , phone
                , uuid
              from common_user as cu
              where position(? in name) > 0
                or position(? in phone) > 0
              order by id desc
              limit 100
              `;
        cnx.execute(sql, [data.keyword, data.keyword], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),
};
