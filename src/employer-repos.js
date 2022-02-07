const dayjs = require('dayjs');

const pool = require('./mysql');

module.exports = {
  signIn: (data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      const sql = `
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
  }),

  statistic: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'qty-by-total-today') {
        const sql = `
              select (select count(*) from enterprise) total
              , (select count(*) from enterprise where position(? in date) > 0) today
              `;
        cnx.execute(sql, [dayjs().format('YYYY-MM-DD')], (err, result) => {
          if (err) reject(err);
          resolve(result[0] || { total: 0, today: 0 });
        });
      } else if (option === 'to-certificate-qty') {
        const sql = `
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
      } else if (option === 'user-by-employer') {
        const sql = `
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
      } else if (option === 'user-by-employer1') {
        const sql = `
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
  }),

  update: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'certificate') {
        cnx.execute(`
        update enterprise
        set status = '认证', yingyezhizhao_tu = null
        where id = ? and uuid = ?
        `, [data.id, data.uuid], (errResult, result) => {
          if (errResult) reject(errResult);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),

  filter: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === '') {
        const sql = `
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
      } else if (option === 'user-by-user-id-list') {
        const sql = `
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
      } else if (option === 'filter-user-by-id-list') {
        const sql = `
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
      if (option === 'to-certificate') {
        const sql = `
          select id, uuid, name, faren
          from enterprise
          where status = '待认证'
              and yingyezhizhao_tu is not null
              and position(? in name) > 0
          order by id desc
          `;
        cnx.execute(sql, [data.name], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }
      pool.releaseConnection(cnx);
    });
  }),
};
