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
				url : appPath + '/jobService/run.do?name=' + encodeURI(taskName),
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
				url : appPath + '/jobService/stop.do?executionId=' + encodeURI(executionId),
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
			{field:'name', text:'任务', sortable: false},
			{field:'comment', text:'注释', sortable: false},
			{field:'result', text:'结果', sortable: false},
			{field:'reason', text:'原因', sortable: false},
			{field: 'fileName', text: '文件名', sortable: false},
			{field: 'number', text: '数量', sortable: false},
			{field: 'logDate', text: '日志日期', sortable: false}
	   ]
    });
    
	// 定时，查询日志
	loadLogInterval = setInterval(function(){
		$.ajax({
			type : 'GET',
			url : appPath + '/jobService/result.do?executionId=' + encodeURI(executionId),
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
			    if(null != data.jobMeasure && data.jobMeasure.length > 0){
			    	var arr = data.jobMeasure[0].children;
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