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
}

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

module.exports = util;