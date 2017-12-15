const express = require('express');
const router = express.Router();
const util = require('../util/util');
const pool = require('../commons/db_conn_pool');
const QUERY = require('../database/query');
const async = require('async');

const aws = require('aws-sdk');
const multer = require('multer');
// const multerS3 = require('multer-s3');
const memorystorage = multer.memoryStorage();
const upload = multer({ storage: memorystorage });

aws.config.loadFromPath('./secret/aws-config.json');

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
          list: result,
          loggedIn: req.user
        });
      }
    });
  });
});

router.post('/', util.isAuthenticated, upload.array('file'), (req, res, next) => {
  const {
    title,
    contents
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;

    const s3upload = callback => {
      if (!req.files) {
        callback(null, null);
      } else {
        req.files.forEach((fileObj, index) => {
          const params = {
            Bucket: 'orange-checklist',
            Key: fileObj.originalname,
            ACL: 'public-read',
            ContentType: fileObj.mimetype
          };

          const s3 = new aws.S3({ params });

          s3.upload({ Body: fileObj.buffer })
            .on('httpUploadProgress', event => {
              console.log(event);
            })
            .send((err, data) => {
              callback(err, data ? data.Location : null);
            });
        });
      }
    };

    const insert = (filename, callback) => {
      connection.query(QUERY.BOARD.Insert,
        [
          title,
          contents,
          req.user.admin_id,
          req.user.name,
          req.user.fc_id,
          filename
        ],
        (err, result) => {
          callback(err, result);
        }
      );
    };

    async.waterfall([
      s3upload,
      insert
    ], (err, result) => {
      connection.release();

      if (err) {
        return next({
          status: 500
        });
      } else {
        res.redirect('/board');
      }
    });
  });
});

router.post('/update', util.isAuthenticated, upload.array('file'), (req, res, next) => {
  const {
    id,
    title,
    contents
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;

    const s3upload = callback => {
      if (!req.files) {
        callback(null, null);
      } else {
        req.files.forEach((fileObj, index) => {
          const params = {
            Bucket: 'orange-checklist',
            Key: fileObj.originalname,
            ACL: 'public-read',
            ContentType: fileObj.mimetype
          };

          const s3 = new aws.S3({ params });

          s3.upload({ Body: fileObj.buffer })
            .on('httpUploadProgress', event => {
              console.log(event);
            })
            .send((err, data) => {
              callback(err, data ? data.Location : null);
            });
        });
      }
    };

    const update = (filename, callback) => {
      connection.query(QUERY.BOARD.Update,
        [
          title,
          contents,
          filename,
          id
        ],
        (err, result) => {
          callback(err, result);
        });
    };

    async.waterfall([
      s3upload,
      update
    ], (err, result) => {
      connection.release();

      if (err) {
        console.log(err);
        return next({
          status: 500
        });
      } else {
        res.redirect('/board');
      }
    });
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
