const express = require('express');
const router = express.Router();
const util = require('../util/util');
// const pool = require('../commons/db_conn_pool');
// const QUERY = require('../database/query');
// const async = require('async');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  res.render('board', {
    current_path: 'Board',
    title: '게시판 관리'
  });
});

module.exports = router;
