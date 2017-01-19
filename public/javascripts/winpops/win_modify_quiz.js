'use strict';
requirejs([
        'jquery',
        'axios',
        'jquery_ui',
        'bootstrap',
        'slimScroll',
        'quiz_service',    
    ],
    function ($, axios) {

        // 퀴즈 서비스
        var QuizService = require('quiz_service');

		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button); 

        // cache
        var _btn_add_quiz_a = $('#btn-add-quiz-a'); // 단답형
        var _btn_add_quiz_b = $('#btn-add-quiz-b'); // 선택형
        var _btn_add_quiz_c = $('#btn-add-quiz-c'); // 다답형        
        var _btn_modify_quiz = $('#modify-quiz'); // 등록
        var _root_container = $('#modifyQuiz');     // winpopup container 
        var _quiz_container = document.getElementById('quiz-container');  // quiz container

        var _course_id = $('input[name=course_id]').val();
        var _course_list_id = _root_container.data('course-list-id');
        var _course_list_order = _root_container.data('course-list-order');
        var _quiz_group_id = _root_container.data('quiz-group-id');        
        var _type = _root_container.data('type');
        var _title = $('#title').val();
        var _confirm = true; // 윈도우 종료 시 창을 닫을지 여부 

        /**
         * 모듈 초기화
         * 
         * TODO
         * 1. course_list_id 를 알아야한다.
         * 2. QuizService 에게 데이터 조회를 위한 키값들을 전달한다.
         * 3. QuizService 에서 데이터를 조회한다.
         * 3. QuizService 에서 조회한 데이터를 통해 QuizComponent 를 생성한다.
         * 4. 각각의 QuizComponent 에서는 자신을 수정,삭제할 수 있다.
         */
        $(function () {
            createQuizService();            
        });

        // jQuery UI sortable 초기화
        $('.connectedSortable').sortable({
            placeholder: "sort-highlight",
            connectWith: ".connectedSortable",
            handle: ".box-header",
            forcePlaceholderSize: true,
            zIndex: 999999,
            start: function(e, ui) {
                $(this).attr('data-previndex', ui.item.index());
            },
            update: function(e, ui) {
                var newIndex = ui.item.index();
                var oldIndex = $(this).attr('data-previndex');
                $(this).removeAttr('data-previndex');
                // console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
                QuizService.moveQuizIndexes(oldIndex, newIndex);
            }
        });       

        /**
         * 퀴즈 목록을 조회한다.
         * 
         */
        function getQuizList () {
            return axios.get('/api/v1/quizlist', {
                params: {
                    quiz_group_id: _quiz_group_id
                }
            });            
        }

        /**
         * QuizService 를 생성한다.
         * 
         */
        function createQuizService () {

            axios.all([
                getQuizList()
            ])
            .then(axios.spread(function (res) {                
                // 데이터가 통으로 넘어오기 때문에 퀴즈와 보기를 분리하는 작업을 수행.
                var quiz_list = res.data.quiz_list;

                // 퀴즈 서비스를 생성한다.
                var options = {
                    root_wrapper: _root_container,
                    wrapper: _quiz_container
                };

                var data = {
                    course_id: _course_id,
                    course_list_id: _course_list_id,
                    quiz_group_id: _quiz_group_id,
                    quiz_list: quiz_list,
                    type: _type, // QUIZ/FINAL
                    title: _title,
                    course_list_order: _course_list_order
                };

                QuizService = new QuizService(options, data, function (result) {
                    // 퀴즈 등록시 호출된다.                        
                    alert('자료를 수정하였습니다.');
                    window.parent.opener.location.reload(); // 부모폼을 reload 한다.

                    _confirm = false;
                    window.close();
                });                
            }));

        }   

        /**
         * 단덥형 퀴즈 생성
         */
        _btn_add_quiz_a.bind('click', function() {            
            QuizService.addQuizSingleAnswer();
        });

        /**
         * 선택형 퀴즈 생성
         */
        _btn_add_quiz_b.bind('click', function() {            
            QuizService.addQuizMultiOptionWithOneAnswer();
        });

        /**
         * 다답형 퀴즈 생성
         */
        _btn_add_quiz_c.bind('click', function() {            
            QuizService.addQuizMultiOptionWithMultiAnswer();
        });       

        /**
         * 퀴즈 일체를 수정한다.
         * 
         */
        _btn_modify_quiz.bind('click', function () {                        
            QuizService.saveSessionAndQuiz();
        });

        /**
         * 윈도우 팝업창 종료 시 발생
         * 
         */
        window.onbeforeunload = function (event) {

            if (_confirm)
                return confirm("진행중인 작업이 모두 사라집니다. 계속하시겠습니까?");
        };
    }
);
