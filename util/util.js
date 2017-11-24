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
  return str.toString().replace(/ /g, '').trim();
};

exports.getLogoInfo = (req, res, next) => {
  let logoImageName;
  let logoName;
  let theme;
  let themeOfTile;
  let themeOfProgressBar;
  let copyright;
  let vodUrl;
  let uploadFolder;

  // console.log('host: ' + req.headers.host);

  switch (req.headers.host) {
  case 'waffle.edu1004.kr':
    logoImageName = 'waffle.kosc.png';
    logoName = '와플대학';
    theme = 'skin-yellow-light';
    themeOfTile = 'bg-blue-gradient';
    themeOfProgressBar = 'progress-bar-yellow';
    copyright = 'Waffle university coop';
    vodUrl = 'http://pcst.aquan.waffle.edu1004.kr/orangenamu/waffle/';
    uploadFolder = '/waffle';
    break;

  case 'momstouch.edu1004.kr':
    logoImageName = 'momstouch.png';
    logoName = '맘스터치';
    theme = 'skin-red-light';
    themeOfTile = 'bg-yellow-gradient';
    themeOfProgressBar = 'progress-bar-yellow';
    copyright = 'MOM\'S TOUCH';
    vodUrl = 'http://pcst.aquan.momstouch.edu1004.kr/orangenamu/momstouch/';
    uploadFolder = '/momstouch';
    break;

  case 'homesfood.edu1004.kr':
    logoImageName = 'homesfood-dark.png';
    logoName = '홈스푸드';
    theme = 'skin-black';
    themeOfTile = 'bg-black-gradient';
    themeOfProgressBar = 'progress-bar-yellow';
    copyright = '홈스푸드';
    vodUrl = 'http://pcst.aquan.homesfood.edu1004.kr/orangenamu/homesfood/';
    uploadFolder = '/homesfood';
    break;

  case 'artandheart.edu1004.kr':
    logoImageName = 'artandheart.png';
    logoName = '아트앤하트';
    theme = 'skin-blue-light';
    themeOfTile = 'bg-light-blue-gradient';
    themeOfProgressBar = 'progress-bar-yellow';
    copyright = '아트앤하트';
    vodUrl = 'http://pcst.aquan.artandheart.edu1004.kr/orangenamu/artandheart/';
    uploadFolder = '/artandheart';
    break;

  case 'dev.edu1004.kr':
  default:
    logoImageName = 'orangenamu.png';
    logoName = '오렌지나무시스템';
    theme = 'skin-yellow';
    themeOfTile = 'bg-gray';
    themeOfProgressBar = 'progress-bar-yellow';
    copyright = 'Copyright © 2017 Orangenamu ALL RIGHTS RESERVED.';
    vodUrl = 'http://pcst.aquan.dev.edu1004.kr/orangenamu/dev/';
    uploadFolder = '/dev';
    break;
  }
  res.locals.logoImageName = logoImageName;
  res.locals.logoName = logoName;
  res.locals.theme = theme;
  res.locals.themeOfTile = themeOfTile;
  res.locals.themeOfProgressBar = themeOfProgressBar;
  res.locals.copyright = copyright;
  res.locals.vodUrl = vodUrl;
  res.locals.uploadFolder = uploadFolder;

  return next();
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

exports.microtime = (getAsFloat) => {
  // php microtime 함수를 javascript 로 제작
  // https://stackoverflow.com/questions/38758655/php-microtime-in-javascript-or-angularjs
  var s, now, multiplier;

  now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
  multiplier = 1e3; // 1,000

  // Getting microtime as a float is easy
  if (getAsFloat) {
    return Math.round(now);
  }

    // Dirty trick to only get the integer part
  s = now | 0;

  return (Math.round((now - s) * multiplier) / multiplier) + ' ' + s;
};
