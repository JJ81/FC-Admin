
const QUERY = require('../database/query');
const async = require('async');
const Util = require('../util/util');
const pool = require('../commons/db_conn_pool');

exports.getAdminOffices = (req, res, next) => {
  const adminId = req.query.id;

  SelectAdminOffices(req.user.fc_id, adminId, (err, data) => {
    if (err) {
      return res.sendStatus(400);
    } else {
      return res.json(data);
    }
  });
};

const SelectAdminOffices = (fcId, adminId, callback) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.ADMIN.SelectAdminOffices,
      [ adminId, fcId ],
      (err, data) => {
        connection.release();
        if (err) throw err;
        callback(err, data);
      }
    );
  });
};
