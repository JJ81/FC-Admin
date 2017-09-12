"use strict";window.define(["common","text!../../../nplayer_wrapper.html","axplugin","nplayer","nplayer_ui","cdnproxy","nplayer_conf"],function(e,n,t){function i(e){r=this,r.extendOptions(e),r.init()}var o,a,r=null,d=d||window.$;return i.prototype={options:{},extend:function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t]);return e},extendOptions:function(e){this.options=this.extend({},this.options),this.extend(this.options,e)},init:function(){r.getEncodedParam(),r.resize()},initPlayer:function(){"ActiveXObject"in window?r.initPlayerWindow():r.initPlayerHTML()},initPlayerHTML:function(){a=new window.NPlayer("video",{controlBox:"nplayer_control.html",visible:!1,mode:"html5"}),window.player=a,window.initNPlayerUI(a),a.bindEvent("Ready",function(){r.reportMessage("ready"),window.proxy_init(function(){window.setPlayerStart(!0),window.setNPlayer(a),window.mygentAuthCall(function(e){window.setMediaInfo(r.options.fileUrl,e);var n=window.getMediaURL(!1);a.open({URL:window.encodeURI(n)})},o)},window.indicateInstall,window.indicateUpdate)}),a.bindEvent("OpenStateChanged",function(e){switch(r.reportMessage("OpenStateChanged"),e){case window.NPlayer.OpenState.Opened:a.setVisible(!0),window.starthtml5State();break;case window.NPlayer.OpenState.Closed:window.Stophtml5State(window.NPlayer.OpenState.Closed)}}),a.bindEvent("PlayStateChanged",function(e){switch(r.reportMessage("PlayStateChanged"),e){case window.NPlayer.PlayState.Playing:a.setVisible(!0);break;case window.NPlayer.PlayState.Stopped:a.setVisible(!1);break;case window.NPlayer.PlayState.Paused:a.setVisible(!0)}}),a.bindEvent("GuardCallback",function(e,n){r.reportMessage("GuardCallback - "+e+" : "+n)}),a.bindEvent("Error",function(e){r.reportMessage("Error - "+e)})},initPlayerWindow:function(){r.options.fileUrl="http://eng-media-02.cdngc.net/cdnlab/cs1/tsbox/CSS_1500k.mp4",a=new window.NPlayer("video",{controlBox:"nplayer_control.html",visible:!1});window.player=a,window.initNPlayerUI(a),a.bindEvent("Ready",function(){r.reportMessage("Ready"),a.setCDNAuthParam("pwClNIt9VvCLi88GmznRuVVXxQy6cZ6CRz3Mdlccyyp4UVmt+Pznd+KrwhKL5X/jWC1jdbs2oOwpPKDRlZconDIqHNlt5vcJhEEfl7AOZ28QqYtnve5PZOGv9Zaok/37ju9VYKOfm8I8H9LhBueExOWruaBEUISJprfPCjRoIwvCA0wpyca7Y2nZ8CE4Q7QM1A4MZXdbTvtRDADEOJSSw/T6eNnFbI3hsU3po3WN6luWKg3gi3X/maxv0gd59+rr+1cCyOevi4OsRenHpQgR6MEdwJPVrCjcG+lv7yEBK+hvY2tJZD0x"),a.addContextMenu("SystemInfo","sysinfo"),console.log(window.encodeURI(r.options.fileUrl)),a.open({URL:window.encodeURI(r.options.fileUrl)})}),a.bindEvent("OpenStateChanged",function(e){switch(r.reportMessage("OpenStateChanged",e),e){case window.NPlayer.OpenState.Opened:a.setVisible(!0);break;case window.NPlayer.OpenState.Closed:}}),a.bindEvent("PlayStateChanged",function(e){switch(r.reportMessage("PlayStateChanged",e),e){case window.NPlayer.PlayState.Playing:if(a.setVisible(!0),!0===t.isDup){a.stop(),window.alert(window.NPLAYER_DUP_MSG);break}break;case window.NPlayer.PlayState.Stopped:a.setVisible(!1);break;case window.NPlayer.PlayState.Paused:a.setVisible(!0)}}),a.bindEvent("GuardCallback",function(e,n){}),a.bindEvent("Error",function(e){d("#video").css("background-image","none")}),a.bindEvent("ContextMenu",function(e){}),window.onunload=function(){}},getEncodedParam:function(){window.axios.get("/api/v1/player/encparam").then(function(e){o=e.data.encparam,r.reportMessage(o),r.initPlayer()}).catch(function(e){r.reportError(e)})},reportMessage:function(e){console.log("aquaservice : "+e)},reportError:function(e){console.log("aquaservice : "+e)},resize:function(){d(window).resize(function(){a&&a.getFullscreen()?d("#video").height(d(window).height()):d("#video").height(d(window).height()-d(".wrapper_foot").height())})}},i});
//# sourceMappingURL=../../maps/components/aquaplayer_service.js.map
