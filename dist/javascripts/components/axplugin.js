"use strict";function getE(t){return document.getElementById(t)}function loadAquaAxPlugin(){if($("html").append('<OBJECT CLASSID="clsid:81C08477-A103-4FDC-B7A6-953940EAD67F"  codebase="'+NPLAYER_SETUP_URL+"#version="+AX_VERSION+'" width="0" height="0" ID="AquaAxPlugin" ></OBJECT>'),void 0!==AquaAxPlugin.InitAuth)return!0;timerid=setInterval("chkObj()",1e3)}function chkObj(){var t=getE("AquaAxPlugin");t.object&&1==t.checkAquaAxVersion(AX_VERSION)&&(clearInterval(timerid),location.reload())}function setAquaAxPlugin(t,e){return void 0!==AquaAxPlugin.InitAuth&&(AquaAxPlugin.authParam=e,AquaAxPlugin.InitAuth(),AquaAxPlugin.mediaURL=t,AquaAxPlugin.OpenMedia(),!0)}function setMegaSubtitle(t,e,n,i,u,a,r,l,o){player.setSubtitleFont(t,e),player.setSubtitleColor(n,i,u,a),player.setSubtitlePosition(r,l),player.setSubtitleText(o)}function dupPlayerStop(){var t=NPLAYER_DUP_MSG;player.stop(),setTimeout(function(){alert(t)},200),isDup=!0}function getPlayerDuration(){var t=player.getDuration();return parseInt(1e3*t)}function getPlaybackRate(){var t=player.getCurrentPlaybackRate();return parseInt(1e3*t)}function getCurrentPosition(){var t=player.getCurrentPlaybackTime();return parseInt(1e3*t)}window.define([],function(){});var timerid=0,isDup=!1;
//# sourceMappingURL=../../maps/components/axplugin.js.map