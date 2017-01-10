Hik.dataSource.layout = function() {
	var This = this;
	// 获得父容器
	var $parent = $('.dataSourceContainer');
	
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

Hik.dataSource.addListener = function() {
	var This = this;
	
	// 自适应事件
	$('.container').unbind('resize').bind('resize', function() {
		This.layout();
	});
	
	//绑定，新建按钮
	$('.navigatorToolBar .addBtn').bind('click',function(){
		Hik.dataSource.addSource();
	});
	
	//绑定导航菜单事件
	$('.navigatorTd > .nav > .menu').unbind('click').bind('click', function(){
		var $this = $(this);
		$('.navigatorTd > .nav > .menu').removeClass('active');
		$this.addClass('active').siblings(".nav > .menu").removeClass('active');
		var data = new Base64().decode($this.attr('value'))
		Hik.dataSource.showDataSource(JSON.parse(data));
	});
	
	//删除按钮
	$('.navigatorTd > .nav > .menu > .delbtn').unbind('click').bind('click', function(){
		var $this = $(this);
		//alert("删除：" + $this.parent().attr('value'));
		jConfirm('确认删除？', '系统提示', function (r) {   
	        if(r){
	        	var value = $this.parent().attr('value');
	        	var data = JSON.parse(new Base64().decode(value));
	        	if('' != data){
	        		$.ajax({
	        			type : 'GET',
	        			url : appPath + '/databaseSourceServie/delDatabase.do?name=' + encodeURI(data.name),
	        			dataType : 'json',
	        			success: function(result){
	        				if(result.success){
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
}

/**
 * 新增数据源
 */
Hik.dataSource.addSource = function(data){
	var title = '新建数据源';
	if(data){
		title  = data['name'];
	}
	var html = [ 
	    '<form id="folderEditForm">',
	    '<div class="dataSourcePanel">',
	    	'<div class="dataSourceTitle">',
	    		'<div class="title">' + title + '</div>',
	    	'</div>',
			'<div class="baseinfoEdit">',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>数据源名称：</div>',
					'<div class="controls">',
						'<input class="auto-input" maxlength="50" value="" required="true" vtype="common" type="text" name="name" /> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>数据库类型：</div>',
					'<div class="controls">',
						'<select name="type">',
							'<option value="POSTGRESQL">POSTGRESQL</option>',
							'<option value="ORACLE">ORACLE</option>',
						'</select>',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>IP地址：</div>',
					'<div class="controls">',
						'<input class="auto-input" value="" required="true" vtype="ip" type="text" name="hostname" /> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>端口号：</div>',
					'<div class="controls">',
						'<input class="auto-input" value="" required="true" vtype="number" allowDecimals="false" type="text" name="port" /> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>数据库名称：</div>',
					'<div class="controls">',
						'<input class="auto-input" maxlength="50" value="" required="true" vtype="common" type="text" name="databaseName" /> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>用户名：</div>',
					'<div class="controls">',
						'<input class="auto-input" maxlength="50" value="" required="true" vtype="common" type="text" name="username" /> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label"><em>*</em>密码：</div>',
					'<div class="controls">',
						'<input class="auto-input" maxlength="50" value="" required="true" vtype="common" type="text" name="password" /> ',
					'</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">',
						'<a href="javascript:void(0)" class="button button-success" name="test">测试</a>&nbsp;',
					'</div>',
					'<div class="controls">',
						'<a href="javascript:void(0)" class="button" name="save">保存</a>&nbsp;',
						'<a href="javascript:void(0)" class="button button-cancel" name="return">取消</a>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		'</form>'
  	];
  	$('.container').empty().append(html.join(''));
  	
  	//界面优化
  	$('.dataSourcePanel').height($('.containerTd').height() - 50);
	$('.baseinfoEdit SELECT').droplist();
	
	//是否是编辑
	if(data){
		$('.baseinfoEdit .controls input:not([library])').each(function() {
			var $this = $(this);
			var name = $this.attr('name');
			var value = Tool.empty2def(data[name]);
			$this.val(Tool.empty2def(value));
		});
	}
	
	//按钮事件，绑定
	$('.baseinfoEdit .button[name=test]').click(function(){
		var isOk = true;
		$('#folderEditForm INPUT, SELECT').each(function(){
			if(!$(this).validate()){
				isOk = false;
			}
		});
		if(!isOk){
			return;
		}
		
		var databaseInfo = JSON.stringify($('#folderEditForm').serializeJSON());
		$.ajax({
			type : 'GET',
			url : appPath + '/databaseSourceServie/test.do?databaseInfo=' + databaseInfo,
			dataType : 'json',
			success: function(result){
				if(result.success){
					jAlert('连接成功', '系统提示', 'ok');
				}else{
					jAlert('测试异常，异常原因：' + result.message, '系统提示', 'attention');
				}
			},
			error: function(result){
				jAlert('测试异常，请稍后重试！', '系统提示', 'attention');
			}
		});
	});
	
	$('.baseinfoEdit .button[name=save]').click(function(){
		var isOk = true;
		$('#folderEditForm INPUT, SELECT').each(function(){
			if(!$(this).validate()){
				isOk = false;
			}
		});
		if(!isOk){
			return;
		}
		
		var databaseInfo = JSON.stringify($('#folderEditForm').serializeJSON());
		$.ajax({
			type : 'GET',
			url : appPath + '/databaseSourceServie/saveOrUpdateDatabase.do?databaseInfo=' + databaseInfo,
			dataType : 'json',
			success: function(result){
				if(result.success){
					jAlert('保存成功', '系统提示', 'ok');
					window.location.reload();
				}else{
					jAlert('保存异常，异常原因：' + result.message, '系统提示', 'attention');
				}
			},
			error: function(result){
				jAlert('保存异常，请稍后重试！', '系统提示', 'attention');
			}
		});
	});
	
	$('.baseinfoEdit .button[name=return]').click(function(){
		if ($(".nav > .menu").length == 0) {
			window.location.reload();
		} else {
			$('.navigatorTd > .nav > .menu:first').trigger('click');
		}
	});
}

/**
 * 显示数据源
 */
Hik.dataSource.showDataSource = function(data){
	debugger
	var html = [ 
	    '<div class="dataSourcePanel">',
	    	'<div class="dataSourceTitle">',
	    		'<div class="title">'+ data.name + '</div>',
	    		'<div class="editBtn" title="编辑">编辑</div>',
	    	'</div>',
			'<div class="baseinfoEdit">',
				'<div class="control-group">',
					'<div class="control-label">数据源名称：</div>',
					'<div class="controls">' + data.name + '</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">数据库类型：</div>',
					'<div class="controls">' + data.type + '</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">IP地址：</div>',
					'<div class="controls">' + data.hostname + '</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">端口号：</div>',
					'<div class="controls">' + data.port + '</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">数据库名称：</div>',
					'<div class="controls">' + data.databaseName + '</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">用户名：</div>',
					'<div class="controls">' + data.username + '</div>',
				'</div>',
				'<div class="control-group">',
					'<div class="control-label">密码：</div>',
					'<div class="controls">' + data.password + '</div>',
				'</div>',
			'</div>',
		'</div>'
  	];
  	$('.container').empty().append(html.join(''));
	
  	//界面优化
  	$('.dataSourcePanel').height($('.containerTd').height() - 50);
	
  	//按钮
  	$('.dataSourcePanel .editBtn').click(function(){
  		Hik.dataSource.addSource(data);
	});
  	
}


/**
 * 页面元素加载完成后将执行此方法
 */
Hik.dataSource.initialize = function(){
	var This = this;
	
	//查询任务和转换
	$.ajax({
		type : 'GET',
		url : appPath + '/databaseSourceServie/getDatabases.do',
		dataType : 'text',
		success: function(result){
			var data = JSON.parse(result);
			if(data.length > 0){
				$('.navigatorTd > .nav').empty();
			}
			for (var i = 0; i < data.length; i++) {
				var html = [
			        '<div class="menu" value="' + new Base64().encode(JSON.stringify(data[i])) + '">',
						'<div class="title">' + data[i].name + '</div>',
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
		},
		error: function(result){
			alert(result.success);
		}
	});
	
	//自适应
	This.layout();
}

$(document).ready(function(){
	setTimeout(function() {
		Hik.dataSource.initialize();
	});
});