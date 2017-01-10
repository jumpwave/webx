Hik.dataAudit.layout = function() {
	var This = this;
	// 获得父容器
	var $parent = $('.dataAuditContainer');	
	// 获取页面容器的高度
	var height = $(window).height();
	$parent.height(height - 10);
	
	var spanHeight = $('.navigatorTd .span').height();
	$('.navigatorTd').height(height);
	
	var spanHeight = $('.navigatorTd .span').height();
	$('.containerTd').height(height);
	
	var $nav = $('.navigatorTd > .nav');
	$nav.height(height - 70);
	$nav.css('overflow-y', 'auto');
	$nav.css('overflow-x', 'hidden');
	
}

Hik.dataAudit.addListener = function() {
	var This = this;
	
	// 自适应事件
	$('.container').unbind('resize').bind('resize', function() {
		This.layout();
	});
	
	//绑定，新建按钮
	$('.navigatorTitle .addBtn').bind('click',function(){
		Hik.dataAudit.addAuditTaskBase();
	});
	
	//绑定导航菜单事件
	$('.navigatorTd > .nav > .menu').unbind('click').bind('click', function(){
		var $this = $(this);
		$('.navigatorTd > .nav > .menu').removeClass('active');
		$this.addClass('active').siblings(".nav > .menu").removeClass('active');
		var task_id = $this.attr('task_id')
		Hik.dataAudit.showTask(task_id);
	});
	
	//删除按钮
	$('.navigatorTd > .nav > .menu > .delbtn').unbind('click').bind('click', function(){
		var $this = $(this);
		//alert("删除：" + $this.parent().attr('value'));
		jConfirm('确认删除？', '系统提示', function (r) {   
	        if(r){
	        	var task_id = $this.parent().attr('task_id');
	        	if('' != data){
	        		$.ajax({
	        			type : 'DELETE',
	        			url : appPath + '/metadata/DataAuditTask/' + task_id,
	        			dataType : 'json',
	        			success: function(result){
	        				if(0 == result.ret){
	        					jAlert('删除成功', '系统提示', 'ok');
	        					window.location.reload();
	        				}else{
	        					jAlert('删除异常，异常原因：' + result.message, '系统提示', 'attention');
	        				}
	        			},
	        			error: function(result){
	        				jAlert('删除异常，请稍后重试！', '系统提示', 'attention');
	        			}
	        		});
	        	}
	        	//移除当前的菜单，点击第一个
	        	$this.parent().remove();
	    		$('.navigatorTd > .nav > .menu:first').trigger('click');
	        }   
	    }); 
	});
	
	//暂停或恢复
	$('.navigatorTd > .nav > .menu > .statebtn').unbind('click').bind('click', function(e){	
		e.stopPropagation();
		var $this = $(this);
		var state = 'paused';
		var msg = '暂停';
    	var task_id = $this.parent().attr('task_id');
		var url = appPath + '/metadata/DataAuditTask/' + task_id + "/pause";		
		if($this.hasClass("paused")){
			url = appPath + '/metadata/DataAuditTask/' + task_id + "/resume";
			state = 'running';
			msg = '恢复';
		}

		$.ajax({
			type : 'GET',
			url :  url,
			dataType : 'json',
			success: function(result){
				if(0 == result.ret){    	
					if('PAUSED' == result.result){
						$this.addClass("paused");
					}else{
						$this.removeClass("paused");
					}
				}else{
					jAlert(msg + '失败！');
				}
			},
			error: function(result){
				jAlert( msg + '失败！');
			}
		});
    	    	
	});
	
}

Hik.dataAudit.initData = function(data){
	$('.baseinfoEdit .controls input[type="text"],.baseinfoEdit .controls textarea').each(function() {
		var $this = $(this);
		var name = $this.attr('name');
		var value = Tool.empty2def(data[name]);
		$this.val(Tool.empty2def(value));
	});
	$('.baseinfoEdit .controls input[type="radio"]').each(function() {
		var $this = $(this);
		$this.removeAttr('checked');
		var name = $this.attr('name');
		var value = Tool.empty2def(data[name]);
		if($this.val() == value){
			$this.attr('checked','checked').trigger('click');
		}
	});
	$('.baseinfoEdit .controls select').each(function() {
		var $this = $(this);
		var name = $this.attr('name');
		var value = Tool.empty2def(data[name]);
		$('option', $this).each(function(inx,el){
			$(el).removeAttr('selected');
			if($(el).val() == value){
				$(el).attr('selected','selected');
			}					
		})
		
		$this.droplist();
	});	
	
	
}

/**
 * 基本设置
 */
Hik.dataAudit.addAuditTaskBase = function(data){
	var This = this;
	var html = [ 
	         
	         '<div class="dataAuditPanel">',
	          '<div style="height:5px;"></div>',
	          '<div id="stepBar"></div>',
	          '<form id="folderEditForm">',
			   '<div class="baseinfoEdit">',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>任务名称：</div>',
					'<div class="controls">',
						'<input type="text" name="task_name" id="task_name" class="typetext" style="width:400px;" maxlength="100" required="true" vtype="common" /> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">任务目标：</div>',
					'<div class="controls">',
						'<textarea name="task_target" id="task_target"  height="100" width="400" maxlength="200" required="true" vtype="common" ></textarea>',
					'</div>',
				'</div>',	        
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>初次执行时间：</div>',
					'<div class="controls">',
						'<input class="Wdate typetext" required="true" type="text" name="first_execute_time"  id="first_execute_time"/> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>执行次数：</div>',
					'<div class="controls">',
						'<input type="radio" name="execute_times" value="once" checked="checked">单次</input>&nbsp;&nbsp; <input type="radio" name="execute_times" value="more">循环</input> ',
					'</div>',
				'</div>',				
				'<div class="control-group execute_interval_div" style="display:none;">',
					'<div class="control-label"><em>*</em>执行间隔：</div>',
					'<div class="controls">',
						'<input class="typetext" type="text" name="execute_interval" style="width:100px; position:relative;top:-10px;"  required="false" vtype="number" allowDecimals="false"/> ',
						 '<select name="execute_interval_unit" id="execute_interval_unit" style="width:80px;">',  
					        '<option value="minute" selected="selected">分钟</option>',  
					        '<option value="hour">小时</option>',  
					        '<option value="day">天</option>',  
//					        '<option value="month">月</option>',  
					    '</select>', 						
					'</div>',
				'</div>',
				'</div>',
			'<div class="control-group">',
				'<div class="control-label">',
					'<a href="javascript:void(0)" class="button button-next" name="next">下一步</a>&nbsp;',
				'</div>',
				'<div class="controls">',
					'<a href="javascript:void(0)" class="button button-cancel" name="return">取消</a>',
				'</div>',
			'</div>',
			'</form>',
		'</div>'
  	];
  	$('.container').empty().append(html.join(''));
  	//界面优化
  	$('.dataAuditPanel').height($('.containerTd').height() - 50);
  	$('#execute_interval_unit').droplist();   	
	var stepBar = $('#stepBar').stepBar([{text: '基本设置'}, {text: '脚本设置'}]).setStep(0);

    $('#first_execute_time').on('click', function(){  
            var opt = {  
                showtime: true,  
               minDate: new Date(), 
                dateFmt:'yyyy-MM-dd HH:mm:ss'  
            };  
            WdatePicker.call(this, opt);  
    });  
    
    $('input[name="execute_times"]').unbind('click').click(function(){
    	if('once' == $(this).val()){
    		$('.execute_interval_div').hide();
    		$('.execute_interval_div  input').removeAttr('required');
    	}else{
    		$('.execute_interval_div').show();
    		$('.execute_interval_div  input').attr('required','true');
    	}   	
    });
	
	$('.dataAuditPanel .button[name=next]').unbind('click').click(function(){
		var isOk = true;
		$('.dataAuditPanel INPUT, SELECT').each(function(){
			if(!$(this).validate()){
				isOk = false;
			}
		});
		if(!isOk){
			return;
		} 
		var databaseInfo = $('#folderEditForm').serializeJSON();
		//到下一步
		$('#stepBar').setStep(1);
		
		data = data || {};
		$.extend(true,data,databaseInfo);
		Hik.dataAudit.addAuditTaskScript(data);		

	});
	
	$('.dataAuditPanel .button[name=return]').unbind('click').click(function(){
		if(data && data.task_id){
			$('.nav > .menu[task_id="'+data.task_id+'"]').trigger('click');
		}else if ($(".nav > .menu").length == 0) {
			window.location.reload();
		} else {
			$('.navigatorTd > .nav > .menu:first').trigger('click');
		}
	});
	
	//数据初始化
	if(data){
		This.initData(data);		
	}		
}

Hik.dataAudit.addAuditTaskScript = function(data){
	debugger;
	var This = this;
	var html = [ 
	        '<div class="dataAuditPanel">',
	          '<div style="height:5px;"></div>',
	          '<div id="stepBar"></div>',
	          '<form id="folderEditForm">',
			 '<div class="baseinfoEdit">',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>数据源：</div>',
					'<div class="controls">',
					'<select name="data_source" id="data_source" style="width:610px;" required="false">',  
					'</select>',
					'</div>',
				'</div>',	
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>SQL脚本：</div>',
					'<div class="controls">',
						'<textarea name="audit_script" id="audit_script" style="width:600px;height:180px;" required="true"></textarea>',
					'</div>',				
				'</div>',	
				'<div class="control-group">',
					'<div class="control-label">SQL参数设置：</div>',
					'<div class="controls">',
						'<a href="javascript:void(0);" class="addFilterBtn" ><i class="icon99 i-new"></i>添加参数</a>',
					'</div>',	
				'</div>',				
				'<div class="control-group">',
					'<div class="control-label"></div>',
					'<div class="controls">',
						'<div id="filterDivTemplate">',
						'</div>',						
					'</div>',	
				'</div>',				
			'</div>',
			'<div class="control-group">',
				'<div class="control-label">',
					'<a href="javascript:void(0)" class="button button-pre" name="pre">上一步</a>&nbsp;',
				'</div>',
				'<div class="controls">',
					'<a href="javascript:void(0)" class="button" name="save">保存</a>&nbsp;',
					'<a href="javascript:void(0)" class="button button-cancel" name="return">取消</a>',
				'</div>',
			'</div>',
			'</form>',
		  '</div>'
  	];
  	$('.container').empty().append(html.join(''));
	var stepBar = $('#stepBar').stepBar([{text: '基本设置',}, {text: '脚本设置',}]).setStep(1);
  	//界面优化
  	$('.dataAuditPanel').height($('.containerTd').height());
  	
	$.ajax({
		type : 'GET',
		async: false,
		url : appPath + '/databaseSourceServie/getDatabases.do',
		//contentType: 'application/json',
		dataType : 'json',
		success: function(result){
			if($.isArray(result)){
				for(var i=0;i<result.length;i++){
					$('<option>').val(result[i].name).text(result[i].name).appendTo($('#data_source'));
				}
			}
		},
		error: function(result){
			jAlert('初始化数据源异常！', '系统提示', 'attention');
		}
	});  	
  	
	function createQueryParamDiv(qp){
		var html = ['<div class="queryParamDiv"> &nbsp;&nbsp;',
		    		'参数名称:<input type="text" name="param_name" class="typetext" style="width:100px;margin-right:20px;" maxlength="100" required="true" vtype="common" /> ',
		    		'参数类型:<select name="param_type" style="width:100px;" required="true">',
		    				'<option value="string">字符串</option><option value="number">数字</option><option value="date">日期</option><option value="system">系统变量</option>',
		    				'</select>',  	
		    		'参数值:<span class="param_value_div"><input type="text" name="param_value" class="typetext" style="width:150px;" maxlength="150" required="true" vtype="common" /></span> ',
		    		'<i class="icon99 i-delete delFilterBtn" style="margin-top: 12px;margin-right: 5px; float: right;cursor: pointer;" href="javascript:void(0)"></i>',
		    		'</div>'];

		var _queryParamDiv = $(html.join(""));
		if(qp){
			$('[name="param_name"]', _queryParamDiv).val(qp.param_name);
			$('[name="param_type"] option', _queryParamDiv).each(function(inx,el){
				$(el).removeAttr("selected");
				if(qp.param_type == $(el).val()){
					$(el).attr("selected","selected");
				}
			})
			
			paramTypeChangeHandler();
			$('[name="param_value"]', _queryParamDiv).val(qp.param_value);
		}	
		$("#filterDivTemplate").append(_queryParamDiv);
		_queryParamDiv.find('select').each(function(inx,el){
			$(el).droplist();
		});
		_queryParamDiv.find(".delFilterBtn").unbind('click').bind('click',function(){
			$(this).closest(".queryParamDiv").remove();		
		});		
		
		function paramTypeChangeHandler(){
			$('.param_value_div',_queryParamDiv).empty();
			var _paramValue = $('<input type="text" name="param_value" class="typetext" style="width:150px;" maxlength="150" required="true" vtype="common" /> ');
			var _paramValueSystem = $('<select name="param_value" style="width:150px;"  required="true" ><option value="last_month">上月yyyy-MM</option><option value="current_month">当月yyyy-MM</option></select> ');
			if($('[name="param_type"]', _queryParamDiv).val() == 'string'){
				$(_paramValue).appendTo($('.param_value_div',_queryParamDiv));
			}
			if($('[name="param_type"]', _queryParamDiv).val() == 'number'){
				$(_paramValue).appendTo($('.param_value_div',_queryParamDiv));
			}
			if($('[name="param_type"]', _queryParamDiv).val() == 'date'){
				$(_paramValue).appendTo($('.param_value_div',_queryParamDiv)).addClass("Wdate").on('click', function(){  
		            var opt = {  
		                    showtime: true,  
		                    dateFmt:'yyyy-MM-dd HH:mm:ss'  
		                };  
		                WdatePicker.call(this, opt);  
		        }); 
				
			}
			if($('[name="param_type"]', _queryParamDiv).val() == 'system'){
				$(_paramValueSystem).appendTo($('.param_value_div',_queryParamDiv));
			}
			
		}
		
		_queryParamDiv.find('[name="param_type"]').change(function(){
			paramTypeChangeHandler();
			_queryParamDiv.find('select').each(function(inx,el){
				$(el).droplist();
			});
		});
	}
	
	$(".addFilterBtn").click(function(){
		createQueryParamDiv();
	});
	
	function getPageParams(){
		var auditScriptParam = $('#folderEditForm').serializeJSON();
		var pageParam = {};
		pageParam.data_source = auditScriptParam.data_source;
		pageParam.audit_script = auditScriptParam.audit_script;
		var script_params = [];
		if($.isArray(auditScriptParam.param_name)){
			for(var i=0;i<auditScriptParam.param_name.length;i++){
				var obj = {};
				obj.param_name = auditScriptParam.param_name[i];
				obj.param_type = auditScriptParam.param_type[i];
				obj.param_value = auditScriptParam.param_value[i];
				script_params.push(obj);
			}
		}else if("undefined" != typeof auditScriptParam.param_name){
			var obj = {};
			obj.param_name = auditScriptParam.param_name;
			obj.param_type = auditScriptParam.param_type;
			obj.param_value = auditScriptParam.param_value;
			script_params.push(obj);			
		}
		pageParam.script_params = script_params;	
		return pageParam;
	}
	
	//按钮事件，绑定
	$('.dataAuditPanel .button[name=pre]').click(function(){
		//到下一步
		$('#stepBar').setStep(0);

		$.extend(true,data,getPageParams());	
		
		Hik.dataAudit.addAuditTaskBase(data);
	});
	
	$('.dataAuditPanel .button[name=save]').click(function(){
		var isOk = true;
		$('#folderEditForm INPUT, SELECT').each(function(){
			if(!$(this).validate()){
				isOk = false;
			}
		});
		if(!isOk){
			return;
		}
		
		$.extend(true,data,getPageParams());
		$.ajax({
			type : data.task_id ? 'PUT' : 'POST',
			url : appPath + '/metadata/DataAuditTask',
			contentType: 'application/json',
			dataType : 'json',
			data: JSON.stringify(data),
			success: function(result){
				if(result.ret == 0){
					jAlert('保存成功', '系统提示', 'ok',function(){	
						window.location.reload();
					});
				}else{
					jAlert('保存异常，异常原因：' + result.msg, '系统提示', 'attention');
				}
			},
			error: function(result){
				jAlert('保存异常，请稍后重试！', '系统提示', 'attention');
			}
		});
	});
	
	$('.dataAuditPanel .button[name=return]').click(function(){
		if(data && data.task_id){
			$('.nav > .menu[task_id="'+data.task_id+'"]').trigger('click');
		}else if ($(".nav > .menu").length == 0) {
			window.location.reload();
		} else {
			$('.navigatorTd > .nav > .menu:first').trigger('click');
		}
	});	
	
	//数据初始化
	if(data){
		This.initData(data);
		if($.isArray(data.script_params)){
			$(data.script_params).each(function(inx,e){
				createQueryParamDiv(e);
			})
		}
	}	
	
}

/**
 * 显示数据源
 */
Hik.dataAudit.showTask = function(task_id){
  	$('.container').empty().load(appPath + "/web/dataAudit/detail.jsp?taskId=" + task_id);
	
  	//界面优化
  	$('.dataSourcePanel').height($('.containerTd').height() - 50);
	
  	
}
Hik.dataAudit.getRunningStatus = function(tasks){
	var This = this;
	if($.isArray(tasks)){
		for(var i=0;i<tasks.length;i++){
			var task = tasks[i]
			//查询任务
			$.ajax({
				type : 'GET',
				async: false,
				url : appPath + '/metadata/DataAuditTask/' + task.task_id + '/runnigStatus',
				dataType : 'json',
				contentType: 'application/json',
				success: function(data){
					if('PAUSED' == data.result){
						$('.menu[task_id="'+task.task_id+'"] .statebtn').addClass('paused');
					}else if('NONE' == data.result){ //一次性任务执行完成后，查不到状态
						$('.menu[task_id="'+task.task_id+'"] .statebtn').hide();
					}else{
						$('.menu[task_id="'+task.task_id+'"] .statebtn').removeClass('paused');
					}
				},
				error: function(result){
					jAlert(data.msg);
				}
			});				
		}
	}

}

/**
 * 页面元素加载完成后将执行此方法
 */
Hik.dataAudit.initialize = function(){
	var This = this;
	
	//查询任务
	$.ajax({
		type : 'GET',
		url : appPath + '/metadata/AllDataAuditTask',
		dataType : 'json',
		contentType: 'application/json',
		success: function(result){
			var data = result;
			if(data.length > 0){
				$('.navigatorTd > .nav').empty();
			}
			for (var i = 0; i < data.length; i++) {
				var html = [
			        '<div class="menu" task_id="'+ data[i].task_id +'" >',
						'<div class="title">' + data[i].task_name + '</div>',
						'<div class="statebtn"></div>',
						'<div class="delbtn" title="删除"></div>',
					'</div>' 
				];
				$('.navigatorTd > .nav').append(html.join(''));
			}

			//增加按钮监听
			This.addListener();
			
			if (data.length > 0) {
				$('.navigatorTd > .nav > .menu:first').trigger('click');
			}else{
				$('.containerTd > .container > .tips').show();
			}
			
			This.getRunningStatus(data);
		},
		error: function(result){
			jAlert(result.success);
		}
	});
	
	//自适应
	This.layout();
}




$(document).ready(function(){
	setTimeout(function() {
		Hik.dataAudit.initialize();
	},100);
});