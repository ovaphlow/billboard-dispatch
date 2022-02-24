import Router from '@koa/router';
import grpc from 'grpc';

import { default as stub } from './bulletin-stub.js';
import { default as logger } from './logger.js';
import { default as pool } from './mysql.js';

export const router = new Router({
  prefix: '/api/job-fair',
});

export const filterFairById = async (data) => {
  const client = pool.promise();
  const sql = `
  select * from job_fair where id = ?
  `;
  const param = [data.id];
  const [result] = await client.execute(sql, param);
  return result;
};

// wx-minip job-fair/List.jsx
router.get('/', async (ctx) => {
  try {
    const grpcClient = new stub.Fair(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.list(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch({});
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});

// wx-minip job-fair/Details.jsx
router.get('/:id', async (ctx) => {
  try {
    const grpcClient = new stub.Fair(
      ctx.grpc_service,
      grpc.credentials.createInsecure(),
    );
    const grpcFetch = (body) =>
      new Promise((resolve, reject) => {
        grpcClient.get(body, (err, response) => {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response.data);
          }
        });
      });
    ctx.response.body = await grpcFetch(ctx.params);
  } catch (err) {
    logger.error(err);
    ctx.response.body = { message: '服务器错误' };
  }
});
