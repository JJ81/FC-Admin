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


module.exports = util;