'use strict';
window.requirejs(
  [
    'common'
  ],
function (Util) {
  // var btnAddItem = window.$('.additem');
  var tableChecklist = window.$('#table_checklist');
  var btnSaveChecklist = window.$('#regist-quiz');
  var $ = $ || window.$;

  window.$(function () {
    tableChecklist.find('tr:first-child').not('thead tr').find('input[name="item"]').focus();
    tableChecklist.find('tbody').sortable({
      items: 'tr:not(:first)',
      placeholder: 'sort-highlight',
      handle: '.handle',
      forcePlaceholderSize: true,
      zIndex: 999999,
      start: function (e, ui) {
        window.$(this).attr('data-previndex', ui.item.index());
      },
      update: function (e, ui) {
        // var newIndex = ui.item.index();
        // var oldIndex = window.$(this).attr('data-previndex');
        window.$(this).removeAttr('data-previndex');
        setRowNo();
        // console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
      }
    });
  });

  /**
   * 행추가
   */
  tableChecklist.on('click', '.additem', function (e) {
    var $row = window.$(this).closest('.item');
    var $category = $row.find('input[name="category"]');
    var $item = $row.find('input[name="item"]');
    var $itemType = $row.find('.itemtype');
    var $sample = $row.find('.sample');

    if ($itemType.val() !== 'write') {
      if ($category.val() === '') {
        window.alert('분류를 입력하세요.');
        $category.focus();
        return false;
      }
    }

    if ($item.val() === '') {
      window.alert('체크사항을 입력하세요.');
      $item.focus();
      return false;
    }

    var $clone = $row.clone();

    $clone.find('.itemno').html(tableChecklist.find('tr').not(':first').length);
    $clone.find('#item').attr('placeholder', '');
    $clone.find('.itemtype').val($itemType.val());
    $clone.find('.additem').hide();
    $clone.find('.removeitem').show();
    tableChecklist.find('tbody').find('tr:last').after($clone);

    $itemType.val('select'); // 선택형
    $category.show();
    $sample.show();
    $item.val('');
    $item.focus();
  });

  /**
   * 행삭제
   */
  tableChecklist.on('click', '.removeitem', function () {
    var $row = window.$(this).closest('.item');
    if (window.confirm('삭제하시겠습니까?')) {
      window.axios.delete('/course/checklist', {
        params: {
          checklist_group_id: window.$('input[name=checklist_group_id]').val(),
          checklist_id: $row.data('id')
        }
      }).then(function (response) {
        window.alert('체크리스트를 삭제하였습니다.');
        $row.remove();
        setRowNo();
      })
      .catch(function (error) {
        console.error(error);
      });
    }
  });

  tableChecklist.on('change', '.itemtype', function (e) {
    var $row = window.$(this).closest('.item');
    var $selected = window.$(this);
    var $item = $row.find('input[name="item"]');
    var $category = $row.find('input[name="category"]');
    var $sample = $row.find('.sample');

    switch ($selected.val()) {
    case 'write':
      $category.hide();
      $sample.hide();
      break;
    default:
      $category.show();
      $sample.show();
      break;
    }

    $item.select();
  });

  tableChecklist.on('keypress', '.inputitem', function (e) {
    if (e.which === 13) {
      var $row = window.$(this).parent().closest('.item');
      if ($row.index() === 0) {
        $row.find('.additem').click();
      }
    }
  });

  /**
   * 자료 저장하기
   */
  btnSaveChecklist.on('click', function () {
    var itemArray = [];
    var rows = tableChecklist.find('tr').not(':first');
    var $title = window.$('input[name=title]');
    var $desc = $('#desc').val(); // window.tinymce.activeEditor.getContent();

    if ($title.val().trim() === '') {
      window.alert('대표제목을 입력하세요.');
      $title.focus();
      return false;
    }

    rows.each(function (i, row) {
      if (i === 0) return true;
      var $row = window.$(row);
      var itemId = $row.data('id');
      var $itemType = $row.find('.itemtype');
      var $item = $row.find('input[name="item"]');
      var $category = $row.find('input[name="category"]');
      var $sample = $row.find('input[name="sample"]');

      // 체크사항 빈값여부 검사
      if ($item.val() === '') {
        window.alert('체크사항을 입력하세요.');
        $item.focus();
        return false;
      }
      // 보기 빈값여부 검사
      if ($itemType.val() === 'select' || $itemType.val() === 'choose') {
        if ($sample.val() === '') {
          window.alert('보기를 입력하세요.');
          $sample.focus();
          return false;
        }
      }

      itemArray.push({
        id: itemId,
        item_name: $item.val(),
        item_type: $itemType.val(),
        item_section: (function () {
          if ($itemType.val() !== 'write') {
            return $category.val();
          } else {
            return '';
          }
        }()),
        sample: (function () {
          if ($itemType.val() !== 'write') {
            return $sample.val();
          } else {
            return '';
          }
        }()),
        order: i
      });
    });

    // console.log(itemArray);
    window.axios.post('/course/checklist', {
      course_id: window.$('input[name=course_id]').val(),
      course_list_id: window.$('input[name=course_list_id]').val(),
      checklist_group_id: window.$('input[name=checklist_group_id]').val(),
      title: window.$('input[name=title]').val(),
      desc: window.tinymce.get('desc').getContent({
        format: 'raw'
      }),
      data: itemArray
    })
    .then((response) => {
      // console.log(response);
      window.alert('자료를 수정하였습니다.');
      closeWindow();
    })
    .catch((error) => {
      console.error(error);
    });
  });

  /**
   * 번호를 다시 매긴다.
   */
  const setRowNo = () => {
    var rows = tableChecklist.find('tr').not(':first');
    rows.each(function (i, row) {
      if (i === 0) return true;
      var $row = window.$(row);
      $row.find('.itemno').html(i);
    });
  };

  const closeWindow = () => {
    // window.parent.opener.location.reload();
    window.parent.opener.winpop_listener(true);
    window.close();
  };
});

