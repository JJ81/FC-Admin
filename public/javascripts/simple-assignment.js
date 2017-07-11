'use strict';

window.requirejs([
  'common'
], function (Util) {
  var $ = undefined || window.$;
  var navListItems = $('ul.setup-panel li a');
  var allWells = $('.setup-content');
  var tableCheckAll = $('#check-all');
  var tableEmployee = Util.initDataTable($('#table_employee'), {
    'lengthMenu': [ [5, 10, 25, 50, -1], [5, 10, 25, 50, '전체'] ],
    'columnDefs': [
      { orderable: false, targets: [0] }
    ]});

  $(function () {
    allWells.hide();

    // DateTimePicker 설정
    Util.initDateTimePicker(
      $('.date#start_dt'),
      $('.date#end_dt')
    );
  });

  tableCheckAll.bind('click', function () {
    $(':checkbox', tableEmployee.rows().nodes()).prop('checked', this.checked);
  });

  navListItems.click(function (e) {
    e.preventDefault();
    var $target = $($(this).attr('href'));
    var $item = $(this).closest('li');

    if (!$item.hasClass('disabled')) {
      navListItems.closest('li').removeClass('active');
      $item.addClass('active');
      allWells.hide();
      $target.show();
    }
  });

  $('ul.setup-panel li.active a').trigger('click');

  function activateStep1 () {
    $('ul.setup-panel li:eq(0)').removeClass('disabled');
    $('ul.setup-panel li a[href="#step-1"]').trigger('click');
  }
  function activateStep2 () {
    $('ul.setup-panel li:eq(1)').removeClass('disabled');
    $('ul.setup-panel li a[href="#step-2"]').trigger('click');
  }
  function activateStep3 () {
    $('ul.setup-panel li:eq(2)').removeClass('disabled');
    $('ul.setup-panel li a[href="#step-3"]').trigger('click');
  }
  function activateStep4 () {
    $('ul.setup-panel li:eq(3)').removeClass('disabled');
    $('ul.setup-panel li a[href="#step-4"]').trigger('click');
  }

  $('.step1 > .next > a').on('click', function (e) {
    e.preventDefault();
    activateStep2();
  });
  $('.step2 > .previous > a').on('click', function (e) {
    e.preventDefault();
    activateStep1();
  });
  $('.step2 > .next > a').on('click', function (e) {
    e.preventDefault();
    activateStep3();
  });
  $('.step3 > .previous > a').on('click', function (e) {
    e.preventDefault();
    activateStep2();
  });
  $('.step3 > .next > a').on('click', function (e) {
    e.preventDefault();
    activateStep4();
  });
  $('.step4 > .previous > a').on('click', function (e) {
    e.preventDefault();
    activateStep3();
  });

  $('.panel-collapse').on('hide.bs.collapse', function () {
    $('.panel-collapse-clickable').find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
  });

  $('.panel-collapse').on('show.bs.collapse', function () {
    $('.panel-collapse-clickable').find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
  });
});
