/*!
   SoundManager 2: Javascript Sound for the Web
   --------------------------------------------
   http://schillmania.com/projects/soundmanager2/

   Copyright (c) 2008, Scott Schiller. All rights reserved.
   Code licensed under the BSD License:
   http://schillmania.com/projects/soundmanager2/license.txt

   V2.95a.20090717
*/

var soundManager=null;function SoundManager(smURL,smID){this.flashVersion=8;this.debugMode=false;this.useConsole=true;this.consoleOnly=false;this.waitForWindowLoad=false;this.nullURL='null.mp3';this.allowPolling=true;this.useFastPolling=false;this.useMovieStar=false;this.bgColor='#ffffff';this.useHighPerformance=false;this.flashLoadTimeout=1000;this.wmode=null;this.allowFullScreen=true;this.defaultOptions={'autoLoad':false,'stream':true,'autoPlay':false,'onid3':null,'onload':null,'whileloading':null,'onplay':null,'onpause':null,'onresume':null,'whileplaying':null,'onstop':null,'onfinish':null,'onbeforefinish':null,'onbeforefinishtime':5000,'onbeforefinishcomplete':null,'onjustbeforefinish':null,'onjustbeforefinishtime':200,'multiShot':true,'multiShotEvents':false,'position':null,'pan':0,'volume':100};this.flash9Options={'isMovieStar':null,'usePeakData':false,'useWaveformData':false,'useEQData':false,'onbufferchange':null,'ondataerror':null};this.movieStarOptions={'onmetadata':null,'useVideo':false,'bufferTime':null};var SMSound=null;var _s=this;this.version=null;this.versionNumber='V2.95a.20090717';this.movieURL=null;this.url=null;this.altURL=null;this.swfLoaded=false;this.enabled=false;this.o=null;this.id=(smID||'sm2movie');this.oMC=null;this.sounds={};this.soundIDs=[];this.muted=false;this.isFullScreen=false;this.isIE=(navigator.userAgent.match(/MSIE/i));this.isSafari=(navigator.userAgent.match(/safari/i));this.debugID='soundmanager-debug';this.debugURLParam=/([#?&])debug=1/i;this.specialWmodeCase=false;this._onready=[];this._debugOpen=true;this._didAppend=false;this._appendSuccess=false;this._didInit=false;this._disabled=false;this._windowLoaded=false;this._hasConsole=(typeof console!='undefined'&&typeof console.log!='undefined');this._debugLevels=['log','info','warn','error'];this._defaultFlashVersion=8;this._oRemoved=null;this._oRemovedHTML=null;var _$=function(sID){return document.getElementById(sID);};this.filePatterns={flash8:/\.mp3(\?.*)?$/i,flash9:/\.mp3(\?.*)?$/i};this.netStreamTypes=['aac','flv','mov','mp4','m4v','f4v','m4a','mp4v','3gp','3g2'];this.netStreamPattern=new RegExp('\\.('+this.netStreamTypes.join('|')+')(\\?.*)?$','i');this.filePattern=null;this.features={buffering:false,peakData:false,waveformData:false,eqData:false,movieStar:false};this.sandbox={'type':null,'types':{'remote':'remote (domain-based) rules','localWithFile':'local with file access (no internet access)','localWithNetwork':'local with network (internet access only, no local access)','localTrusted':'local, trusted (local + internet access)'},'description':null,'noRemote':null,'noLocal':null};this._setVersionInfo=function(){if(_s.flashVersion!=8&&_s.flashVersion!=9){alert('soundManager.flashVersion must be 8 or 9. "'+_s.flashVersion+'" is invalid. Reverting to '+_s._defaultFlashVersion+'.');_s.flashVersion=_s._defaultFlashVersion;}
_s.version=_s.versionNumber+(_s.flashVersion==9?' (AS3/Flash 9)':' (AS2/Flash 8)');if(_s.flashVersion>8){_s.defaultOptions=_s._mergeObjects(_s.defaultOptions,_s.flash9Options);_s.features.buffering=true;}
if(_s.flashVersion>8&&_s.useMovieStar){_s.defaultOptions=_s._mergeObjects(_s.defaultOptions,_s.movieStarOptions);_s.filePatterns.flash9=new RegExp('\\.(mp3|'+_s.netStreamTypes.join('|')+')(\\?.*)?$','i');_s.features.movieStar=true;}else{_s.useMovieStar=false;_s.features.movieStar=false;}
_s.filePattern=_s.filePatterns[(_s.flashVersion!=8?'flash9':'flash8')];_s.movieURL=(_s.flashVersion==8?'soundmanager2.swf':'soundmanager2_flash9.swf');_s.features.peakData=_s.features.waveformData=_s.features.eqData=(_s.flashVersion>8);};this._overHTTP=(document.location?document.location.protocol.match(/http/i):null);this._waitingforEI=false;this._initPending=false;this._tryInitOnFocus=(this.isSafari&&typeof document.hasFocus=='undefined');this._isFocused=(typeof document.hasFocus!='undefined'?document.hasFocus():null);this._okToDisable=!this._tryInitOnFocus;this.useAltURL=!this._overHTTP;var flashCPLink='http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html';this.strings={notReady:'',appXHTML:'',localFail:'',waitFocus:'',waitImpatient:'',waitForever:'',needFunction:''};this.supported=function(){return(_s._didInit&&!_s._disabled);};this.getMovie=function(smID){return _s.isIE?window[smID]:(_s.isSafari?_$(smID)||document[smID]:_$(smID));};this.loadFromXML=function(sXmlUrl){try{_s.o._loadFromXML(sXmlUrl);}catch(e){_s._failSafely();return true;}};this.createSound=function(oOptions){var _cs='soundManager.createSound(): ';if(!_s._didInit){throw _s._complain(_cs+_s.strings.notReady,arguments.callee.caller);}
if(arguments.length==2){oOptions={'id':arguments[0],'url':arguments[1]};}
var thisOptions=_s._mergeObjects(oOptions);var _tO=thisOptions;if(_tO.id.toString().charAt(0).match(/^[0-9]$/)){var complaint=_cs+'Warning: Sound ID "'+_tO.id+'" should be a string, starting with a non-numeric character';}
if(_s._idCheck(_tO.id,true)){return _s.sounds[_tO.id];}
if(_s.flashVersion>8&&_s.useMovieStar){if(_tO.isMovieStar===null){_tO.isMovieStar=(_tO.url.match(_s.netStreamPattern)?true:false);}
if(_tO.isMovieStar){}
if(_tO.isMovieStar&&(_tO.usePeakData||_tO.useWaveformData||_tO.useEQData)){_tO.usePeakData=false;_tO.useWaveformData=false;_tO.useEQData=false;}}
_s.sounds[_tO.id]=new SMSound(_tO);_s.soundIDs[_s.soundIDs.length]=_tO.id;if(_s.flashVersion==8){_s.o._createSound(_tO.id,_tO.onjustbeforefinishtime);}else{_s.o._createSound(_tO.id,_tO.url,_tO.onjustbeforefinishtime,_tO.usePeakData,_tO.useWaveformData,_tO.useEQData,_tO.isMovieStar,(_tO.isMovieStar?_tO.useVideo:false),(_tO.isMovieStar?_tO.bufferTime:false));}
if(_tO.autoLoad||_tO.autoPlay){if(_s.sounds[_tO.id]){_s.sounds[_tO.id].load(_tO);}}
if(_tO.autoPlay){_s.sounds[_tO.id].play();}
return _s.sounds[_tO.id];};this.createVideo=function(oOptions){if(arguments.length==2){oOptions={'id':arguments[0],'url':arguments[1]};}
if(_s.flashVersion>=9){oOptions.isMovieStar=true;oOptions.useVideo=true;}else{return false;}
if(!_s.useMovieStar){}
return _s.createSound(oOptions);};this.destroySound=function(sID,bFromSound){if(!_s._idCheck(sID)){return false;}
for(var i=0;i<_s.soundIDs.length;i++){if(_s.soundIDs[i]==sID){_s.soundIDs.splice(i,1);continue;}}
_s.sounds[sID].unload();if(!bFromSound){_s.sounds[sID].destruct();}
delete _s.sounds[sID];};this.destroyVideo=this.destroySound;this.load=function(sID,oOptions){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].load(oOptions);};this.unload=function(sID){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].unload();};this.play=function(sID,oOptions){if(!_s._didInit){throw _s._complain('soundManager.play(): '+_s.strings.notReady,arguments.callee.caller);}
if(!_s._idCheck(sID)){if(typeof oOptions!='Object'){oOptions={url:oOptions};}
if(oOptions&&oOptions.url){oOptions.id=sID;_s.createSound(oOptions);}else{return false;}}
_s.sounds[sID].play(oOptions);};this.start=this.play;this.setPosition=function(sID,nMsecOffset){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].setPosition(nMsecOffset);};this.stop=function(sID){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].stop();};this.stopAll=function(){for(var oSound in _s.sounds){if(_s.sounds[oSound]instanceof SMSound){_s.sounds[oSound].stop();}}};this.pause=function(sID){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].pause();};this.pauseAll=function(){for(var i=_s.soundIDs.length;i--;){_s.sounds[_s.soundIDs[i]].pause();}};this.resume=function(sID){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].resume();};this.resumeAll=function(){for(var i=_s.soundIDs.length;i--;){_s.sounds[_s.soundIDs[i]].resume();}};this.togglePause=function(sID){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].togglePause();};this.setPan=function(sID,nPan){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].setPan(nPan);};this.setVolume=function(sID,nVol){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].setVolume(nVol);};this.mute=function(sID){if(typeof sID!='string'){sID=null;}
if(!sID){for(var i=_s.soundIDs.length;i--;){_s.sounds[_s.soundIDs[i]].mute();}
_s.muted=true;}else{if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].mute();}};this.muteAll=function(){_s.mute();};this.unmute=function(sID){if(typeof sID!='string'){sID=null;}
if(!sID){for(var i=_s.soundIDs.length;i--;){_s.sounds[_s.soundIDs[i]].unmute();}
_s.muted=false;}else{if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].unmute();}};this.unmuteAll=function(){_s.unmute();};this.toggleMute=function(sID){if(!_s._idCheck(sID)){return false;}
_s.sounds[sID].toggleMute();};this.getMemoryUse=function(){if(_s.flashVersion==8){return 0;}
if(_s.o){return parseInt(_s.o._getMemoryUse(),10);}};this.disable=function(bNoDisable){if(typeof bNoDisable=='undefined'){bNoDisable=false;}
if(_s._disabled){return false;}
_s._disabled=true;for(var i=_s.soundIDs.length;i--;){_s._disableObject(_s.sounds[_s.soundIDs[i]]);}
_s.initComplete(bNoDisable);};this.canPlayURL=function(sURL){return(sURL?(sURL.match(_s.filePattern)?true:false):null);};this.getSoundById=function(sID,suppressDebug){if(!sID){throw new Error('SoundManager.getSoundById(): sID is null/undefined');}
var result=_s.sounds[sID];if(!result&&!suppressDebug){}
return result;};this.onready=function(oMethod,oScope){if(oMethod&&oMethod instanceof Function){if(_s._didInit){}
if(!oScope){oScope=window;}
_s._addOnReady(oMethod,oScope);_s._processOnReady();return true;}else{throw _s.strings.needFunction;}};this.oninitmovie=function(){};this.onload=function(){soundManager._wD('soundManager.onload()',1);};this.onerror=function(){};this._idCheck=this.getSoundById;this._complain=function(sMsg,oCaller){var sPre='Error: ';if(!oCaller){return new Error(sPre+sMsg);}
var e=new Error('');var stackMsg=null;if(e.stack){try{var splitChar='@';var stackTmp=e.stack.split(splitChar);stackMsg=stackTmp[4];}catch(ee){stackMsg=e.stack;}}
if(typeof console!='undefined'&&typeof console.trace!='undefined'){console.trace();}
var errorDesc=sPre+sMsg+'. \nCaller: '+oCaller.toString()+(e.stack?' \nTop of stacktrace: '+stackMsg:(e.message?' \nMessage: '+e.message:''));return new Error(errorDesc);};var _doNothing=function(){return false;};_doNothing._protected=true;this._disableObject=function(o){for(var oProp in o){if(typeof o[oProp]=='function'&&typeof o[oProp]._protected=='undefined'){o[oProp]=_doNothing;}}
oProp=null;};this._failSafely=function(bNoDisable){if(typeof bNoDisable=='undefined'){bNoDisable=false;}
if(!_s._disabled||bNoDisable){_s.disable(bNoDisable);}};this._normalizeMovieURL=function(smURL){var urlParams=null;if(smURL){if(smURL.match(/\.swf(\?.*)?$/i)){urlParams=smURL.substr(smURL.toLowerCase().lastIndexOf('.swf?')+4);if(urlParams){return smURL;}}else if(smURL.lastIndexOf('/')!=smURL.length-1){smURL=smURL+'/';}}
return(smURL&&smURL.lastIndexOf('/')!=-1?smURL.substr(0,smURL.lastIndexOf('/')+1):'./')+_s.movieURL;};this._getDocument=function(){return(document.body?document.body:(document.documentElement?document.documentElement:document.getElementsByTagName('div')[0]));};this._getDocument._protected=true;this._setPolling=function(bPolling,bHighPerformance){if(!_s.o||!_s.allowPolling){return false;}
_s.o._setPolling(bPolling,bHighPerformance);};this._createMovie=function(smID,smURL){var specialCase=null;var remoteURL=(smURL?smURL:_s.url);var localURL=(_s.altURL?_s.altURL:remoteURL);if(_s.debugURLParam.test(window.location.href.toString())){_s.debugMode=true;}
if(_s._didAppend&&_s._appendSuccess){return false;}
_s._didAppend=true;_s._setVersionInfo();_s.url=_s._normalizeMovieURL(_s._overHTTP?remoteURL:localURL);smURL=_s.url;if(_s.useHighPerformance&&_s.useMovieStar&&_s.defaultOptions.useVideo===true){specialCase='soundManager note: disabling highPerformance, not applicable with movieStar mode + useVideo';_s.useHighPerformance=false;}
_s.wmode=(!_s.wmode&&_s.useHighPerformance&&!_s.useMovieStar?'transparent':_s.wmode);if(_s.wmode!==null&&_s.flashLoadTimeout!==0&&!_s.useHighPerformance&&!_s.isIE&&navigator.platform.match(/win32/i)){_s.specialWmodeCase=true;_s.wmode=null;}
if(_s.flashVersion==8){_s.allowFullScreen=false;}
var oEmbed={name:smID,id:smID,src:smURL,width:'100%',height:'100%',quality:'high',allowScriptAccess:'always',bgcolor:_s.bgColor,pluginspage:'http://www.macromedia.com/go/getflashplayer',type:'application/x-shockwave-flash',wmode:_s.wmode,allowfullscreen:(_s.allowFullScreen?'true':'false')};if(!_s.wmode){delete oEmbed.wmode;}
var oMovie=null;var tmp=null;if(_s.isIE){oMovie=document.createElement('div');var movieHTML='<object id="'+smID+'" data="'+smURL+'" type="application/x-shockwave-flash" width="100%" height="100%"><param name="movie" value="'+smURL+'" /><param name="AllowScriptAccess" value="always" /><param name="quality" value="high" />'+(_s.wmode?'<param name="wmode" value="'+_s.wmode+'" /> ':'')+'<param name="bgcolor" value="'+_s.bgColor+'" /><param name="allowFullScreen" value="'+(_s.allowFullScreen?'true':'false')+'" /><!-- --></object>';}else{oMovie=document.createElement('embed');for(tmp in oEmbed){if(oEmbed.hasOwnProperty(tmp)){oMovie.setAttribute(tmp,oEmbed[tmp]);}}}
var oD=document.createElement('div');oD.id=_s.debugID+'-toggle';var oToggle={position:'fixed',bottom:'0px',right:'0px',width:'1.2em',height:'1.2em',lineHeight:'1.2em',margin:'2px',textAlign:'center',border:'1px solid #999',cursor:'pointer',background:'#fff',color:'#333',zIndex:10001};oD.appendChild(document.createTextNode('-'));oD.onclick=_s._toggleDebug;oD.title='Toggle SM2 debug console';if(navigator.userAgent.match(/msie 6/i)){oD.style.position='absolute';oD.style.cursor='hand';}
for(tmp in oToggle){if(oToggle.hasOwnProperty(tmp)){oD.style[tmp]=oToggle[tmp];}}
var oTarget=_s._getDocument();if(oTarget){_s.oMC=_$('sm2-container')?_$('sm2-container'):document.createElement('div');if(!_s.oMC.id){_s.oMC.id='sm2-container';_s.oMC.className='movieContainer';var s=null;var oEl=null;if(_s.useHighPerformance){s={position:'fixed',width:'8px',height:'8px',bottom:'0px',left:'0px',overflow:'hidden'};}else{s={position:'absolute',width:'8px',height:'8px',top:'-9999px',left:'-9999px'};}
var x=null;for(x in s){if(s.hasOwnProperty(x)){_s.oMC.style[x]=s[x];}}
try{if(!_s.isIE){_s.oMC.appendChild(oMovie);}
oTarget.appendChild(_s.oMC);if(_s.isIE){oEl=_s.oMC.appendChild(document.createElement('div'));oEl.className='sm2-object-box';oEl.innerHTML=movieHTML;}
_s._appendSuccess=true;}catch(e){throw new Error(_s.strings.appXHTML);}}else{_s.oMC.appendChild(oMovie);if(_s.isIE){oEl=_s.oMC.appendChild(document.createElement('div'));oEl.className='sm2-object-box';oEl.innerHTML=movieHTML;}
_s._appendSuccess=true;}
if(!_$(_s.debugID)&&((!_s._hasConsole||!_s.useConsole)||(_s.useConsole&&_s._hasConsole&&!_s.consoleOnly))){var oDebug=document.createElement('div');oDebug.id=_s.debugID;oDebug.style.display=(_s.debugMode?'block':'none');if(_s.debugMode&&!_$(oD.id)){try{oTarget.appendChild(oD);}catch(e2){throw new Error(_s.strings.appXHTML);}
oTarget.appendChild(oDebug);}}
oTarget=null;}
if(specialCase){}};this._writeDebug=function(sText,sType,bTimestamp){if(!_s.debugMode){return false;}
if(typeof bTimestamp!='undefined'&&bTimestamp){sText=sText+' | '+new Date().getTime();}
if(_s._hasConsole&&_s.useConsole){var sMethod=_s._debugLevels[sType];if(typeof console[sMethod]!='undefined'){console[sMethod](sText);}else{console.log(sText);}
if(_s.useConsoleOnly){return true;}}
var sDID='soundmanager-debug';try{var o=_$(sDID);if(!o){return false;}
var oItem=document.createElement('div');if(++_s._wdCount%2===0){oItem.className='sm2-alt';}
if(typeof sType=='undefined'){sType=0;}else{sType=parseInt(sType,10);}
oItem.appendChild(document.createTextNode(sText));if(sType){if(sType>=2){oItem.style.fontWeight='bold';}
if(sType==3){oItem.style.color='#ff3333';}}
o.insertBefore(oItem,o.firstChild);}catch(e){}
o=null;};this._writeDebug._protected=true;this._wdCount=0;this._wdCount._protected=true;this._wD=this._writeDebug;this._wDAlert=function(sText){alert(sText);};if(window.location.href.indexOf('debug=alert')+1&&_s.debugMode){_s._wD=_s._wDAlert;}
this._toggleDebug=function(){var o=_$(_s.debugID);var oT=_$(_s.debugID+'-toggle');if(!o){return false;}
if(_s._debugOpen){oT.innerHTML='+';o.style.display='none';}else{oT.innerHTML='-';o.style.display='block';}
_s._debugOpen=!_s._debugOpen;};this._toggleDebug._protected=true;this._debug=function(){for(var i=0,j=_s.soundIDs.length;i<j;i++){_s.sounds[_s.soundIDs[i]]._debug();}};this._debugTS=function(sEventType,bSuccess,sMessage){if(typeof sm2Debugger!='undefined'){try{sm2Debugger.handleEvent(sEventType,bSuccess,sMessage);}catch(e){}}};this._debugTS._protected=true;this._mergeObjects=function(oMain,oAdd){var o1={};for(var i in oMain){if(oMain.hasOwnProperty(i)){o1[i]=oMain[i];}}
var o2=(typeof oAdd=='undefined'?_s.defaultOptions:oAdd);for(var o in o2){if(o2.hasOwnProperty(o)&&typeof o1[o]=='undefined'){o1[o]=o2[o];}}
return o1;};this.createMovie=function(sURL){if(sURL){_s.url=sURL;}
_s._initMovie();};this.go=this.createMovie;this._initMovie=function(){if(_s.o){return false;}
_s.o=_s.getMovie(_s.id);if(!_s.o){if(!_s.oRemoved){_s._createMovie(_s.id,_s.url);}else{if(!_s.isIE){_s.oMC.appendChild(_s.oRemoved);}else{_s.oMC.innerHTML=_s.oRemovedHTML;}
_s.oRemoved=null;_s._didAppend=true;}
_s.o=_s.getMovie(_s.id);}
if(_s.o){if(_s.flashLoadTimeout>0){}}
if(typeof _s.oninitmovie=='function'){setTimeout(_s.oninitmovie,1);}};this.waitForExternalInterface=function(){if(_s._waitingForEI){return false;}
_s._waitingForEI=true;if(_s._tryInitOnFocus&&!_s._isFocused){return false;}
if(_s.flashLoadTimeout>0){if(!_s._didInit){}
setTimeout(function(){if(!_s._didInit){if(!_s._overHTTP){}
_s._debugTS('flashtojs',false,': Timed out'+(_s._overHTTP)?' (Check flash security or flash blockers)':' (No plugin/missing SWF?)');}
if(!_s._didInit&&_s._okToDisable){_s._failSafely(true);}},_s.flashLoadTimeout);}else if(!_s._didInit){}};this.handleFocus=function(){if(_s._isFocused||!_s._tryInitOnFocus){return true;}
_s._okToDisable=true;_s._isFocused=true;if(_s._tryInitOnFocus){window.removeEventListener('mousemove',_s.handleFocus,false);}
_s._waitingForEI=false;setTimeout(_s.waitForExternalInterface,500);if(window.removeEventListener){window.removeEventListener('focus',_s.handleFocus,false);}else if(window.detachEvent){window.detachEvent('onfocus',_s.handleFocus);}};this.initComplete=function(bNoDisable){if(_s._didInit){return false;}
_s._didInit=true;if(_s._disabled||bNoDisable){_s._processOnReady();_s._debugTS('onload',false);_s.onerror.apply(window);return false;}else{_s._debugTS('onload',true);}
if(_s.waitForWindowLoad&&!_s._windowLoaded){if(window.addEventListener){window.addEventListener('load',_s._initUserOnload,false);}else if(window.attachEvent){window.attachEvent('onload',_s._initUserOnload);}
return false;}else{if(_s.waitForWindowLoad&&_s._windowLoaded){}
_s._initUserOnload();}};this._addOnReady=function(oMethod,oScope){_s._onready.push({'method':oMethod,'scope':(oScope||null),'fired':false});};this._processOnReady=function(){if(!_s._didInit){return false;}
var status={success:(!_s._disabled)};var queue=[];for(var i=0,j=_s._onready.length;i<j;i++){if(_s._onready[i].fired!==true){queue.push(_s._onready[i]);}}
if(queue.length){for(i=0,j=queue.length;i<j;i++){if(queue[i].scope){queue[i].method.apply(queue[i].scope,[status]);}else{queue[i].method(status);}
queue[i].fired=true;}}};this._initUserOnload=function(){window.setTimeout(function(){_s._processOnReady();_s.onload.apply(window);});};this.init=function(){_s._initMovie();if(_s._didInit){return false;}
if(window.removeEventListener){window.removeEventListener('load',_s.beginDelayedInit,false);}else if(window.detachEvent){window.detachEvent('onload',_s.beginDelayedInit);}
try{_s.o._externalInterfaceTest(false);if(!_s.allowPolling){}
_s._setPolling(true,_s.useFastPolling?true:false);if(!_s.debugMode){_s.o._disableDebug();}
_s.enabled=true;_s._debugTS('jstoflash',true);}catch(e){_s._debugTS('jstoflash',false);_s._failSafely(true);_s.initComplete();return false;}
_s.initComplete();};this.beginDelayedInit=function(){_s._windowLoaded=true;setTimeout(_s.waitForExternalInterface,500);setTimeout(_s.beginInit,20);};this.beginInit=function(){if(_s._initPending){return false;}
_s.createMovie();_s._initMovie();_s._initPending=true;return true;};this.domContentLoaded=function(){if(document.removeEventListener){document.removeEventListener('DOMContentLoaded',_s.domContentLoaded,false);}
_s.go();};this._externalInterfaceOK=function(){if(_s.swfLoaded){return false;}
_s._debugTS('swf',true);_s._debugTS('flashtojs',true);_s.swfLoaded=true;_s._tryInitOnFocus=false;if(_s.isIE){setTimeout(_s.init,100);}else{_s.init();}};this._setSandboxType=function(sandboxType){var sb=_s.sandbox;sb.type=sandboxType;sb.description=sb.types[(typeof sb.types[sandboxType]!='undefined'?sandboxType:'unknown')];if(sb.type=='localWithFile'){sb.noRemote=true;sb.noLocal=false;}else if(sb.type=='localWithNetwork'){sb.noRemote=false;sb.noLocal=true;}else if(sb.type=='localTrusted'){sb.noRemote=false;sb.noLocal=false;}};this.reboot=function(){if(_s.soundIDs.length){}
for(var i=_s.soundIDs.length;i--;){_s.sounds[_s.soundIDs[i]].destruct();}
try{if(_s.isIE){_s.oRemovedHTML=_s.o.innerHTML;}
_s.oRemoved=_s.o.parentNode.removeChild(_s.o);}catch(e){}
_s.enabled=false;_s._didInit=false;_s._waitingForEI=false;_s._initPending=false;_s._didAppend=false;_s._appendSuccess=false;_s._disabled=false;_s._waitingforEI=true;_s.swfLoaded=false;_s.soundIDs={};_s.sounds=[];_s.o=null;for(i=_s._onready.length;i--;){_s._onready[i].fired=false;}
window.setTimeout(soundManager.beginDelayedInit,20);};this.destruct=function(){_s.disable(true);};SMSound=function(oOptions){var _t=this;this.sID=oOptions.id;this.url=oOptions.url;this.options=_s._mergeObjects(oOptions);this.instanceOptions=this.options;this._iO=this.instanceOptions;this.pan=this.options.pan;this.volume=this.options.volume;this._lastURL=null;this._debug=function(){if(_s.debugMode){var stuff=null;var msg=[];var sF=null;var sfBracket=null;var maxLength=64;for(stuff in _t.options){if(_t.options[stuff]!==null){if(_t.options[stuff]instanceof Function){sF=_t.options[stuff].toString();sF=sF.replace(/\s\s+/g,' ');sfBracket=sF.indexOf('{');msg[msg.length]=' '+stuff+': {'+sF.substr(sfBracket+1,(Math.min(Math.max(sF.indexOf('\n')-1,maxLength),maxLength))).replace(/\n/g,'')+'... }';}else{msg[msg.length]=' '+stuff+': '+_t.options[stuff];}}}}};this._debug();this.id3={};this.resetProperties=function(bLoaded){_t.bytesLoaded=null;_t.bytesTotal=null;_t.position=null;_t.duration=null;_t.durationEstimate=null;_t.loaded=false;_t.playState=0;_t.paused=false;_t.readyState=0;_t.muted=false;_t.didBeforeFinish=false;_t.didJustBeforeFinish=false;_t.isBuffering=false;_t.instanceOptions={};_t.instanceCount=0;_t.peakData={left:0,right:0};_t.waveformData={left:[],right:[]};_t.eqData=[];};_t.resetProperties();this.load=function(oOptions){if(typeof oOptions!='undefined'){_t._iO=_s._mergeObjects(oOptions);_t.instanceOptions=_t._iO;}else{oOptions=_t.options;_t._iO=oOptions;_t.instanceOptions=_t._iO;if(_t._lastURL&&_t._lastURL!=_t.url){_t._iO.url=_t.url;_t.url=null;}}
if(typeof _t._iO.url=='undefined'){_t._iO.url=_t.url;}
if(_t._iO.url==_t.url&&_t.readyState!==0&&_t.readyState!=2){return false;}
_t.url=_t._iO.url;_t._lastURL=_t._iO.url;_t.loaded=false;_t.readyState=1;_t.playState=0;try{if(_s.flashVersion==8){_s.o._load(_t.sID,_t._iO.url,_t._iO.stream,_t._iO.autoPlay,(_t._iO.whileloading?1:0));}else{_s.o._load(_t.sID,_t._iO.url,_t._iO.stream?true:false,_t._iO.autoPlay?true:false);if(_t._iO.isMovieStar&&_t._iO.autoLoad&&!_t._iO.autoPlay){_t.pause();}}}catch(e){_s._debugTS('onload',false);_s.onerror();_s.disable();}};this.unload=function(){if(_t.readyState!==0){if(_t.readyState!=2){_t.setPosition(0,true);}
_s.o._unload(_t.sID,_s.nullURL);_t.resetProperties();}};this.destruct=function(){_s.o._destroySound(_t.sID);_s.destroySound(_t.sID,true);};this.play=function(oOptions){if(!oOptions){oOptions={};}
_t._iO=_s._mergeObjects(oOptions,_t._iO);_t._iO=_s._mergeObjects(_t._iO,_t.options);_t.instanceOptions=_t._iO;if(_t.playState==1){var allowMulti=_t._iO.multiShot;if(!allowMulti){return false;}else{}}
if(!_t.loaded){if(_t.readyState===0){_t._iO.stream=true;_t._iO.autoPlay=true;_t.load(_t._iO);}else if(_t.readyState==2){return false;}else{}}else{}
if(_t.paused){_t.resume();}else{_t.playState=1;if(!_t.instanceCount||_s.flashVersion>8){_t.instanceCount++;}
_t.position=(typeof _t._iO.position!='undefined'&&!isNaN(_t._iO.position)?_t._iO.position:0);if(_t._iO.onplay){_t._iO.onplay.apply(_t);}
_t.setVolume(_t._iO.volume,true);_t.setPan(_t._iO.pan,true);_s.o._start(_t.sID,_t._iO.loop||1,(_s.flashVersion==9?_t.position:_t.position/1000));}};this.start=this.play;this.stop=function(bAll){if(_t.playState==1){_t.playState=0;_t.paused=false;if(_t._iO.onstop){_t._iO.onstop.apply(_t);}
_s.o._stop(_t.sID,bAll);_t.instanceCount=0;_t._iO={};}};this.setPosition=function(nMsecOffset,bNoDebug){if(typeof nMsecOffset=='undefined'){nMsecOffset=0;}
var offset=Math.min(_t.duration,Math.max(nMsecOffset,0));_t._iO.position=offset;if(!bNoDebug){}
_s.o._setPosition(_t.sID,(_s.flashVersion==9?_t._iO.position:_t._iO.position/1000),(_t.paused||!_t.playState));};this.pause=function(){if(_t.paused||_t.playState===0){return false;}
_t.paused=true;_s.o._pause(_t.sID);if(_t._iO.onpause){_t._iO.onpause.apply(_t);}};this.resume=function(){if(!_t.paused||_t.playState===0){return false;}
_t.paused=false;_s.o._pause(_t.sID);if(_t._iO.onresume){_t._iO.onresume.apply(_t);}};this.togglePause=function(){if(_t.playState===0){_t.play({position:(_s.flashVersion==9?_t.position:_t.position/1000)});return false;}
if(_t.paused){_t.resume();}else{_t.pause();}};this.setPan=function(nPan,bInstanceOnly){if(typeof nPan=='undefined'){nPan=0;}
if(typeof bInstanceOnly=='undefined'){bInstanceOnly=false;}
_s.o._setPan(_t.sID,nPan);_t._iO.pan=nPan;if(!bInstanceOnly){_t.pan=nPan;}};this.setVolume=function(nVol,bInstanceOnly){if(typeof nVol=='undefined'){nVol=100;}
if(typeof bInstanceOnly=='undefined'){bInstanceOnly=false;}
_s.o._setVolume(_t.sID,(_s.muted&&!_t.muted)||_t.muted?0:nVol);_t._iO.volume=nVol;if(!bInstanceOnly){_t.volume=nVol;}};this.mute=function(){_t.muted=true;_s.o._setVolume(_t.sID,0);};this.unmute=function(){_t.muted=false;var hasIO=typeof _t._iO.volume!='undefined';_s.o._setVolume(_t.sID,hasIO?_t._iO.volume:_t.options.volume);};this.toggleMute=function(){if(_t.muted){_t.unmute();}else{_t.mute();}};this._whileloading=function(nBytesLoaded,nBytesTotal,nDuration){if(!_t._iO.isMovieStar){_t.bytesLoaded=nBytesLoaded;_t.bytesTotal=nBytesTotal;_t.duration=Math.floor(nDuration);_t.durationEstimate=parseInt((_t.bytesTotal/_t.bytesLoaded)*_t.duration,10);if(_t.durationEstimate===undefined){_t.durationEstimate=_t.duration;}
if(_t.readyState!=3&&_t._iO.whileloading){_t._iO.whileloading.apply(_t);}}else{_t.bytesLoaded=nBytesLoaded;_t.bytesTotal=nBytesTotal;_t.duration=Math.floor(nDuration);_t.durationEstimate=_t.duration;if(_t.readyState!=3&&_t._iO.whileloading){_t._iO.whileloading.apply(_t);}}};this._onid3=function(oID3PropNames,oID3Data){var oData=[];for(var i=0,j=oID3PropNames.length;i<j;i++){oData[oID3PropNames[i]]=oID3Data[i];}
_t.id3=_s._mergeObjects(_t.id3,oData);if(_t._iO.onid3){_t._iO.onid3.apply(_t);}};this._whileplaying=function(nPosition,oPeakData,oWaveformDataLeft,oWaveformDataRight,oEQData){if(isNaN(nPosition)||nPosition===null){return false;}
if(_t.playState===0&&nPosition>0){nPosition=0;}
_t.position=nPosition;if(_t._iO.usePeakData&&typeof oPeakData!='undefined'&&oPeakData){_t.peakData={left:oPeakData.leftPeak,right:oPeakData.rightPeak};}
if(_t._iO.useWaveformData&&typeof oWaveformDataLeft!='undefined'&&oWaveformDataLeft){_t.waveformData={left:oWaveformDataLeft.split(','),right:oWaveformDataRight.split(',')};}
if(_t._iO.useEQData&&typeof oEQData!='undefined'&&oEQData){_t.eqData=oEQData;}
if(_t.playState==1){if(_t.isBuffering){_t._onbufferchange(0);}
if(_t._iO.whileplaying){_t._iO.whileplaying.apply(_t);}
if(_t.loaded&&_t._iO.onbeforefinish&&_t._iO.onbeforefinishtime&&!_t.didBeforeFinish&&_t.duration-_t.position<=_t._iO.onbeforefinishtime){_t._onbeforefinish();}}};this._onload=function(bSuccess){bSuccess=(bSuccess==1?true:false);if(!bSuccess){if(_s.sandbox.noRemote===true){}
if(_s.sandbox.noLocal===true){}}
_t.loaded=bSuccess;_t.readyState=bSuccess?3:2;if(_t._iO.onload){_t._iO.onload.apply(_t);}};this._onbeforefinish=function(){if(!_t.didBeforeFinish){_t.didBeforeFinish=true;if(_t._iO.onbeforefinish){_t._iO.onbeforefinish.apply(_t);}}};this._onjustbeforefinish=function(msOffset){if(!_t.didJustBeforeFinish){_t.didJustBeforeFinish=true;if(_t._iO.onjustbeforefinish){_t._iO.onjustbeforefinish.apply(_t);}}};this._onfinish=function(){if(_t._iO.onbeforefinishcomplete){_t._iO.onbeforefinishcomplete.apply(_t);}
_t.didBeforeFinish=false;_t.didJustBeforeFinish=false;if(_t.instanceCount){_t.instanceCount--;if(!_t.instanceCount){_t.playState=0;_t.paused=false;_t.instanceCount=0;_t.instanceOptions={};}
if(!_t.instanceCount||_t._iO.multiShotEvents){if(_t._iO.onfinish){_t._iO.onfinish.apply(_t);}}}else{if(_t.useVideo){}}};this._onmetadata=function(oMetaData){if(!oMetaData.width&&!oMetaData.height){oMetaData.width=320;oMetaData.height=240;}
_t.metadata=oMetaData;_t.width=oMetaData.width;_t.height=oMetaData.height;if(_t._iO.onmetadata){_t._iO.onmetadata.apply(_t);}};this._onbufferchange=function(bIsBuffering){if(_t.playState===0){return false;}
if(bIsBuffering==_t.isBuffering){return false;}
_t.isBuffering=(bIsBuffering==1?true:false);if(_t._iO.onbufferchange){_t._iO.onbufferchange.apply(_t);}};this._ondataerror=function(sError){if(_t.playState>0){if(_t._iO.ondataerror){_t._iO.ondataerror.apply(_t);}}else{}};};this._onfullscreenchange=function(bFullScreen){_s.isFullScreen=(bFullScreen==1?true:false);if(!_s.isFullScreen){try{window.focus();}catch(e){}}};if(window.addEventListener){window.addEventListener('focus',_s.handleFocus,false);window.addEventListener('load',_s.beginDelayedInit,false);window.addEventListener('unload',_s.destruct,false);if(_s._tryInitOnFocus){window.addEventListener('mousemove',_s.handleFocus,false);}}else if(window.attachEvent){window.attachEvent('onfocus',_s.handleFocus);window.attachEvent('onload',_s.beginDelayedInit);window.attachEvent('unload',_s.destruct);}else{_s._debugTS('onload',false);soundManager.onerror();soundManager.disable();}
if(document.addEventListener){document.addEventListener('DOMContentLoaded',_s.domContentLoaded,false);}}
if(typeof SM2_DEFER=='undefined'||!SM2_DEFER){soundManager=new SoundManager();}