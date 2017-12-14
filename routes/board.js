const express = require('express');
const router = express.Router();
const util = require('../util/util');
const pool = require('../commons/db_conn_pool');
const QUERY = require('../database/query');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    connection.release();

    if (err) throw err;

    connection.query(QUERY.BOARD.Select, [ req.user.fc_id ], (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          msg: err
        });
      } else {
        res.render('board', {
          current_path: 'Board',
          title: '게시판 관리',
          list: result
        });
      }
    });
  });
});

router.post('/', util.isAuthenticated, (req, res, next) => {
  const {
    title,
    contents,
    file = null
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.BOARD.Insert,
      [
        title,
        contents,
        req.user.admin_id,
        req.user.name,
        req.user.fc_id,
        file
      ],
      (err, result) => {
        connection.release();

        if (err) {
          return next({
            status: 500
          });
        } else {
          res.redirect('/board');
        }
      }
    );
  });
});

router.post('/update', util.isAuthenticated, (req, res, next) => {
  const {
    id,
    title,
    contents,
    file = null
  } = req.body;

  console.log(req.body);

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.BOARD.Update,
      [
        title,
        contents,
        file,
        id
      ],
      (err, result) => {
        connection.release();

        if (err) {
          console.log(err);
          return next({
            status: 500
          });
        } else {
          res.redirect('/board');
        }
      }
    );
  });
});

router.delete('/:id', util.isAuthenticated, (req, res, next) => {
  const {
    id
  } = req.params;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.BOARD.Delete,
      [
        id
      ],
      (err, result) => {
        connection.release();

        if (err) {
          return res({
            status: 500
          });
        } else {
          res.send({
            success: true
          });
        }
      }
    );
  });
});

module.exports = router;
