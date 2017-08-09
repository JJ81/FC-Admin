var mysql = require('mysql');
var config = require('../secret/db_info').dev;
const pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

// pool.on('acquire', function (connection) {
//   console.log('Connection %d acquired', connection.threadId);
// });

// pool.on('enqueue', function () {
//   console.log('Waiting for available connection slot');
// });

// pool.on('release', function (connection) {
//   console.log('Connection %d released', connection.threadId);
// });

// pool.on('connection', function (connection) {
//   console.log('New Sessino has created');
//   connection.query('SET SESSION auto_increment_increment=1');
// });

module.exports = pool;
