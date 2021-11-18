const dayjs = require('dayjs');
const logger = require('./logger');
const pool = require('./mysql');

module.exports = {
  statistic: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('campus-qty-by-total-today' === option) {
          let sql = `
              select (select count(*) qty from campus) total
                , (select count(*)
                   from campus
                   where position(? in mp->>'$.create_at') > 0) today
              `;
          cnx.execute(sql, [dayjs().format('YYYY-MM-DD')], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || { total: 0, today: 0 });
          });
        } else if ('notification-qty-by-total-today' === option) {
          let sql = `select (select count(*) from recommend) total
              , (select count(*) from recommend where position(? in date_create) > 0) today
              `;
          cnx.execute(sql, [dayjs().format('YYYY-MM-DD')], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || { total: 0, today: 0 });
          });
        } else if ('tuijian-today' === option) {
          let sql = `
              select count(*) qty
              from recommend
              where position(? in date_create) > 0
              `;
          cnx.execute(sql, [data.date], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || {});
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },

  get: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('banner' === option) {
          let sql = `
              select
                category
                , comment
                , data_url
                , datime
                , id
                , source_url
                , status
                , title
                , uuid
              from banner
              where id = ?
                and uuid = ?
              limit 1
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || {});
          });
        } else if ('' === option) {
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
              select id
                , datime
                , title
                , content
                , status
              from job_fair
              where id = ?
              limit 1
              `;
          cnx.execute(sql, [data.id], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || {});
          });
        } else if ('notification' === option) {
          let sql = `
                select
                  address_level1
                  , address_level2
                  , baomignfangshi
                  , category
                  , content
                  , date1
                  , date2
                  , date_create
                  , id
                  , publisher
                  , qty
                  , title
                  , uuid
              from recommend
              where id = ?
                and uuid = ?
              `;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result[0] || {});
          });
        } else if ('topic' === option) {
          let sql = `
              select
                content
                , date
                , id
                , mis_user_id
                , tag
                , time
                , title
                , uuid
              from topic
              where id = ?
                and uuid = ?
              limit 1
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

  update: (option, data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, cnx) => {
        if (err) reject(err);
        if ('banner' === option) {
          let sql = `
              update banner
              set status = ?
                , category = ?
                , title = ?
                , comment = ?
                , datime = ?
                , data_url = ?
              where id = ?
                and uuid = ?
              `;
          cnx.execute(
            sql,
            [data.status, data.category, data.title, data.comment, data.datime, data.data_url, data.id, data.uuid],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('' === option) {
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
          cnx.execute(sql, [data.title, data.content, data.title, data.status, data.id], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('notification' === option) {
          let sql = `
              update recommend
              set category = ?
                , title = ?
                , date1 = ?
                , date2 = ?
                , address_level1 = ?
                , address_level2 = ?
                , publisher = ?
                , qty = ?
                , baomignfangshi = ?
                , content = ?
              where id = ?
                and uuid = ?
              `;
          cnx.execute(
            sql,
            [
              data.category,
              data.title,
              data.date1,
              data.date2,
              data.address_level1,
              data.address_level2,
              data.publisher,
              data.qty,
              data.baomingfangshi,
              data.content,
              data.id,
              data.uuid,
            ],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('topic' === option) {
          let sql = `
              update topic
              set title = ?
                , tag = ?
                , date = ?
                , time = ?
                , content = ?
              where id = ?
                and uuid = ?
              `;
          cnx.execute(
            sql,
            [data.title, data.tag, data.date, data.time, data.content, data.id, data.uuid],
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
        if ('banner' === option) {
          let sql = `delete from banner where id = ? and uuid = ?`;
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('' === option) {
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
        } else if ('notification' === option) {
          let sql = 'delete from recommend where id = ? and uuid = ?';
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('topic' === option) {
          let sql = 'delete from topic where id = ? and uuid = ?';
          cnx.execute(sql, [data.id, data.uuid], (err, result) => {
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
        if ('banner' === option) {
          let sql = `
              select
                category
                , comment
                , data_url
                , datime
                , id
                , source_url
                , status
                , title
                , uuid
              from banner
              where category = ?
                and status = ?
              order by datime desc
              limit 20
              `;
          cnx.execute(sql, [data.category, data.status], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('banner-by-category' === option) {
          let sql = `
              select id, uuid, datime, data_url, source_url, category
              from banner
              where category = ?
                and status = '启用'
              order by datime desc
              `;
          cnx.execute(sql, [data.category], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('bulletin' === option) {
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
        } else if ('bulletin-by-tag' === option) {
          let sql = `
              select id
                , uuid
                , title
                , b.doc->>'$.content' content
                , dday
              from bulletin b
                -- left join resume r on r.education = b.doc ->> '$.education'
                --   and r.address1 = b.doc ->> '$.address_level1'
                --   and r.address2 = b.doc ->> '$.address_level2'
              where dday >= CURRENT_DATE
                and receiver = ?
              order by id desc
              `;
          cnx.execute(sql, [data.tag], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('campus' === option) {
          let sql = `
              select address_level1
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
        } else if ('campus-by-id-list' === option) {
          let sql = `
              select address_level1
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
              where id in ${data.id_list}
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('campus-by-address_level2-category-keyword' === option) {
          let sql = `
              select id
                , uuid
                , title
                , address_level3
                , address_level2
                , date
                , school
                , category
              from campus
              where date >= curdate()
                and position(? in address_level2) > 0
                and position(category in ?) > 0
                and (position(? in title) > 0 or position(? in school) > 0)
              order by date
              `;
          cnx.execute(sql, [data.address_level2, data.category, data.keyword, data.keyword], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('fair' === option) {
          let sql = `
              select id
                , datime
                , status
                , title
                , content
              from job_fair
              order by id desc
              limit 100
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('fair-by-status' === option) {
          let sql = `
              select id
                , datime
                , status
                , title
              from job_fair
              where status = ?
              order by id desc
              `;
          cnx.execute(sql, [data.status], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('notification' === option) {
          let sql = `
              select address_level1
                , address_level2
                , baomignfangshi
                , category
                , date1
                , date2
                , id
                , publisher
                , qty
                , title
                , uuid
              from recommend
              where position(? in title) > 0
                and ? between date1 and date2
              order by id desc
              `;
          cnx.execute(sql, [data.title, data.date], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('notification-by-id_list' === option) {
          let sql = `
              select address_level1
                , address_level2
                , baomignfangshi
                , category
                , date1
                , date2
                , id
                , publisher
                , qty
                , title
                , uuid
              from recommend
              where id in (${data.id_list})
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('notification-wx-default' === option) {
          let sql = `
              select id, uuid, category, title, date1, date2, address_level1, address_level2,
                publisher, qty, baomignfangshi
              from recommend
              where position(category in ?) > 0
                and position(? in address_level2) > 0
                and position(? in title) > 0
              order by date1 desc, date2
              limit ${data.page > 1 ? (data.page - 1) * 50 : 0}, 50
              `;
          cnx.execute(sql, [data.category, data.address_level2, data.keyword], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('notification-by-category-address_level2-title' === option) {
          let sql = `
              select id, uuid, category, title, date1, date2, address_level1, address_level2,
                publisher, qty, baomignfangshi
              from recommend
              where position(? in category) > 0
                and position(? in address_level2) > 0
                and position(? in title) > 0
              order by date1 desc, date2
              limit ${data.page > 1 ? (data.page - 1) * 50 : 0}, 50
              `;
          cnx.execute(sql, [data.category, data.address_level2, data.keyword], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('topic' === option) {
          let sql = `
              select
                date
                , id
                , mis_user_id
                , tag
                , time
                , title
                , uuid
              from topic
              where position(? in date) > 0
                and position(? in title) > 0
              order by id desc
              limit 100
              `;
          cnx.execute(sql, [data.date, data.title], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('topic-by-limit' === option) {
          // 用于企业网站
          let sql = `
              select id
                , uuid
                , date
                , time
                , tag
                , title
                , content
                , mis_user_id
              from topic
              where tag != '热门话题'
              order by id desc
              limit 5
              `;
          cnx.execute(sql, [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        } else if ('topic-wxmp-by-limit' === option) {
          // 用于微信小程序
          let sql = `
              select id
                , uuid
                , date
                , time
                , tag
                , title
              from topic
              where tag = '热门话题'
              order by id desc
              limit 9
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
        if ('banner' === option) {
          let sql = `
              insert into banner
                (uuid, status, category, title, comment, datime, data_url)
                values(uuid(), ?, ?, ?, ?, ?, ?)
              `;
          cnx.execute(
            sql,
            [data.status, data.category, data.title, data.comment, data.datime, data.data_url],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('bulletin' === option) {
          let sql = `
            insert into bulletin (uuid
              , title
              , dday
              , receiver
              , doc)
              values(?, ?, ?, ?, ?)
            `;
          cnx.execute(sql, [data.uuid, data.title, data.dday, data.receiver, data.doc], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
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
        } else if ('notification' === option) {
          let sql = `
              insert into recommend (
                uuid
                , category
                , title
                , date1
                , date2
                , address_level1
                , address_level2
                , publisher
                , qty
                , baomignfangshi
                , content
              ) values(
                uuid()
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
              data.category,
              data.title,
              data.date1,
              data.date2,
              data.address_level1,
              data.address_level2,
              data.publisher,
              data.qty,
              data.baomingfangshi,
              data.content,
            ],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            },
          );
        } else if ('topic' === option) {
          let sql = `
              insert into topic (
                uuid
                , mis_user_id
                , tag
                , title
                , date
                , time
                , content
              ) values(
                uuid()
                , 0
                , ?
                , ?
                , ?
                , ?
                , ?
              )
              `;
          cnx.execute(sql, [data.tag, data.title, data.date, data.time, data.content], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        }
        pool.releaseConnection(cnx);
      });
    });
  },
};
