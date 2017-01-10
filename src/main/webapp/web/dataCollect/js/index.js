// 当前选择的类型是 转换 还是 任务
Hik.dataCollect.pages.currentView = null;
// 当前转换或者任务的名称
Hik.dataCollect.pages.taskName = null;
// 执行相关的参数，任务ID，定时任务
Hik.dataCollect.pages.param = {
		executionId : null,
		loadLogInterval : null
	}

Hik.dataCollect.pages.loadPage = {
	transform : appPath + "/web/dataCollect/modules/transform/index.jsp",
	job : appPath + "/web/dataCollect/modules/task/index.jsp"
}

Hik.dataCollect.layout = function() {
	var This = this;
	// 获取页面容器的高度
	var height = $(window).height();
	
	// 获得父容器
	var $parent = $('.dataCollectContainer');
	$parent.height(height);
	
	// 左侧菜单栏
	$('.navigatorTd').height(height);
	$('.navigatorTd .nav').height(height - 80);
	$('.navigatorTd .nav').css('overflow-y', 'auto');
	$('.navigatorTd .nav').css('overflow-x', 'hidden');
	
	// 日志
	$('.myflow_log').width($('.container').width());
	$('.myflow_log .tab-content .log').height($('.myflow_log').height() - 38);
	$('.myflow_log .tab-content .datagrid').height($('.myflow_log').height() - 38);
	
	// 属性框
	$('#myflow_props').height(height - 45);
	
	// 画板
	$('.containerTd').width($parent.width() - 240);
	$('.containerTd').height(height);
	$('.graphDiv').width($parent.width() - 280);
	$('.graphDiv').height(height - 80);
	// 重画、画板
	Hik.dataCollect.pages.graph.drag(Hik.dataCollect.pages.graph.data);
	
}

Hik.dataCollect.addListener = function() {
	var This = this;
	
	// 自适应事件
	$('.dataCollectContainer').unbind('resize').bind('resize', function() {
		Hik.dataCollect.layout();
	});
	
	//绑定，新建转换按钮
	$('.transform.btn').bind('click',function(){
		//alert('新建转换');
		var nextNum = $('.navigatorTd > .nav > .transform.option > .menu').length + 1;
		var html = [
	        '<div class="menu" value="" type="transform">',
				'<div class="title">新建转换' + nextNum + '</div>',
				'<div class="delbtn" title="删除"></div>',
			'</div>' ];
		$('.navigatorTd > .nav > .transform.option').prepend(html.join(''));
		
		$('.navigatorTd .nav .transform.option .tip').remove();
		This.bindMenu();
		$('.navigatorTd > .nav > .transform.option > .menu:first').trigger('click');
	});
	
	//绑定，新建任务按钮
	$('.task.btn').bind('click',function(){
		//alert('新建任务');
		var nextNum = $('.navigatorTd > .nav > .task.option > .menu').length + 1;
		var html = [
	        '<div class="menu" value="" type="task">',
				'<div class="title">新建任务' + nextNum + '</div>',
				'<div class="delbtn" title="删除"></div>',
			'</div>' ];
		$('.navigatorTd > .nav > .task.option').prepend(html.join(''));
		
		$('.navigatorTd .nav .task.option .tip').remove();
		This.bindMenu();
		$('.navigatorTd > .nav > .task.option > .menu:first').trigger('click');
	});
	
	//绑定收缩展开按钮
	$('.transform.message').bind('click',function(){
		var This = this;
		var $opeionDiv = $('.transform.option');
		if($opeionDiv.is(":hidden")){
			$(this).removeClass('hide');
			$opeionDiv.show();
		}else{
			$(this).addClass('hide');
			$opeionDiv.hide();
		}
	});
	$('.task.message').bind('click',function(){
		var This = this;
		var $opeionDiv = $('.task.option');
		if($opeionDiv.is(":hidden")){
			$(this).removeClass('hide');
			$opeionDiv.show();
		}else{
			$(this).addClass('hide');
			$opeionDiv.hide();
		}
	});
	
	//日志 标签
	$('#demo1').tabs({
		panelid:'demo1-cn' 
	});
	//日志窗口，关闭按钮
	$('.myflow_log .closebtn').bind('click',function(){
		// 关闭就停掉，定时更新
		clearInterval(Hik.dataCollect.pages.param.loadLogInterval);
		$('.myflow_log').hide();
	});
	
	//设计
	$(".titleTd .btn .design").bind('click',function(){
		if('transform' == Hik.dataCollect.pages.currentView){
			//转换
			window.location.href(Hik.dataCollect.pages.loadPage.transform + "?taskName=" + Hik.dataCollect.pages.taskName);
		}
		else if('task' == Hik.dataCollect.pages.currentView){
			//任务
			window.location.href(Hik.dataCollect.pages.loadPage.job + "?taskName=" + Hik.dataCollect.pages.taskName);
		}else{
			jAlert('未知类型，无法进行设计！', '系统提示', 'ok');   
		}
	});
	
	
	//执行
	$(".titleTd .btn .run").bind('click',function(){
		// 清空历史的记录
		$('.myflow_log .log').empty();
		$('.myflow_log .datagrid').empty();
		// 切换标签
		$('#demo1').trigger('change.tabs','t-1');
		
		var url;
		if('transform' == Hik.dataCollect.pages.currentView){
			url = appPath + '/transService/run.do?tranName=' + encodeURI(Hik.dataCollect.pages.taskName);
		}else if('task' == Hik.dataCollect.pages.currentView){
			url = appPath + '/jobService/run.do?name=' + encodeURI(Hik.dataCollect.pages.taskName);
		}
		
		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'json',
			success : function(data){
				Hik.dataCollect.pages.param.executionId = data.message;
				//定时查询最新日志
				if('transform' == Hik.dataCollect.pages.currentView){
					This.loadTranLogData(data.message);
				}else if('task' == Hik.dataCollect.pages.currentView){
					This.loadJobLogData(data.message);
				}
				
				$('.myflow_log').show();
				//停止执行按钮,启用停止 按钮
				$(".titleTd .btn .run").hide();
				$(".titleTd .btn .stop").show();
				//关闭属性窗口
				$('#myflow_props').empty().hide();
			},
			error : function(data){
				$.sticky('执行失败', 'error', {position: 'center-center'});
			} 
		});
	});
	
	//停止
	$(".titleTd .btn .stop").bind('click',function(){
		clearInterval(Hik.dataCollect.pages.param.loadLogInterval);
		$.ajax({
			type : 'GET',
			url : appPath + '/transService/stop.do?executionId=' + encodeURI(Hik.dataCollect.pages.param.executionId),
			dataType : 'json',
			success : function(result){
				$.sticky('停止成功', 'ok', {position: 'center-center'});
				//执行按钮 置为不可用
				//停止执行按钮,启用停止 按钮
				$(".titleTd .btn .run").show();
				$(".titleTd .btn .stop").hide();
				Hik.dataCollect.pages.param.executionId = null;
			},
			error : function(data){
				$.sticky('停止失败', 'error', {position: 'center-center'});
			} 
		});
	});
	
	// 查看日志
	$(".titleTd .btn .queryJob").bind('click',function(){
		$('#demo1').trigger('change.tabs','t-1');
		if('transform' == Hik.dataCollect.pages.currentView){
			This.loadTranLogData(Hik.dataCollect.pages.taskName);
		}else if('task' == Hik.dataCollect.pages.currentView){
			This.loadJobLogData(Hik.dataCollect.pages.taskName);
		}
		$('.myflow_log').show();
	});
	
	This.bindMenu();
}

Hik.dataCollect.bindMenu = function(){
	//绑定导航菜单事件
	$('.navigatorTd > .nav > .option > .menu').unbind('click').bind('click', function(){
		var $this = $(this);
		$('.navigatorTd > .nav > .transform.option > .menu').removeClass('active');
		$('.navigatorTd > .nav > .task.option > .menu').removeClass('active');
		$this.addClass('active').siblings(".nav > .option > .menu").removeClass('active');
		Hik.dataCollect.pages.currentView = $this.attr('type');
		Hik.dataCollect.pages.taskName = $this.attr('value');
		
		//显示名称
		if('' == $this.attr('value')){
			$('.titleTd .desc').html($this.find('.title').text());
		}else{
			$('.titleTd .desc').html($this.attr('value'));
		}
		
		//加载图片界面
		$(".titleTd .btn .design").show();
		Hik.dataCollect.pages.graph.init($this.attr('value'));
		// 切换的时候，关闭日志窗口
		$('.myflow_log .closebtn').trigger('click');
		
	});
	//删除按钮
	$('.navigatorTd > .nav > .option > .menu > .delbtn').unbind('click').bind('click', function(){
		var $this = $(this);
		jConfirm('确认删除？', '系统提示', function (r) {   
	        if(r){
	        	var name = $this.parent().attr('value');
	        	if('' != name){
	        		// 不是页面新增未保存的转换的，需要向后台请求，删除
	        		var url ;
		        	if('transform' == Hik.dataCollect.pages.currentView){
		        		url = appPath + '/transService/drop.do?type=transformation&name=' + encodeURI(name);
		        	}else if('task' == Hik.dataCollect.pages.currentView){
		        		url = appPath + '/jobService/drop.do?type=transformation&name=' + encodeURI(name);
		        	}
	        		$.ajax({
	        			type : 'GET',
	        			async : 'false',
	        			url : url,
	        			dataType : 'json',
	        			success: function(result){
	        				if(result.success){
	        					jAlert('删除成功', '系统提示', 'ok');
	        					//移除当前的菜单，点击第一个
	        		        	$this.parent().remove();
	        				}else{
	        					jAlert('删除异常，异常原因：' + result.message, '系统提示', 'attention');
	        				}
	        			},
	        			error: function(result){
	        				jAlert('删除异常，请稍后重试！', '系统提示', 'attention');
	        			}
	        		});
	        	}else{
	        		//移除当前的菜单
		        	$this.parent().remove();
	        	}
	        	
	        	setTimeout(function(){
	        		// 删除的是最后一个，刷新界面
	        		if($('.navigatorTd > .nav > .transform.option > .menu').length == 0) {
	        			var html = ['<div class="tip">暂无转换，请点击新建按钮</div>'];
						$('.navigatorTd > .nav > .transform.option').empty().append(html.join(''));
						Hik.dataCollect.pages.graph.init(null);
						$(".titleTd .btn .run").hide();
						$(".titleTd .btn .design").hide();
	        		}
	        		if($('.navigatorTd > .nav > .task.option > .menu').length == 0) {
	        			var html = ['<div class="tip">暂无任务，请点击新建按钮</div>'];
	    				$('.navigatorTd > .nav > .task.option').empty().append(html.join(''));
	    				Hik.dataCollect.pages.graph.init(null);
	    				$(".titleTd .btn .run").hide();
	    				$(".titleTd .btn .design").hide();
					}else{
						// 删除后默认显示第一个
						$('.navigatorTd > .nav > .option > .menu:first').trigger('click');
					}
	        	}, 500);
	        }   
	    }); 
	});
}


Hik.dataCollect.loadTranLogData = function(executionId){
	var This = this;
	
	//步骤跟踪
    var grid = new pk.Ajaxgrid({
        el: $('#DataGrid'),
        autoHeight: false,
        pagination: false,
        height: $('.myflow_log').height() - 38,
        fields: [
			{field:'t1', text:'步骤名称', sortable: false},
			{field:'t2', text:'复制的记录行数', sortable: false},
			{field:'t3', text:'读', sortable: false},
			{field:'t4', text:'写', sortable: false},
			{field: 't5', text: '输入', sortable: false},
			{field: 't6', text: '输出', sortable: false},
			{field: 't7', text: '更新', sortable: false},
			{field: 't8', text: '拒绝', sortable: false},
			{field: 't9', text: '错误', sortable: false},
			{field: 't10', text: '激活', sortable: false},
			{field: 't11', text: '时间', sortable: false},
			{field: 't12', text: '速度（条记录/秒）', sortable: false},
			{field: 't13', text: 'Pri/in/out', sortable: false}
        ]
    });
    
	Hik.dataCollect.pages.param.loadLogInterval = setInterval(function(){
		//查询日志
		$.ajax({
			type : 'GET',
			url : appPath + '/transService/result.do?executionId=' + encodeURI(executionId),
			dataType : 'json',
			success : function(data){
				// 打印日志
				$('.log').empty();
				if(null != data.log){
					var log = data.log.replaceAll('\r\n','<br>').replaceAll('\n','<br>');
					//log = log.replaceAll('错误被检测到!','<font color="red">错误被检测到!</font>');
					$('.log').append(log);
				}else{
					$('.log').html('<div style="">暂无记录！</div>');
				}
				
			    //将数组数据，组装成表格所需的数据格式
			    if(null != data.stepMeasure){
		    	    var arr = [];
		    	    debugger
		    		for(var i in data.stepMeasure){
		    			if(!$.isFunction(data.stepMeasure[i])){
			    			var map = {};
			    			for(var j in data.stepMeasure[i]){
			    				if(!$.isFunction(data.stepMeasure[i][j])){
			    					map['t' + (parseInt(j)+1)] = data.stepMeasure[i][j];
			    				}
			    			}
			    	        arr.push(map);
		    			}
		    	    }
			    	grid.loadData(arr);
			    }
			    
			    //任务已结束，停止定时查询
			    if(data.finished){
			    	clearInterval(Hik.dataCollect.pages.param.loadLogInterval);
			    	//停止按钮 禁用,重启 执行 按钮
			    	$(".titleTd .btn .stop").hide()
			    	$('.titleTd .btn .run').show();
			    	jAlert('执行完成！', '系统提示', 'ok');
			    }
			},
			error : function(data){
				$.sticky('打印日志失败', 'error', {position: 'center-center'});
			}
		});
	}, 1000);
}


Hik.dataCollect.loadJobLogData = function(executionId){
	var This = this;
	
	//步骤跟踪
    var grid = new pk.Ajaxgrid({
        el: $('#DataGrid'),
        autoHeight: false,
        pagination: false,
        height: $('.myflow_log').height() - 38,
        fields: [
	        {field:'name', text:'任务', sortable: false},
	        {field:'comment', text:'注释', sortable: false},
	        {field:'result', text:'结果', sortable: false},
	        {field:'reason', text:'原因', sortable: false},
	        {field: 'fileName', text: '文件名', sortable: false},
	        {field: 'number', text: '数量', sortable: false},
	        {field: 'logDate', text: '日志日期', sortable: false}
	   ]
    });
    
	//查询日志
	Hik.dataCollect.pages.param.loadLogInterval = setInterval(function(){
		$.ajax({
			type : 'GET',
			url : appPath + '/jobService/result.do?executionId=' + encodeURI(executionId),
			dataType : 'json',
			success : function(data){
				// 打印日志
				$('.myflow_log .log').empty();
				if(null != data.log){
					var log = decodeURIComponent(data.log);
					log = log.replaceAll('\r\n','<br>').replaceAll('\n','<br>');
					$('.myflow_log .log').append(log);
				}else{
					$('.myflow_log .log').html('<div style="">暂无记录！</div>');
				}
			    
			    //将数组数据，组装成表格所需的数据格式
			    if(null != data.jobMeasure && data.jobMeasure.length > 0){
			    	var arr = data.jobMeasure[0].children;
			    	grid.loadData(arr);
			    }
			    
			    //任务已结束，停止定时查询
			    if(data.finished){
			    	clearInterval(Hik.dataCollect.pages.param.loadLogInterval);
			    	//停止按钮 禁用,重启 执行 按钮
			    	$(".titleTd .btn .stop").hide()
			    	$('.titleTd .btn .run').show();
			    	jAlert('执行完成！', '系统提示', 'ok');
			    }
			},
			error : function(data){
				$.sticky('打印日志失败', 'error', {position: 'center-center'});
			}
		});
	}, 1000);
}

/**
 * 页面元素加载完成后将执行此方法
 */
Hik.dataCollect.initialize = function(){
	var This = this;
	
	//查询任务和转换
	$.ajax({
		type : 'GET',
		async : 'false',
		url : appPath + '/repositoryService/explorer.do',
		dataType : 'json',
		success: function(result){
			// 转换
			for ( var i = 0; i < result.transformation.length; i++) {
				var html = [
			        '<div class="menu" value="' + result.transformation[i] + '" type="transform">',
						'<div class="title">' + result.transformation[i] + '</div>',
						'<div class="delbtn" title="删除"></div>',
					'</div>' 
				];
				$('.navigatorTd > .nav > .transform.option').append(html.join(''));
			}
			if(result.transformation.length == 0){
				var html = ['<div class="tip">暂无转换，请点击新建按钮</div>'];
				$('.navigatorTd > .nav > .transform.option').append(html.join(''));
			}
			
			// 任务
			for ( var i = 0; i < result.job.length; i++) {
				var html = [
					'<div class="menu" value="' + result.job[i] + '" type="task">',
						'<div class="title">' + result.job[i] + '</div>',
						'<div class="delbtn" title="删除"></div>',
					'</div>' 
				];
				$('.navigatorTd > .nav > .task.option').append(html.join(''));
			}
			if(result.job.length == 0){
				var html = ['<div class="tip">暂无任务，请点击新建按钮</div>'];
				$('.navigatorTd > .nav > .task.option').append(html.join(''));
			}
			
			//增加按钮监听
	    	This.addListener();
	    	//第一个菜单触发单击事件
	    	$('.navigatorTd > .nav > .option > .menu:first').trigger('click');
	    	//自适应
	    	This.layout();
		},
		error: function(result){
			jAlert('查询异常，刷新试试！', '系统提示', 'attention');
		}
	});

}

$(document).ready(function(){
	setTimeout(function() {
		Hik.dataCollect.initialize();
	});
});