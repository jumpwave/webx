<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isELIgnored="false"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<script type="text/javascript" src="<%=basePath%>baseui/raphael/raphael.js"></script>
<script type="text/javascript" src="<%=basePath%>baseui/myflow/myflow.js"></script>
<script type="text/javascript" src="<%=basePath%>baseui/myflow/myflow.jpdl4.js"></script>