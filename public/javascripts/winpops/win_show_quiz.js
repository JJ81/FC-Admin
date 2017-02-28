'use strict';
requirejs([
  'common'
],
  function (Util) {
    var btnCheckQuiz = $('#check-quiz');
    var _answer = $('.answer');

    btnCheckQuiz.bind('click', function () {
      _answer.show();
    });
  }
);
