var myflow = null;
// 缓存当前图的数据，用于自适应时，重新画图
Hik.dataCollect.transform.data = null;

Hik.dataCollect.transform.loadPage = {
	index : appPath + "/web/dataCollect/index.jsp"
}

Hik.dataCollect.transform.layout = function() {
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
	Hik.dataCollect.transform.graphDrag(Hik.dataCollect.transform.data);
}

Hik.dataCollect.transform.addListener = function(){
	
	// 自适应事件
	$('.container').unbind('resize').bind('resize', function() {
		Hik.dataCollect.transform.layout();
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
			url : appPath + '/transService/save.do',
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
		window.location.href(Hik.dataCollect.transform.loadPage.index);
	});
	
	var tempTaskName;
	//编辑名称
	$('.titleTd .editBtn').bind('click',function(){
		var taskName = $('.titleTd .title').html()
		tempTaskName = taskName;
		var html = ['<input type="text" value="' + taskName + '">'];
		$('.titleTd .desc .title').empty().append(html.join(''));
		$(this).hide();
		$('.titleTd .saveBtn').show();
		$('.titleTd .cancelBtn').show();
	});
	//确认名称
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
Hik.dataCollect.transform.loadTableInfo = function(props, callback) {
	var This = this;
	
	var html = [
	    '<div class="control-group" style="float: left;">',
		    '<div class="control-label"><em>*</em>步骤名称：</div>',
		    '<div class="controls">',
		        '<input class="auto-input" name="label" maxlength="30" required="true" vtype="common" type="text"  isOverflown="true" promptPosition="bottomRight"/>',
		    '</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"><em>*</em>数据源：</div>',
		    '<div class="controls">',
		    	'<select required="true" name="connection">',
		    		'<option value="">--请选择--</option>',
		    	'</select>',
		    '</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		    '<div class="control-label"><em>*</em>数据库表：</div>',
		    '<div class="controls">',
		    	'<select required="true" name="tableName">',
		    		'<option value="">--请选择--</option>',
		    	'</select>',
		    '</div>',
		'</div>',
		'<div class="halving">表字段</div>',
		'<div class="datagrid tableDialogGrid"></div>',
		'<div class="tableDataDialog">',
			'<div class="datagrid tableDataDialogGrid"></div>',
		'</div>'
	];
	
	 $('.tableDialog').html(html.join(''));
	 
	//美化字段表格
	var grid = new pk.Ajaxgrid({
		el: $('.tableDialogGrid'),
		autoHeight: false,
        pagination: false,
        idField: 'name',
        fields: [{
            field: '_check'
        },{
        	field: '_serial'  
        },{
            field: 'name',
            weight: 60,
            text: '字段'
        },{
            field: 'type',
            weight: 60,
            text: '类型'
        },{
            field: 'alias_show',
            weight: 100,
            text: '别名',
            renderer: function(rowData){
            	return '<input class="auto-input" type="text" name="' + rowData.name + '_alias" value=""/>';
            }
        }]
    });
	
	//美化下拉
	$('.tableDialog SELECT[name=connection]').droplist();
	$('.tableDialog SELECT[name=tableName]').droplist();
	
	//查询数据源
	var dsName = null;
	var tableName = null;
	var tableFields = null;
	dataAjax.queryDataSource(function(dataSource){
		if(!Tool.isEmpty(dataSource)){
			for (var i = 0; i < dataSource.length; i++) {
				$('.tableDialog SELECT[name=connection]').append('<option value="' + dataSource[i].name + '">' + dataSource[i].name + '</option>');  
			}
			$('.tableDialog SELECT[name=connection]').droplist();
			
			// 数据源修改时，修改表
			$('.tableDialog SELECT[name=connection]').bind('change', function(){
				// 清空原始数据
				$('.tableDialog SELECT[name=tableName] OPTION').each(function(){
					if(Tool.isEmpty($(this).val())){
						return;
					}
					$(this).remove();
				});
				$('.tableDialog SELECT[name=tableName]').droplist();
				$('.tableDialog SELECT[name=tableName]').val('').trigger('change');
				grid.loadData([]);
				
				dsName = $(this).val();
				if(Tool.isEmpty(dsName)){
					return;
				}
				//加载新的表
				dataAjax.queryDataTable(dsName, function(tableList){
					for (var i = 0; i < tableList.length; i++) {
						$('.tableDialog SELECT[name=tableName]').append('<option value="' + tableList[i] + '">' + tableList[i] + '</option>');  
					}
					$('.tableDialog SELECT[name=tableName]').droplist();
					grid.loadData([]);
						
					//表修改时，修改对应的字段
					$('.tableDialog SELECT[name=tableName]').bind('change', function(){
						// 清空原始数据
						grid.loadData([]);
						
						tableName = $(this).val();
						if(Tool.isEmpty(tableName)){
							return;
						}
						
						dataAjax.queryTableFields(dsName, tableName, function(fieldList){
							tableFields = fieldList;
							var gridData = [];
							for (var i = 0; i < fieldList.length; i++) {
								var d = {
									name : fieldList[i][0],
									type : fieldList[i][1]
								}
								gridData.push(d);
							}
							grid.loadData(gridData);
							
							setTimeout(function(){
								for (var i = 0; i < fieldList.length; i++) {
									$('.tableDialog INPUT[name=' + fieldList[i][0] + '_alias]').val(fieldList[i][0]);
								}
							},500);
								
						});
					});
				 });
			});
		}
	});
	
	//赋值
	$('.tableDialog INPUT[name=label]').val(props['label']);
	setTimeout(function(){
		if(Tool.isNotEmpty(props['connection'])){
			$('.tableDialog SELECT[name=connection]').val(props['connection']);
			$('.tableDialog SELECT[name=connection]').trigger('change');  
		}
	}, 500);
	setTimeout(function(){
		if(Tool.isNotEmpty(props['tableName'])){
			$('.tableDialog SELECT[name=tableName]').val(props['tableName']);
			$('.tableDialog SELECT[name=tableName]').trigger('change');  
		}
	}, 800);
	setTimeout(function(){
		if(Tool.isNotEmpty(props['fields'])){
			// 表格，判断哪些选择了的，需要勾选并展示
			var fields = JSON.parse(props['fields'])
			for (var i = 0; i < fields.length; i++) {
				$('.tableDialog INPUT[name=' + fields[i].src + '_alias]').val(fields[i].target);
				$('.tableDialog TD[title=' + fields[i].src + ']').parent().find('INPUT[type=checkbox]').attr('checked','true');
			}
			// 全选，需要单独勾选全选钩
			if(fields.length == tableFields.length){
				$('.tableDialog .grid-hd').find('INPUT[type=checkbox]').attr('checked','true');
			}
		}
	}, 1000);
	
	//打开弹出框
	var tableDialog = $('.tableDialog').dialog({
    	title : "表输入",
    	autoOpen : true,
    	modal : true,
    	width : 650,
		height : 450,
		draggable: false,
		resizable: false,
		buttons : {
			"look" : {
				text : "数据预览",
				'class' : 'button',
				click : function() {
					if(!Tool.isEmpty(dsName) && !Tool.isEmpty(tableName)){
						var name = $('.tableDialog INPUT[name=label]').val();
						var data = {};
						data.label = $('.tableDialog INPUT[name=label]').val();
				        data.connection = $('.tableDialog SELECT[name=connection]').val();
				        data.tableName = $('.tableDialog SELECT[name=tableName]').val();
//						
//				        // 获取选择了的表格字段的值
						var gridData = grid.getSelected();
						if(gridData.length == 0){
							jAlert('请先勾选需要展示的字段！', '系统提示', 'attention');
							return;
						}
						var fields = [];
						for ( var i = 0; i < gridData.length; i++) {
							var alias = $('.tableDialog INPUT[name=' + gridData[i].name + '_alias]').val();
							if(Tool.isNotEmpty(alias)){
								var field = {};
			        		    field.src =  gridData[i].name;
			        		    field.target = alias;
			        		    fields.push(field);
			        	    }
			            }
			            data.fields = JSON.stringify(fields);
			            if ($.isFunction(callback)) {
			        	    callback(name, data);
			            }
//						debugger
//						$(this).find('.button .ui-button-text[innerHTML=确认]').empty();
			            //需要先将字段存储下来，才能预览数据
			            This.loadTableData(name, props['label']);
					}else{
						jAlert('请先现在对应的数据库表！', '系统提示', 'attention');
					}
				}
			},
		    "ok" : {
		    	text : "确认",
		    	'class' : 'button',
		        click : function() {
		        	// 参数验证
		        	var isOk = true;
		    		$('.tableDialog INPUT, SELECT').each(function(){
		    			if(!$(this).validate()){
		    				isOk = false;
		    			}
		    		});
		    		if(!isOk){
		    			return;
		    		}
		    		
		           var name = $('.tableDialog INPUT[name=label]').val();
		           var data = {};
		           data.label = $('.tableDialog INPUT[name=label]').val();
		           data.connection = $('.tableDialog SELECT[name=connection]').val();
		           data.tableName = $('.tableDialog SELECT[name=tableName]').val();
		           
		           // 获取选择了的表格字段的值
		           var gridData = grid.getSelected();
		           var fields = [];
		           for ( var i = 0; i < gridData.length; i++) {
		        	   var alias = $('.tableDialog INPUT[name=' + gridData[i].name + '_alias]').val();
		        	   if(Tool.isNotEmpty(alias)){
		        		   var field = {};
		        		   field.src =  gridData[i].name;
		        		   field.target = alias
		        		   fields.push(field);
		        	   }
		           }
		           data.fields = JSON.stringify(fields);
		           if ($.isFunction(callback)) {
		        	   callback(name, data);
		           }
		           tableDialog.dialog("close");
		        }
		    },
		    "cancel" : {
		    	text : "取消",
		    	'class' : 'button button-cancel',   
		    	click : function() {
		    		tableDialog.dialog("close");   
		        }
		    }
		}
	});
}

/** 查询 表输入的数据详情 */
Hik.dataCollect.transform.loadTableData = function(name, stepName){
	var graphJson = myflow.data.getGraphJsonData(name);
	$.ajax({
		type : 'POST',
		async : 'false',
		url : appPath + '/transService/previewData.do',
		data : 'graphJson=' + encodeURI(graphJson) +'&stepName=' + encodeURI(stepName) + '&rowLimit=100',
		dataType : 'text',
		success: function(result){
			var data = JSON.parse(result);
			var fields = [];
			if(data.columns.length == 0){
				$('.tableDataDialogGrid').html('没有查询到数据');
				return;
			}
			for(var k in data.columns){
				if($.isFunction(data.columns[k])){
					continue;
				};
				var field = {};
				field.field = data.columns[k].dataIndex;
				field.text = data.columns[k].header;
				fields.push(field);
			}
			//加载表格
			var grid = new pk.Ajaxgrid({
				el: $('.tableDataDialogGrid'),
				autoHeight: false,
			    pagination: true,
			    pageSize: 20, 
			    hasTotal: false,
			    fields: fields
			});
			grid.loadData(data.firstRecords);
			
		},
		error: function(result){
			$.sticky('数据预览失败，请检查配置是否正确', 'error', {position: 'center-center'});
		}
		
	});

	//打开弹出框
	var tableDataDialog = $('.tableDataDialog').dialog({
		title : "数据展示",
		autoOpen : true,
		modal : false,
		width : 650,
		height : 450,
		draggable: false,
		resizable: false,
		buttons : {
		    "cancel" : {
		    	text : "关闭",
		    	'class' : 'button button-cancel',   
		    	click : function() {
		    		tableDataDialog.dialog("close");   
		        }
		    }
		}
	});
}

/* 合并连接  */
Hik.dataCollect.transform.loadJoinInfo = function(src ,props, callback) {
	// 弹框界面
	var html = [
		'<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>步骤名称：</div>',
		'<div class="controls">',
		    '<input class="auto-input" maxlength="30" name="label" required="true" vtype="common" type="text" isOverflown="true" promptPosition="bottomRight"/>',
		'</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>连接类型：</div>',
		'<div class="controls">',
			'<select required="true" name="join_type">',
				 '<option value="">--请选择--</option>',
				 '<option value="INNER">INNER</option>',
				 '<option value="LEFT OUTER">LEFT OUTER</option>',
				 '<option value="RIGHT OUTER">RIGHT OUTER</option>',
				 '<option value="FULL OUTER">FULL OUTER</option>',
			'</select>',
		'</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>步骤一：</div>',
		'<div class="controls">',
			'<select required="true" name="step1">',
				'<option value="">--请选择--</option>',
			'</select>',
		'</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
		'<div class="control-label"><em>*</em>步骤二：</div>',
		'<div class="controls">',
			'<select required="true" name="step2">',
				'<option value="">--请选择--</option>',
			'</select>',
		'</div>',
		'</div>',
		'<div class="datagrid step1Grid"></div>',
		'<div class="datagrid step2Grid"></div>'           
	];
	$('.joinDialog').html(html.join(''));
	
	
	
	//加载表格
	var grid1 = new pk.Ajaxgrid({
		el: $('.step1Grid'),
		autoHeight: false,
	    pagination: false,
	    idField: 'name',
	    fields: [{
            field: '_check'
        },{
	        field: 'name',
	        text: '连接字段'
	    }]
	});
	
	var grid2 = new pk.Ajaxgrid({
		el: $('.step2Grid'),
		autoHeight: false,
	    pagination: false,
	    idField: 'name',
	    fields: [{
            field: '_check'
        },{
	        field: 'name',
	        text: '连接字段'
	    }]
	});
	
	// 下拉优化
	$('.joinDialog SELECT[name=join_type]').droplist();   
	$('.joinDialog SELECT[name=step1]').droplist();
	$('.joinDialog SELECT[name=step2]').droplist();
	
	var states = myflow.data.getMergeJoinData(src.getId());
	if (states.length > 2) {
		jAlert('目前只支持两张表输入', '系统提示', 'attention');
		return;
	}
	for ( var i = 0; i < states.length; i++) {
		var id = states[i].getId();
		var text = states[i].text();
		$('.joinDialog SELECT[name=step1]').append('<option value="' + text + '" id="' + id + '">' + text + '</option>');  
		$('.joinDialog SELECT[name=step2]').append('<option value="' + text + '" id="' + id + '">' + text + '</option>');  
	}
	$('.joinDialog SELECT[name=step1]').droplist();
	$('.joinDialog SELECT[name=step2]').droplist();
	//表修改时，修改对应的字段
	var table1Fields = null;
	var table2Fields = null;
	$('.joinDialog SELECT[name=step1],SELECT[name=step2]').bind('change', function(){
		// 清空原始数据
		if($(this).attr('name') == 'step1'){
			grid1.loadData([]);
		}
		if($(this).attr('name') == 'step2'){
			grid2.loadData([]);
		}
		
		for (var i = 0; i < states.length; i++) {
			if($(this).val() == states[i].text()){
				//没有将属性放入标签，双引号问题转换比较麻烦，个数不多，直接遍历
				var fields = states[i].getProps()['fields'];
				if(Tool.isNotEmpty(fields)){
					var fieldList = JSON.parse(fields);
					var gridData = [];
					for (var i = 0; i < fieldList.length; i++) {
						var field = {
							name : fieldList[i].target
						}
						gridData.push(field);
					}
					if($(this).attr('name') == 'step1'){
						grid1.loadData(gridData);
						table1Fields = gridData;
					}
					if($(this).attr('name') == 'step2'){
						grid2.loadData(gridData);
						table2Fields = gridData;
					}
				}
			}
		}
	});
	
	//赋值
	$('.joinDialog INPUT[name=label]').val(props['label']);
	if(Tool.isNotEmpty(props['join_type'])){
		$('.joinDialog SELECT[name=join_type]').val(props['join_type']);
		$('.joinDialog SELECT[name=join_type]').trigger('change');  
	}
	if(Tool.isNotEmpty(props['step1'])){
		$('.joinDialog SELECT[name=step1]').val(props['step1']);
		$('.joinDialog SELECT[name=step1]').trigger('change');  
	}
	if(Tool.isNotEmpty(props['step2'])){
		$('.joinDialog SELECT[name=step2]').val(props['step2']);
		$('.joinDialog SELECT[name=step2]').trigger('change');
	}
	setTimeout(function(){
		if(Tool.isNotEmpty(props['key1'])){
			//表格，判断哪些选择了的，需要勾选并展示
			var fields = JSON.parse(props['key1'])
			for (var i = 0; i < fields.length; i++) {
				$('.joinDialog .step1Grid TD[title=' + fields[i].key + ']').parent().find('INPUT[type=checkbox]').attr('checked','true');
			}
			// 全选，需要单独勾选全选钩
			if(fields.length == table1Fields.length){
				$('.joinDialog .step1Grid .grid-hd').find('INPUT[type=checkbox]').attr('checked','true');
			}
		}
		if(Tool.isNotEmpty(props['key2'])){
			//表格，判断哪些选择了的，需要勾选并展示
			var fields = JSON.parse(props['key2'])
			for (var i = 0; i < fields.length; i++) {
				$('.joinDialog .step2Grid TD[title=' + fields[i].key + ']').parent().find('INPUT[type=checkbox]').attr('checked','true');
			}
			// 全选，需要单独勾选全选钩
			if(fields.length == table2Fields.length){
				$('.joinDialog .step2Grid .grid-hd').find('INPUT[type=checkbox]').attr('checked','true');
			}
		}
	},1000);
	
	//打开弹出框
	var joinDialog = $('.joinDialog').dialog({
    	title : "合并连接",
    	autoOpen : true,
    	modal : true,
    	width : 650,
		height : 480,
		draggable: false,
		resizable: false,
		buttons : {
		    "ok" : {
		    	text : "确认",
		    	'class' : 'button',
		        click : function() {
		        	// 参数验证
		        	var isOk = true;
		    		$('.joinDialog INPUT, SELECT').each(function(){
		    			if(!$(this).validate()){
		    				isOk = false;
		    			}
		    		});
		    		if(!isOk){
		    			return;
		    		}
		        	
		           var name = $('.joinDialog INPUT[name=label]').val();
		           var data = {};
		           data.label = $('.joinDialog INPUT[name=label]').val();
		           data.join_type = $('.joinDialog SELECT[name=join_type]').val();
		           data.step1 = $('.joinDialog SELECT[name=step1]').val();
		           data.step2 = $('.joinDialog SELECT[name=step2]').val();
		           
		           var grid1Data = grid1.getSelected();
		           var field1 = [];
		           for (var i = 0; i < grid1Data.length; i++) {
	        		   var field = {};
	        		   field.key = grid1Data[i].name;
	        		   field1.push(field);
		           }
		           data.key1 = JSON.stringify(field1);
		           
		           var grid2Data = grid2.getSelected();
		           var field2 =[];
		           for ( var i = 0; i < grid2Data.length; i++) {
	        		   var field = {};
	        		   field.key = grid2Data[i].name;
	        		   field2.push(field);
		           }
		           data.key2 = JSON.stringify(field2);
		           if ($.isFunction(callback)) {
		        	   callback(name, data);
		           }
		           joinDialog.dialog("close");
		        }
		    },
		    "cancel" : {
		    	text : "取消",
		    	'class' : 'button button-cancel',   
		    	click : function() {
		    		joinDialog.dialog("close");   
		        }
		    }
		}
	});
}

/* 插入/更新 */
Hik.dataCollect.transform.loadInsertInfo = function(src, props, callback) {
	var html = [
        '<div class="control-group" style="float: left;">',
        	'<div class="control-label"><em>*</em>步骤名称：</div>',
			'<div class="controls">',
			    '<input class="auto-input" maxlength="30" name="label" required="true" vtype="common" type="text" isOverflown="true" promptPosition="bottomRight"/>',
			'</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
			'<div class="control-label"><em>*</em>数据源：</div>',
			'<div class="controls">',
				'<select required="true" name="connection">',
					'<option value="">--请选择--</option>',
				'</select>',
			'</div>',
		'</div>',
		'<div class="control-group" style="float: left;">',
			'<div class="control-label"><em>*</em>目标表：</div>',
			'<div class="controls">',
				'<select required="true" name="table">',
					'<option value="">--请选择--</option>',
				'</select>',
			'</div>',
		'</div>',
		'<div class="allFieldsDiv">',
			'<ul id="fieldTab" class="tab-line-nav" style="border: 0px;border-bottom: 1px solid #DCDCDC;">',
				'<li class="tab-line-nav-btn" data-tab="t-1">',
					'<a class="tab-line-nav-content" href="javascript:void(0);">查询字段</a>',
				'</li>',
				'<li class="tab-line-nav-btn" data-tab="t-2">',
					'<a class="tab-line-nav-content" href="javascript:void(0);">更新字段</a>',
				'</li>',
				'<div class="addbtn"></div>',
			'</ul>',
			'<div id="fieldTabDiv" class="tab-content">',
				'<div class="tab-panel" data-tab="t-1">',
					'<div class="searchFieldsDivTitle">',
						'<div class="fieldsTitle">流字段</div>',
						'<div class="fieldsTitle" style="width: 100px;">比较符</div>',
						'<div class="fieldsTitle">表字段</div>',
					'</div>',
					'<div class="searchFieldsDiv"></div>',
				'</div>',
				'<div class="tab-panel" data-tab="t-2">',
					'<div class="updateFieldsDivTitle">',
						'<div class="fieldsTitle">流字段</div>',
						'<div class="fieldsTitle" style="margin-left:40px;">表字段</div>',
					'</div>',
					'<div class="updateFieldsDiv"></div>',
				'</div>',
			'</div>',
		'</div>'
	];
	
	$('.insertDialog').html(html.join(''));
	
	$('.insertDialog #fieldTab').tabs({
		panelid:'fieldTabDiv' 
	});
	
	// 下拉
	$('.insertDialog SELECT[name=connection]').droplist();   
	$('.insertDialog SELECT[name=table]').droplist();
	$('.insertDialog .searchFieldsDiv').empty();
	$('.insertDialog .updateFieldsDiv').empty();
	
	// 查询数据源
	var dsName = null;
	var tableName = null;
	
	$('.addbtn').unbind('click').bind('click',function(){
		if(Tool.isEmpty(tableName)){
			jAlert('新增异常，请先选择目标表', '提示', 'attention');
			return;
		}
		var type = $('.insertDialog #fieldTab').find('li.active').attr('data-tab');
		switch (type) {
		case 't-1':
			Hik.dataCollect.transform.addSearchField(streamFields, srcFields);
			break;
		case 't-2':
			Hik.dataCollect.transform.addUpdateField(streamFields, srcFields);
			break;
		default:
			break;
		}
	});
	if($('.titleTd .saveBtn').is(":visible")){
		$('.titleTd .saveBtn').trigger('click');
	}
	var taskName = $('.titleTd .desc .title').html();
	var graphJson = myflow.data.getGraphJsonData(taskName);
	var stepName = src.text();
	var streamFields = [];
	$.ajax({
		type : 'POST',
		url : appPath + '/transService/inputOutputFields.do',
		data : 'graphJson=' + encodeURI(graphJson) +'&stepName=' + encodeURI(stepName) + '&before=true',
		dataType : 'text',
		success: function(result){
			streamFields = JSON.parse(result);
		},
		error: function(result){
			$.sticky('加载流字段异常，请尝试打开弹窗', 'error', {position: 'center-center'});
		}
	});
	
	var srcFields = [];
	dataAjax.queryDataSource(function(dataSource){
		if(!Tool.isEmpty(dataSource)){
			for (var i = 0; i < dataSource.length; i++) {
				$('.insertDialog SELECT[name=connection]').append('<option value="' + dataSource[i].name + '">' + dataSource[i].name + '</option>');  
			}
			$('.insertDialog SELECT[name=connection]').droplist();
			
			//数据源修改时，修改表
			$('.insertDialog SELECT[name=connection]').bind('change', function(){
				// 清空原始数据
				$('.insertDialog SELECT[name=table] OPTION').each(function(){
					if(Tool.isEmpty($(this).val())){
						return;
					}
					$(this).remove();
				});
				$('.insertDialog SELECT[name=table]').droplist();
				$('.insertDialog SELECT[name=table]').val('').trigger('change');
				$('.insertDialog .searchFieldsDiv').empty();
				$('.insertDialog .updateFieldsDiv').empty();
				
				dsName = $(this).val();
				if(Tool.isEmpty(dsName)){
					return;
				}
				//加载新的表
				dataAjax.queryDataTable(dsName, function(tableList){
					for (var i = 0; i < tableList.length; i++) {
						$('.insertDialog SELECT[name=table]').append('<option value="' + tableList[i] + '">' + tableList[i] + '</option>');  
					}
					$('.insertDialog SELECT[name=table]').droplist();
					
					//表修改时，修改对应的字段
					$('.insertDialog SELECT[name=table]').bind('change', function(){
						// 清空原始数据
						$('.insertDialog .searchFieldsDiv').empty();
						$('.insertDialog .updateFieldsDiv').empty();
						srcFields = [];
						
						// 修改为空
						tableName = $(this).val();
						if(Tool.isEmpty(tableName)){
							return;
						}
						
						//等于0时，不提示，直接修改
						dataAjax.queryTableFields(dsName, tableName, function(fieldList){
							srcFields = [];
							for (var i = 0; i < fieldList.length; i++) {
								var d = {
									name : fieldList[i][0]
								}
								srcFields.push(d);
							}
						});
					});
				 });
			});
		}
	});
	
	//赋值
	$('.insertDialog INPUT[name=label]').val(props['label']);
	setTimeout(function(){
		if(Tool.isNotEmpty(props['connection'])){
			$('.insertDialog SELECT[name=connection]').val(props['connection']);
			$('.insertDialog SELECT[name=connection]').trigger('change');  
		}
	}, 500);
	setTimeout(function(){
		if(Tool.isNotEmpty(props['table'])){
			$('.insertDialog SELECT[name=table]').val(props['table']);
			$('.insertDialog SELECT[name=table]').trigger('change');  
		}
	}, 1000);
	setTimeout(function(){
		if(Tool.isNotEmpty(props['updateFields'])){
			var updateFields = JSON.parse(props['updateFields']);
			for(var k in updateFields){
				if($.isFunction(updateFields[k])){
					continue;
				};
				Hik.dataCollect.transform.addUpdateField(streamFields, srcFields);
				$('.insertDialog .updateFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').val(updateFields[k].updateStream);
				$('.insertDialog .updateFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').trigger('change');
				
				$('.insertDialog .updateFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').val(updateFields[k].updateLookup);
				$('.insertDialog .updateFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').trigger('change');
			}
		}
		if(Tool.isNotEmpty(props['searchFields'])){
			var searchFields = JSON.parse(props['searchFields']);
			for(var k in searchFields){
				if($.isFunction(searchFields[k])){
					continue;
				};
				Hik.dataCollect.transform.addSearchField(streamFields, srcFields);
				$('.insertDialog .searchFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').val(searchFields[k].keyStream1);
				$('.insertDialog .searchFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').trigger('change');
				
				$('.insertDialog .searchFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').val(searchFields[k].keyLookup);
				$('.insertDialog .searchFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').trigger('change');
				
				$('.insertDialog .searchFieldsDiv .fieldDiv:last').find('SELECT[name=field3]').val(searchFields[k].keyCondition);
				$('.insertDialog .searchFieldsDiv .fieldDiv:last').find('SELECT[name=field3]').trigger('change');
			}
		}
	}, 1500);
	
	//打开弹出框
	var insertDialog = $('.insertDialog').dialog({
    	title : "插入/更新",
    	autoOpen : true,
    	modal : true,
    	width : 670,
		height : 480,
		draggable: false,
		resizable: false,
		buttons : {
		    "ok" : {
		    	text : "确认",
		    	'class' : 'button',
		        click : function() {
		        	// 参数验证
		        	var isOk = true;
		    		$('.insertDialog INPUT, SELECT').each(function(){
		    			if(!$(this).validate()){
		    				isOk = false;
		    			}
		    		});
		    		if(!isOk){
		    			return;
		    		}
		        	
		           var name = $('.insertDialog INPUT[name=label]').val();
		           var data = {};
		           data.label = $('.insertDialog INPUT[name=label]').val();
		           data.connection = $('.insertDialog SELECT[name=connection]').val();
		           data.table = $('.insertDialog SELECT[name=table]').val();
		         
		           // 查询字段
		           var searchFields = [];
		           $('.insertDialog .searchFieldsDiv .fieldDiv').each(function(){
		        	   var field = {};
		        	   field.keyStream1 =  $(this).find('SELECT[name=field1]').val();
		        	   field.keyLookup =  $(this).find('SELECT[name=field2]').val();
		        	   field.keyCondition = $(this).find('SELECT[name=field3]').val();
		        	   searchFields.push(field);
		           });
		           eval("var searchFieldsStr = '" + JSON.stringify(searchFields) + "';"); //解决中文被转成unicode的问题
		           data.searchFields = searchFieldsStr;
		           // 更新字段
		           var updateFields = [];
		           $('.insertDialog .updateFieldsDiv .fieldDiv').each(function(){
		        	   var field = {};
		        	   field.updateStream =  $(this).find('SELECT[name=field1]').val();
		        	   field.updateLookup =  $(this).find('SELECT[name=field2]').val();
		        	   field.updateLookupComment = "";
		        	   field.update = "Y";
		        	   var origin = $(this).find('SELECT[name=field1] OPTION[value=' + field.updateStream + ']').attr('table');
		        	   field.origin = origin;
		        	   updateFields.push(field);
		           });
		           eval("var updateFieldsStr = '" + JSON.stringify(updateFields) + "';"); //解决中文被转成unicode的问题
		           data.updateFields = updateFieldsStr;
		           if ($.isFunction(callback)) {
		        	   callback(name, data);
		           }
		           insertDialog.dialog("close");
		        }
		    },
		    "cancel" : {
		    	text : "取消",
		    	'class' : 'button button-cancel',   
		    	click : function() {
		    		insertDialog.dialog("close");   
		        }
		    }
		}
	});
}

Hik.dataCollect.transform.addUpdateField = function(streamFields, srcFields){
	var html = [
		'<div class="fieldDiv">',
			'<div class="control-group" style="float: left;">',
		    	'<select required="true" name="field1">',
		    		'<option value="">--请选择--</option>',
		    	'</select>',
			'</div>',
			'<div class="control-group" style="float: left;margin-left:40px;">',
		    	'<select required="true" name="field2">',
		    		'<option value="">--请选择--</option>',
		    	'</select>',
			'</div>',
			'<div class="delbtn" title="删除"></div>',
		'</div>'
	];
	$('.insertDialog .updateFieldsDiv').append(html.join(''));

	// 流字段
	$('.updateFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').droplist();
	for (var i = 0; i < streamFields.length; i++) {
		var option = '<option value="' + streamFields[i].name + '" table="' + streamFields[i].origin + '">' + streamFields[i].name + '</option>';
		$('.updateFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').append(option);  
	}
	$('.updateFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').droplist();
	// 目标字段
	$('.updateFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').droplist();
	for (var i = 0; i < srcFields.length; i++) {
		$('.updateFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').append('<option value="' + srcFields[i].name + '">' + srcFields[i].name + '</option>');  
	}
	$('.updateFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').droplist();
	$('.updateFieldsDiv .fieldDiv:last').find('.delbtn').unbind('click').bind('click',function(){
		$(this).parent().remove();
	});
}

Hik.dataCollect.transform.addSearchField = function(streamFields, srcFields){
	var html = [
		'<div class="fieldDiv">',
			'<div class="control-group" style="float: left;">',
		    	'<select required="true" name="field1">',
		    		'<option value="">--请选择--</option>',
		    	'</select>',
			'</div>',
			'<div class="control-group" style="float: left;margin-left:10px;">',
		    	'<select required="true" name="field3" style="width: 100px;">',
		    		'<option value="=">=</option>',
		    		'<option value="<>"><></option>',
		    		'<option value="<">"<"</option>',
		    		'<option value="<="><=</option>',
		    		'<option value=">">></option>',
		    		'<option value=">=">>=</option>',
		    		'<option value="LIKE">LIKE</option>',
		    		'<option value="BETWEEN">BETWEEN</option>',
		    		'<option value="IS NULL">IS NULL</option>',
		    		'<option value="IS NOT NULL">IS NOT NULL</option>',
		    	'</select>',
			'</div>',
			'<div class="control-group" style="float: left;margin-left:10px;">',
		    	'<select required="true" name="field2">',
		    		'<option value="">--请选择--</option>',
		    	'</select>',
			'</div>',
			'<div class="delbtn" title="删除"></div>',
		'</div>'
	];
	$('.insertDialog .searchFieldsDiv').append(html.join(''));

	// 流字段
	$('.searchFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').droplist();
	for (var i = 0; i < streamFields.length; i++) {
		var option = '<option value="' + streamFields[i].name + '" table="' + streamFields[i].origin + '">' + streamFields[i].name + '</option>';
		$('.searchFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').append(option);  
	}
	$('.searchFieldsDiv .fieldDiv:last').find('SELECT[name=field1]').droplist();
	// 关系符
	$('.searchFieldsDiv .fieldDiv:last').find('SELECT[name=field3]').droplist();
	// 目标字段
	$('.searchFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').droplist();
	for (var i = 0; i < srcFields.length; i++) {
		$('.searchFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').append('<option value="' + srcFields[i].name + '">' + srcFields[i].name + '</option>');  
	}
	$('.searchFieldsDiv .fieldDiv:last').find('SELECT[name=field2]').droplist();
	$('.searchFieldsDiv .fieldDiv:last').find('.delbtn').unbind('click').bind('click',function(){
		$(this).parent().remove();
	});
}


/**
 * 页面元素加载完成后将执行此方法
 */
Hik.dataCollect.transform.initialize = function(taskName){
	var This = this;
	
	This.addListener();
	This.layout();
	
	if(Tool.isNotEmpty(taskName)){
		//修改
		$('.titleTd .desc .title').html(taskName);
		$.ajax({
			type : 'GET',
			async : 'false',
			url : appPath + '/transService/open.do?name=' + encodeURI(taskName) + '&type=transformation',
			dataType : 'text',
			success : function(data){
				Hik.dataCollect.transform.graphDrag(data);
			},
			error : function(data){
				$.sticky('加载数据失败，请刷新界面', 'error', {position: 'center-center'});
			} 
		});
		// 可执行
		logging.init(taskName);
	}else{
		//新增
		$('.titleTd .desc .title').html('新建转换');
		Hik.dataCollect.transform.graphDrag(null);
	}
	
}

/**
 *  画图
 */
Hik.dataCollect.transform.graphDrag = function(data){
	Hik.dataCollect.transform.data = data;
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
							case 'TableInput':
								This.loadTableInfo(props, callback);
								break;
							case 'MergeJoin':
								This.loadJoinInfo(src, props, callback);
								break;
							case 'InsertUpdate':
								This.loadInsertInfo(src, props, callback);
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
		Hik.dataCollect.transform.initialize(Hik.dataCollect.transform.taskName);
	});
});