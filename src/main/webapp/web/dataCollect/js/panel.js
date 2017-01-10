// 缓存当前图的数据，用于自适应时，重新画图
Hik.dataCollect.pages.graph.data = null;

Hik.dataCollect.pages.graph.drag = function(data){
	Hik.dataCollect.pages.graph.data = data;
	var This = this;
	//绘图
	$('.graphDiv').myflow({
		editable : true,
		width :  $('.graphDiv').width(),
		height : $('.graphDiv').height(),
		restore : eval("(" + data + ")"),
		tools : {
			showProps:{
				onclick : function(e, props, src, callback) {
					var ctype = props['ctype'];
					if(null != ctype){
						switch (ctype) {
							case 'TableInput':
								//表输入
								This.loadTableInfo(props);
								$('#myflow_props .fieldInfos').height($('#myflow_props').height() - 225);
								break;
							case 'InsertUpdate':
								//插入/更新
								This.loadInsertInfo(props);
								$('#myflow_props .fieldInfos').height(($('#myflow_props').height() - 225)/2 - 20);
								break;
							case 'MergeJoin':
								//合并连接
								This.loadJoinInfo(props);
								$('#myflow_props .fieldInfos').height($('#myflow_props').height() - 195);
								break;
							case 'SPECIAL':
								//开始
								This.loadStartInfo(props);
								break;
							case 'TRANS':
								//转换
								This.loadTransformInfo(props);
								break;
							default:
								break;
						}
					}
					//将属性框置顶，主要是当执行框弹出的时候
					$('#myflow_props').css('z-index', Tool.getMaxZIndex() + 1);
					//绑定关闭按钮
					$('#myflow_props').find('.closebtn').bind('click',function(){
						$('#myflow_props').find('.button').trigger('click');
					});
					$('#myflow_props').find('.button').bind('click',function(){
						$('#myflow_props').empty().hide();
					});
				}
			}
		}
	});
	
}

/**
 * 画板 初始化
 */
Hik.dataCollect.pages.graph.init = function(taskName){
	var This = this;
	
	// 说明是有任务的，可以启动任务
	if(null != taskName && '' != taskName){
		$(".titleTd .btn .run").show();
	}else{
		$(".titleTd .btn .run").hide();
	}
	
	// 加载流程图
	if(null == taskName || '' == taskName){
		This.drag(null);
		return;
	}
	
	// 不是新增的，需要从后台查询数据
	if('transform' == Hik.dataCollect.pages.currentView){
//		var data = '{states:{to1:{type:"insert",text:{text:"插入/更新"},attr:{height:50,x:410,width:100,y:359},props:{param:{value:"xxxx"}}},to2:{type:"join",text:{text:"合并连接"},attr:{height:50,x:310,width:100,y:259},props:{param:{value:"xxxx"}}},from1:{type:"table",text:{text:"表输入"},attr:{height:50,x:210,width:100,y:159},props:{param:{value:"xxxx"}}}},paths:{path1:{from:"from1",to:"to2",dots:[],text:{text:""},props:{param:{value:"xxxx"}}},path2:{from:"to2",to:"to1",dots:[],text:{text:""},props:{param:{value:"xxxx"}}}}}';
//		This.drag(data);
		$.ajax({
			type : 'GET',
			url : appPath + '/transService/open.do?name=' + encodeURI(taskName) + '&type=transformation',
			dataType : 'text',
			success : function(data){
				This.drag(data);
			},
			error : function(data){
				This.drag(null);
				$.sticky('加载图形化数据失败', 'error', {position: 'center-center'});
			} 
		});
	}
	if('task' == Hik.dataCollect.pages.currentView){
//		var data = '{states:{to2:{type:"TRANS",text:{text:"转换"},attr:{height:50,x:310,width:100,y:259},props:{param:{value:"xxxx"}}},from1:{type:"SPECIAL",text:{text:"开始"},attr:{height:50,x:210,width:100,y:159},props:{param:{value:"xxxx"}}}},paths:{path1:{from:"from1",to:"to2",dots:[],text:{text:""},props:{param:{value:"xxxx"}}}}}';
//		This.drag(data);
		$.ajax({
			type : 'GET',
			url : appPath + '/jobService/open.do?name=' + encodeURI(taskName) + '&type=job',
			dataType : 'text',
			success : function(data){
				This.drag(data);
			},
			error : function(data){
				This.drag(null);
				$.sticky('加载图形化数据失败', 'error', {position: 'center-center'});
			} 
		});
	}
}

/**
 * 展示表输入相关的信息
 */
Hik.dataCollect.pages.graph.loadTableInfo = function(props){
	var field = "";
	if(Tool.isNotEmpty(props.fields)){
		var fields = JSON.parse(props.fields);
		for(var k in fields){
			if(fields[k].src && fields[k].target){
				field += '<div class="fieldInfo">';
				field += '<div class="field">' + fields[k].src + '</div>';
				field += '<div class="field tip">别名:' + fields[k].target + '</div>';
				field += '</div>';
			}
		}
	}
	
	var html = [ 
	   '<div class="title">表输入',
	   		'<div class="closebtn"></div>',
	   '</div>', 
	   '<div class="info">',
		   '<div>步骤名称：' + props.label + '</div>',
		   '<div>数据源：' + props.connection + '</div>',
		   '<div>数据库表：' + props.tableName + '</div>',
	   '</div>',
	   '<div class="fieldTitle">',
	   	   '<div class="message">表字段&nbsp;</div>',
		   '<div class="line"></div>',
	   '</div>',
	   '<div class="fieldInfos">',
	   		'' + field + '',
	   '</div>'
	];
	$('#myflow_props').append(html.join(''));
	$('#myflow_props').append('<a href="javascript:void(0)" class="button" name="stop">关闭</a>');
}

/**
 * 展示插入更新
 */
Hik.dataCollect.pages.graph.loadInsertInfo = function(props){
	var searchField = "";
	if(Tool.isNotEmpty(props.searchFields)){
		var fields = JSON.parse(props.searchFields);
		for(var k in fields){
			if(fields[k].keyLookup && fields[k].keyStream1){
				searchField += '<div class="fieldInfo">';
				searchField += '<div class="field">流字段：' + fields[k].keyStream1 + '</div>';
				searchField += '<div class="field">比较符：' + fields[k].keyCondition + '</div>';
				searchField += '<div class="field">表字段：' + fields[k].keyLookup + '</div>';
				searchField += '</div>';
			}
		}
	}
	
	var updateField = "";
	if(Tool.isNotEmpty(props.updateFields)){
		var fields = JSON.parse(props.updateFields);
		for(var k in fields){
			if(fields[k].updateLookup && fields[k].updateStream){
				updateField += '<div class="fieldInfo">';
				updateField += '<div class="field">流字段：' + fields[k].updateStream + '</div>';
				updateField += '<div class="field">表字段：' + fields[k].updateLookup + '</div>';
				updateField += '</div>';
			}
		}
	}
	
	var html = [ 
 	   '<div class="title">插入更新',
 	   		'<div class="closebtn"></div>',
 	   '</div>', 
 	   '<div class="info">',
 		   '<div>步骤名称：' + props.label + '</div>',
 		   '<div>数据源：' + props.connection + '</div>',
 		   '<div>目标表：' + props.table + '</div>',
 	   '</div>',
 	   '<div class="fieldTitle">',
 	   		'<div class="message">查询字段</div>',
 	   		'<div class="line"></div>',
 	   '</div>',
 	   '<div class="fieldInfos">',
 	   		'' + searchField + '',
 	   '</div>',
 	   '<div class="fieldTitle">',
	  	   '<div class="message">更新字段</div>',
		   '<div class="line"></div>',
	   '</div>',
	   '<div class="fieldInfos">',
	   		'' + updateField + '',
	   '</div>'
 	];
 	$('#myflow_props').append(html.join(''));
 	
 	for (var l in props.updateFields) {
 		if(!$.isFunction(props.updateFields[l])){
			var html = [
			    '<div class="fieldInfo">',
			    	'<div class="name">表字段：' + props.updateFields[l].updateLookup + '</div>',
			    	'<div class="alias">流字段：' + props.updateFields[l].updateStream + '</div>',
			    '</div>'
			];
			$('#myflow_props').append(html.join(''));
 		}
	}
 	
 	$('#myflow_props').append('<a href="javascript:void(0)" class="button" name="stop">关闭</a>');
}

/**
 * 展示合并连接
 */
Hik.dataCollect.pages.graph.loadJoinInfo = function(props){
	var key1 = "";
	if(Tool.isNotEmpty(props.key1)){
		var key = JSON.parse(props.key1);
		for(var k in key){
			if(key[k].key){
				key1 += '<div class="field" style="margin-left: 50px;">' + key[k].key + '</div>';
			}
		}
	}
	var key2 = "";
	if(Tool.isNotEmpty(props.key2)){
		var key = JSON.parse(props.key2);
		for(var k in key){
			if(key[k].key){
				key2 += '<div class="field" style="margin-left: 50px;">' + key[k].key + '</div>';
			}
		}
	}
	
	var html = [ 
  	   '<div class="title">合并连接',
  	   		'<div class="closebtn"></div>',
  	   '</div>', 
  	   '<div class="info">',
  		   '<div>步骤名称：' + props.label + '</div>',
  		   '<div>连接类型：' + props.join_type + '</div>',
  	   '</div>',
  	   '<div class="fieldTitle">',
		   '<div class="message">步骤详情</div>',
		   '<div class="line"></div>',
	   '</div>',
	   '<div class="fieldInfos">',
		   '<div class="fieldInfo">',
		   		'<div class="name">步骤一：' + props.step1 + '</div>',
		    	'' + key1 + '',
		   '</div>',
		   '<div class="fieldInfo">',
		    	'<div class="name">步骤二：' + props.step2 + '</div>',
		    	'' + key2 + '',
		   '</div>',
	   '</div>'
	];
	
	$('#myflow_props').append(html.join(''));
  	$('#myflow_props').append('<a href="javascript:void(0)" class="button" name="stop">关闭</a>');
}

/**
 * 开始
 */
Hik.dataCollect.pages.graph.loadStartInfo = function(props){
	var repeat;
	(props.repeat == 'Y') ? repeat = "重复" : repeat = "不重复";
	
	var times = "";
	switch(props.schedulerType){
		case '0':
			//不需要定时
			times = "不需要定时";
			break;
		case '1':
	 		// 时间
			times = "间隔" + props.intervalSeconds + "秒";
			break;
	 	case '2':
	 		//天
	 		times = props.hour + " 时 " + props.minutes + " 分";
			break;
	 	case '3':
	 		//周
	 		var weekDay;
	 		switch(props.weekDay){
	 			case '0' : weekDay="星期天";break;
	 			case '1' : weekDay="星期一";break;
	 			case '2' : weekDay="星期二";break;
	 			case '3' : weekDay="星期三";break;
	 			case '4' : weekDay="星期四";break;
	 			case '5' : weekDay="星期五";break;
	 			case '6' : weekDay="星期六";break;
	 		}
	 		times =  weekDay + " " + props.hour + " 时 " + props.minutes + " 分";
			break;
	 	case '4':
	 		//月
	 		times = "第 " + props.DayOfMonth + " 天 " + props.hour + " 时 " + props.minutes + " 分";
			break;
		default:
			//不需要定时
			times = "不需要定时";
			break;
	}
	var html = [ 
  	   '<div class="title">开始',
  	   		'<div class="closebtn"></div>',
  	   '</div>', 
  	   '<div class="info">',
  		   '<div>是否重复：' + repeat + '</div>',
  		   '<div>执行时间：' + times + '</div>',
  	   '</div>'
  	];
	
  	$('#myflow_props').append(html.join(''));
  	$('#myflow_props').append('<a href="javascript:void(0)" class="button" name="stop">关闭</a>');
}

/**
 * 转换
 */
Hik.dataCollect.pages.graph.loadTransformInfo = function(props){
	var html = [ 
  	   '<div class="title">转换',
  	   		'<div class="closebtn"></div>',
  	   '</div>', 
  	   '<div class="info">',
  		   '<div>步骤名称：' + props.label+ '</div>',
  		   '<div>转换名称：' + props.transname + '</div>',
  	   '</div>'
  	];
	
  	$('#myflow_props').append(html.join(''));
  	$('#myflow_props').append('<a href="javascript:void(0)" class="button" name="stop">关闭</a>');
}