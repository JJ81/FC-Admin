const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const randomstring = require('randomstring'); // randomstring
// const moment = require('moment');

exports.isValidEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

exports.checkOnlyDigit = (num) => {
  return /^\d+$/.test(num);
};

// check password length
exports.checkPasswordSize = (pass, minimum) => {
  if (pass.length >= minimum) {
    return true;
  }
  return false;
};

exports.deleteFile = (_path, cb) => {
  fs.unlink(path.normalize(_path), (err) => {
    if (err) {
      console.error(err);
      cb(err, null);
    } else {
      cb(null, true);
    }
  });
};

/**
 * 파일 존재유무를 반환한다.
 */
exports.FileExists = (_filePath, _callback) => {
  fs.stat(_filePath, (err, stat) => {
    _callback(err, null);
  });
};

exports.publishHashByMD5 = (value) => {
    // return md5(value);
  return md5(value + randomstring.generate(7));
};

/**
 * 정규표현식을 이용하여, 숫자만 추출한다.
 */
exports.getDigitOnly = function (str) {
  return str.replace(/[^0-9]/g, '');
};

/**
 * 정규표현힉으로, 핸드폰번호를 체크한다.
 * https://goo.gl/SJKff1
 */
exports.isValidPhone = (str) => {
  let re = /^\d{3}\d{3,4}\d{4}$/;
  return re.test(str);
};

/**
 * 정규표현힉으로, 공백여부를 체크한다.
 * https://goo.gl/SJKff1
 */
exports.hasSpace = (str) => {
  let re = /\s/g;
  return re.test(str);
};

// 공백을 모두 제거한다.
exports.replaceEmptySpace = (str) => {
  return str.replace(/ /g, '').trim();
};

exports.getLogoInfo = (req, res, next) => {
  let logoImageName;
  let logoName;
  let theme;
  let themeOfTile;
  let themeOfProgressBar;
  let copyright;

  switch (req.headers.host) {
  case 'admin.vodaeyewear.orangenamu.net':
    logoImageName = 'vodaeyewear.png';
    logoName = '보다안경원';
    theme = 'skin-green-light';
    themeOfTile = 'bg-gray';
    themeOfProgressBar = 'progress-bar-green';
    copyright = 'Copyright © 2017 Orangenamu ALL RIGHTS RESERVED.';
    break;
  case 'admin.waffle.kosc.orangenamu.net':
    logoImageName = 'waffle.kosc.png';
    logoName = '와플대학';
    theme = 'skin-yellow-light';
    themeOfTile = 'bg-red-active';
    themeOfProgressBar = 'progress-bar-yellow';
    copyright = 'Waffle university coop';
    break;
  default:
    // edu.orangenamu.net
    logoImageName = 'orangenamu.png';
    logoName = '오렌지나무시스템';
    theme = 'skin-yellow-light';
    themeOfTile = 'bg-gray';
    themeOfProgressBar = 'progress-bar-yellow';
    copyright = 'Copyright © 2017 Orangenamu ALL RIGHTS RESERVED.';
    break;
  }
  res.locals.logoImageName = logoImageName;
  res.locals.logoName = logoName;
  res.locals.theme = theme;
  res.locals.themeOfTile = themeOfTile;
  res.locals.themeOfProgressBar = themeOfProgressBar;
  res.locals.copyright = copyright;

  return next();
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
