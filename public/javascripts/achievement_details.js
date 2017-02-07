/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
        'common',
	],
	function (Util) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		// $.widget.bridge('uibutton', $.ui.button);

        $(function () {

            Util.initDataTable($('#table-personal-point-rank'), {
                "order": [[ 0, 'asc' ]],
            });
        });
        

	}); // end of func