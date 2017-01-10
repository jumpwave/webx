<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isELIgnored="false"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!-- 默认皮肤样式 -->
<link rel="stylesheet" href="<%=basePath%>common/themes/default/common.css"/>
<link rel="stylesheet" href="<%=basePath%>common/themes/default/footer.css"/>
<link rel="stylesheet" href="<%=basePath%>common/themes/default/tabs.css"/>
<link rel="stylesheet" href="<%=basePath%>common/themes/default/menus.css"/>