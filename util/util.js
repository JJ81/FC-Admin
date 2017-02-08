const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const randomstring = require('randomstring'); // randomstring
const moment = require('moment');

var util ={};

util.isValidEmail =  function (email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

util.checkOnlyDigit = function (num){
  return /^\d+$/.test(num);
};

// check password length
util.checkPasswordSize = function (pass, minimum) {
  if(pass.length >= minimum){
    return true;
  }
  return false;
};

util.deleteFile = function (_path, cb) {
  fs.unlink(path.normalize(_path), function (err) {
    if(err){
      console.error(err);
      cb(err, null);
    }else{
      console.log('deleted file');
      cb(null, true);
    }
  });
};

util.publishHashByMD5 = function (value) {
    // return md5(value);
    return md5(value + randomstring.generate(7));
};

/**
 * 정규표현식을 이용하여, 숫자만 추출한다. 
 */
util.getDigitOnly = function (str) {
    return str.replace(/[^0-9]/g, "");
};

/**
 * 정규표현힉으로, 핸드폰번호를 체크한다.
 * https://goo.gl/SJKff1
 */
util.isValidPhone = function (str) {
  
  var re = /^\d{3}\d{3,4}\d{4}$/;
  return re.test(str);

};

/**
 * 정규표현힉으로, 공백여부를 체크한다.
 * https://goo.gl/SJKff1
 */
util.hasSpace = function (str) {
  
  var re = /\s/g;
  return re.test(str);

};

// 공백을 모두 제거한다.
util.replaceEmptySpace = function (str) {
    return str.replace(/ /g, '').trim();
};

module.exports = util;