// 任务ID
var executionId;
// 定时任务
var loadLogInterval;

var logging = {
	// 初始化，对按钮事件进行绑定
	init : function(taskName){
		// 显示执行按钮
		$('.titleTd .btn .run').show();
		
		// 日志 标签
		$('#demo1').tabs({
			panelid:'demo1-cn' 
		});
		// 日志窗口，关闭按钮
		$('.myflow_log .closebtn').bind('click',function(){
			// 关闭就停掉，定时更新
			clearInterval(loadLogInterval);
			$('.myflow_log').hide();
		});
		
		// 执行
		$(".titleTd .btn .run").bind('click',function(){
			// 清空历史的记录
			$('.myflow_log .log').empty();
			$('.myflow_log .datagrid').empty();
			// 切换标签
			$('#demo1').trigger('change.tabs','t-1');
			
			$.ajax({
				type : 'GET',
				url : appPath + '/transService/run.do?tranName=' + encodeURI(taskName),
				dataType : 'json',
				success : function(data){
					executionId = data.message;
					// 定时查询最新日志
					loadLogData(executionId);
					$('.myflow_log').show();
					// 停止执行按钮,启用停止 按钮
					$(".titleTd .btn .run").hide();
					$(".titleTd .btn .stop").show();
				},
				error : function(data){
					$.sticky('执行失败', 'error', {position: 'center-center'});
				} 
			});
		});
		
		//停止
		$(".titleTd .btn .stop").bind('click',function(){
			$.ajax({
				type : 'GET',
				url : appPath + '/transService/stop.do?executionId=' + encodeURI(executionId),
				dataType : 'json',
				success : function(result){
					$.sticky('停止成功', 'ok', {position: 'center-center'});
					// 取消定时查询任务
					clearInterval(loadLogInterval);
					//停止执行按钮,启用停止 按钮
					$(".titleTd .btn .run").show();
					$(".titleTd .btn .stop").hide();
					executionId = null;
				},
				error : function(data){
					$.sticky('停止失败', 'error', {position: 'center-center'});
				} 
			});
		});
	}
};
		
// 查询执行情况，并打印
var loadLogData = function(executionId){
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
    
	// 定时，查询日志
	loadLogInterval = setInterval(function(){
		$.ajax({
			type : 'GET',
			url : appPath + '/transService/result.do?executionId=' + encodeURI(executionId),
			dataType : 'json',
			success : function(data){
				// 打印日志
				$('.myflow_log .log').empty();
				if(null != data.log){
					var log = data.log.replaceAll('\r\n','<br>').replaceAll('\n','<br>');
					$('.myflow_log .log').append(log);
				}else{
					$('.myflow_log .log').html('<div style="">暂无记录！</div>');
				}
				
			    //将数组数据，组装成表格所需的数据格式
			    if(null != data.stepMeasure){
		    	    var arr = [];
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
			    	clearInterval(loadLogInterval);
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