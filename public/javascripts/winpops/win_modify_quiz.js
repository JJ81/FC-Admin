'use strict';
requirejs([
  'common',
  'quiz_service'
],
function (Util) {
    // 퀴즈 서비스
  var QuizService = require('quiz_service');

  // avoid to confliction between jquery tooltip and bootstrap tooltip
  $.widget.bridge('uibutton', $.ui.button);

    // cache
  var btnAddQuizTypeA = $('#btn-add-quiz-a'); // 단답형
  var btnAddQuizTypeB = $('#btn-add-quiz-b'); // 선택형
  var btnAddQuizTypeC = $('#btn-add-quiz-c'); // 다답형
  var btnModifyQuiz = $('#modify-quiz'); // 등록
  var rootContainer = $('#modifyQuiz');     // winpopup container
  var quizContainer = document.getElementById('quiz-container');  // quiz container

  var courseId = $('input[name=course_id]').val();
  var courseListId = rootContainer.data('course-list-id');
  var courseListOrder = rootContainer.data('course-list-order');
  var quizGroupId = rootContainer.data('quiz-group-id');
  var _type = rootContainer.data('type');
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
   * 퀴즈 목록을 조회한다.
   *
   */
  function getQuizList () {
    return axios.get('/api/v1/quizlist', {
      params: {
        quiz_group_id: quizGroupId
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
      var quiz_list = res.data.quiz_list;
      var options = {
        root_wrapper: rootContainer,
        wrapper: quizContainer
      };

      var data = {
        course_id: courseId,
        course_list_id: courseListId,
        quiz_group_id: quizGroupId,
        quiz_list: quiz_list,
        type: _type, // QUIZ/FINAL
        title: _title,
        course_list_order: courseListOrder
      };

      QuizService = new QuizService(options, data, function (result) {
        // 퀴즈 등록시 호출된다.
        alert('자료를 수정하였습니다.');
        // window.parent.opener.location.reload(); // 부모폼을 reload 한다.
        window.parent.opener.winpop_listener();
        _confirm = false;
        window.close();
      });
    }));
  }

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
   * 퀴즈 일체를 수정한다.
   *
   */
  btnModifyQuiz.bind('click', function () {
    QuizService.saveSessionAndQuiz();
  });
});
