/*所有工具类的压缩集合类：js.extend.js、json.js、md5.js、base64.js、date.js、cookie.js、namespace.js、keycode.js*/
String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,"");};String.prototype.lTrim=function(){return this.replace(/(^\s*)/g,"");};String.prototype.rTrim=function(){return this.replace(/(\s*$)/g,"");};String.prototype.startWith=function(str){var reg=new RegExp("^"+str);return reg.test(this);};String.prototype.endWith=function(str){var reg=new RegExp(str+"$");return reg.test(this);};String.prototype.replaceAll=function(s1,s2){return this.replace(new RegExp(s1,"gm"),s2);};String.prototype.getURLParam=function(param){var reg=new RegExp("(^|&)"+param+"=([^&]*)(&|$)");var r=this.substr(this.indexOf("\?")+1).match(reg);if(r!=null){return unescape(r[2]);}
return null;};

var JSON;if(!JSON){JSON={};}
(function(){"use strict";function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'
+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())
+'T'+f(this.getUTCHours())+':'
+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())
+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'
+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'
+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'
+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap
+partial.join(',\n'+gap)+'\n'+mind+'}':'{'
+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.toString');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'
+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

function hex_md5(source){if(source=="")
return source;return rstr2hex(rstr_md5(str2rstr_utf8(source)))}
function MD5(source){return hex_md5(source);}
function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}
function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}
function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}
var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}
var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}
function rstr2hex(c){var f="0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}
return b}
function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}
if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}
return b}
function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}
for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}
return a}
function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}
return a}
function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}
return Array(o,n,m,l)}
function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}
function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}
function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}
function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}
function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}
function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}
function bit_rol(a,b){return(a<<b)|(a>>>(32-b))}

function Base64(){var _keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";this.encode=function(input){var output="";var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0;input=_utf8_encode(input);while(i<input.length){chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64;}else if(isNaN(chr3)){enc4=64;}
output=output+
_keyStr.charAt(enc1)+_keyStr.charAt(enc2)+
_keyStr.charAt(enc3)+_keyStr.charAt(enc4);}
return output;}
this.decode=function(input){var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\@]/g,"");while(i<input.length){enc1=_keyStr.indexOf(input.charAt(i++));enc2=_keyStr.indexOf(input.charAt(i++));enc3=_keyStr.indexOf(input.charAt(i++));enc4=_keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2);}
if(enc4!=64){output=output+String.fromCharCode(chr3);}}
output=_utf8_decode(output);return output;}
var _utf8_encode=function(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;}
var _utf8_decode=function(utftext){var string="";var i=0;var c=0,c1=0,c2=0,c3;while(i<utftext.length){c=utftext.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++;}else if((c>191)&&(c<224)){c2=utftext.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2;}else{c2=utftext.charCodeAt(i+1);c3=utftext.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}
return string;}};var BASE64=new Base64();

Date.prototype.format=function(fmt){var DEFAULT_PATTERN='yyyy-MM-dd HH:mm:ss';fmt=fmt||DEFAULT_PATTERN;var o={"M+":this.getMonth()+1,"d+":this.getDate(),"H+":this.getHours(),"h+":this.getHours()>12?this.getHours()%12:this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"w":this.getDay(),"q":Math.floor((this.getMonth()+3)/3)};if(/(y+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4
-RegExp.$1.length));}
if(/(S+)/.test(fmt)){var milliSecond=this.getMilliseconds()+"";fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?milliSecond:("000"+milliSecond).substr(milliSecond.length));}
for(var k in o){if(new RegExp("("+k+")").test(fmt)){var value=o[k]+"";fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));}}
return fmt;};DateFormat=(function(){var SIGN_REGEXP=/([yMdHhmsS])(\1*)/g;var DEFAULT_PATTERN='yyyy-MM-dd HH:mm:ss';var NOW_DATE=new Date();function padding(s,len){var len=len-(s+'').length;for(var i=0;i<len;i++){s='0'+s;}
return s;};return({format:function(date,pattern){pattern=pattern||DEFAULT_PATTERN;return pattern.replace(SIGN_REGEXP,function($0){switch($0.charAt(0)){case'y':return padding(date.getFullYear(),$0.length);case'M':return padding(date.getMonth()+1,$0.length);case'd':return padding(date.getDate(),$0.length);case'H':return padding(date.getHours(),$0.length);case'h':return date.getHours()>12?date.getHours()%12:date.getHours();case'm':return padding(date.getMinutes(),$0.length);case's':return padding(date.getSeconds(),$0.length);case'S':return padding(date.getMilliseconds(),$0.length);}});},parse:function(dateString,pattern){pattern=pattern||DEFAULT_PATTERN;var matchs1=pattern.match(SIGN_REGEXP);var matchs2=dateString.match(/(\d)+/g);if(matchs1.length==matchs2.length){var _date=new Date(1970,0,1);for(var i=0;i<matchs1.length;i++){var _int=parseInt(matchs2[i],10);var sign=matchs1[i];switch(sign.charAt(0)){case'y':_date.setFullYear(_int);break;case'M':_date.setMonth(_int-1);break;case'd':_date.setDate(_int);break;case'H':_date.setHours(_int);break;case'h':_date.setHours(_int>12?_int%12:_int);break;case'm':_date.setMinutes(_int);break;case's':_date.setSeconds(_int);break;case'S':_date.setMilliseconds(_int);break;}}
return _date;}
return null;}});})();

var Cookie={checkEnabled:function(){var cookieEnabled=(navigator.cookieEnabled)?true:false;if(typeof navigator.cookieEnabled=="undefined"&&!cookieEnabled){document.cookie="testcookie";cookieEnabled=(document.cookie=="testcookie")?true:false;document.cookie="";}
return cookieEnabled;},isEmpty:function(obj){return typeof obj=='undefined'||obj==null||((obj.constructor===String||obj.constructor===Array)&&obj.length==0);},isNotEmpty:function(obj){return!this.isEmpty(obj);},set:function(name,value,hours){if(!this.checkEnabled()){return;}
if(this.isNotEmpty(name)){name=escape(name.replace(/^\s*|\s*$/,''));var args=arguments;var argLen=arguments.length;var expires=null;if(this.isNotEmpty(hours)&&!isNaN(hours)){expires=new Date();expires.setTime(expires.getTime()+hours*60*60*1000);}
var path=(argLen>3)?args[3]:'/';var domain=(argLen>4)?args[4]:null;var secure=(argLen>5)?args[5]:false;document.cookie=name
+"="
+escape(value)
+((expires==null)?"":("; expires="+expires.toGMTString()))
+((path==null)?"":("; path="+path))
+((domain==null)?"":("; domain="+domain))
+((secure==true)?"; secure":"");}},get:function(name){if(!this.checkEnabled()){return;}
if(this.isNotEmpty(name)){name=escape(name.replace(/^\s*|\s*$/,''));var allcookies=document.cookie;name+="=";var pos=allcookies.indexOf(name);if(pos!=-1){var start=pos+name.length;var end=allcookies.indexOf(";",start);if(end==-1)
end=allcookies.length;var value=allcookies.substring(start,end);return unescape(value);}}
return"";},clear:function(name){var This=this;if(!This.checkEnabled()){return;}
if(This.isNotEmpty(name)&&This.isNotEmpty(This.get(name))){This.set(name,"",-1);}}};

var Namespace=function(mynamespace){if(!mynamespace||!mynamespace.length){return null;}
var levels=mynamespace.split(".");var curNS=window;for(var i=0;i<levels.length;i++){var key=levels[i];if(i==levels.length-1){if(curNS!=window&&curNS.hasOwnProperty(key)){curNS[key]=null;delete curNS[key];}
curNS[key]={};}else{curNS[key]=curNS[key]||{};}
curNS=curNS[key];}
return curNS;};

var KEYCODE={"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause":19,"CapsLock":20,"Esc":27,"Space":32,"PageUp":33,"PageDown":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Print":44,"Insert":45,"Delete":46,"Help":47,"Number":[48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],"Letter":[65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90]};