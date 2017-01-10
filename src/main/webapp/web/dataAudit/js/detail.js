Hik.dataAudit.detail.initialize = function(){
	var This = this;
    $('#dataAuditTab').tabs({panelid:'dataAuditTab-cn'});  
	//界面优化
	$('.dataAuditDetailPanel').height($(window).height() - 40);
	This.addListeners();
}

Hik.dataAudit.detail.layout = function(){
	var entryW = $('.resultEntry').width();
	var entryIconW = $('.resultEntry .resultIcon').width();
	$(".resultEntry .resultCnt").width(entryW - entryIconW);
	$('body').css("overflow-y","auto");
}

Hik.dataAudit.detail.createResultDiv = function(taskResult){
	var icon = appPath + '/web/dataAudit/image/success.png';
	if("1" == taskResult.has_exception){
		icon = appPath + '/web/dataAudit/image/alarm.png';
	}
	var html = [
	    		'<div class="resultEntry">',
    			'<div class="resultIcon">',
    				'<image src="' + icon + '"/>',
    			'</div>',
    			'<div class="resultCnt">',
    				'<div><span class="timeSpan">执行开始时间: '+ taskResult.begin_time+'</span>',
    					 '<span class="timeSpan">执行结束时间: '+ taskResult.end_time+'</span>',
    					 
    					 '<a class="sqlScriptA" href="javascript:void(0);" title="SQL脚本"></a>',
    					 '<div class="clear"></div>',
    					 '<div class="sqlScript">执行脚本:' + taskResult.audit_script + '</div>',
    					 '<div class="clear"></div>',
    				'</div>'
	        ];
	if("1" == taskResult.has_exception){

			html.push('<div><span class="exceptionLabel">异常内容: </span>');
			html.push('<div class="exceptionDiv datagrid">');
			html.push('<table cellspacing="0" cellpadding="0" class="tLight" style="width:100%;">');
			html.push(		 '<thead>');
			html.push(			'<tr>');
			var headers = eval(taskResult.exception_headers);
			if($.isArray(headers)){
				for(var i=0;i<headers.length;i++){
					html.push('<th>' + headers[i] + '</th>');
				}				
			}
			html.push(			'</tr>');
			html.push(		'</thead>');
			html.push(        '<tbody>'); 
			var epts = eval(taskResult.exceptions);
			if($.isArray(epts)){
				for(var i=0;i<epts.length;i++){
					if(i%2 == 0){
						html.push(           '<tr class="odd">');
					}else{
						html.push(           '<tr class="even">');
					}
					
					var ep = epts[i]
					for(var j=0;j<headers.length;j++){
						html.push('<td class="textC">' +ep[headers[j]]+ '</td>');
					}
					html.push(            '</tr>'); 
				}				
			}			
			html.push(        '</tbody>');	    						
			html.push(	'</table>');
			html.push('</div>');
			html.push('</div>');	               

	}
	
	html.push('</div>');
	html.push('<div class="clear"></div>');
	html.push('</div>');
	
	var _resultEntry = $(html.join(""));
	$('.taskResultDiv').append(_resultEntry);
	
	$('.sqlScriptA',_resultEntry).unbind('click').click(function(){
		if($('.sqlScript',_resultEntry).hasClass('show')){
			$('.sqlScript',_resultEntry).removeClass('show');
		}else{
			$('.sqlScript',_resultEntry).addClass('show');
		}
	})
}


Hik.dataAudit.detail.publish = function(taskObj){
	var folderTree = null;
	var setting= {
			view: {
				selectedMulti: false
			},
			edit: {
				enable: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			check:{
				enable: true,
				chkStyle: "radio",
				radioType: "all"
			}
		};
		$.ajax({
			type:'GET',
			url : appPath + '/metadata/FolderTree',
			contentType: 'application/json',
			dataType : 'json',
			success: function(result){
				folderTree =$.fn.zTree.init($("#folderTree"), setting, result.data); 	 
	
			},
			error: function(result){
				jAlert('生成树异常', '系统提示', 'attention');
			}
		});
	
	    var dialog = $('#publishDialog').dialog({  
		        autoOpen : true,  
		        modal : true,  
		        width : 400,  
		        height : 350,  
		        draggable: true,  
		        resizable: false,  
		        buttons : {  
		            "ok" : {  
		                text : '确认',  
		               'class' : 'button button-minor',  
		                click : function() {  
		                	var nodes = folderTree.getCheckedNodes(true);
		                	var folderid = nodes[0].fId;
//		                    var data = {
//		                    		   'label':'ws_7657657567' ,
//		                    		   'typeid':'WORKSHEET',
//		                    		   'wk_definition':{
//		                    		      'basicInfo':{
//		                    		    	'reportFolderId':folderid,
//		                    		        'reportName':taskObj.task_name
//		                    		      }		                    		   	 
//		                    		   },
//		                    		   'keywords':'dataAudit'
//		                    };
		                    debugger;
		            		$.ajax({
		            			type:'POST',
		            			url: appPath + '/metadata/DataAuditTask/' + Hik.dataAudit.detail.taskId + "/publish",
		            			dataType : 'json',
		            			data: {task_name: taskObj.task_name, folder_id: folderid},
		            			success: function(result){
		            				if(result.ret == 0){
		            					jAlert('发布成功', '系统提示', 'ok',function(){
		            						window.location.reload();
		            					});
		            				}else{
		            					jAlert('发布异常，异常原因：' + result.msg, '系统提示', 'attention');
		            				}
		            			},
		            			error: function(result){
		            				jAlert('发布异常，请稍后重试！', '系统提示', 'attention');
		            			}
		            		});
		                }  
		            },  
		            "cancel" : {  
		                text : '取消',  
		                'class' : 'button button-cancel',  
		                click : function() {  
		                    dialog.dialog("close");  
		                }  
		            }  
		        }  
		    });  
	
}


Hik.dataAudit.detail.addListeners = function(){
	 var This = this;
	
	 $('#dataAuditTab .tab-line-nav-btn').click(function(){
		if("t-1" == $(this).attr("data-tab")){
			$.ajax({
				type : 'GET',
				url : appPath + '/metadata/DataAuditTask/' + Hik.dataAudit.detail.taskId,
				contentType: 'application/json',
				dataType : 'json',
				success: function(result){
					$('.controls [name="task_name"]').text(result.task_name);
					$('.controls [name="task_target"]').text(result.task_target);
					$('.controls [name="first_execute_time"]').text(result.first_execute_time);
					$('.controls [name="execute_times"]').text(result.execute_times == 'once' ? "一次" :"循环" );

					if(result.execute_times == 'once'){
						$('.controls [name="execute_interval"]').parents('.control-group').hide();
					}else{
						var txt = result.execute_interval ;
						if('minute' == result.execute_interval_unit){
							txt = txt + '分钟';
						}else if('hour' == result.execute_interval_unit){
							txt = txt + '小时';
						}else if('day' == result.execute_interval_unit){
							txt = txt + '天';
						}
						$('.controls [name="execute_interval"]').text(txt );
					}
					
					$('.controls [name="data_source"]').text(result.data_source);
					$('.controls [name="audit_script"]').text(result.audit_script);
					
					
					$(".editBtn").click(function(){
						Hik.dataAudit.addAuditTaskBase(result);
					})
					$(".publishBtn").click(function(){
						Hik.dataAudit.detail.publish(result);
					})					
					
				},
				error: function(result){
					jAlert('初始化数据源异常！', '系统提示', 'attention');
				}
			});  			
		}
		
		if("t-2" == $(this).attr("data-tab")){
			Hik.dataAudit.detail.loadResultEntry();
		}

	 });
	 
	 $('#dataAuditTab .tab-line-nav-btn:first').click();
	 
//	 $('[name="checkboxException"]').click(function(){
//		 if($(this).is(":checked")){
//			 Hik.dataAudit.detail.loadResultEntry("1");
//		 }else{
//			 Hik.dataAudit.detail.loadResultEntry();
//		 }
//	 })
	 
		// 自定义开始时间监听
		$('.resultToolbar INPUT[name=timeMin]').bind('click', function(){
			WdatePicker({
				dateFmt : 'yyyy-MM-dd HH:mm:ss',
				maxDate : $('.resultToolbar INPUT[name=timeMax]').val() + ' || %y-%M-%d %H:%m:%s'
			});
			return false;
		});
		// 自定义结束时间监听
		$('.resultToolbar INPUT[name=timeMax]').bind('click', function(){
			WdatePicker({
				dateFmt : 'yyyy-MM-dd HH:mm:ss',
				minDate : $('.resultToolbar INPUT[name=timeMin]').val(),
				maxDate : '%y-%M-%d %H:%m:%s'
			});
			return false;
		});
		
		
		// 过滤按钮
		$('.resultToolbar .button-query').bind('click', function(){
			 Hik.dataAudit.detail.loadResultEntry();
		});		 
}
var pagination4 = null;
Hik.dataAudit.detail.loadResultEntry = function(pageNum){
	
	$('.taskResultDiv').empty();
	var timeMin = $('.resultToolbar INPUT[name=timeMin]').val()
	var timeMax = $('.resultToolbar INPUT[name=timeMax]').val();
	var onlyShowException = null;
	if($('[name="checkboxException"]').is(":checked")){
		onlyShowException = '1';
	}
	var pageSize = 10;
	if(typeof pageNum == 'undefined'){
		pageNum = 1;
	}
	$.ajax({
		type : 'GET',
		url : appPath + '/metadata/DataAuditResult/page',
		contentType: 'application/json',
		data: {"task_id": Hik.dataAudit.detail.taskId, has_exception: onlyShowException,"timeMin": timeMin, "timeMax": timeMax,"pageNum":pageNum,"pageSize":pageSize},
		dataType : 'json',
		success: function(resp){
			if($.isArray(resp.list)){
				for(var i=0;i<resp.list.length;i++){
					Hik.dataAudit.detail.createResultDiv(resp.list[i]);
				}
			}
			if(null == pagination4){
		        pagination4 = new pk.Pagination({  
		            el: $('#pagination4'),  
		            currentPage: resp.pageNum,  
                    maxPage	: resp.pages,
                    firstPagesCount: resp.firstPage,
                    preposePagesCount: resp.prePage,
                    postposePagesCount: resp.nextPage,
                    lastPagesCount: resp.lastPage,		            
		            styleType: 'default_css',  
		            paged : function(page) {  
		            	Hik.dataAudit.detail.loadResultEntry(page);
		            }  
		        }); 				
			}else{
				var obj = {'maxPage':resp.pages,'currentPage':resp.pageNum};  
				pagination4.setPageParam(obj);  
				
			}
 

			Hik.dataAudit.detail.layout();
		},
		error: function(result){
			jAlert('初始化数据源异常！', '系统提示', 'attention');
		}
	}); 	
}

$(document).ready(function(){
	if(1 == hideIcon){
		$(".editBtn, .publishBtn").hide();
	}
	setTimeout(function() {
		Hik.dataAudit.detail.initialize();
		if(1 == hideIcon){
			$('#dataAuditTab .tab-line-nav-btn[data-tab=t-2]').click();
		}
	},100);
});