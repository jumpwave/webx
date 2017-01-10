Hik.metadata.stage = null;
Hik.metadata.scene = null;
Hik.metadata.startNode = null;
Hik.metadata.layout = function(){
	var wrapper = $("#wrapper");
	wrapper.width($(window).width() - 40);
	wrapper.height($(window).height() - $('#title').height() - 20);
	var _w = wrapper.width(), _h = wrapper.height();
	$("#wrapper").width(_w).height(_h);
	var canvas = document.getElementById('lineage_canvas');
	canvas.width= _w;
	canvas.height=(_h - $("#iconExample").height() - $("#notice").height());
};

Hik.metadata.getNodeByPath = function(path,classifier){
	
	var This = this;
	var paths = path.split(",");
	var locAnchor = null;
	if($.isArray(paths)){
		for(var j=0; j<paths.length;j++){
			$.ajax({
				datatype: 'json',
				async: false,
				url : 'metadata/instance', //根据path查询node
				data : {"path" : paths[j], "classifier": classifier},
				success : function(result) {					
					if (Tool.isNotEmpty(result)) {	
						//添加标题
						$("#title").text(result.mdInstnace.instance_name + "血缘图");
						var instance_id = result.mdInstnace.instance_id;						
						var chartText = result.mdInstnace.instance_name;
						var children = [];
						//查询报表下的维度和度量
						$.ajax({
							datatype: 'json',
							async: false,
							url : 'metadata/' + instance_id + "/children",
							data : {"relationship" : ''},
							success : function(result) {
								if (Tool.isNotEmpty(result)) {
									children = result;
								} 
							}
						});							
						
//						var titleNode = This.createTitleNode2(30,44,chartText);
//						var container1 = This.createContainer();			
//						container1.locAnchor = locAnchor;
//						locAnchor = container1;
//						container1.add(titleNode);			
//						titleNode.container = container1;	
						
						var chartContainer = This.createChartContainer(chartText);
						var li = $('<li><a href="#" class="icon-amazon">' + chartText + '</a></li>')
						$('#example-2 .nav_ul').append(li);						

						
						if($.isArray(children)){
							
							for(var i=0;i<children.length;i++){							
								This.getNode(children[i].instance_id,function(node){
									node.chartIdx = j;
									var container = This.createContainer();			
									container.locAnchor = locAnchor;
									locAnchor = container;
									
									node.setLocation(50,35); 			
									container.add(node);			
									node.container = container;				
									
									chartContainer.add(node);
									node.chartContainer = chartContainer;
									This.getDepend(node);															
									//This.drawDepend(node);																	
									
								});									
								
								
							}
						}
											
					
					} else {
					}
				},
				error : function() {
				}
			});	
			
		}
	}		
	
		
	


	
};

Hik.metadata.getNode = function(id, callback){
	var This = this;
	$.ajax({
		datatype: 'json',
		async: false,
		url : 'metadata/instance/' + id,
		data : {},
		success : function(result) {
			if (Tool.isNotEmpty(result)) {
				var node = This.createNode(result);
				This.scene.add(node);
				
				if($.isFunction(callback)){
					callback(node);
				}
			} else {
			}
		},
		error : function() {
		}
	});	
};


Hik.metadata.getDepend = function(fromNode){

	var instaceId = fromNode.data.mdInstnace.instance_id;
	var This = this;
	$.ajax({
		datatype: 'json',
		async: false,
		url : 'metadata/' + instaceId + "/depend",
		data : {"relationship" : ''},
		success : function(result) {
			if (Tool.isNotEmpty(result)) {
				var depends = result;
				if($.isArray(depends)){
//					if(depends.length > 0){
//						//画分隔线
//						newVerticalCutLine(fromNode.x + fromNode.width + 65, fromNode.y + fromNode.height + 10);
//					}
					for(var dep in depends){
						This.getNode(depends[dep].to_instance_id,function(node){
							node.container = fromNode.container;	
							node.chartContainer = fromNode.chartContainer;
							fromNode.appendDepened(node);
							fromNode.container.add(node);
							fromNode.chartContainer.add(node);
							//一直找依赖,直到没有依赖
							This.getDepend(node);
							
						});
					}
					if(fromNode.container){
						setTimeout(function(){
							fromNode.container.dispatchEvent("container-verticalSize", fromNode.container);	
						},100);						
					}					
					
				}
			} else {
			}
		},
		error : function() {
		}
	});		
}


Hik.metadata.getChildren = function(fatherNode){
	var instaceId = fatherNode.data.mdInstnace.instance_id;
	var This = this;
	$.ajax({
		datatype: 'json',
		async: false,
		url : 'metadata/' + instaceId + "/children",
		data : {"relationship" : ''},
		success : function(result) {
			if (Tool.isNotEmpty(result)) {
				var children = result;
				if($.isArray(children)){								
					for(var child in children){						
						This.getNode(children[child].instance_id,function(node){
							fatherNode.appendChild(node);															
							//This.drawDepend(node);
						});	
					}
					if(fatherNode.container){
						setTimeout(function(){
							fatherNode.container.dispatchEvent("container-verticalSize", fatherNode.container);	
						},100);						
					}


				}
			} else {
			}
		},
		error : function() {
		}
	});			
}

Hik.metadata.drawDepend = function(node){
	var This = this;
	//查询新创建的节点的依赖关系
	$.ajax({
		datatype: 'json',
		url : 'metadata/' + node.id + "/depend",
		data : {"relationship" : ''},
		success : function(result) {
			if (Tool.isNotEmpty(result)) {
				var depends = result;
				if($.isArray(depends)){
					for(var dep in depends){
						This.paintDepend(node.id, depends[dep].to_instance_id /*, depends[dep].relationship*/);
					}
				}
			} else {
			}
		},
		error : function() {
		}
	});		
	
//	$.ajax({
//		datatype: 'json',
//		url : '/web/metadata/' + node.id + "/depended",
//		data : {"relationship" : ''},
//		success : function(result) {
//			if (Tool.isNotEmpty(result)) {
//				var depends = result;
//				if($.isArray(depends)){
//					for(var dep in depends){
//						This.paintDepend(depends[dep].from_instance_id,node.id /*, depends[dep].relationship*/);
//					}
//				}
//			} else {
//			}
//		},
//		error : function() {
//		}
//	});	
}

Hik.metadata.paintDepend = function(fromId, toId, relationship){
	var fromNode, toNode, lnk;
	var childs = Hik.metadata.scene.childs;
	for(var i=0;i<childs.length;i++){
		if('MetaNode' == childs[i].elementType && fromId == childs[i].id){
			fromNode = childs[i];
		}
		if('MetaNode' == childs[i].elementType && toId == childs[i].id){
			toNode = childs[i];
		}
		if('link' == childs[i].elementType){
			if(childs[i].nodeA.id == fromId && childs[i].nodeZ.id == toId ){
				lnk = childs[i];
			}
		}
	}
	if(fromNode && toNode && (!lnk)){
		var link = newFlexionalLink(fromNode, toNode, relationship);
		fromNode.links.push(link);
	}
}

Hik.metadata.createContainer = function(node){
	var This = this;
	var container = new MDContainer();	
	This.scene.add(container);
	container.addEventListener("container-verticalSize",function(c){
		var childs = Hik.metadata.scene.childs;
		//console.log('c' + c._id);
		for(var i=0;i<childs.length;i++){
			if('container' == childs[i].elementType ){				
				var container = childs[i];
				//console.log('container.locAnchor' + container.locAnchor);
				if(container.locAnchor && container.locAnchor._id == c._id){
					console.log('relocate' + container._id);
					container.relocate();
					
					setTimeout(function(){
						container.dispatchEvent("container-verticalSize", container);
					},100);
					break;					
				}

			}

		}		

	})
	return container;
}

Hik.metadata.createChartContainer = function(chartText){
	var This = this;
	var chartContainer = This.createContainer();	
	chartContainer.text = chartText;
	chartContainer.alpha = 0.9;
	chartContainer.fillColor = '255,255,255';	
	chartContainer.textPosition = 'Top_Left';
	chartContainer.fontColor = '51,51,51';//'49,91,12';
	chartContainer.font = '16px 微软雅黑';
	chartContainer.borderColor = '228,228,228' ;//'243,243,243';
	chartContainer.fillColor = '228,228,228';
	chartContainer.borderRadius = 10; // 圆角
	chartContainer.borderWidth = 6;
//	chartContainer.dbclick(function(e){
//		chartContainer.width = 0;
//		chartContainer.height = 0;
//	});
	
	chartContainer.paintSelected = function(){};
	if(!$.isArray(This.stage.chartContainers) ){
		This.stage.chartContainers = [];
	}
	This.stage.chartContainers.push(chartContainer);
	return chartContainer;
}


Hik.metadata.createTitleNode = function(chartIdx, text){
	var textNode = new JTopo.TextNode(text);
	textNode.font = 'bold 16px 微软雅黑';
	var childs = Hik.metadata.scene.childs;
	var minX = 10000, minY = 10000;
	var maxX = 0, maxY = 0;
	for(var i=0;i<childs.length;i++){
		if('MetaNode' == childs[i].elementType && chartIdx == childs[i].chartIdx){
			if(childs[i].x < minX){
				minX = childs[i].x;
			}
			if(childs[i].y < minY){
				minY = childs[i].y;
			}			
			if(childs[i].x > maxX){
				maxX = childs[i].x;
			}
			if(childs[i].y > maxY){
				maxY = childs[i].y;
			}
		}
	}
	textNode.setLocation(minX, minY - 20);
	
	Hik.metadata.scene.add(textNode);
	return textNode;
}

Hik.metadata.createTitleNode2 = function(x,y,text){
	var This = this;
	var node = new MDNode('chart_title');
	node.text = text;
	This.scene.add(node);
	return node;
}

Hik.metadata.createNode = function(intc){
	var This = this;
	var mdInstnace = intc.mdInstnace;
	var node = new MDNode(mdInstnace.classifier_id);
	node.id = mdInstnace.instance_id;
	node.text = Tool.ellipsis(mdInstnace.instance_name,20,2) ; // 文字
	node.data = intc;

	
//	node.dbclick(function(event){
//		//$("#wrapper").append('<div style="position:absolute;top:100px;left:100px;">' + node.text + '</div>');
//		if(!node.expanded){
//			This.getChildren(node);
//			node.expanded = true;
//		}else{
//			node.remove();
//			setTimeout(function(){
//				node.container && node.container.dispatchEvent("container-verticalSize", node.container);
//			},100);
//			node.expanded= false;				
//		}
//		
//		//JTopo.layout.layoutNode(Hik.metadata.scene, node, true);
//	});
	
//	node.click(function(event){
//		This.drawDepend(node);
//	});
	
	
	
	var pop = null;
	var mouseoverHandler = function(event){

	   var target = event.target;
	   var conHtml = ['<div class="popboxContent">',
	       '<div><span class="label">元数据编码：</span>'+ mdInstnace.instance_code +'</div>',
	       '<div class="odd"><span class="label">元数据名称：</span>'+ mdInstnace.instance_name +'</div>',
	       '<div><span class="label">上下文：</span>'+ mdInstnace.path +'</div>',
	   ];

	   var featureList = intc.featureList;
	   if($.isArray(featureList)){
		   for(var i=0;i<featureList.length;i++){
			   var feature = featureList[i];
			   var att_store = feature.mmFeatureCol.att_store.toLowerCase();
			   if(null != mdInstnace[att_store] && "" != mdInstnace[att_store]){
				   if(i%2 == 0){
					   conHtml.push('<div class="odd"><span class="label">'+ feature.att_name +'：</span>'+ mdInstnace[att_store] +'</div>');
				   }else{
					   conHtml.push('<div><span class="label">'+ feature.att_name +'：</span>'+ mdInstnace[att_store] +'</div>');
				   }
				   
			   }
			   
		   }
	   }	   
	   conHtml.push('</div>');
	   
	   if('TableMapping' == mdInstnace.classifier_id || 'ColumnMapping' == mdInstnace.classifier_id){
		   conHtml = ['<div class="popboxContent">',
		              '<div><span class="label">元数据编码：</span>'+ mdInstnace.instance_code +'</div>',
		              '</div>'];
	   }
	   pop =  $(this).popbox({
	            "isCreate":false,
	            boxClass: "sd_popbox",
	            content: conHtml.join(""),
	            //width:200,
	            //height:200,
	            "iconClass":"icon_ask",
	            //directing:{"top":20,"left":20},
	            zIndex:2000,
	            opacity: true,
	            direction:{
	           	  "popBoxT":event.pageY,	           	  
	              "popBoxL":event.pageX, 
	              "popBoxOffsetT": event.pageY,
	              "popBoxOffsetL":event.pageX
	            }	   
		});	
	   
//	   pop.popbox("setPos",{
//     	  "popBoxT":event.offsetTop,
//          "popBoxL":event.offsetLeft  
//	   });//这里重新定位
	}	
	
	node.click(mouseoverHandler);
	Hik.metadata.stage.addEventListener('mouseup', function(event){
		if(event.button == 2){// 右键
			if(null != pop){
				pop.popbox("close");
				pop = null;
			}
		}

	});

//	node.mouseover( );
//	
//	node.mouseout(function(event){
//		var position = pop.data("popbox").position;
//		if(position.popBoxL <= event.offsetX &&  event.offsetX <= (position.popBoxL + 200)
//			&& position.popBoxT<= event.offsetY && event.offsetY+7 <= (position.popBoxT + 200))
//		{
//			return ;
//		}else{
//			if(null != pop){
//				pop.popbox("close");
//				pop = null;
//			}
//					
//			
//		}
//
//		
//	}); 
	
	return node;
	
}


Hik.metadata.init = function(){
	var This = this;
	This.layout();
	if(!Hik.metadata.path || !Hik.metadata.classifier){
		alert("请传入正确的路径参数和classifier参数！");
	}
	This.getNodeByPath(Hik.metadata.path, Hik.metadata.classifier);	
	
};

/**
两个container区域碰撞检测函数，优化后的算法可以检测包含关系
*/
function isOverlap(objOne, objTwo) {
	var offsetOne = {left: objOne.x,top:objOne.y};
	var offsetTwo = {left: objTwo.x,top:objTwo.y};
    topOne=offsetOne.top,
    topTwo=offsetTwo.top,
    leftOne=offsetOne.left,
    leftTwo=offsetTwo.left,
    widthOne = objOne.width,
    widthTwo = objTwo.width,
    heightOne = objOne.height,
    heightTwo = objTwo.height;
	var leftTop = leftTwo > leftOne && leftTwo < leftOne+widthOne 
	        && topTwo > topOne && topTwo < topOne+heightOne,
	    rightTop = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne 
	        && topTwo > topOne && topTwo < topOne+heightOne,
	    leftBottom = leftTwo > leftOne && leftTwo < leftOne+widthOne 
	        && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne,
	    rightBottom = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne 
	        && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne;
	return leftTop || rightTop || leftBottom || rightBottom;

}

Hik.metadata.initSticklr = function(){
	
	$('#example-2').sticklr({
		showOn		: 'hover',
		stickTo     : 'right'
	}).css("top","8px");
	$('#example-2 .nav_ul li').each(function(inx,el){
		$(el).click(function(){
			//alert(Hik.metadata.stage.chartContainers[inx].getBound().top);
			//Hik.metadata.stage.setCenter(bound.left + (bound.right-bound.left)/2,(ccbound.top-35) + (bound.bottom-bound.top)/2 -35);	
			
			//动画
			var bound = Hik.metadata.stage.getBound();
			var ccbound = Hik.metadata.stage.chartContainers[inx].getBound();
			var oriCenterY = (bound.bottom-bound.top)/2;
			var finalCenterY = (ccbound.top-35) + (bound.bottom-bound.top)/2 -35;	
			var tempCenterY = oriCenterY;
			var si = setInterval(function(){
				if(finalCenterY > oriCenterY){
					tempCenterY = tempCenterY + 10;
					if(tempCenterY > finalCenterY){
						clearInterval(si);
					}
					Hik.metadata.stage.setCenter(bound.left + (bound.right-bound.left)/2, tempCenterY);
				}else{
					tempCenterY = tempCenterY - 10;
					if(tempCenterY < finalCenterY){
						clearInterval(si);
					}
					Hik.metadata.stage.setCenter(bound.left + (bound.right-bound.left)/2, tempCenterY);
				}
				
				
			},5);
		});
	});
}

$(document).ready(function(){
	
	var canvas = document.getElementById('lineage_canvas');			
	Hik.metadata.stage = new JTopo.Stage(canvas);
	Hik.metadata.scene = new JTopo.Scene();
	
	Hik.metadata.stage.add(Hik.metadata.scene);
//	Hik.metadata.stage.mousedrag(function(e){
//		var childs = Hik.metadata.scene.childs;
//		for(var i=0;i<childs.length;i++){
//			if('node' == childs[i].elementType && 1 == childs[i].cutLine){
//				var node = childs[i];
//				node.setLocation(node.x + e.dx, node.y);
//				console.log(node.x + "  " + node.y);
//			}
//
//		}	
//	})
	//显示工具栏
	showJTopoToobar(Hik.metadata.stage);
	Hik.metadata.init();
	//Hik.metadata.stage.centerAndZoom();
	Hik.metadata.initSticklr();
	
});


