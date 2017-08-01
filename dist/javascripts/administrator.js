"use strict";window.requirejs(["common"],function(n){var t=this,a=a||window.$,i=window.$("#select-branch-list"),r=[],e=window.$(".btn-assign-branch"),d=window.$("#draggablePanelList"),o=window.$(".btn-assign-branch-submit"),c=null;a(function(){a("#select-branch-list").select2(),n.initDataTable(a("#table_administrator"))}),window.$("#table_administrator").on("click",".btn-delete-admin",function(){if(!window.confirm("삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?"))return!1;var n={id:window.$(t).data("user-id")};window.axios.delete("/administrator",{params:n}).then(function(n){n.data.success?window.alert("관리자를 삭제하였습니다."):window.alert("관리자를 삭제하지 못했습니다."),window.location.reload()}).catch(function(n){console.log(n)})}),window.administrator={removeElement:function(n){return a(n).parent().parent().remove(),r=u(),!1}},window.$(".btn-modify-admininfo").bind("click",function(n){var t=window.$(n.currentTarget),a=t.attr("data-user-name"),i=t.attr("data-user-email"),r=t.attr("data-user-role"),e=t.attr("data-url"),d=window.$("#frm_modify_admin");c=t.attr("data-user-id"),d.find("#name").val(a),d.find("#email").val(i),d.find(".employee_id").val(c),d.find("#select_authority").val(r),d.attr("action",e)}),window.$(".btn-modify-role").bind("click",function(n){var t=window.$(n.currentTarget),a=t.attr("data-user-role"),i=window.$("#frm_change_admin_role");c=t.attr("data-user-id"),i.find(".user_id").val(c),i.find("#select_authority").val(a)}),window.$(".btn-add-branch").bind("click",function(n){var t=window.$(n.currentTarget),a=window.$("#frm_assign_branch");c=t.attr("data-user-id"),a.find(".user_id").val(c),window.axios({method:"get",url:"/administrator/branch/"+c}).then(function(n){n.data.success?(r=[],d.empty(),n.data.list.forEach(function(n){var t=s(n.id,n.name);d.append(t),r.push([c,n.id])})):window.alert("알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.")})}),e.bind("click",function(){var n=i.find("option:selected").text().trim(),t=i.find("option:selected").val().trim();if(!w(t)){var a=s(t,n);d.append(a),r.push([c,t])}});var s=function(n,t){return'<li class="list-group-item" data-branch-id="'+n+'"><div class="course">'+t+'<a href="#" class="btn-delete-course" onclick="administrator.removeElement(this);"> <i class="fa fa-remove text-red"></i></a> </div></li>'},l=window.$("#draggablePanelList");l.sortable({handle:".course",update:function(){r=u()}});var w=function(n){for(var t=0,a=r.length;t<a;t++)if(r[t][1]===n)return!0;return!1},u=function(){var n=[];return window.$(".list-group-item",l).each(function(t,a){var i=[c,window.$(a).attr("data-branch-id")];n.push(i)}),n};o.bind("click",function(n){if(n.preventDefault(),r.length<=0)return void window.alert("지점을 추가하세요.");window.axios({method:"post",url:"/administrator/assign/branch",data:{user_id:c,branch_list:r}}).then(function(n){n.data.success?window.alert("지점을 배정하였습니다."):(console.log(n.data.msg),window.alert("알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.")),window.location.reload()})})});
//# sourceMappingURL=../maps/administrator.js.map
