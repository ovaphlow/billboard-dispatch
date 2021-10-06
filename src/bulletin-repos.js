const pool = require('./mysql');

module.exports = {
  get: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('' === option) {
          let sql = `
            select id
              , uuid
              , dday
              , receiver
              , title
              , doc->>'$.content' content
              , doc->>'$.address_level1' address_level1
              , doc->>'$.address_level2' address_level2
              , doc->>'$.education' education
              , doc->>'$.industry' industry
            from bulletin
            where id = ?
              and uuid = ?
            limit 1
            `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result.length === 1 ? result[0] : {});
          });
        } else if ('campus' === option) {
          let sql = `
              select
                address_level1
                , address_level2
                , address_level3
                , address_level4
                , category
                , content
                , date
                , id
                , mis_user_id
                , school
                , time
                , title
                , uuid
              from campus
              where id = ?
                and uuid = ?
              limit 1
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || {});
          });
        } else if ('fair' === option) {
          let sql = `
              select
                content
                , datime
                , id
                , status
                , title
              from job_fair
              where id = ?
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

  update: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('' === option) {
          let sql = `
            update bulletin
            set uuid = ?
              , title = ?
              , dday = ?
              , receiver = ?
              , doc = ?
            where id = ?
              and uuid = ?
            `;
          cnx.execute(
            sql,
            [data.uuid, data.title, data.dday, data.receiver, data.doc, data.id, data.uuid],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('campus' === option) {
          let sql = `
              update campus
              set title = ?
                , date = ?
                , time = ?
                , address_level1 = ?
                , address_level2 = ?
                , address_level3 = ?
                , address_level4 = ?
                , school = ?
                , content = ?
                , category = ?
              where id = ?
                and uuid = ?
              `;
          cnx.execute(
            sql,
            [
              data.title,
              data.date,
              data.time,
              data.address_level1,
              data.address_level2,
              data.address_level3,
              data.address_level4,
              data.school,
              data.content,
              data.category,
              data.id,
              data.uuid,
            ],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('fair' === option) {
          let sql = `
              update job_fair
              set title = ?
                , content = ?
                , datime = ?
                , status = ?
              where id = ?
              `;
          cnx.execute(
            sql,
            [data.title, data.content, data.title, data.status, data.id],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        }
        pool.releaseConnection(cnx);
      });
    });
  },

  remove: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('' === option) {
          let sql = 'delete from bulletin where id = ? and uuid = ?';
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('campus' === option) {
          let sql = 'delete from campus where id = ? and uuid = ?';
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('fair' === option) {
          let sql = 'delete from job_fair where id = ? 1';
          cnx.execute(sql, [data.id], (err, result) => {
            if (err) reject(err);
            resolve(result);
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
        if ('bulletin' === option) {
          let sql = `
              select *
              from bulletin
              order by id desc
              limit 20
              `;
          cnx.execute(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('campus' === option) {
          let sql = `
              select
                address_level1
                , address_level2
                , address_level3
                , address_level4
                , category
                , date
                , id
                , mis_user_id
                , school
                , time
                , title
                , uuid
              from campus
              where position(? in date) > 0
                and position(? in title) > 0
              order by id desc
              limit 20
              `;
          cnx.execute(sql, [data.date, data.title], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('fair' === option) {
          let sql = `
              select
                content
                , datime
                , id
                , status
                , title
              from job_fair
              order by id desc
              limit 100
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

  save: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('bulletin' === option) {
          let sql = `
            insert into bulletin (uuid
              , title
              , dday
              , receiver
              , doc)
              values(?, ?, ?, ?, ?)
            `;
          cnx.execute(
            sql,
            [data.uuid, data.title, data.dday, data.receiver, data.doc],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('campus' === option) {
          let sql = `
              insert into campus (
                uuid
                , mis_user_id
                , title
                , date
                , time
                , address_level1
                , address_level2
                , address_level3
                , address_level4
                , school
                , content
                , category
              ) values(
                uuid()
                , 0
                , ?
                , ?
                , ?
                , ?
                , ?
                , ?
                , ?
                , ?
                , ?
                , ?
              )
              `;
          cnx.execute(
            sql,
            [
              data.title,
              data.date,
              data.time,
              data.address_level1,
              data.address_level2,
              data.address_level3,
              data.address_level4,
              data.school,
              data.content,
              data.category,
            ],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('fair' === option) {
          let sql = `
              insert into job_fair (title
                                    , content
                                    , datime)
              values(?, ?, ?)
              `;
          cnx.execute(sql, [data.title, data.content, data.datime], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};
