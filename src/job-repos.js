const dayjs = require('dayjs');
const logger = require('./logger');
const pool = require('./mysql');

module.exports = {
  statistic: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('qty-by-total-today' === option) {
          let sql = `
              select (select count(*) from recruitment) total
                , (select count(*) from recruitment where position(? in date) > 0) today
              `;
          cnx.execute(sql, [dayjs().format('YYYY-MM-DD')], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || { total: 0, today: 0 });
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },

  get: (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        let sql = `
              select id
                , uuid
                , name
                , date
                , address1
                , address2
                , education
                , category
                , salary1
                , salary2
                , enterprise_id
                , enterprise_uuid
                , requirement
                , description
                , status
              from recruitment
              where id = ?
                and uuid = ?
              `;
        cnx.execute(sql, [data.id, data.uuid], (err, result) => {
          if (err) reject(err);
          resolve(result[0] || {});
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
              select address1
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
                and position(? in status) > 0
              limit 100
              `;
          cnx.execute(sql, [data.id, data.uuid, data.status], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('by-fair-id' === option) {
          let sql = `
              select address1
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
        } else if ('by-ref_id-fair' === option) {
          let sql = `
              select id
                , job_fair_id
                , json_overlaps(job_fair_id, '[${data.list}]') qty
              from billboard.recruitment
              where enterprise_id = ?
                and enterprise_uuid = ?
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('by-category-address_level2-industry-name' === option) {
          let sql = `
              select *
              from recruitment
              where status = '在招'
                and position(category in ?) > 0
                and position(? in address2) > 0
                and position(? in industry) > 0
                and (
                  position(? in name) > 0
                  or enterprise_id in (select id from enterprise where position(? in name) > 0)
                )
              order by date_refresh desc, id desc
              limit ${data.page > 1 ? (data.page - 1) * 100 : 0}, 100
              `;
          cnx.execute(sql, [data.category, data.address_level2, data.industry, data.name, data.name], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },

  batchUpdate: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('fair-save-by-employer' === option) {
          let sql = `
              update recruitment
              set job_fair_id = json_array_append(job_fair_id, '$', ?)
              where enterprise_id = ?
                and id in (${data.list})
              `;
          cnx.execute(sql, [`${data.fair_id}`, data.employer_id], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('fair-remove-by-employer' === option) {
          let sql = `
              update recruitment
              set job_fair_id = json_remove(job_fair_id,
                  json_unquote(json_search(job_fair_id, 'one', ?)))
              where enterprise_id = ?
                and id in (${data.list})
              `;
          cnx.execute(sql, [`${data.fair_id}`, data.employer_id], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};
