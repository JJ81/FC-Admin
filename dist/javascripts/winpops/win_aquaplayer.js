"use strict";window.requirejs(["common","nplayer","nplayer_ui","cdnproxy","nplayer_conf"],function(e){var n,t=t||window.$;t(function(){t(window).resize(),n=new window.NPlayer("video",{controlBox:"nplayer_control.html",visible:!1,mode:"html5"}),window.initNPlayerUI(n),window.axios.get("/api/v1/player/encparam").then(function(e){var t=e.data.encparam;n.bindEvent("Ready",function(){console.log("player : ","ready"),window.proxy_init(function(){window.setPlayerStart(!0),window.setNPlayer(n),window.mygentAuthCall(function(e){window.setMediaInfo("http://pcst.aquan.dev.edu1004.kr/orangenamu/dev/cdnetworks.mp4",e);var t=window.getMediaURL(!1);n.open({URL:encodeURI(t)})},t)},window.indicateInstall,window.indicateUpdate)}),n.bindEvent("OpenStateChanged",function(e){switch(e){case window.NPlayer.OpenState.Opened:n.setVisible(!0),window.starthtml5State();break;case window.NPlayer.OpenState.Closed:window.Stophtml5State(window.NPlayer.OpenState.Closed)}}),n.bindEvent("PlayStateChanged",function(e){switch(e){case window.NPlayer.PlayState.Playing:n.setVisible(!0);break;case window.NPlayer.PlayState.Stopped:n.setVisible(!1);break;case window.NPlayer.PlayState.Paused:n.setVisible(!0)}})}).catch(function(e){console.error(e)})}),t(window).resize(function(){n&&n.getFullscreen()?t("#video").height(t(window).height()):t("#video").height(t(window).height()-t(".wrapper_foot").height())})});
//# sourceMappingURL=../../maps/winpops/win_aquaplayer.js.map
