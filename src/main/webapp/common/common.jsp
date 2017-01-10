<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isELIgnored="false"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!-- 全局唯一appPath：项目跟路径；全局唯一appAddress：项目全路径 -->
<script>
	var appPath = "<%=path%>";
	var appAddress = "<%=basePath%>";
</script>

<!-- base css -->
<link type="text/css" href="<%=basePath%>common/css/base.css" rel="stylesheet" />
<link type="text/css" href="<%=basePath%>baseui/puck-1.2.0/css/puck.css" rel="stylesheet" />
<%-- <link type="text/css" href="<%=basePath%>baseui/jquery-ui/css/smoothness/jquery-ui-1.8.4.custom.css" rel="stylesheet" /> --%>

<!-- default theme -->

<!-- base js & jQuery core -->
<script type="text/javascript" src="<%=basePath%>common/js/base.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/tool.js"></script>
<script type="text/javascript" src="<%=basePath%>baseui/jquery-1.8.3/jquery.js"></script>
<script type="text/javascript" src="<%=basePath%>baseui/jquery-ui/js/jquery-ui-1.9.2.custom.min.js"></script>
<script type="text/javascript" src="<%=basePath%>baseui/puck-1.2.0/puck.all.js"></script>
<%--
<script src="<%=basePath%>common/js/library.js"></script>
<script src="<%=basePath%>common/js/jquery.js"></script>
<script src="<%=basePath%>common/js/jquery.base.js"></script> 
--%>

