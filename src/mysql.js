const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'billboard',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.NODE_PROC, 10) * 2,
  queueLimit: 0,
});

module.exports = pool;
