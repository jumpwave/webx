define("./swfobject",[],function(){var D=function(){function u(){if(!s){try{var a=d.getElementsByTagName("body")[0].appendChild(d.createElement("span"));a.parentNode.removeChild(a)}catch(b){return}s=!0;for(var a=x.length,c=0;c<a;c++)x[c]()}}function M(a){s?a():x[x.length]=a}function N(a){if(typeof m.addEventListener!=i)m.addEventListener("load",a,!1);else if(typeof d.addEventListener!=i)d.addEventListener("load",a,!1);else if(typeof m.attachEvent!=i)V(m,"onload",a);else if(typeof m.onload=="function"){var b=
m.onload;m.onload=function(){b();a()}}else m.onload=a}function W(){var a=d.getElementsByTagName("body")[0],b=d.createElement(r);b.setAttribute("type",y);var c=a.appendChild(b);if(c){var f=0;(function(){if(typeof c.GetVariable!=i){var g=c.GetVariable("$version");if(g)g=g.split(" ")[1].split(","),e.pv=[parseInt(g[0],10),parseInt(g[1],10),parseInt(g[2],10)]}else if(f<10){f++;setTimeout(arguments.callee,10);return}a.removeChild(b);c=null;E()})()}else E()}function E(){var a=o.length;if(a>0)for(var b=0;b<
a;b++){var c=o[b].id,f=o[b].callbackFn,g={success:!1,id:c};if(e.pv[0]>0){var d=n(c);if(d)if(z(o[b].swfVersion)&&!(e.wk&&e.wk<312)){if(t(c,!0),f)g.success=!0,g.ref=F(c),f(g)}else if(o[b].expressInstall&&G()){g={};g.data=o[b].expressInstall;g.width=d.getAttribute("width")||"0";g.height=d.getAttribute("height")||"0";if(d.getAttribute("class"))g.styleclass=d.getAttribute("class");if(d.getAttribute("align"))g.align=d.getAttribute("align");for(var h={},d=d.getElementsByTagName("param"),j=d.length,k=0;k<
j;k++)d[k].getAttribute("name").toLowerCase()!="movie"&&(h[d[k].getAttribute("name")]=d[k].getAttribute("value"));H(g,h,c,f)}else X(d),f&&f(g)}else if(t(c,!0),f){if((c=F(c))&&typeof c.SetVariable!=i)g.success=!0,g.ref=c;f(g)}}}function F(a){var b=null;if((a=n(a))&&a.nodeName=="OBJECT")typeof a.SetVariable!=i?b=a:(a=a.getElementsByTagName(r)[0])&&(b=a);return b}function G(){return!A&&z("6.0.65")&&(e.win||e.mac)&&!(e.wk&&e.wk<312)}function H(a,b,c,f){A=!0;I=f||null;O={success:!1,id:c};var g=n(c);if(g){g.nodeName==
"OBJECT"?(w=J(g),B=null):(w=g,B=c);a.id=P;if(typeof a.width==i||!/%$/.test(a.width)&&parseInt(a.width,10)<310)a.width="310";if(typeof a.height==i||!/%$/.test(a.height)&&parseInt(a.height,10)<137)a.height="137";d.title=d.title.slice(0,47)+" - Flash Player Installation";f=e.ie&&e.win?"ActiveX":"PlugIn";f="MMredirectURL="+encodeURI(window.location).toString().replace(/&/g,"%26")+"&MMplayerType="+f+"&MMdoctitle="+d.title;typeof b.flashvars!=i?b.flashvars+="&"+f:b.flashvars=f;if(e.ie&&e.win&&g.readyState!=
4)f=d.createElement("div"),c+="SWFObjectNew",f.setAttribute("id",c),g.parentNode.insertBefore(f,g),g.style.display="none",function(){g.readyState==4?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)}();K(a,b,c)}}function X(a){if(e.ie&&e.win&&a.readyState!=4){var b=d.createElement("div");a.parentNode.insertBefore(b,a);b.parentNode.replaceChild(J(a),b);a.style.display="none";(function(){a.readyState==4?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)})()}else a.parentNode.replaceChild(J(a),
a)}function J(a){var b=d.createElement("div");if(e.win&&e.ie)b.innerHTML=a.innerHTML;else if(a=a.getElementsByTagName(r)[0])if(a=a.childNodes)for(var c=a.length,f=0;f<c;f++)!(a[f].nodeType==1&&a[f].nodeName=="PARAM")&&a[f].nodeType!=8&&b.appendChild(a[f].cloneNode(!0));return b}function K(a,b,c){var f,g=n(c);if(e.wk&&e.wk<312)return f;if(g){if(typeof a.id==i)a.id=c;if(e.ie&&e.win){var q="",h;for(h in a)if(a[h]!=Object.prototype[h])h.toLowerCase()=="data"?b.movie=a[h]:h.toLowerCase()=="styleclass"?
q+=' class="'+a[h]+'"':h.toLowerCase()!="classid"&&(q+=" "+h+'="'+a[h]+'"');h="";for(var j in b)b[j]!=Object.prototype[j]&&(h+='<param name="'+j+'" value="'+b[j]+'" />');g.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+q+">"+h+"</object>";C[C.length]=a.id;f=n(a.id)}else{j=d.createElement(r);j.setAttribute("type",y);for(var k in a)a[k]!=Object.prototype[k]&&(k.toLowerCase()=="styleclass"?j.setAttribute("class",a[k]):k.toLowerCase()!="classid"&&j.setAttribute(k,a[k]));for(q in b)b[q]!=
Object.prototype[q]&&q.toLowerCase()!="movie"&&(a=j,h=q,k=b[q],c=d.createElement("param"),c.setAttribute("name",h),c.setAttribute("value",k),a.appendChild(c));g.parentNode.replaceChild(j,g);f=j}}return f}function Q(a){var b=n(a);if(b&&b.nodeName=="OBJECT")e.ie&&e.win?(b.style.display="none",function(){if(b.readyState==4){var c=n(a);if(c){for(var f in c)typeof c[f]=="function"&&(c[f]=null);c.parentNode.removeChild(c)}}else setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b)}function n(a){var b=
null;try{b=d.getElementById(a)}catch(c){}return b}function V(a,b,c){a.attachEvent(b,c);v[v.length]=[a,b,c]}function z(a){var b=e.pv,a=a.split(".");a[0]=parseInt(a[0],10);a[1]=parseInt(a[1],10)||0;a[2]=parseInt(a[2],10)||0;return b[0]>a[0]||b[0]==a[0]&&b[1]>a[1]||b[0]==a[0]&&b[1]==a[1]&&b[2]>=a[2]?!0:!1}function R(a,b,c,f){if(!e.ie||!e.mac){var g=d.getElementsByTagName("head")[0];if(g){c=c&&typeof c=="string"?c:"screen";f&&(L=l=null);if(!l||L!=c)f=d.createElement("style"),f.setAttribute("type","text/css"),
f.setAttribute("media",c),l=g.appendChild(f),e.ie&&e.win&&typeof d.styleSheets!=i&&d.styleSheets.length>0&&(l=d.styleSheets[d.styleSheets.length-1]),L=c;e.ie&&e.win?l&&typeof l.addRule==r&&l.addRule(a,b):l&&typeof d.createTextNode!=i&&l.appendChild(d.createTextNode(a+" {"+b+"}"))}}}function t(a,b){if(S){var c=b?"visible":"hidden";s&&n(a)?n(a).style.visibility=c:R("#"+a,"visibility:"+c)}}function T(a){return/[\\\"<>\.;]/.exec(a)!=null&&typeof encodeURIComponent!=i?encodeURIComponent(a):a}var i="undefined",
r="object",y="application/x-shockwave-flash",P="SWFObjectExprInst",m=window,d=document,p=navigator,U=!1,x=[function(){U?W():E()}],o=[],C=[],v=[],w,B,I,O,s=!1,A=!1,l,L,S=!0,e=function(){var a=typeof d.getElementById!=i&&typeof d.getElementsByTagName!=i&&typeof d.createElement!=i,b=p.userAgent.toLowerCase(),c=p.platform.toLowerCase(),f=c?/win/.test(c):/win/.test(b),c=c?/mac/.test(c):/mac/.test(b),b=/webkit/.test(b)?parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,g=!+"\u000b1",e=[0,0,0],
h=null;if(typeof p.plugins!=i&&typeof p.plugins["Shockwave Flash"]==r){if((h=p.plugins["Shockwave Flash"].description)&&!(typeof p.mimeTypes!=i&&p.mimeTypes[y]&&!p.mimeTypes[y].enabledPlugin))U=!0,g=!1,h=h.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),e[0]=parseInt(h.replace(/^(.*)\..*$/,"$1"),10),e[1]=parseInt(h.replace(/^.*\.(.*)\s.*$/,"$1"),10),e[2]=/[a-zA-Z]/.test(h)?parseInt(h.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}else if(typeof m.ActiveXObject!=i)try{var j=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
if(j&&(h=j.GetVariable("$version")))g=!0,h=h.split(" ")[1].split(","),e=[parseInt(h[0],10),parseInt(h[1],10),parseInt(h[2],10)]}catch(k){}return{w3:a,pv:e,wk:b,ie:g,win:f,mac:c}}();(function(){e.w3&&((typeof d.readyState!=i&&d.readyState=="complete"||typeof d.readyState==i&&(d.getElementsByTagName("body")[0]||d.body))&&u(),s||(typeof d.addEventListener!=i&&d.addEventListener("DOMContentLoaded",u,!1),e.ie&&e.win&&(d.attachEvent("onreadystatechange",function(){d.readyState=="complete"&&(d.detachEvent("onreadystatechange",
arguments.callee),u())}),m==top&&function(){if(!s){try{d.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}u()}}()),e.wk&&function(){s||(/loaded|complete/.test(d.readyState)?u():setTimeout(arguments.callee,0))}(),N(u)))})();(function(){e.ie&&e.win&&window.attachEvent("onunload",function(){for(var a=v.length,b=0;b<a;b++)v[b][0].detachEvent(v[b][1],v[b][2]);a=C.length;for(b=0;b<a;b++)Q(C[b]);for(var c in e)e[c]=null;e=null;for(var f in D)D[f]=null;D=null})})();return{registerObject:function(a,
b,c,f){if(e.w3&&a&&b){var d={};d.id=a;d.swfVersion=b;d.expressInstall=c;d.callbackFn=f;o[o.length]=d;t(a,!1)}else f&&f({success:!1,id:a})},getObjectById:function(a){if(e.w3)return F(a)},embedSWF:function(a,b,c,d,g,q,h,j,k,m){var n={success:!1,id:b};e.w3&&!(e.wk&&e.wk<312)&&a&&b&&c&&d&&g?(t(b,!1),M(function(){c+="";d+="";var e={};if(k&&typeof k===r)for(var l in k)e[l]=k[l];e.data=a;e.width=c;e.height=d;l={};if(j&&typeof j===r)for(var o in j)l[o]=j[o];if(h&&typeof h===r)for(var p in h)typeof l.flashvars!=
i?l.flashvars+="&"+p+"="+h[p]:l.flashvars=p+"="+h[p];if(z(g))o=K(e,l,b),e.id==b&&t(b,!0),n.success=!0,n.ref=o;else if(q&&G()){e.data=q;H(e,l,b,m);return}else t(b,!0);m&&m(n)})):m&&m(n)},switchOffAutoHideShow:function(){S=!1},ua:e,getFlashPlayerVersion:function(){return{major:e.pv[0],minor:e.pv[1],release:e.pv[2]}},hasFlashPlayerVersion:z,createSWF:function(a,b,c){if(e.w3)return K(a,b,c)},showExpressInstall:function(a,b,c,d){e.w3&&G()&&H(a,b,c,d)},removeSWF:function(a){e.w3&&Q(a)},createCSS:function(a,
b,c,d){e.w3&&R(a,b,c,d)},addDomLoadEvent:M,addLoadEvent:N,getQueryParamValue:function(a){var b=d.location.search||d.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(a==null)return T(b);for(var b=b.split("&"),c=0;c<b.length;c++)if(b[c].substring(0,b[c].indexOf("="))==a)return T(b[c].substring(b[c].indexOf("=")+1))}return""},expressInstallCallback:function(){if(A){var a=n(P);if(a&&w){a.parentNode.replaceChild(w,a);if(B&&(t(B,!0),e.ie&&e.win))w.style.display="block";I&&I(O)}A=!1}}}}();return D});
