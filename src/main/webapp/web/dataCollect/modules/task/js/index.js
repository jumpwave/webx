var myflow = null;
//缓存当前图的数据，用于自适应时，重新画图
Hik.dataCollect.task.data = null;

Hik.dataCollect.task.loadPage = {
	index : appPath + "/web/dataCollect/index.jsp"
}

Hik.dataCollect.task.layout = function() {
	var This = this;
	// 获取页面容器的高度
	var height = $(window).height();
	
	// 获得父容器
	var $parent = $('.container');
	$parent.height(height);
	
	// 左侧菜单栏
	$('.navigatorTd').height(height);
	$('.navigatorTd .nav').css('overflow-y', 'auto');
	$('.navigatorTd .nav').css('overflow-x', 'hidden');
	
	// 日志
	$('.myflow_log').width($parent.width() - 240);
	$('.myflow_log .tab-content .log').height($('.myflow_log').height() - 38);
	$('.myflow_log .tab-content .datagrid').height($('.myflow_log').height() - 38);
	
	// 画板
	$('.containerTd').width($parent.width() - 240);
	$('.containerTd').height(height);
	$('.graphDiv').width($parent.width() - 280);
	$('.graphDiv').height(height - 80);
	// 重画、画板
	Hik.dataCollect.task.graphDrag(Hik.dataCollect.task.data);
}

Hik.dataCollect.task.addListener = function(){
	
	// 自适应事件
	$('.container').unbind('resize').bind('resize', function() {
		Hik.dataCollect.task.layout();
	});
	
	//选取、连线
	$('.toolbtn .node').bind('click', function(){
		var $this = $(this);
		$('.toolbtn .node').removeClass('active');
		$this.addClass('active').siblings(".toolbtn").removeClass('active');
	});
	
	//保存
	$(".titleTd .btn .save").bind('click',function(){
		if($('.titleTd .saveBtn').is(":visible")){
			$('.titleTd .saveBtn').trigger('click');
		}
		var taskName = $('.titleTd .desc .title').html();
		var data = myflow.data.getGraphJsonData(taskName);
		$.ajax({
			type : 'POST',
			url : appPath + '/jobService/save.do',
			data : 'graphJson=' + encodeURI(data),
			dataType : 'json',
			success: function(result){
				if(result.success){
					// 执行按钮是隐藏的，说明是新建，保存后才显示
					// 反之，则是修改，直接显示
					if($('.titleTd .run').is(":hidden")){
						// 绑定执行，停止按钮
						logging.init(taskName);
					}
					
					jAlert('保存成功', '提示', 'ok');
				}else{
					jAlert('保存异常，异常原因：' + result.message, '提示', 'attention');
				}
			},
			error: function(result){
				jAlert('保存异常，请稍后重试！', '提示', 'attention');
			}
		});
		
	});
	
	//返回
	$(".titleTd .btn .return").bind('click',function(){
		window.location.href(Hik.dataCollect.task.loadPage.index);
	});
	
	var tempTaskName;
	//编辑
	$('.titleTd .editBtn').bind('click',function(){
		var taskName = $('.titleTd .title').html()
		tempTaskName = taskName;
		var html = [
		    '<input type="text" value="' + taskName + '">'
		];
		$('.titleTd .desc .title').empty().append(html.join(''));
		$(this).hide();
		$('.titleTd .saveBtn').show();
		$('.titleTd .cancelBtn').show();
	});
	//确认
	$('.titleTd .saveBtn').bind('click',function(){
		var taskName = $('.titleTd .title INPUT').val();
		$('.titleTd .desc .title').empty().html(taskName);
		$(this).hide();
		$('.titleTd .cancelBtn').hide();
		$('.titleTd .editBtn').show();
	});
	$('.titleTd .cancelBtn').bind('click',function(){
		$('.titleTd .desc .title').empty().html(tempTaskName);
		$(this).hide();
		$('.titleTd .saveBtn').hide();
		$('.titleTd .editBtn').show();
	});
	
}

/** 表输入的弹出窗口 */
Hik.dataCollect.task.loadStartInfo = function(props, callback) {
	var This = this;
	
	var html = [
		'<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>是否重复：</div>',
		'<div class="controls" style="line-height: 26px;">',
			'<input class="auto-input" type="radio" name="repeat" required="true" promptPosition="bottomRight" value="Y" checked="checked"/>重复',
			'<input class="auto-input" type="radio" name="repeat" required="true" promptPosition="bottomRight" value="N" />不重复',
		'</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>执行时间：</div>',
		'<div class="controls">',
			'<select required="true" name="schedulerType">',
				'<option value="0">不需要定时</option>',
				'<option value="1">按时间间隔</option>',
				'<option value="2">按天</option>',
				'<option value="3">按周</option>',
				'<option value="4">按月</option>',
			'</select>',
		'</div>',
		'</div>',
		
		'<!-- 时间间隔 -->',
		'<div class="option timeOption">',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label">间隔：</div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="intervalSeconds" />&nbsp;秒',
		    '</div>',
		'</div>',
		'</div>',
		'<!-- 按天 -->',
		'<div class="option dateOption">',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"></div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="hour" />&nbsp;时',
		    '</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"></div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="minutes" />&nbsp;分',
		    '</div>',
		'</div>',
		'</div>',
		'<!-- 按周 -->',
		'<div class="option weekOption">',
			'<div class="control-group" style="float: left;">',
		    '<div class="control-label"></div>',
		    '<div class="controls">',
		    	'<select required="true" name="weekDay">',
		    		'<option value="0">星期天</option>',
		    		'<option value="1">星期一</option>',
		    		'<option value="2">星期二</option>',
		    		'<option value="3">星期三</option>',
		    		'<option value="4">星期四</option>',
		    		'<option value="5">星期五</option>',
		    		'<option value="6">星期六</option>',
		    	'</select>',
		    '</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"></div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="hour" />&nbsp;时',
		    '</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"></div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="minutes" />&nbsp;分',
		    '</div>',
		'</div>',
		'</div>',
		'<!-- 按月 -->',
		'<div class="option monthOption">',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label">第</div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="DayOfMonth" />&nbsp;天',
		    '</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"></div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="hour" />&nbsp;时',
		    '</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"></div>',
		    '<div class="controls" style="line-height: 26px;">',
		    	'<input type="text" name="minutes" />&nbsp;分',
		    '</div>',
		'</div>',
		'</div>'   
	];
	$('.startDailog').html(html.join(''));
	
	//数据源、表
	$('.startDailog SELECT[name=schedulerType]').droplist();   
	$('.startDailog SELECT[name=schedulerType]').bind('change',function(){
		$('.startDailog .timeOption').hide();
		$('.startDailog .dateOption').hide();
		$('.startDailog .weekOption').hide();
		$('.startDailog .monthOption').hide();
		
		switch($(this).val()){
			case '0': 
				break;
			case '1': 
				$('.startDailog .timeOption').show();
				break;
			case '2': 
				$('.startDailog .dateOption').show();
				break;
			case '3': 
				$('.startDailog .weekOption').show();
				$('.startDailog SELECT[name=weekDay]').droplist();   
				break;
			case '4': 
				$('.startDailog .monthOption').show();
				break;
			default:
				break;
		}
	});
	
	//赋值
	if(Tool.isNotEmpty(props['repeat'])){
		$('.startDailog INPUT[name=repeat]').each(function(){
			if(props['repeat'] == $(this).val()){
				$(this).attr('checked','checked');
			}
	    });
	}
	if(Tool.isNotEmpty(props['schedulerType'])){
		var schedulerType = props['schedulerType'];
		$('.startDailog SELECT[name=schedulerType]').val(schedulerType);
		$('.startDailog SELECT[name=schedulerType]').trigger('change');
		
		switch (schedulerType) {
			case '1':
	     		// 时间
	     		$('.startDailog .timeOption INPUT[name=intervalSeconds]').val(props['intervalSeconds']);
				break;
	     	case '2':
	     		//天
	     		$('.startDailog .dateOption INPUT[name=hour]').val(props['hour']);
	     		$('.startDailog .dateOption INPUT[name=minutes]').val(props['minutes']);
				break;
	     	case '3':
	     		//周
	     		$('.startDailog .weekOption SELECT[name=weekDay]').val(props['weekDay']);
	     		$('.startDailog .weekOption SELECT[name=weekDay]').trigger('change');
	     		$('.startDailog .weekOption INPUT[name=hour]').val(props['hour']);
	     		$('.startDailog .weekOption INPUT[name=minutes]').val(props['minutes']);
				break;
	     	case '4':
	     		//月
//	     		$('.startDailog .monthOption INPUT[name=intervalSeconds]').val(props['intervalSeconds']);
	     		$('.startDailog .monthOption INPUT[name=DayOfMonth]').val(props['DayOfMonth']);
	     		$('.startDailog .monthOption INPUT[name=hour]').val(props['hour']);
	     		$('.startDailog .monthOption INPUT[name=minutes]').val(props['minutes']);
				break;
			default:
				//不需要定时
				break;
		}
	}
	
	//打开弹出框
	var dialog = $('.startDailog').dialog({
    	title : "测试",
    	autoOpen : true,
    	modal : true,
    	width : 360,
		height : 300,
		draggable: false,
		resizable: false,
		buttons : {
		    "ok" : {
		    	text : "确认",
		    	'class' : 'button',
		        click : function() {
		           var data = {};
		           data.repeat = $('.startDailog INPUT[name=repeat]:checked').val();
		           data.schedulerType = $('.startDailog SELECT[name=schedulerType]').val();
		           switch (data.schedulerType) {
		           	case '1':
		           		// 时间
		           		data.intervalSeconds = $('.startDailog .timeOption INPUT[name=intervalSeconds]').val();
						break;
		           	case '2':
		           		//天
		           		data.hour = $('.startDailog .dateOption INPUT[name=hour]').val();
		           		data.minutes = $('.startDailog .dateOption INPUT[name=minutes]').val();
						break;
		           	case '3':
		           		//周
		           		data.weekDay = $('.startDailog .weekOption SELECT[name=weekDay]').val();
		           		data.hour = $('.startDailog .weekOption INPUT[name=hour]').val();
		           		data.minutes = $('.startDailog .weekOption INPUT[name=minutes]').val();
						break;
		           	case '4':
		           		//月
		           		$('.startDailog .monthOption INPUT[name=intervalSeconds]').val();
		           		data.DayOfMonth = $('.startDailog .monthOption INPUT[name=DayOfMonth]').val();
		           		data.hour = $('.startDailog .monthOption INPUT[name=hour]').val();
		           		data.minutes = $('.startDailog .monthOption INPUT[name=minutes]').val();
						break;
					default:
						//不需要定时
						break;
					}
		           if ($.isFunction(callback)) {
		        	   callback('START', data);
		           }
		           dialog.dialog("close");
		        }
		    },
		    "cancel" : {
		    	text : "取消",
		    	'class' : 'button button-cancel',   
		    	click : function() {
		    		dialog.dialog("close");   
		        }
		    }
		}
	});
}

Hik.dataCollect.task.loadTransformInfo = function(props , callback){
	var html = [
        '<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>步骤名称：</div>',
		'<div class="controls">',
			'<input class="auto-input" maxlength="30" name="label" required="true" vtype="common" type="text" isOverflown="true" promptPosition="bottomRight"/>',
		'</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>转换名称：</div>',
		'<div class="controls">',
			'<select required="true" name="transname">',
				'<option value="">--请选择--</option>',
			'</select>',
		'</div>',
		'</div>'
	];
	$('.transformDailog').html(html.join(''));
	
	$('.transformDailog SELECT[name=transname]').droplist();
	
	dataAjax.queryTransformations(function(transformations){
		for (var i = 0; i < transformations.length; i++) {
			$('.transformDailog SELECT[name=transname]').append('<option value="' + transformations[i] + '">' + transformations[i] + '</option>');  
		}
		$('.transformDailog SELECT[name=transname]').droplist();
		
		//赋值
		if(Tool.isNotEmpty(props['transname'])){
			$('.transformDailog SELECT[name=transname]').val(props['transname']);
			$('.transformDailog SELECT[name=transname]').trigger('change');  
		}
	});
	//赋值
	$('.transformDailog INPUT[name=label]').val(props['label']);
    
	
	//打开弹出框
	var dialog = $('.transformDailog').dialog({
    	title : "测试",
    	autoOpen : true,
    	modal : true,
    	width : 350,
		height : 240,
		draggable: false,
		resizable: false,
		buttons : {
		    "ok" : {
		    	text : "确认",
		    	'class' : 'button',
		        click : function() {
		        	// 参数验证
		        	var isOk = true;
		    		$('.transformDailog INPUT, SELECT').each(function(){
		    			if(!$(this).validate()){
		    				isOk = false;
		    			}
		    		});
		    		if(!isOk){
		    			return;
		    		}
		        	
		           var data = {};
		           var name = $('.transformDailog INPUT[name=label]').val();
			       data.label = $('.transformDailog INPUT[name=label]').val();
			       data.transname = $('.transformDailog SELECT[name=transname]').val();
		           if ($.isFunction(callback)) {
		        	   callback(name, data);
		           }
		           dialog.dialog("close");
		        }
		    },
		    "cancel" : {
		    	text : "取消",
		    	'class' : 'button button-cancel',   
		    	click : function() {
		    		dialog.dialog("close");   
		        }
		    }
		}
	});
}


/**
 * 页面元素加载完成后将执行此方法
 */
Hik.dataCollect.task.initialize = function(taskName){
	var This = this;
	
	This.addListener();
	This.layout();
	
	if(Tool.isNotEmpty(taskName)){
		//修改
		$('.titleTd .desc .title').html(taskName);
		$.ajax({
			type : 'GET',
			async : 'false',
			url : appPath + '/jobService/open.do?name=' + encodeURI(taskName) + '&type=job',
			dataType : 'text',
			success : function(data){
				Hik.dataCollect.task.graphDrag(data);
			},
			error : function(data){
				$.sticky('加载数据失败，请刷新界面', 'error', {position: 'center-center'});
			} 
		});
		// 可执行
		logging.init(taskName);
	}else{
		//新增
		$('.titleTd .desc .title').html('新建任务');
		Hik.dataCollect.task.graphDrag(null);
	}
	
}

Hik.dataCollect.task.graphDrag = function(data){
	Hik.dataCollect.task.data = data;
	//加载流程图
	var This = this;
	
	myflow = $('.graphDiv').myflow({
		editable : true,
		width : $('.graphDiv').width(),
		height : $('.graphDiv').height(),
		restore : eval("(" + data + ")"),
		tools : {
			showProps:{
				//ondbclick
				ondbclick : function(e, props, src, callback) {
					var ctype = props['ctype'];
					if (null != ctype) {
						switch (ctype) {
							case 'SPECIAL':
								This.loadStartInfo(props, callback);
								break;
							case 'TRANS':
								This.loadTransformInfo(props, callback);
								break;
							
							default:
								break;
						}
					}
					
				}
			}
		}
	});
}

$(document).ready(function(){
	setTimeout(function() {
		Hik.dataCollect.task.initialize(Hik.dataCollect.task.taskName);
	});
});