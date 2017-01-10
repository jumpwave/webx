<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String taskName = request.getParameter("taskName");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=8" />
		<title>数据采集</title>
		<jsp:include page="../../../../common/common.jsp"></jsp:include>
		<jsp:include page="../../../../common/myflow.jsp"></jsp:include>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>web/dataCollect/modules/transform/css/index.css"/>
		<script>
			Namespace('Hik.dataCollect.transform');
			Hik.dataCollect.transform.taskName = '<%=taskName%>';
		</script>
		<script type="text/javascript" src="<%=basePath%>web/dataCollect/modules/transform/js/index.js"></script>
		<script type="text/javascript" src="<%=basePath%>web/dataCollect/modules/transform/js/logging.js"></script>
		<script type="text/javascript" src="<%=basePath%>web/dataCollect/modules/common/dataAjax.js"></script>
	</head>
	
	<body>
		<div class="container">
			<table>
				<tr>
					<td colspan="2" class="titleTd">
						<div class="desc">
							<div class="title"></div>
	    					<div class="editBtn" title="编辑"></div>
	    					<div class="saveBtn" title="确定"></div>
	    					<div class="cancelBtn" title="取消"></div>
						</div>
						<div class="btn">
							<div class="return" title="返回查看界面">返回</div>
							<div class="separate"></div>
							<div class="save" title="保存当前转换">保存</div>
							<div class="stop" title="停止当前转换">停止</div>
							<div class="run" title="执行当前转换">执行</div>
						</div>
					</td>
				</tr>
				<tr>
					<td class="navigatorTd">
						<!-- 标头 -->
						<div class="navigatorTitle">
							<span>资源库</span>
						</div>
						
						<!-- 导航  -->
						<div class="tip">从以下列表拖拽步骤设计转换</div>
						
						<div id="myflow_tools">
							<div id="myflow_tools_handle"></div>
							
							<div class="toolbtn">
								<div class="node selectable active" id="pointer">选取	</div>
								<div class="node selectable" id="path">连线</div>
							</div>
						
							<div class="nav">
								<div class="divTitle">
									<div class="message">输入</div>
									<div class="line"></div>
									<div class="option">
										<div class="node state" id="state" type="TableInput">表输入</div>
									</div>
								</div>
								
								<div class="divTitle">
									<div class="message">连接</div>
									<div class="line"></div>
									<div class="option">
										<div class="node state" id="state" type="MergeJoin">合并连接</div>
									</div>
								</div>
								
								<div class="divTitle">
									<div class="message">输出</div>
									<div class="line"></div>
									<div class="option">
										<div class="node state" id="state" type="InsertUpdate">插入更新</div>
									</div>
								</div>
							</div>
						</div>
						
						<div class="tip">
							<p>小提示：</p><br>
							<p>1.选中图标，再次点击，将弹出其属性框。</p><br>
							<p>2.连线，选中源图标后，再点击目标图标。</p><br>
							<p>3.字段，必须勾选才生效，默认不使用。</p>
						</div>
						
					</td>
					<td class="containerTd">
						<div class="graphDiv"></div>
						<div class="myflow_log">
							<ul id="demo1" class="tab-line-nav">
								<li class="tab-line-nav-btn" data-tab="t-1">
									<a class="tab-line-nav-content" href="javascript:void(0);">日志</a>
								</li>
								<li class="tab-line-nav-btn" data-tab="t-2">
									<a class="tab-line-nav-content" href="javascript:void(0);">步骤跟踪</a>
								</li>
								<div class="closebtn"></div>
							</ul>
							<div id="demo1-cn" class="tab-content">
								<div class="tab-panel log" data-tab="t-1"></div>
								<div class="tab-panel step" data-tab="t-2">
									<div id="DataGrid" class="datagrid"></div>  
								</div>
							</div>
						</div>
					</td>
				</tr>
			</table>
		</div>
		
		<!-- 表输入 弹窗  -->
        <div class="tableDialog"></div>
        
        <!-- 合并连接 弹窗 -->
        <div class="joinDialog"></div>
        
        <!-- 插入/更新 弹窗 -->
        <div class="insertDialog"></div>
	</body>
</html>