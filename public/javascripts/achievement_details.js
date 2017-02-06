/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
        'jquery',
		'bootstrap',
        'jquery_datatable',
		'bootstrap_datatable',
        'responsive_datatable',
        'jszip',
        'buttons_html5',
        'buttons_datatable',
		'adminLTE',
        'common',
	],
	function ($) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		// $.widget.bridge('uibutton', $.ui.button);

        $('#personal-rank-download').bind('click', function (e) {      

                var tbl = 'xltest';
                var a = document.createElement('a');
                var data_type = 'data:application/vnd.ms-excel';
                var table_div = document.getElementById( tbl );
                var table_html = table_div.outerHTML.replace(/ /g, '%20');
 
                a.href = data_type + ', ' + table_html;
                a.download = 'download.xls';
                a.click();
 
                e.preventDefault();            

            // var link = $(this);
            // link.download = "download2.xls";
            // link.href = 'data:,' + $('#table-personal-point-rank').text();
            // link.click();
        
            // return ExcellentExport.excel(this, 'datatable', '개인별 순위 및 이수율');

        });

        $(function () {

            var table = $('#table-personal-point-rank').DataTable({
                responsive: true,
                language: { "url": "https://cdn.datatables.net/plug-ins/1.10.13/i18n/Korean.json" },
                "order": [[ 0, 'asc' ]],
                dom: 'Bfrtip',
                buttons: [
                    'excel'
                ]
            }); 
        });
        

	}); // end of func