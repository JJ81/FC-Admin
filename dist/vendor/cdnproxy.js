function setNPlayer(e){newinPlayer=e}function setPlayerStart(e){videoStartFlag=e}function setMediaInfo(e,t){media_auth=t,media_url=encodeURIComponent(e)}function setdupcallback(e){dupProxycallback=e}function setduplicatePlayCallback(e){dupPlayercallback=e}function getMediaURL(e){return 1==e?proxy_https_host+"/cddr_streaming?url="+media_url+"&param="+media_auth:proxy_http_host+"/cddr_streaming?url="+media_url+"&param="+media_auth}function exitFunction(){console.log("exitFunction fire"),authdelete()}function setpageunloaccallback(){var e=get_browser();"IE"===e.name||"msie"===e.name||"safari"===e.name||"chrome"===e.name||"trident"===e.name?document.addEventListener?(document.addEventListener("pagehide",exitFunction,!1),document.addEventListener("unload",exitFunction,!1)):window.attachEvent&&(document.attachEvent("pagehide",exitFunction),document.attachEvent("unload",exitFunction)):"firefox"===e.name&&window.addEventListener("beforeunload",function(e){console.log("Player 종료합니다.");return authdelete(),e.defaultPrevenred=!0,"Player 종료합니다."})}function getNewinPlayerDuration(){var e=newinPlayer.getDuration();return parseInt(1e3*e)}function getNewinPlaybackRate(){var e=newinPlayer.getCurrentPlaybackRate();return parseInt(1e3*e)}function getNewinCurrentPosition(){var e=newinPlayer.getCurrentPlaybackTime();return parseInt(1e3*e)}function createXMLHttpRequest(){return new XMLHttpRequest}function starthtml5State(){switch(newinPlayer.getOpenState()){case NPlayer.OpenState.Opened:statehttp=createXMLHttpRequest();var e=proxy_state_host+"/mediastate?mediaKey="+media_auth+"&current="+getNewinCurrentPosition();e+="&playbackrate="+getNewinPlaybackRate()+"&duration="+getNewinPlayerDuration()+"&playstate="+newinPlayer.getPlayState()+"&openstate="+newinPlayer.getOpenState(),statehttp.onreadystatechange=html5statecallback,statehttp.open("GET",e,!0),statehttp.send(null)}}function html5statecallback(){if(4==statehttp.readyState)if(200==statehttp.status){var e=newinPlayer.getOpenState();e==NPlayer.OpenState.Opened&&1==videoStartFlag&&setTimeout("starthtml5State()",2e3)}else if(statehttp.status==PROXY_ERROR_FORCE_STOP){var t=NPLAYER_PLAYER_STOP_REQUEST_MSG;newinPlayer.stop(),newinPlayer.close(),setTimeout(function(){alert(t),setTimeout(function(){window.close()},1e3)},200)}else if(statehttp.status==PROXY_ERROR_DUP_CHECKED)if("function"==dupProxycallback)dupProxycallback();else{var t=NPLAYER_DUP_MSG;newinPlayer.stop(),newinPlayer.close(),setTimeout(function(){alert(t),setTimeout(function(){window.close()},1e3)},200)}else if(statehttp.status==PROXY_ERROR_CAPTURE_ENABLED){var t=STR_PROXY_ERROR_CAPTURE_ENABLED;newinPlayer.stop(),newinPlayer.close(),setTimeout(function(){alert(t),setTimeout(function(){window.close()},1e3)},200)}else{console.log("html5statecallback readyState=="+statehttp.readyState),console.log("html5statecallback status=="+statehttp.status);var e=newinPlayer.getOpenState();e==NPlayer.OpenState.Opened&&1==videoStartFlag&&setTimeout("starthtml5State()",2e3)}}function Stophtml5State(e){stopstatehttp=createXMLHttpRequest();var t=proxy_state_host+"/mediastate?mediaKey="+media_auth+"&openstate="+e;stopstatehttp.open("GET",t,!0),stopstatehttp.send(null)}function authdelete(){stopstatehttp=createXMLHttpRequest();var e=proxy_state_host+"/delgenauth?mediaKey="+media_auth;stopstatehttp.open("GET",e,!0),stopstatehttp.send(null)}function get_browser(){var e,t=navigator.userAgent,a=t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];return/trident/i.test(a[1])?(e=/\brv[ :]+(\d+)/g.exec(t)||[],{name:"IE",version:e[1]||""}):"Chrome"===a[1]&&null!=(e=t.match(/\bOPR\/(\d+)/))?{name:"Opera",version:e[1]}:(a=a[2]?[a[1],a[2]]:[navigator.appName,navigator.appVersion,"-?"],null!=(e=t.match(/version\/(\d+)/i))&&a.splice(1,1,e[1]),a[0]=a[0].toLowerCase(),{name:a[0],version:a[1]})}function callErrorState(){callerrorhttp=createXMLHttpRequest();var e=proxy_state_host+"/errstate";callerrorhttp.onreadystatechange=callErrorStateresponse,callerrorhttp.open("GET",e,!0),callerrorhttp.send(null)}function callErrorStateresponse(){if(4==callerrorhttp.readyState)switch(console.log(callerrorhttp.responseText+"==code==="+callerrorhttp.status),callerrorhttp.status){case PROXY_ERROR_UNKONWN:onErrorMessage(STR_PROXY_ERROR_UNKONWN);break;case PROXY_ERROR_ACTIVE_NOT_CLEARED:onErrorMessage(STR_PROXY_ERROR_ACTIVE_NOT_CLEARED);break;case PROXY_ERROR_AUTH_NOT_FOUND:onErrorMessage(STR_PPROXY_ERROR_AUTH_NOT_FOUND);break;case PROXY_ERROR_AUTH_HTTP_403:onErrorMessage(STR_PPROXY_ERROR_AUTH_HTTP_403);break;case PROXY_ERROR_AUTH_HTTP_404:onErrorMessage(STR_PPROXY_ERROR_AUTH_HTTP_404);break;case PROXY_ERROR_BLOCKED_HTTP:onErrorMessage(STR_PPROXY_ERROR_BLOCKED_HTTP)}}function onErrorMessage(e){$("#video-nplayer-1-msg tr td").text(e)}function checkNRunProxyAgent(e,t){AgentCheckCallback=e,portcheckhandler=function(){ProxyPortCheck()},timeouthandler=function(){window.clearInterval(gtimer),ProxyPortCheckFail()},gtimer=window.setInterval(portcheckhandler,1e3),proxycheckTimer=window.setTimeout(timeouthandler,t)}function checkNRunProxyAgentOnce(e,t){AgentCheckCallback=e,portcheckhandler=function(){ProxyPortCheck()},timeouthandler=function(){window.clearInterval(gtimer),ProxyPortCheckFail()},portcheckhandler(),proxycheckTimer=window.setTimeout(timeouthandler,t)}function ProxyPortCheck(){proxyHealthhttp=createXMLHttpRequest(),proxyHealthchecked=!1;var e=proxy_state_host+"/portcheck";proxyHealthhttp.onreadystatechange=ProxyPortCheckHandler,proxyHealthhttp.open("GET",e,!0),proxyHealthhttp.send(null)}function ProxyPortCheckHandler(){4==proxyHealthhttp.readyState&&200==proxyHealthhttp.status&&(proxyHealthchecked=!0,window.clearInterval(gtimer),window.clearTimeout(gtimeout),window.removeEventListener("blur",eventhandler,!1),"function"==typeof AgentCheckCallback&&AgentCheckCallback(!0))}function ProxyPortCheckFail(){0==proxyHealthchecked&&"function"==typeof AgentCheckCallback&&AgentCheckCallback(!1)}function ExitProxyServer(){exithttp=createXMLHttpRequest();var e=proxy_state_host+"/exit";exithttp.open("GET",e,!0),exithttp.send(null)}function versionCheck(e){checkversioncallback=e,getProxyVer()}function compareversion(e,t){if(console.log(e),console.log(t),e===t)return 0;for(var a=e.split(","),n=t.split(","),o=Math.min(a.length,n.length),r=0;r<o;r++){if(parseInt(a[r])>parseInt(n[r]))return 1;if(parseInt(a[r])<parseInt(n[r]))return-1}return a.length>n.length?1:a.length<n.length?-1:0}function getProxyVer(){proxyverhttp=createXMLHttpRequest();var e=proxy_state_host+"/version";proxyverhttp.open("GET",e,!0),proxyverhttp.send(null),proxyverhttp.onreadystatechange=function(){4==proxyverhttp.readyState&&(console.log(proxyverhttp.responseText+" code __ "+proxyverhttp.status),200==proxyverhttp.status?compareversion(proxy_ver,proxyverhttp.responseText)>0?"function"==typeof checkversioncallback&&checkversioncallback(!0):"function"==typeof checkversioncallback&&checkversioncallback(!1):indicateRunFail())}}function launchProxy(e,t,a,n){function o(e){"function"==typeof e&&e()}function r(e){var t;return e||(e=document.body),t=document.createElement("iframe"),t.style.display="none",t.id="hiddenIframe",t.src="about:blank",e.appendChild(t),t}function l(e){console.log("AgentCheckCallback called"),1==e?(console.log("AgentCheckCallback success"),o(t)):(console.log("AgentCheckCallback fail"),!u.isChrome||isMac||h?(console.log(h),o(a)):(console.log(h),o(indicateRunFail)))}var i,c,s,p,d,u,h=!0;if(console.log("test_1"),console.log("test_2"),console.log("test_3"),console.log("test_4"),u={isChrome:!1,isFirefox:!1,isIE:!1,isSafari:!1,isEdge:!1},console.log("test_5"),navigator.userAgent.match(/Edge\//)?u.isEdge=!0:window.chrome&&!navigator.userAgent.match(/Opera|OPR\//)?u.isChrome=!0:"undefined"!=typeof InstallTrigger?u.isFirefox=!0:"ActiveXObject"in window?u.isIE=!0:navigator.userAgent.match(/Safari\//)&&(u.isSafari=!0),console.log("test_6"),u.isChrome&&!isMac||u.isEdge)s=function(){h=!1,window.clearTimeout(p),window.clearInterval(gtimer),window.clearTimeout(gtimeout),window.removeEventListener("blur",s,!1),console.log("test1 oooooooooooooo"),u.isEdge?o(a):checkNRunProxyAgent(l,8e3)},d=function(){window.clearTimeout(gtimeout),window.removeEventListener("blur",s,!1),checkNRunProxyAgent(l,3e3),console.log("test1 zzzzzzzzzzzz")},eventhandler=s,window.addEventListener("blur",s,!1),window.location.href=e,p=window.setTimeout(d,2e3),console.log("test_7 aaaaaaaaaa");else if(navigator.msLaunchUri)console.log("navigator.msLaunchUri !! "+e),console.log("test_8");else if(u.isFirefox){c=r();try{c.contentWindow.location.href=e,checkNRunProxyAgent(l,8e3)}catch(e){"NS_ERROR_UNKNOWN_PROTOCOL"===e.name?(console.log("test3_firefox"),o(a)):(console.log("test4_firefox"),o(n))}finally{!function(e){c&&(e||(e=document.body),e.removeChild(c),c=null)}()}console.log("test_9")}else if(u.isIE){i=window.open("","launcher","width=0,height=0"),i.location.href=e;try{i.location.href="about:blank",checkNRunProxyAgent(l,8e3);var g=window.setInterval(function(){console.log("test4_____"),i.close(),i.closed&&window.clearInterval(g)},500)}catch(e){i=window.open("about:blank","launcher"),i.close(),console.log("test4___________"),o(a)}console.log("test_10")}else c=r(),c.contentWindow.location.href=e,d=function(){window.clearTimeout(p),checkNRunProxyAgent(l,4e3),console.log("test1")},p=window.setTimeout(d,2e3),console.log("test_11")}function mygentAuthCall(e,t){playruncallback=e,gentAuthhttp=createXMLHttpRequest();var a=proxy_state_host+"/genauth?genparam="+t;gentAuthhttp.onreadystatechange=mygentAuthCallHandler,gentAuthhttp.open("GET",a,!0),gentAuthhttp.send(null)}function mygentAuthCallHandler(){4==gentAuthhttp.readyState&&200==gentAuthhttp.status&&"function"==typeof playruncallback&&playruncallback(gentAuthhttp.responseText)}function proxy_init(e,t,a){function n(){versionCheck(o)}function o(t){1==t?a():(show_loading(!1),e())}function r(e){if(1==e)versionCheck(o);else{launchProxy("cdnproxy://launch",n,t,t)}}checkNRunProxyAgentOnce(r,2e3),show_loading(!0)}function indicateUpdate(){var e="<div id='area_meg' style='display:table; width:100%;height:100%;'><p id='pmsg' style='display:table-cell; color:#7d7d7d;text-align:center;vertical-align:middle'>";e=e+"<a href='"+setup_url+"'><img src='images/download.png' border='0' /></a><br><span style='color:#00ff00'>AquaNPlayer</span> 업데이트가 필요합니다.<br>동영상을 시청하려면 <span style='color:#ff4f4f'>수동 설치 프로그램을 내려받아</span> 설치 후 페이지를 새로고침 해 주세요.",e+="</p></div>",$("#video").empty().append(e)}function indicateInstall(){var e="<div id='area_meg' style='display:table; width:100%;height:100%;'><p id='pmsg' style='display:table-cell; color:#7d7d7d;text-align:center;vertical-align:middle'>";e=e+"<a href='"+setup_url+"'><img src='images/download.png' border='0' /></a><br>동영상을 시청하려면 <span style='color:#00ff00'>AquaNPlayer</span> <span style='color:#ff4f4f'>수동 설치 프로그램을 내려받아</span> 설치하여 주십시오.<br>플레이어 설치 후 페이지를 새로고침 해 주세요.",e+="</p></div>",$("#video").empty().append(e)}function indicateRunFail(){var e="<div id='area_meg' style='display:table; width:100%;height:100%;'><p id='pmsg' style='display:table-cell; color:#7d7d7d;text-align:center;vertical-align:middle'>";e+="플레이어 구동에 실패 하였습니다.<br>페이지를 새로고침 해 주세요.",e+="</p></div>",$("#video").empty().append(e)}function show_loading(e){if(1==e){var t="<div id='video-loading' style='display:table; width:100%;height:100%;'><p id='video-loading-p' style='display:table-cell; color:#7d7d7d;text-align:center;vertical-align:middle'>";t+="<img src='images/video-loading.gif' />",t+="</p></div>",$("#video").prepend(t)}else $("#video-loading").fadeOut(300,function(){$(this).remove()})}var statehttp,videoStartFlag,stopstatehttp,proxyHealthchecked,proxyHealthhttp,proxyverhttp,callerrorhttp,exithttp,newinPlayer,media_auth,media_url,gentAuthhttp,proxy_http_host="http://cdnplayer.cdnetworks.com:8282",proxy_https_host="https://cdnplayer.cdnetworks.com:8283",proxy_state_host="http://cdnplayer.cdnetworks.com:8284",dupProxycallback,dupPlayercallback,isMac=navigator.platform.toUpperCase().indexOf("MAC")>=0,setup_url,proxy_ver;isMac?(setup_url=NPLAYER_OSX_SETUP_URL,proxy_ver=PROXY_OSX_VERSION):(setup_url=NPLAYER_SETUP_URL,proxy_ver=PROXY_WIN_VERSION);var AgentCheckCallback,gtimer,gtimeout,eventhandler,checkversioncallback,playruncallback;