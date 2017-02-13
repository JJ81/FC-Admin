var express = require('express');
var router = express.Router();
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

router.get('/', isAuthenticated, function (req, res) {

    res.render('documentation', {
        current_path: 'Documentation',
        title: PROJ_TITLE + 'Documentation',
    });

});

module.exports = router;