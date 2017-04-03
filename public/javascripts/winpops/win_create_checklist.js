'use strict';
requirejs(
  [
    'common'
  ],
function (Util) {
  // var btnAddItem = $('.additem');
  var tableChecklist = $('#table_checklist');

  $(function () {
    tableChecklist.find('tr:first-child').not('thead tr').find('input[name="item"]').focus();
    tableChecklist.find('tbody').sortable({
      items: 'tr:not(:first)',
      placeholder: 'sort-highlight',
      handle: '.handle',
      forcePlaceholderSize: true,
      zIndex: 999999,
      start: function (e, ui) {
        $(this).attr('data-previndex', ui.item.index());
      },
      update: function (e, ui) {
        $(this).removeAttr('data-previndex');
      }
    });
  });

  /**
   * 행추가
   */
  tableChecklist.on('click', '.additem', function (e) {
    var $row = $(this).closest('.item');
    var $category = $row.find('input[name="category"]');
    var $item = $row.find('input[name="item"]');
    var $itemType = $row.find('.itemtype');
    var $selectPoint = $row.find('.select_point');

    if ($itemType.val() !== 'write') {
      if ($category.val() === '') {
        window.alert('분류를 입력하세요.');
        $category.focus();
        return false;
      }
    }

    if ($item.val() === '') {
      window.alert('항목을 입력하세요.');
      $item.focus();
      return false;
    }

    var $clone = $row.clone();

    $clone.find('.itemtype').val($itemType.val());
    $clone.find('.additem').hide();
    $clone.find('.removeitem').show();
    tableChecklist.find('tbody').find('tr:last').after($clone);

    $itemType.val('select'); // 선택형
    $category.show();
    $selectPoint.show();
    $item.val('');
    $item.focus();
  });

  /**
   * 행삭제
   */
  tableChecklist.on('click', '.removeitem', function () {
    var $row = $(this).closest('.item');
    if (window.confirm('삭제하시겠습니까?')) {
      $row.remove();
    }
  });

  tableChecklist.on('change', '.itemtype', function (e) {
    var $row = $(this).closest('.item');
    var $selected = $(this);
    var $item = $row.find('input[name="item"]');
    var $category = $row.find('input[name="category"]');
    var $selectPoint = $row.find('.select_point');

    switch ($selected.val()) {
    case 'write':
      $category.hide();
      $selectPoint.hide();
      break;
    default:
      $category.show();
      $selectPoint.show();
      break;
    }

    $item.select();
  });

  tableChecklist.on('keypress', '.inputitem', function (e) {
    if (e.which == 13) {
      var $row = $(this).parent().closest('.item');
      if ($row.index() === 0) {
        $row.find('.additem').click();
      }
    }
  });
});
