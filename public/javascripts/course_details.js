/**
 * Created by yijaejun on 30/11/2016.
 */

'use strict';
requirejs(
	[
		'jquery'
        ,'axios'
		,'common'
		,'moment'
		,'excellentExport'
		,'bootstrap'
		,'jquery_datatable'
		,'bootstrap_datatable'
		,'select2'
		,'daterangepicker'
		,'jquery_ui'
		,'adminLTE'
		,'fastclick'
        ,'es6-promise'
	],
	function ($, axios, Util) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button);

        require('es6-promise').polyfill(); // https://github.com/stefanpenner/es6-promise 참고

		var _winpop_option = 'scrollbars=yes, toolbar=no, location=no, status=no, menubar=no, ' +
			'resizable=yes, width=1040, height=760, left=0, top=0';
            
		var _btn_watch = $('.btn-watch-video');
		var _btn_solve_quiz = $('.btn-solve-quiz'); // 퀴즈/파이널테스트 보기
		var _btn_create_video = $('.btn-create-video'); // 비디오 보기
        var _btn_modify_video = $('.btn-modify-video'); // 비디오 수정
        var _btn_create_quiz = $('.btn-create-quiz'); // 퀴즈 생성
        var _btn_create_final = $('.btn-create-final'); // 파이널테스트 생성
        var _btn_delete_session = $('.btn-delete-session'); // 세션 삭제버튼
        var _btn_modify_session = $('.btn-modify-session'); // 세션 수정버튼

        $(function () {

            // jQuery UI sortable 초기화
            $('.course-session').sortable({
                placeholder: "sort-highlight",
                handle: ".handle",
                forcePlaceholderSize: true,
                zIndex: 999999,
                start: function(e, ui) {
                    $(this).attr('data-previndex', ui.item.index());
                },
                update: function(e, ui) {
                    var newIndex = ui.item.index();
                    var oldIndex = $(this).attr('data-previndex');
                    $(this).removeAttr('data-previndex');
                    console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
                    
                    changeSessionOrder();
                }
            });

        });

        // 비디오 보기
		_btn_watch.bind('click', function (e) {
			e.preventDefault();

			// 비디오 아이디를 추출
			var _video_id = $(this).attr('data-video-id');
			Util.createWindowPopup('/course/video?id='+_video_id,'Video', _winpop_option);
		});

        // 비디오 생성하기
		_btn_create_video.bind('click', function (e) {
			e.preventDefault();

			var _course_id = $(this).attr('data-course-id');
			Util.createWindowPopup('/course/create/video?course_id='+_course_id, 'Video', _winpop_option);

		});

        // 퀴즈 풀어보기
		_btn_solve_quiz.bind('click', function (e) {
			e.preventDefault();

            var _quiz_group_id = $(this).attr('data-quiz-group');
			var _title = $(this).attr('data-title');
			var _type = $(this).attr('data-type');

			Util.createWindowPopup('/course/quiz?id='+_quiz_group_id + '&title='+_title + '&type=' + _type, 'Quiz', _winpop_option);
		});

        // 퀴즈 생성하기
		_btn_create_quiz.bind('click', function (e) {
			e.preventDefault();

			var _course_id = $(this).attr('data-course-id');
			Util.createWindowPopup('/course/create/quiz?course_id=' +_course_id + '&type=QUIZ', 'Quiz', _winpop_option);
		});

        // 파이널테스트 생성하기
		_btn_create_final.bind('click', function (e) {
			e.preventDefault();

			var _course_id = $(this).attr('data-course-id');
			Util.createWindowPopup('/course/create/quiz?course_id=' +_course_id + '&type=FINAL', 'Final', _winpop_option);

		});

        /**
         * 세션관련정보를 삭제한다.
         * 주의사항: 
         * 세션과 관련된 일체를 실제 삭제하는 기능이므로, 꼭 필요한 경우에만 사용하도록 할 필요가 있다.
         * 
         * 1. 세션정보(course_list) 삭제
         * 2. 퀴즈 보기(quiz_option) 삭제
         * 3. 퀴즈(quiz) 를 삭제한다.
         * 4. 퀴즈 보기 그룹(quiz_group) 삭제
         */
        function deleteSession(params) {

            axios.delete('/course/courselist', 
            {
                params: params
            })            
            .then(function (response) {
                // console.log(response);
                alert("세션을 삭제하였습니다.");
                location.reload();
            })
            .catch(function (error) {
                console.log(error);
            });
        }

        /**
         * 세션을 삭제한다.
         * 
         */
        _btn_delete_session.bind('click', function (e) {
            // 세션 삭제
            e.preventDefault();

            if (!confirm("삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?"))
                return false;
            
            var params = {
                course_list_id: $(this).parent('span').data('course-list-id'),
                course_list_type: $(this).parent('span').data('type'),
                quiz_group_id: $(this).data('quiz-group'),
                video_id: $(this).data('video-id')
            };

            deleteSession(params);
        });         

        /** 
         * 세션 수정하기
         * 
         */
		_btn_modify_session.bind('click', function (e) {

			e.preventDefault();

            console.log('logging..');

			var course_id = $(this).parent('span').data('course-id');
            var course_list_id = $(this).parent('span').data('course-list-id');
            var video_id = $(this).data('video-id');
            var quiz_group_id = $(this).data('quiz-group');
            var type = $(this).parent('span').data('type'); // VIDEO/QUIZ/FINAL

            if (type === 'VIDEO') {
                Util.createWindowPopup('/course/modify/video?course_id=' + course_id + '&course_list_id=' + course_list_id + '&video_id=' + video_id, 'Video', _winpop_option);
            } else if (type === 'QUIZ' || type === 'FINAL') {
                Util.createWindowPopup('/course/modify/quiz?course_id=' + course_id + '&course_list_id=' + course_list_id + '&type=' + type + '&quiz_group_id=' + quiz_group_id, 'Quiz', _winpop_option);
            }
			    
		});      

        /**
         * DB 에서 세션 순서를 변경한다.
         */
        function makeSessionOrderChangeRequest (session) {
            return axios({
                method: 'put',
                url: '/course/courselist',
                data: {
                    title: session.children().children('a').data('title'),
                    course_list_id: session.children().children('a').data('id'),
                    course_list_order: session.index()
                }
            });            
        }

        /**
         * 세션순서를 변경한다.
         */
        function changeSessionOrder () {
            
            var promises = [];
            var items = $('.session-list'); //.children().children('a');
            
            for (var index = 0; index < items.length; index++) {
                promises.push(makeSessionOrderChangeRequest($(items[index])));
            }

            axios.all(promises).then(function(results) {
                results.forEach(function(response) {
                    // console.log(response);
                });
            });
        }        

	}); // end of func