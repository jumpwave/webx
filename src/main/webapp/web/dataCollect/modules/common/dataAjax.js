var dataAjax = {
	//查询数据源
	queryDataSource : function(callback){
		var data;
		$.ajax({
			type : 'GET',
			async : 'false',
			url : appPath + '/databaseSourceServie/getDatabases.do',
			dataType : 'json',
			success: function(result){
				if ($.isFunction(callback)) {
					callback(result);
				}
			},
			error: function(){
				jAlert('查询数据源异常，请重试！', '系统提示', 'attention');
			}
		});	
//		return data;
	},
	
	//查询数据源下面的表
	queryDataTable : function(dsName, callback){
		$.ajax({
			type : 'GET',
			async : 'false',
			url : appPath + '/transService/dbexplorer.do?dsName=' +  encodeURI(dsName),
			dataType : 'json',
			success: function(result){
				if ($.isFunction(callback)) {
					callback(result);
				}
			},
			error: function(){
				jAlert('查询数据库表异常，请重试！', '系统提示', 'attention');
			}
		});
	},
	
	//查询表的具体字段
	queryTableFields : function(dsName, tableName, callback){
		$.ajax({
			type : 'GET',
			async : 'false',
			url : appPath + '/transService/tableFields.do?dsName=' + encodeURI(dsName) + '&tableName=' + encodeURI(tableName),
			dataType : 'json',
			success: function(result){
				if ($.isFunction(callback)) {
					callback(result);
				}
			},
			error: function(){
				jAlert('查询数据库表字段异常，请重试！', '系统提示', 'attention');
			}
		});
	},
	
	//查询转换任务
	queryTransformations : function(callback){
		$.ajax({
			type : 'GET',
			async : 'false',
			url : appPath + '/transService/explorer.do?type=transformation',
			dataType : 'json',
			success: function(result){
				if ($.isFunction(callback)) {
					callback(result);
				}
			},
			error: function(){
				jAlert('查询转换任务异常，请重试！', '系统提示', 'attention');
			}
		});
	}
};