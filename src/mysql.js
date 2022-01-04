const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '82.156.226.151',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'billboard',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.NODE_PROC || 1, 10) * 2 + 1,
  queueLimit: 0,
});

module.exports = pool;
