'use strict';
window.requirejs(
  [
    'common',
    'nplayer_conf',
    'nplayer',
    'nplayer_ui',
    'cdnproxy'
  ],
function (Util) {
  var $ = $ || window.$;

  //사용자ID를 넣는 부분, 넘겨줄 ID가 없는 경우 중복로그인제한 회피를 위해 Unique 한 ID 로 랜덤처리 필요.
  var UserID = "test_id";
  /////////////////////////////////////////////////////////////////////////////
  //AquaAuth 파라메터 설정
  /////////////////////////////////////////////////////////////////////////////
  var MasterKey = "orgnm"; //당사에서 정해진 고정된 값 ,5자로 제한
  //사용자 및 웹서버 IP 정보
  var UserIP = $_SERVER["REMOTE_ADDR"];
  var ServerIP = $_SERVER["SERVER_ADDR"];
  var TimeOut = "300";
  //AquaAuth 사용 여부
  //1: 사용함 (default)
  //0 :사용안함
  var AquaAuth = "1";
  //웹서버 시간정보
  var WebserverTime =  microtime(true);

  //전체 파라미터 암호화
  //32bit OS
  //$encParam = exec("./Module/ENCAQALINK_V2_x86 -t ENC " . "\"" . $param . "\"");
  //64bit OS
  var encParam = exec("./Module/ENCAQALINK_V2_x64 -t ENC " . "\"" . $param . "\"");


//중복로그인 차단 사용 여부
//0: 사용안함 (default)
//1: 선 사용자 허용, 후 사용자 차단
//2: 후 사용자 허용, 선 사용자 차단
$AUTH_DUP_USER = "2";

//중복로그인 차단 범위 입력
//1: CP 별 차단
//2: 도메인 별 차단 (default)
$AUTH_DUP_SCOPE = "1";

//중복로그인 차단 주기 (default: 60초)
$AUTH_DUP_CYCLE = "20";

//Custom을 구분하는 ID 값.
//Dup_scope 가 1(CP별 차단)로 입력된 경우만 사용
$AUTH_DUP_CP_KEY = "orangenamu";

//사용자 기기 정보 수집
$NotifyInfo = "http://~~고객사 정보 수집용 페이지~~.php?POST:BA:data=USERID,MAC,HDD,USERIP";
//$NotifyInfo = "http://~webserver~/notifyinfo/getuserinfo.php?POST:BA:data=USERID,MAC,HDD,USERIP";



//암호화 되기 전 파라미터 선언
$param = $param . "MasterKey=" . $MasterKey;
$param = $param . "&userid=" . $UserID;
$param = $param . "&userip=" . $UserIP;
$param = $param . "&serverip=" . $ServerIP;
$param = $param . "&WebServerTime=" .$WebserverTime;
$param = $param . "&AquaAuth=" . $AquaAuth;
$param = $param . "&timeout=" . $TimeOut;
$param = $param . "&dup_user=" . $AUTH_DUP_USER;
$param = $param . "&dup_scope=" . $AUTH_DUP_SCOPE;
$param = $param . "&dup_cycle=" . $AUTH_DUP_CYCLE;
$param = $param . "&dup_custom_key=" . $AUTH_DUP_CP_KEY;
$param = $param . "&NotifyInfo=" . $NotifyInfo;
  
  var exec = require('child_process').exec;

  var encParam = 
});
