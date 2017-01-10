<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=8" />
		<title>数据采集</title>
		<jsp:include page="../../common/common.jsp"></jsp:include>
		<jsp:include page="../../common/myflow.jsp"></jsp:include>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>web/dataCollect/css/index.css"/>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>web/dataCollect/css/panel.css"/>
		<script>
			Namespace('Hik.dataCollect.pages');
			Namespace('Hik.dataCollect.pages.graph');
		</script>
		<script type="text/javascript" src="<%=basePath%>web/dataCollect/js/index.js"></script>
		<script type="text/javascript" src="<%=basePath%>web/dataCollect/js/panel.js"></script>
	</head>
	
	<body>
		<div class="dataCollectContainer">
			<table>
				<tr>
					<td colspan="2" class="titleTd">
						<div class="desc"></div>
						<div class="btn">
							<!-- <a href="javascript:void(0)" class="button button-success" name="run">执行</a>
							<a href="javascript:void(0)" class="button" name="design">设计</a>  -->
							<div class="design" title="进入编辑界面">设计</div>
							<div class="queryJob" title="查看运行日志">查看日志</div>
							<div class="stop" title="停止当前转换">停止</div>
							<div class="run" title="执行当前转换/任务">执行</div>
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
						<div class="nav">
							<div class="divTitle">
								<div class="transform message">转换</div>
								<div class="line"></div>
								<div class="transform btn" title="新建转换"></div>
							</div>
							<div class="transform option"></div>
							<div class="divTitle">
								<div class="task message">任务</div>
								<div class="line"></div>
								<div class="task btn" title="新建任务"></div>
							</div>
							<div class="task option"></div>
						</div>
					</td>
					<td class="containerTd">
						<div class="container" style="overflow: hidden;">
							<div class="graphDiv">
								<div id="myflow_props"></div>
							</div>
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
						</div>
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>