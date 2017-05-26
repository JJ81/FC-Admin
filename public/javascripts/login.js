/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
window.requirejs([
  'jquery',
  'jqueryCookie'
],
function (jQuery) {
  var $ = jQuery;
  var remember = $('#remember');
  var inputEmail = $('#email');
  var btnLogin = $('.btn-login');

  checkCookie();

  btnLogin.bind('click', function () {
    if ($.cookie('email') === undefined && remember.prop('checked')) {
      setCookie(inputEmail.val());
    }
  });

  remember.change('click', function () {
    if (!$(this).prop('checked')) {
      if ($.cookie('email') !== undefined) {
        removeCookie();
      }
    }
  });

  function setCookie (email) {
    $.cookie('email', email);
  }

  function getCookie () {
    inputEmail.val($.cookie('email'));
  }

  function checkCookie () {
    if ($.cookie('email') === undefined) {
      remember.prop('checked', false);
    } else {
      remember.prop('checked', true);
      getCookie();
    }
  }

  function removeCookie () {
    var removeCookie = window.confirm('저장된 아이디를 삭제하시겠습니까?');
    if (removeCookie) {
      $.removeCookie('email');
    }
  }
});

