const dayjs = require('dayjs');

const pool = require('./mysql');

module.exports = {
  statistic: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'qty-by-total-today') {
        const sql = `
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
  }),

  get: (data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      const sql = `
              select id
                , uuid
                , name
                , date
                , address1
                , address2
                , address3
                , education
                , category
                , salary1
                , salary2
                , enterprise_id
                , enterprise_uuid
                , industry
                , position
                , requirement
                , description
                , status
                , qty
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
  }),

  update: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === '') {
        const sql = `
              update recruitment
              set name = ?,
                qty = ?,
                description = ?,
                requirement = ?,
                address1 = ?,
                address2 = ?,
                address3 = ?,
                salary1 = ?,
                salary2 = ?,
                education = ?,
                category = ?,
                industry = ?,
                position = ?
              where id = ?
                and uuid = ?
              `;
        cnx.execute(
          sql,
          [
            data.name,
            data.qty,
            data.description,
            data.requirement,
            data.address1,
            data.address2,
            data.address3,
            data.salary1,
            data.salary2,
            data.education,
            data.category,
            data.industry,
            data.position,
            data.id,
            data.uuid,
          ],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          },
        );
      } else if (option === 'by-status') {
        const sql = `
              update recruitment
              set status = ?
              where id = ?
                and uuid = ?
              `;
        cnx.execute(sql, [data.status, data.id, data.uuid], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      } else if (option === 'refresh') {
        const sql = `
            update recruitment set date_refresh = now() where id = ?
            `;
        cnx.execute(sql, [data.id], (err, result) => {
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
      if (option === 'by-id') {
        const sql = `
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
      } else if (option === 'list-by-employer-id') {
        const sql = `
              select address1
                , address2
                , address3
                , category
                , date
                , date_refresh
                , education
                , enterprise_id
                , enterprise_uuid
                , id
                , industry
                , job_fair_id
                , name
                , position
                , qty
                , salary1
                , salary2
                , status
                , uuid
              from recruitment
              where enterprise_id = ?
                and enterprise_uuid = ?
                and position(? in status) > 0
              `;
        cnx.execute(sql, [data.id, data.uuid, data.status], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      } else if (option === 'by-fair-id') {
        const sql = `
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
      } else if (option === 'by-ref_id-fair') {
        const sql = `
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
      } else if (option === 'by-category-address_level2-industry-name') {
        const sql = `
              select address1
                , address2
                , address3
                , category
                , date
                , date_refresh
                , education
                , enterprise_id
                , enterprise_uuid
                , id
                , industry
                , job_fair_id
                , name
                , position
                , qty
                , salary1
                , salary2
                , status
                , uuid
              from recruitment
              where status = '在招'
                and position(? in category) > 0
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
  }),

  /**
   * 参加/退出 线上招聘会
   */
  batchUpdate: (option, data) => new Promise((resolve, reject) => {
    pool.getConnection((err, cnx) => {
      if (err) reject(err);
      if (option === 'fair-save-by-employer') {
        const sql = `
              update recruitment
              set job_fair_id = (
                case
                when json_search(job_fair_id, 'one', ?) is null
                  then json_array_append(job_fair_id, '$', ?)
                else job_fair_id
                end)
              where enterprise_id = ?
                and id in (${data.list})
              `;
        cnx.execute(sql, [data.fair_id, `${data.fair_id}`, data.employer_id], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      } else if (option === 'fair-remove-by-employer') {
        const sql = `
              update recruitment
              set job_fair_id = json_remove(job_fair_id,
                  ifnull(json_unquote(json_search(job_fair_id, 'one', ?)), '$.E'))
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
  }),
};
