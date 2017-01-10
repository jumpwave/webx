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
		<title>数据稽核</title>
		<jsp:include page="../../common/common.jsp"></jsp:include>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>baseui/puck-1.2.0/css/puck.css"/>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>web/dataAudit/css/index.css"/>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>baseui/stepbar/stepbar.css"/>
		<script>
			Namespace('Hik.dataAudit');
		</script>
		<script type="text/javascript" src="<%=basePath%>baseui/My97DatePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="<%=basePath%>baseui/puck-1.2.0/puck.all.js"></script>
		<script type="text/javascript" src="<%=basePath%>baseui/stepbar/stepbar.js"></script>
		<script type="text/javascript" src="<%=basePath%>web/dataAudit/js/index.js"></script>
	</head>
	
	<body>
		<div class="dataAuditContainer">
			<table>
				<tr>
					<td class="navigatorTd">
						<div class="navigatorTitle">
							<span>稽核任务</span>
							<div class="addBtn" title="新建稽核任务"></div>
						</div>
						<!-- 导航  -->
						<div class="nav">
							<div class="tips">暂无稽核任务</div>
						</div>
					</td>
					<td class="containerTd">
						<div class="container">
							<div class="tips" style="display: none;">稽核任务主要用来考察审核数据</div>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>