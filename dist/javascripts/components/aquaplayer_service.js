"use strict";window.define(["common","axplugin","nplayer","nplayer_ui","cdnproxy","nplayer_conf"],function(e,t){function n(e){a=this,a.extendOptions(e),a.init()}var i,o,a=null,r=r||window.$;return n.prototype={options:{},extend:function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},extendOptions:function(e){this.options=this.extend({},this.options),this.extend(this.options,e)},init:function(){a.getEncodedParam(),a.resize()},initPlayer:function(){r(window).resize(),a.options.html5="Windows"!==e.getOSName(),a.options.html5?a.initPlayerHTML():"ActiveXObject"in window&&a.initPlayerWindow()},initPlayerHTML:function(){o=new window.NPlayer("video",{controlBox:"nplayer_control.html",visible:!1,mode:"html5"}),window.player=o,window.initNPlayerUI(o),o.bindEvent("Ready",function(){a.reportMessage("ready"),window.proxy_init(function(){window.setPlayerStart(!0),window.setNPlayer(o),window.mygentAuthCall(function(e){window.setMediaInfo(a.options.fileUrl,e);var t=window.getMediaURL(!1);o.open({URL:window.encodeURI(t)})},i)},window.indicateInstall,window.indicateUpdate)}),o.bindEvent("OpenStateChanged",function(e){switch(a.reportMessage("OpenStateChanged"),e){case window.NPlayer.OpenState.Opened:o.setVisible(!0),window.starthtml5State();break;case window.NPlayer.OpenState.Closed:window.Stophtml5State(window.NPlayer.OpenState.Closed)}}),o.bindEvent("PlayStateChanged",function(e){switch(a.reportMessage("PlayStateChanged"),e){case window.NPlayer.PlayState.Playing:o.setVisible(!0);break;case window.NPlayer.PlayState.Stopped:o.setVisible(!1);break;case window.NPlayer.PlayState.Paused:o.setVisible(!0)}}),o.bindEvent("GuardCallback",function(e,t){a.reportMessage("GuardCallback - "+e+" : "+t)}),o.bindEvent("Error",function(e){a.reportMessage("Error - "+e)})},initPlayerWindow:function(){o=new window.NPlayer("video",{controlBox:"nplayer_control.html",visible:!1});window.player=o,a.testWatermark(),window.initNPlayerUI(o),o.bindEvent("Ready",function(){a.reportMessage("Ready"),o.setCDNAuthParam(i),o.addContextMenu("SystemInfo","sysinfo"),o.open({URL:window.encodeURI(a.options.fileUrl)})}),o.bindEvent("OpenStateChanged",function(e){switch(a.reportMessage("OpenStateChanged"),e){case window.NPlayer.OpenState.Opened:o.setVisible(!0);break;case window.NPlayer.OpenState.Closed:}}),o.bindEvent("PlayStateChanged",function(e){switch(a.reportMessage("PlayStateChanged"),e){case window.NPlayer.PlayState.Playing:o.setVisible(!0);break;case window.NPlayer.PlayState.Stopped:o.setVisible(!1);break;case window.NPlayer.PlayState.Paused:o.setVisible(!0)}}),o.bindEvent("GuardCallback",function(e,t){}),o.bindEvent("Error",function(e){console.log("err",e),r("#video").css("background-image","none")}),o.bindEvent("ContextMenu",function(e){}),window.onunload=function(){}},getEncodedParam:function(){window.axios.get("/api/v1/player/encparam").then(function(e){i=e.data.encparam,a.reportMessage(i),a.initPlayer()}).catch(function(e){a.reportError(e)})},reportMessage:function(e){console.log("aquaservice : "+e)},reportError:function(e){console.log("aquaservice : "+e)},resize:function(){r(window).resize(function(){r("#video").height(r(window).height()-r(".wrapper_foot").height())})},testWatermark:function(){window.player.setWatermarkText(a.options.watermark),window.player.setWatermarkSize(15),window.player.setWatermarkColor(255,0,0,.5),window.player.setWatermarkInterval(5),window.player.setWatermarkLocation(22)},testSubtitle:function(){a.testSubtitle1()},testSubtitle1:function(){window.setTimeout(function(){window.player.setSubtitleFont("궁서",25),window.player.setSubtitleColor(255,0,0,.5),window.player.setSubtitlePosition(100,100),window.player.setSubtitleText("Hello, World - 테스트 1"),a.testSubtitle2()},1e3)},testSubtitle2:function(){window.setTimeout(function(){window.player.setSubtitleFont("Malgun Gothic",15),window.player.setSubtitleColor(0,255,0,1),window.player.setSubtitlePosition(200,50),window.player.setSubtitleText("Hello, World - 테스트 2"),a.testSubtitle3()},1e3)},testSubtitle3:function(){window.setTimeout(function(){window.player.setSubtitleFont("굴림",35),window.player.setSubtitleColor(0,0,255,.7),window.player.setSubtitlePosition(50,200),window.player.setSubtitleText("Hello, World - 테스트 3"),a.testSubtitle1()},1e3)}},n});
//# sourceMappingURL=../../maps/components/aquaplayer_service.js.map
