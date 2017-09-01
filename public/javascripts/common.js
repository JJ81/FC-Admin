/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
window.define(
  [
    'jquery',
    'jszip',
    'axios',
    'moment',
    'pace',
    'lodash',
    'handlebars',
    'tinymce',
    'bootstrap',
    'bootstrap_datetimepicker',
    'jquery-ui',
    'datatables.net',
    'datatables.net-bs',
    // 'datatables.net-buttons',
    'buttons.bootstrap',
    'buttons.html5',
    'buttons.print',
    'datatables.net-responsive',
    'responsive.bootstrap',
    'select2',
    'adminLTE',
    'fastclick',
    'es6-promise',
    'dom-checkbox',
    'tag-it'
    // 'smoothstate'
  ],
function ($, jszip, axios, moment, pace, _, Handlebars) {
  // window.alert(_.VERSION);
  pace.start({
    document: false
  });

  // $('#wrapper').smoothState({
  //   repeatDelay: 500
  // });

  // 전역으로 선언해야 동작되는 라이브러리들을 window 객체에 할당한다.
  window.JSZip = jszip;
  window.axios = axios;
  window.moment = moment;

  $.widget.bridge('uibutton', $.ui.button);

  // https://github.com/stefanpenner/es6-promise 참고
  require('es6-promise').polyfill();

  // show modal to reset password
  $('.btn-modify-password').bind('click', function () {
    $('#frm_set_employee_password .user_id').val($(this).attr('data-user-id'));
    $('#frm_set_employee_password .user_name').val($(this).attr('data-user-name'));
    $('#frm_set_employee_password').attr('action', $(this).attr('data-url'));
  });

  window.Handlebars = Handlebars;
  Handlebars.registerHelper('isEquals', function (a, b) {
    return (a === b);
  });

  $('#js--achievement-group').on('click', function () {
    var $this = $(this);

    if (!$this.hasClass('active')) {
      window.location.href = '/achievement';
    }
  });

  $('#js--education-group').on('click', function () {
    var $this = $(this);

    if (!$this.hasClass('active')) {
      window.location.href = '/simple_assignment';
    }
  });

  Handlebars.registerHelper('star-rating', function (rating) {
    var _class = '';
    if (rating === 0) {
      _class = 'empty';
    } else if (rating > 0 && rating < 1.4) {
      _class = 'half';
    } else if (rating > 0 && rating <= 1.4) {
      _class = 'one';
    } else if (rating >= 1.5 && rating < 2) {
      _class = 'onehalf';
    } else if (rating >= 2 && rating < 2.5) {
      _class = 'two';
    } else if (rating >= 2.5 && rating < 3) {
      _class = 'twohalf';
    } else if (rating >= 3 && rating < 3.5) {
      _class = 'three';
    } else if (rating >= 3.5 && rating < 4) {
      _class = 'threehalf';
    } else if (rating >= 4 && rating < 4.5) {
      _class = 'four';
    } else if (rating >= 4.5 && rating < 5) {
      _class = 'fourhalf';
    } else {
      _class = ''; // full
    }
    return _class;
  });

  window.tinymce.init({
    mode: 'specific_textareas',
    editor_selector: 'editor',
    height: 100,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table contextmenu paste code'
    ],
    language: 'ko_KR',
    toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | table',
    // content_css: [
    //   '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
    //   '//www.tinymce.com/css/codepen.min.css'
    // ],
    editor_deselector: 'mceOthers'
  });

  // window.tinymce.init({
  //   // selector: 'textarea',
  //   mode: 'specific_textareas',
  //   editor_selector: 'editor',
  //   // theme: 'simple',
  //   height: 100,
  //   theme: 'modern',
  //   plugins: [
  //     'link image textcolor lists'
  //             // 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
  //             // 'searchreplace wordcount visualblocks visualchars code fullscreen',
  //             // 'insertdatetime media nonbreaking save table contextmenu directionality',
  //             // 'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
  //   ],
  //   toolbar1: 'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image | forecolor backcolor',
  //         // toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  //         // toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
  //         // image_advtab: true,
  //   menubar: false,
  //   statusbar: false,
  //         // templates: [
  //         //     { title: 'Test template 1', content: 'Test 1' },
  //         //     { title: 'Test template 2', content: 'Test 2' }
  //         // ],
  //         // content_css: [
  //         //     '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
  //         //     '//www.tinymce.com/css/codepen.min.css'
  //         // ],
  //   language: 'ko_KR',
  //   valid_elements: 'i,sub,sup',
  //   invalid_elements: 'p, script',
  //   editor_deselector: 'mceOthers'
  // });

  return {
    cutBytes: function (str, limit) {
      var len = str.length;
      while (this.getBytes(str) > limit) {
        len--;
        str = str.substring(0, len);
      }
      return str;
    },
    getBytes: function (str) {
      var size = 0;
      if (str !== null) {
        for (var index = 0; index < str.length; index++) {
          var chr = escape(str.charAt(index));
          if (chr.indexOf('%u') !== -1) {
            size += 2;
          } else {
            size++;
          }
        }
      }
      return size;
    },
    // text editor 를 초기화 한다.
    initTextEditor: function (_selector, options) {
      window.tinymce.init({
        selector: _selector
      });
    },
    initDataTable: function (element, options) {
      var table = null;
      var _options = {};

      if (options == null) {
        _options.order = [[ 0, '' ]];
      } else {
        _options = options;
      }
      _options.deferRender = true;
      _options.responsive = true;
      // _options.language = { "url": "https://cdn.datatables.net/plug-ins/1.10.13/i18n/Korean.json" };
      _options.language = {
        'sEmptyTable': '데이터가 없습니다',
        'sInfo': '_START_ - _END_ / _TOTAL_',
        'sInfoEmpty': '0 - 0 / 0',
        'sInfoFiltered': '(총 _MAX_ 개)',
        'sInfoPostFix': '',
        'sInfoThousands': ',',
        'sLengthMenu': '페이지당 줄수: _MENU_',
        'sLoadingRecords': '읽는중...',
        'sProcessing': '처리중...',
        'sSearch': '검색:',
        'sZeroRecords': '검색 결과가 없습니다',
        'oPaginate': {
          'sFirst': '처음',
          'sLast': '마지막',
          'sNext': '다음',
          'sPrevious': '이전'
        },
        'oAria': {
          'sSortAscending': ': 오름차순 정렬',
          'sSortDescending': ': 내림차순 정렬'
        }
      };
      _options.dom =
        '<\'row\'<\'col-sm-3\'l><\'col-sm-3 text-center\'B><\'col-sm-6\'f>>' +
        '<\'row\'<\'col-sm-12\'tr>>' +
        '<\'row\'<\'col-sm-5\'i><\'col-sm-7\'p>>';

      if (_options.buttons == null) {
        _options.buttons = [
          {
            text: '<i class="fa fa-copy"></i> 복사',
            extend: 'copy',
            className: 'btn-sm btn-default'
          },
          {
            text: '<i class="fa fa-download"></i> 엑셀',
            extend: 'excel',
            className: 'btn-sm btn-default'
          },
          {
            text: '<i class="fa fa-download"></i> CSV',
            extend: 'csv',
            className: 'btn-sm btn-default'
          }
        ];
      }

      table = element.DataTable(_options);

      return table;
    },
    createWindowPopup: function (url, title, option) {
      window.open(url, title, option);
    },
    initDateTimePicker: function (start, end) {
      var startDt = moment().format();
      var endDt = moment().add(7, 'days');

      // 시작일자
      start.datetimepicker({
        defaultDate: startDt,
        format: 'YYYY-MM-DD HH:mm'
        // showTodayButton: true
        // timePicker: true
        // timePickerIncrement: 30,
        // locale: {
        //   format: 'YYYY-MM-DD h:mm A'
        // }
      });

      // 종료일자
      end.datetimepicker({
        date: endDt,
        format: 'YYYY-MM-DD HH:mm'
        // useCurrent: false,
        // showTodayButton: true
      });

      // 날짜가 서로 겹치지 않도록 설정한다.
      start.on('dp.change', function (e) {
        end.data('DateTimePicker').minDate(e.date);
      });
      end.on('dp.change', function (e) {
        start.data('DateTimePicker').maxDate(e.date);
      });
    }
  };
}); // end of func
