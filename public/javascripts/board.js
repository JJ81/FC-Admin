window.requirejs([
  'common'
],
function (Util, AquaPlayerService) {
  var $ = $ || window.$;
  var $fileUpload = $('.file');

  $(function () {
    // datatable 설정
    Util.initDataTable($('#table-board'));
  });

  $fileUpload.on('change', function () {
    var fileSize = $(this).get(0).files[0].size;
    if (fileSize >= 2 * 1024 * 1024) {
      window.alert('2MB 이하의 파일만 업로드 가능합니다.');
      $(this).val('');
    }
  });

  // 정보 수정
  $('.btn-modify').bind('click', (event) => {
    const $self = $(event.currentTarget);
    const $modal = window.$('#updateBoard');

    const id = $self.attr('data-id');
    const title = $self.attr('data-title');
    const contents = $self.attr('data-contents');
    const filename = $self.attr('data-filename');

    $modal.find('#title').val(title);
    // modal.find('#contents').val(contents);
    window.tinymce.activeEditor.setContent('');
    window.tinymce.get('contents').setContent(contents);
    $modal.find('#board_id').val(id);

    if (filename) {
      const key = filename.substring(filename.lastIndexOf('/') + 1);

      $modal.find('#filename').attr('href', `/api/v1/s3-download?key=${key}`);
      $modal.find('#filename').text(key);
    }
  });

  // 정보 보기
  $('.show-board > a').bind('click', (event) => {
    const $self = $(event.currentTarget);
    const $modal = window.$('#modal-show-board');

    const title = $self.attr('data-title');
    const contents = $self.attr('data-contents');
    const filename = $self.attr('data-filename');

    $modal.find('.modal-title').html(title);

    if (filename) {
      const key = filename.substring(filename.lastIndexOf('/') + 1);

      $modal.find('.modal-body').html('<br><a id="filename" href=""></a>');
      $modal.find('.modal-body').prepend(contents);

      $modal.find('#filename').attr('href', `/api/v1/s3-download?key=${key}`);
      $modal.find('#filename').text(key);
    } else {
      $modal.find('.modal-body').html(contents);
    }
  });

  // 정보 삭제
  $('.btn-delete').bind('click', (event) => {
    if (!window.confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    const $self = $(event.currentTarget);
    const id = $self.attr('data-id');

    window.axios.delete(`/board/${id}`)
      .then(function (response) {
        if (!response.data.success) {
          window.alert('삭제하지 못했습니다.');
        } else {
          window.alert('삭제하였습니다.');
        }
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
