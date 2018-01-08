
const QUERY = require('../database/query');
const pool = require('../commons/db_conn_pool');

/**
 * 관리자에게 지정된 점포목록을 반환합니다.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
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

/**
 * 관리자에게 지정된 점포목록을 조회합니다.
 * @param {*} fcId FC 아이디
 * @param {*} adminId 관리자 아이디
 * @param {*} callback 콜백함수
 */
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
