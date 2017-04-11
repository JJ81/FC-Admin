'use strict';
window.requirejs(
  [
    'common',
    'quiz_service'
  ],
function (Util) {
  var QuizService = require('quiz_service');

  // avoid to confliction between jquery tooltip and bootstrap tooltip
  window.$.widget.bridge('uibutton', window.$.ui.button);

  var btnAddQuizTypeA = window.$('#btn-add-quiz-a'); // 단답형
  var btnAddQuizTypeB = window.$('#btn-add-quiz-b'); // 선택형
  var btnAddQuizTypeC = window.$('#btn-add-quiz-c'); // 다답형
  var btnRegistQuiz = window.$('#regist-quiz'); // 등록
  var rootContainer = window.$('#createQuiz');

  var quizContainer = document.getElementById('quiz-container');
  // var _confirm = true; // 윈도우 종료 시 창을 닫을지 여부

  // 랜덤 문자열을 생성한다.
  function getRandomString () {
    return window.axios.get('/api/v1/course/group/id/create');
  }

  // 강의 세션수를 조회한다.
  function getSessionCount () {
    var courseId = window.$('input[name=course_id]').val();
    return window.axios.get('/course/sessioncount', {
      params: {
        id: courseId
      }
    });
  }

  window.$(function () {
    window.axios.all([
      getRandomString(),
      getSessionCount()
    ])
    .then(window.axios.spread(function (res1, res2) {
      var options = {
        root_wrapper: rootContainer,
        wrapper: quizContainer
      };

      var data = {
        course_id: window.$('input[name=course_id]').val(),
        course_list_id: null,
        quiz_group_id: res1.data.id,
        quiz_list: null,
        type: rootContainer.data('type'), // QUIZ/FINAL
        title: window.$('#title').val(),
        session_count: res2.data.session_count
      };

      QuizService = new QuizService(options, data, function (result) {
        // 퀴즈 등록시 호출된다.
        window.alert('퀴즈를 등록하였습니다.');
        window.parent.opener.location.reload(); // 부모폼을 reload 한다.

        // _confirm = false;
        window.close();
      });
    }));
  });

  window.$('.connectedSortable').sortable({
    placeholder: 'sort-highlight',
    connectWith: '.connectedSortable',
    handle: '.box-header',
    forcePlaceholderSize: true,
    zIndex: 999999,
    start: function (e, ui) {
      window.$(this).attr('data-previndex', ui.item.index());
    },
    update: function (e, ui) {
      var newIndex = ui.item.index();
      var oldIndex = window.$(this).attr('data-previndex');
      window.$(this).removeAttr('data-previndex');
                // console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
      QuizService.moveQuizIndexes(oldIndex, newIndex);
    }
  });

  /**
   * 단덥형 퀴즈 생성
   */
  btnAddQuizTypeA.bind('click', () => {
    QuizService.addQuizSingleAnswer();
  });

  /**
   * 선택형 퀴즈 생성
   */
  btnAddQuizTypeB.bind('click', () => {
    QuizService.addQuizMultiOptionWithOneAnswer();
  });

  /**
   * 다답형 퀴즈 생성
  */
  btnAddQuizTypeC.bind('click', () => {
    QuizService.addQuizMultiOptionWithMultiAnswer();
  });

  /**
   * 퀴즈 일체를 등록한다.
   *
   */
  btnRegistQuiz.bind('click', () => {
    QuizService.saveSessionAndQuiz();
  });
}); // end of func
