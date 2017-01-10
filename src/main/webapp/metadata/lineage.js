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
	canvas.height=_h - $("#iconExample").height() - $("#notice").height();
};

Hik.metadata.getNodeByPath = function(path){
	var This = this;
	$.ajax({
		datatype: 'json',
		url : 'metadata/instance',
		data : {"path" : path},
		success : function(result) {
			
			if (Tool.isNotEmpty(result)) {
				
				//Hik.metadata.startNode = node;
				var container = This.createContainer();
				
				var node = This.createNode(result);
				//添加标题
				$("#title").text(node.text + "血缘图");
				//画分隔线
				newVerticalCutLine(node.x + node.width + 85);
				
				node.setLocation(30, 44); 
				This.scene.add(node);				
				container.add(node);			

				node.container = container;
				
				This.getDepend(node);
				//JTopo.layout.layoutNode(Hik.metadata.scene, Hik.metadata.startNode, true);
			} else {
			}
		},
		error : function() {
		}
	});	
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
				var anchor = null;
				if($.isArray(depends)){
					for(var dep in depends){
						This.getNode(depends[dep].to_instance_id,function(node){
							var container = This.createContainer();							
							fromNode.appendDepened(node);
							container.add(node);
							container.locAnchor = anchor;
							anchor = container;
							node.container = container;					
							//一直找依赖,直到没有依赖
							This.getDepend(node);
							
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
//		url : 'metadata/' + node.id + "/depended",
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
		console.log('c' + c._id);
		for(var i=0;i<childs.length;i++){
			if('container' == childs[i].elementType ){
				
				
				var container = childs[i];
				console.log('container.locAnchor' + container.locAnchor);
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

Hik.metadata.createNode = function(intc){
	var This = this;
	var mdInstnace = intc.mdInstnace;
	var node = new MDNode(mdInstnace.classifier_id);
	node.id = mdInstnace.instance_id;
	node.text = mdInstnace.instance_name; // 文字
	node.data = intc;
//	var level = mdInstnace.namespace.split("/").length - 1;	
	
	
	node.dbclick(function(event){
		//$("#wrapper").append('<div style="position:absolute;top:100px;left:100px;">' + node.text + '</div>');
		if(!node.expanded){
			This.getChildren(node);
			node.expanded = true;
		}else{
			node.remove();
			setTimeout(function(){
				node.container && node.container.dispatchEvent("container-verticalSize", node.container);
			},100);
			node.expanded= false;				
		}
		
		//JTopo.layout.layoutNode(Hik.metadata.scene, node, true);
	});
	
	node.click(function(event){
		This.drawDepend(node);
	});
	
	var pop = null;
	var mouseoverHandler = function(event){

	   var This = this;
	   var conHtml = [
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
	   
	   pop =  $(this).popbox({
	            "isCreate":true,
	            boxClass: "sd_popbox",
	            content: conHtml.join(""),
	            //width:200,
	            //height:200,
	            zIndex:2000,
	            opacity:true,
	            directing:{top:20,left:20},
	            //mouseOverDelay:true,
	            direction:{
	            	  "popBoxT":This.y + This.height,
	                  "popBoxL":This.x-4  
	            }	   	   
		});	
	   
	   pop.popbox("setPos",{
     	  "popBoxT":This.y + This.height,
          "popBoxL":This.x-4  
	   });//这里重新定位
	}	
//	node.mouseover(mouseoverHandler);
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
	if(!Hik.metadata.path){
		alert("请传入正确的路径参数！");
	}
	This.getNodeByPath(Hik.metadata.path);	
	
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


$(document).ready(function(){
	
	var canvas = document.getElementById('lineage_canvas');			
	Hik.metadata.stage = new JTopo.Stage(canvas);
	Hik.metadata.scene = new JTopo.Scene();

	Hik.metadata.stage.add(Hik.metadata.scene);
//
//	
	//显示工具栏
	showJTopoToobar(Hik.metadata.stage);
	Hik.metadata.init();

});


