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
		<title>数据源</title>
		<jsp:include page="../../common/common.jsp"></jsp:include>
		<link type="text/css" rel="stylesheet" href="<%=basePath%>web/dataSource/css/index.css"/>
		<script>
			Namespace('Hik.dataSource');
		</script>
		<script type="text/javascript" src="<%=basePath%>web/dataSource/js/index.js"></script>
	</head>
	
	<body>
		<div class="dataSourceContainer">
			<table>
				<tr>
					<td class="navigatorTd">
						<div class="navigatorTitle">
							<span>数据源</span>
						</div>
						
						<div class="navigatorToolBar">
							<div class="addBtn" title="新建数据源">新建</div>
						</div>
						
						<!-- 导航  -->
						<div class="nav">
							<div class="tips">暂无数据源</div>
						</div>
					</td>
					<td class="containerTd">
						<div class="container">
							<div class="tips" style="display: none;">数据源是指向数据库的，获取数据的来源</div>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>