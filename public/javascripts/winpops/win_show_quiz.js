'use strict';
requirejs([
        'jquery'
    ], 
    function ($) {
        
        var _btn_check_quiz = $('#check-quiz');
        var _answer = $('.answer');

        $(function () {
        });

        _btn_check_quiz.bind('click', function () {
            _answer.show();
        });

    }
);