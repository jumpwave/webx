<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
  <head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>

	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9"/>
	<meta name="Viewport" content="width=device-width; user-scaleable=no; initial-scale=1.0"/>
	<title>血缘图</title>
	<meta name="description" content="报表数据血缘图">
	<meta name="keyword" content="报表数据血缘图">	
	
	<link type="text/css" href="${pageContext.request.contextPath}/baseui/sticklr-1.0/jquery-sticklr-1.0.css" rel="stylesheet" />
	<link type="text/css" href="${pageContext.request.contextPath}/baseui/popbox/popbox.css" rel="stylesheet" />
	<link type="text/css" href="${pageContext.request.contextPath}/metadata/lineage.css" rel="stylesheet" />
	<script type="text/javascript" src="${pageContext.request.contextPath}/common/js/base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/common/js/tool.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/common/js/jquery.js"></script>
	<script>
		Namespace('Hik.metadata');
	    Hik.metadata.path = '${param.path}';
	    Hik.metadata.classifier = '${param.classifier}';
	    ///alert(encodeURIComponent('/消费区域比较图表'));
	    //alert(Hik.metadata.path);
	</script>	

	<script type="text/javascript" src="${pageContext.request.contextPath}/baseui/sticklr-1.0/jquery-sticklr-1.0.pack.js"></script>

	<script type="text/javascript" src="${pageContext.request.contextPath}/baseui/jtopo/jtopo-0.4.8.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/metadata/jtopo-node.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/metadata/MDContainer.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/metadata/link.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/metadata/toolbar.js"></script>
	<%--<script type="text/javascript" src="${pageContext.request.contextPath}/metadata/lineage.js"></script>
	--%>
	<script type="text/javascript" src="${pageContext.request.contextPath}/metadata/lineage-chart.js"></script>	
	<script type="text/javascript" src="${pageContext.request.contextPath}/baseui/popbox/popbox.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/baseui/popbox/jquery.autopopbox.min.js"></script>
  </head>

  <body>
  	  <div id="title"></div>
  	  <div id="headBtn"></div>
	  <div id="wrapper">
	  	<div id="iconExample">
	  		<img src="metadata/image/ico_legend.png" style="margin-left:40px;margin-top:12px;width:230px;height:16px;"/>
	  	</div>
		<canvas id="lineage_canvas" ></canvas>	
	  </div>
  	  <div id="notice"><div><image src="metadata/image/notice.png" style="position: absolute; top:4px;width:14px;height:14px;"/>左键单击查看节点细节,右键空白区域取消</div></div>
	 
	 <div id="sticky">
		<ul id="example-2" class="sticklr">
		<li>
		<a href="#" class="icon-tag" title="图表导航"></a>
			<ul class="nav_ul">
			</ul>
		</ul>
	</div> 	
  </body>

</html>