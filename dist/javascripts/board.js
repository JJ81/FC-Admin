"use strict";window.requirejs(["common"],function(i,n){var e=e||window.$,o=e("#file");e(function(){i.initDataTable(e("#table-board"))}),o.change(function(){var i=e(this).get(0).files[0].size;console.log(i),i>=2097152&&(window.alert("2MB 이하의 파일만 업로드 가능합니다."),e(this).val(""))})});
//# sourceMappingURL=../maps/board.js.map
