/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
		'jquery'
		,'moment'
		,'excellentExport'
		,'bootstrap'
		,'jquery_datatable'
		,'bootstrap_datatable'
		,'select2'
		,'daterangepicker'
		,'jquery_ui'
		,'adminLTE'
		,'fastclick'
		,'common'
	],
	function ($) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button);




	}); // end of func