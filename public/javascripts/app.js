/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';

requirejs.config({
  paths: {
    'jquery': ['static/vendor/plugins/jQuery/jquery-2.2.3.min'],
    'jquery-private': ['static/javascripts/jquery-private'],
    // Add this map config in addition to any baseUrl or
    // paths config you may already have in the project.
    map: {
      // '*' means all modules will get 'jquery-private'
      // for their 'jquery' dependency.
      '*': { 'jquery': 'jquery-private' },

      // 'jquery-private' wants the real jQuery module
      // though. If this line was not here, there would
      // be an unresolvable cyclic dependency.
      'jquery-private': { 'jquery': 'jquery' }
    },
    'jquery_ui': 'static/vendor/plugins/jQueryUI/jquery-ui.min',
    'bootstrap': ['static/vendor/bootstrap/js/bootstrap.min'],
    'jszip': 'static/vendor/plugins/jszip/dist/jszip',
    'datatables.net': 'static/vendor/plugins/datatables.net/js/jquery.dataTables',
    'datatables.net-bs': 'static/vendor/plugins/datatables.net-bs/js/dataTables.bootstrap',
    'datatables.net-buttons': 'static/vendor/plugins/datatables.net-buttons/js/dataTables.buttons',
    'datatables.net-responsive': 'static/vendor/plugins/datatables.net-responsive/js/dataTables.responsive',
    'moment': 'static/vendor/plugins/moment/moment.2.11.2.min',
    'moment_ko': 'static/vendor/plugins/moment/locale/kr',
    'daterangepicker': 'static/vendor/plugins/daterangepicker/daterangepicker',
    'bootstrap_datepicker': 'static/vendor/plugins/datepicker/bootstrap-datepicker',
    'excellentExport': 'static/vendor/plugins/ExcellentExport/excellentexport',
    'select2': 'static/vendor/plugins/select2/select2.full.min',
    'fastclick': 'static/vendor/plugins/fastclick/fastclick',
    'adminLTE': 'static/vendor/dist/js/app.min',
    'jqueryCookie': 'static/vendor/plugins/jquery_cookie/jquery.cookie.1.4.1',
    'jqueryValidate': 'static/vendor/plugins/jquery_validate/jquery.validate.min',
    'common': 'static/javascripts/common',
    'axios': 'https://unpkg.com/axios/dist/axios.min',
    'quiz_component': ['static/javascripts/components/quiz_component'],
    'quiz_service': ['static/javascripts/components/quiz_service'],
    'slimScroll': 'static/vendor/plugins/slimScroll/jquery.slimscroll.min',
    'bootstrap_datetimepicker': ['static/vendor/plugins/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min'],
    'es6-promise': 'static/vendor/plugins/es6-promise/dist/es6-promise',
    'Vimeo': 'static/vendor/plugins/vimeo-player-js/dist/player',
    'tinymce': 'static/vendor/plugins/tinymce/tinymce.min'
  },
  shim: {
    'quiz_component': {
      'deps': ['jquery']
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'daterangepicker': {
      deps: ['jquery', 'moment']
    },
    'bootstrap_datepicker': {
      deps: ['jquery']
    },
    'adminLTE': {
      deps: ['jquery', 'bootstrap']
    },
    'jquery_ui': {
      deps: ['jquery']
    },
    'jqueryCookie': {
      deps: ['jquery']
    },
    'jqueryValidate': {
      deps: ['jquery']
    },
    'slimScroll': {
      deps: ['jquery']
    }
  }
});

