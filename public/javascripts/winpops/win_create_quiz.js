'use strict';
requirejs(
  [
    // 'jquery',
    // 'axios',
    // 'jquery_ui',
    // 'bootstrap',
    // 'slimScroll',
    'common',
    'quiz_service'
  ],
function (Util) {
  var QuizService = require('quiz_service');

  // avoid to confliction between jquery tooltip and bootstrap tooltip
  $.widget.bridge('uibutton', $.ui.button);

  var btnAddQuizTypeA = $('#btn-add-quiz-a'); // 단답형
  var btnAddQuizTypeB = $('#btn-add-quiz-b'); // 선택형
  var btnAddQuizTypeC = $('#btn-add-quiz-c'); // 다답형
  var btnRegistQuiz = $('#regist-quiz'); // 등록
  var rootContainer = $('#createQuiz');

  var quizContainer = document.getElementById('quiz-container');
  // var _confirm = true; // 윈도우 종료 시 창을 닫을지 여부

  // 랜덤 문자열을 생성한다.
  function getRandomString () {
    return axios.get('/api/v1/course/group/id/create');
  }

        // 강의 세션수를 조회한다.
  function getSessionCount () {
    var courseId = $('input[name=course_id]').val();
    return axios.get('/course/sessioncount', {
      params: {
        id: courseId
      }
    });
  }

  $(function () {
    axios.all([
      getRandomString(),
      getSessionCount()
    ])
    .then(axios.spread(function (res1, res2) {
      var options = {
        root_wrapper: rootContainer,
        wrapper: quizContainer
      };

      var data = {
        course_id: $('input[name=course_id]').val(),
        course_list_id: null,
        quiz_group_id: res1.data.id,
        quiz_list: null,
        type: rootContainer.data('type'), // QUIZ/FINAL
        title: $('#title').val(),
        session_count: res2.data.session_count
      };

      QuizService = new QuizService(options, data, function (result) {
        // 퀴즈 등록시 호출된다.
        alert('퀴즈를 등록하였습니다.');
        window.parent.opener.location.reload(); // 부모폼을 reload 한다.

        // _confirm = false;
        window.close();
      });
    }));
  });

  $('.connectedSortable').sortable({
    placeholder: 'sort-highlight',
    connectWith: '.connectedSortable',
    handle: '.box-header',
    forcePlaceholderSize: true,
    zIndex: 999999,
    start: function (e, ui) {
      $(this).attr('data-previndex', ui.item.index());
    },
    update: function (e, ui) {
      var newIndex = ui.item.index();
      var oldIndex = $(this).attr('data-previndex');
      $(this).removeAttr('data-previndex');
                // console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
      QuizService.moveQuizIndexes(oldIndex, newIndex);
    }
  });

        /**
         * 단덥형 퀴즈 생성
         */
  btnAddQuizTypeA.bind('click', function () {
    QuizService.addQuizSingleAnswer();
  });

  /**
   * 선택형 퀴즈 생성
   */
  btnAddQuizTypeB.bind('click', function () {
    QuizService.addQuizMultiOptionWithOneAnswer();
  });

  /**
   * 다답형 퀴즈 생성
  */
  btnAddQuizTypeC.bind('click', function () {
    QuizService.addQuizMultiOptionWithMultiAnswer();
  });

  /**
   * 퀴즈 일체를 등록한다.
   *
   */
  btnRegistQuiz.bind('click', function () {
    QuizService.saveSessionAndQuiz();
  });
}); // end of func
