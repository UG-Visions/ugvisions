// database/connection.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load environment variables from .env file

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',          // environment variable ya default localhost
  user: process.env.DB_USER || 'root',               // environment variable ya default root
  password: process.env.DB_PASS || 'IN SHA ALLAH',   // environment variable ya default password
  database: process.env.DB_NAME || 'ugvisions',      // environment variable ya default database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
