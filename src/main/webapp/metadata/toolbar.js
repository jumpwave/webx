// 页面工具栏
function showJTopoToobar(stage){
	var toobarDiv = $('<div class="jtopo_toolbar">').html(''
//		+'&nbsp;&nbsp;<input type="button" id="centerButton" value="居中显示"/>'
//		+'<input type="button" id="fullScreenButton" value="全屏显示"/>'
		+'<div id="zoomOutButton"><img src="metadata/image/toolbar_ico_zoomin.png" /><span class="text">放 大</span></div>'
		+'<div id="zoomInButton"><img src="metadata/image/toolbar_ico_zoomout.png" /><span class="text">缩 小</span></div>'
		+'<div id="exportButton"><img src="metadata/image/toolbar_ico_exportPNG.png" /><span class="text">导出PNG</span></div>');
		
	$('#iconExample').append(toobarDiv);

	// 工具栏按钮处理
	$('#centerButton').click(function(){
		stage.centerAndZoom(); //缩放并居中显示
	});
	$('#zoomOutButton').click(function(){
		stage.zoomOut(0.95);
	});
	$('#zoomInButton').click(function(){
		stage.zoomIn(0.95);
	});
	$('#exportButton').click(function(){
		stage.saveCurrentImageInfo();
	});
	$('#zoomCheckbox').click(function(){
		if($('#zoomCheckbox').attr('checked')){
			stage.wheelZoom = 0.95; // 设置鼠标缩放比例
		}else{
			stage.wheelZoom = null; // 取消鼠标缩放比例
		}
	});
	$('#fullScreenButton').click(function(){
		runPrefixMethod(stage.canvas, "RequestFullScreen")
	});

	// 查询
	$('#findButton').click(function(){
		var text = $('#findText').val().trim();
		var nodes = stage.find('node[text="'+text+'"]');
		if(nodes.length > 0){
			var node = nodes[0];
			node.selected = true;
			var location = node.getCenterLocation();
			// 查询到的节点居中显示
			stage.setCenter(location.x, location.y);
			
			function nodeFlash(node, n){
				if(n == 0) {
					node.selected = false;
					return;
				};
				node.selected = !node.selected;
				setTimeout(function(){
					nodeFlash(node, n-1);
				}, 300);
			}
			
			// 闪烁几下
			nodeFlash(node, 6);
		}
	});
}

var runPrefixMethod = function(element, method) {
	var usablePrefixMethod;
	["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
		if (usablePrefixMethod) return;
		if (prefix === "") {
			// 无前缀，方法首字母小写
			method = method.slice(0,1).toLowerCase() + method.slice(1);
		}
		var typePrefixMethod = typeof element[prefix + method];
		if (typePrefixMethod + "" !== "undefined") {
			if (typePrefixMethod === "function") {
				usablePrefixMethod = element[prefix + method]();
			} else {
				usablePrefixMethod = element[prefix + method];
			}
		}
	}
);

return usablePrefixMethod;
};
/*
runPrefixMethod(this, "RequestFullScreen");
if (typeof window.screenX === "number") {
var eleFull = canvas;
eleFull.addEventListener("click", function() {
	if (runPrefixMethod(document, "FullScreen") || runPrefixMethod(document, "IsFullScreen")) {
		runPrefixMethod(document, "CancelFullScreen");
		this.title = this.title.replace("退出", "");
	} else if (runPrefixMethod(this, "RequestFullScreen")) {
		this.title = this.title.replace("点击", "点击退出");
	}
});
} else {
alert("浏览器不支持");
}*/
