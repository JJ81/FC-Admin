"use strict";window.define(["jquery","axios","fineUploader","text!../../fine_uploader.html"],function(e,t,o,i){function n(e){a=this,a.extendOptions(e),a.init()}var a,l;return n.prototype={options:{},extend:function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);return e},extendOptions:function(e){this.options=this.extend({},this.options),this.extend(this.options,e)},init:function(){a.getUploadInfo()},getUploadInfo:function(){t.get("/api/v1/fineuploader/token").then(function(e){var t=e.data.uploadInfo;t&&(a.options.uploadUrl=t.uploadUrl.replace("v4","cdnovp"),a.options.uploadCancelUrl=t.uploadCancelUrl,a.options.token=t.token,a.setFineUploader())})},setFineUploader:function(){e("#uploader-template").append(i),l=new o.FineUploader({element:document.getElementById(a.options.el),autoUpload:!1,multiple:a.options.mutiple,cors:{allowXdr:!0,expected:!0},validation:{allowedExtensions:["avi","mp4"],itemLimit:3,stopOnFirstInvalidFile:!0},request:{endpoint:a.options.uploadUrl+"?token="+a.options.token,inputName:"videofile",paramsInBody:!0,params:{token:a.options.token,target_path:"/dev"}},callbacks:{onComplete:function(e,t,o,i){}}}),o(document.getElementById("upload-button")).attach("click",function(){l.uploadStoredFiles()})},setFineUploaderBasic:function(){var t=e("#fine-uploader-basic"),i=e("#messages");l=new o.FineUploaderBasic({button:t[0],autoUpload:!1,multiple:a.options.mutiple,cors:{allowXdr:!0,expected:!0},validation:{allowedExtensions:["avi","mp4"],itemLimit:3,stopOnFirstInvalidFile:!0},request:{endpoint:a.options.uploadUrl,inputName:"videofile",paramsInBody:!1,params:{token:a.options.token,target_path:"/dev"}},callbacks:{onSubmit:function(e,t){i.append('<div id="file-'+e+'" class="alert" style="margin: 20px 0 0"></div>')},onUpload:function(t,o){e("#file-"+t).addClass("alert-info").html('<img src="/static/stylesheets/images/loading.gif" alt="Initializing. Please hold."> Initializing “'+o+"”")},onProgress:function(t,o,i,n){if(i<n){var a=Math.round(i/n*100)+"% of "+Math.round(n/1024)+" kB";e("#file-"+t).removeClass("alert-info").html('<img src="/static/stylesheets/images/loading.gif" alt="In progress. Please hold."> Uploading “'+o+"” "+a)}else e("#file-"+t).addClass("alert-info").html('<img src="/static/stylesheets/images/loading.gif" alt="Saving. Please hold."> Saving “'+o+"”")},onComplete:function(t,o,i){i.success?e("#file-"+t).removeClass("alert-info").addClass("alert-success").html('<i class="icon-ok"></i> Successfully saved “'+o+'”<br><img src="img/success.jpg" alt="'+o+'">'):e("#file-"+t).removeClass("alert-info").addClass("alert-error").html('<i class="icon-exclamation-sign"></i> Error with “'+o+"”: "+i.error)}},debug:!0}),o(document.getElementById("upload-button")).attach("click",function(){l.uploadStoredFiles()})}},n});
//# sourceMappingURL=../../maps/components/fine_uploader_service.js.map