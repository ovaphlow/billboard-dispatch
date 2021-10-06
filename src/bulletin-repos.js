const pool = require('./mysql');

module.exports = {
  get: (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
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
        pool.releaseConnection(cnx);
      });
    });
  },

  update: (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
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
      });
    });
  },

  remove: (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        let sql = 'delete from bulletin where id = ? and uuid = ?';
        cnx.execute(sql, [data.id, data.uuid], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
        pool.releaseConnection(cnx);
      });
    });
  },

  filter: (option) => {
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
          pool.releaseConnection(cnx);
        }
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
          pool.releaseConnection(cnx);
        }
      });
    });
  },
};
