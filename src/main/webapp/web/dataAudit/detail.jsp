<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String taskId = request.getParameter("taskId");
	String hideIcon = request.getParameter("hideIcon");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=8" />
		<title>数据稽核</title>
		<jsp:include page="../../common/common.jsp"></jsp:include>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>baseui/puck-1.2.0/css/puck.css"/>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>web/dataAudit/css/index.css"/>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>baseui/stepbar/stepbar.css"/>	
		<script type="text/javascript">
			Namespace('Hik.dataAudit.detail');
			Hik.dataAudit.detail.taskId = '<%=taskId%>';
			var hideIcon = '<%=hideIcon%>';
		</script>
		<script type="text/javascript" src="<%=basePath%>baseui/My97DatePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="<%=basePath%>baseui/puck-1.2.0/puck.all.js"></script>
		<script type="text/javascript" src="<%=basePath%>baseui/stepbar/stepbar.js"></script>
		<script type="text/javascript" src="<%=basePath%>web/dataAudit/js/detail.js"></script>
	</head>
	
	<body>
	<div class="dataAuditDetailPanel">
		<ul id="dataAuditTab" class="tab-line-nav">  
		    <li class="tab-line-nav-btn" data-tab="t-1">  
		        <a class="tab-line-nav-content" href="javascript:void(0);">任务信息</a>  
		    </li>  
		    <li class="tab-line-nav-btn" data-tab="t-2">  
		        <a class="tab-line-nav-content" href="javascript:void(0);">执行结果</a>  
		    </li>  
		</ul>  
		<div id="dataAuditTab-cn" class="tab-content">  
		    <div class="tab-panel" data-tab="t-1">
		  	  <div>
					<div class="lineTitle">
						<div class="line"></div>
						<div class="message">基本信息</div>
						<div class="btn editBtn" title="编辑"></div>
						<div class="btn publishBtn" title="发布"></div>
					</div>		    
					<div class="control-group">
						<div class="control-label">任务名称：</div>
						<div class="controls"><div name="task_name"></div></div>
					</div>
					<div class="control-group">
						<div class="control-label">任务目标：</div>
						<div class="controls"><div name="task_target"></div></div>
					</div>	        
					<div class="control-group">
						<div class="control-label">初次执行时间：</div>
						<div class="controls"><div name="first_execute_time"></div></div>
					</div>
					<div class="control-group">
						<div class="control-label">执行次数：</div>
						<div class="controls"><div name="execute_times"></div></div>
					</div>	
					<div class="control-group">
						<div class="control-label">执行间隔：</div>
						<div class="controls"><div name="execute_interval"></div></div>
					</div>
				</div>
				<div>		
					<div class="lineTitle">
						<div class="line"></div>
						<div class="message">脚本信息</div>
					</div>	
					<div class="control-group">
						<div class="control-label">数据源：</div>
						<div class="controls"><div name="data_source"></div></div>
					</div>			
					<div class="control-group">
						<div class="control-label">脚本：</div>
						<div class="controls"><div name="audit_script"></div></div>
					</div>	
				</div>																
		    </div>  
		    <div class="tab-panel" data-tab="t-2">
		    	<div class="resultToolbar">
		    		开始时间: <input class="Wdate typetext" type="text" name="timeMin"  id="timeMin"/>
		    		结束时间: <input class="Wdate typetext" type="text" name="timeMax"  id="timeMax"/>
		    		&nbsp;&nbsp;&nbsp;<input type="checkbox" name="checkboxException"/>异常结果
		    		&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="button button-minor button-query" name="next">过滤</a>

		    	</div>
		    	<div class="taskResultDiv">

		    	</div>
		    	<div id="pagination4" class="pagination-content"></div>  
		    </div>  
		</div>  
	</div>
	<div id="publishDialog" title="发布成果物" style="display:none">  
	    <div class="dialogContent" >
	    	<div id="folderTree" class="ztree"></div>
	    </div>  
	</div>  
	
	</body>
</html>