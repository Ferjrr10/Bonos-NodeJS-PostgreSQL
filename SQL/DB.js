const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  password: 'root',
  host: '192.168.1.7',
  port: 5432, // default Postgres port
  database: 'postgres'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};