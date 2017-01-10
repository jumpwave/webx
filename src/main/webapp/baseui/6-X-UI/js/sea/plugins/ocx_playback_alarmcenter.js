define("./ocx_playback_alarmcenter",["./ocx_playback"],function(h){return h("./ocx_playback").extend({ocxNotInstall:!1,constructor:function(b){this.base(b,["hikui-active"],[])},render:function(){this.base("clsid:D4E11A6C-245F-48FB-9D02-8C53C0AB10F6");this.keepLive()},throwError:function(b){throw Error(b);},SetBasicInfo:function(b,c){return this.ocxEl[0].SetBasicInfo(c)},SetPreNextBtnState:function(b,c){return this.ocxEl[0].SetPreNextBtnState(b,c)},SetSearchState:function(b,c,a){return this.ocxEl[0].SetPlayWndStateText(c+
a+"")},SetSearchResult:function(b,c,a){return this.ocxEl[0].SetSearchResult(c,a)},StartPlayback:function(){return this.ocxEl[0].StartPlayback()},StopPlayback:function(){return this.ocxEl[0].StopPlayback()},setWindowStatus:function(b,c,a){a!==!0&&this.trigger("MsgNotify",2566914069);return this.SetSearchState(0,b,c)},startPlayback:function(){return this.StartPlayback(0)},keepLive:function(){setInterval(function(){$.ajax({url:"keepLive.action",type:"POST",dataType:"json"})},9E5)},setResult:function(b,
c){var a=[],f="HIKPlay";a.push('<?xml version="1.0" encoding="UTF-8" ?>');a.push(" <SegmentList>");for(var e=0;e<c.length;e++){var d=c[e];if(d.manufacturer)f=d.manufacturer;a.push("<RecordSegment>");a.push("<BeginTime>");a.push(d.beginTime);a.push("</BeginTime>");a.push("<EndTime>");a.push(d.endTime);a.push("</EndTime>");a.push("<RecordType>");a.push(d.recordType);a.push("</RecordType>");a.push("<MediaDataLen>");a.push(d.mediaDataLen);a.push("</MediaDataLen>");a.push("<IsLocked>");a.push(d.isLocked);
a.push("</IsLocked>");a.push("<PlayURL>");a.push(d.playURL);a.push("</PlayURL>");a.push("</RecordSegment>")}a.push("</SegmentList>");this.SetSearchResult(0,f,a.join(""))},startPlay:function(b,c,a,f){this.cameraId=b;this.StopPlayback();var e=this,d=[];d.push('<?xml version="1.0" encoding="UTF-8" ?>');d.push("<PlaybackBasicInfo>");d.push("<CameraID>"+b+"</CameraID>");d.push("<CameraName>"+f+"</CameraName>");d.push("<BeginTime>"+c+"</BeginTime>");d.push("<EndTime>"+a+"</EndTime>");d.push("</PlaybackBasicInfo>");
e.SetBasicInfo(0,d.join(""));e.setWindowStatus("",language.text("ocx.searchRecord"),!0);$.ajax({url:"queryVideoRecord.action",type:"POST",data:{selectedIds:b,recordType:"4",startTime:c,endTime:a},dataType:"json",success:function(a){if(e.cameraId==b)if(a.success&&a.ret==1)if(a.recordItems&&a.recordItems.length>0){var c=a.recordItems[0];c.status!="200"?e.setWindowStatus("",language.text("ocx.searchRecordF")):c.total==0?e.setWindowStatus("",language.text("ocx.noRecord")):(e.setWindowStatus("",language.text("ocx.playRecord"),
!0),e.setResult(0,a.recordItems),e.startPlayback(0))}else e.setWindowStatus(0,language.text("ocx.searchRecordF"));else $.sticky(language.text("ocx.searchRecordF"),{type:"error"})}})},initLocalParam:function(){var b=[];b.push('<?xml version="1.0" encoding="UTF-8" ?>');b.push("<PlaybackOcxConfig>");var c=$.commonCookie("ocx-setting-replay-decoding");c||(c=0);b.push("<DecodeEffect>"+c+"</DecodeEffect>");b.push("<WindowToolbar>");c=$.commonCookie("ocx-setting-playback-bar-isshow");c!=1&&(c=0);b.push("<ShowMode>"+
c+"</ShowMode>");b.push("<ShowItems>");var a=$.commonCookie("ocx-setting-playback-btn"),c=[];if($.commonCookie("ocx-setting-playback-init")){if(a&&(c=a.split(","),!c||c.length<1))c=[]}else c=[5,7,12,13,17];for(a=0;a<c.length;a++)b.push("<BtnItem>"+c[a]+"</BtnItem>");b.push("</ShowItems>");b.push("</WindowToolbar>");b.push("<SnapParam>");var c=(c=$.commonCookie("ocx-setting-capture-format"))?c=="BMP"?"1":"0":"0",a=2,f=3,e=1E3,d=$.commonCookie("ocx-setting-capture-time");d&&((d=d.split(","))&&d.length==
2?(a=1,e=d[1]*1E3):a=2);(d=$.commonCookie("ocx-setting-capture-count"))&&(f=d);(d=$.commonCookie("ocx-setting-capture-file"))||(d="");var g=$.commonCookie("ocx-setting-capture-path");g||(g=this.GetSystemDrive()+"\\Program Data\\capture");g=g.replace(/&/g,"&amp;");b.push("<FileFormat>"+c+"</FileFormat>");b.push("<FilePath>"+g+"</FilePath>");b.push("<FileCategorization>0</FileCategorization>");b.push("<FileNameFormat>"+d+"</FileNameFormat>");b.push("<SnapMode>2</SnapMode>");b.push("<ContinousNum>"+
f+"</ContinousNum>");b.push("<ContinousMode>"+a+"</ContinousMode>");b.push("<ContinousInterval>"+e+"</ContinousInterval>");b.push("</SnapParam>");b.push("<DiskWarning>");b.push("<EnableDiskWarning>0</EnableDiskWarning>");b.push("<WarningSpace>500</WarningSpace>");b.push("<MinimumSpace>100</MinimumSpace>");b.push("</DiskWarning>");b.push("</PlaybackOcxConfig>");this.SetLocalParam(b.join(""))}})});
