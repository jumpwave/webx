// 简单连线
function newLink(nodeA, nodeZ, text, dashedPattern){
	var link = new JTopo.Link(nodeA, nodeZ, text);	
	link.arrowsRadius = 10; //箭头大小
	link.lineWidth = 2; // 线宽
	link.dashedPattern = dashedPattern; // 虚线
	//link.bundleOffset = 60; // 折线拐角处的长度
	//link.bundleGap = 20; // 线条之间的间隔
	link.textOffsetY = 3; // 文本偏移量（向下3个像素）
	link.strokeColor = '255,174,0';
	Hik.metadata.scene.add(link);
	return link;
}

// 折线
function newFoldLink(nodeA, nodeZ, text, direction, dashedPattern){
	var link = new JTopo.FoldLink(nodeA, nodeZ, text);
	link.direction = direction || 'horizontal';
	link.arrowsRadius = 15; //箭头大小
	link.lineWidth = 2; // 线宽
	link.bundleOffset = 60; // 折线拐角处的长度
	link.bundleGap = 20; // 线条之间的间隔
	link.textOffsetY = 3; // 文本偏移量（向下3个像素）
	link.strokeColor = '255,174,0';
	link.dashedPattern = dashedPattern;
	Hik.metadata.scene.add(link);
	return link;
}
function newHeaderFoldLink(nodeA, nodeZ, text, direction, dashedPattern){
	var link = new JTopo.HeaderFoldLink(nodeA, nodeZ, text);
	link.direction = direction || 'vertical';
	//link.arrowsRadius = 5; //箭头大小
	link.lineWidth = .5; // 线宽
	link.bundleOffset = 60; // 折线拐角处的长度
	link.bundleGap = 20; // 线条之间的间隔
	link.textOffsetY = 3; // 文本偏移量（向下3个像素）
	link.strokeColor ='#F00'; // 线条颜色随机
	//link.dashedPattern = dashedPattern;
	Hik.metadata.scene.add(link);
	return link;
}
// 二次折线
function newFlexionalLink(nodeA, nodeZ, text, direction, dashedPattern){
	var link = new JTopo.FlexionalLink(nodeA, nodeZ, text);
	link.direction = direction || 'horizontal';
	link.arrowsRadius = 10;
	link.lineWidth = 2; // 线宽
	link.offsetGap = 35;
	link.bundleGap = 15; // 线条之间的间隔
	link.textOffsetY = 10; // 文本偏移量（向下15个像素）
	link.strokeColor = '255,174,0';
	link.dashedPattern = dashedPattern; 
	Hik.metadata.scene.add(link);
	return link;
}

// 曲线
function newCurveLink(nodeA, nodeZ, text){
	var link = new JTopo.CurveLink(nodeA, nodeZ, text);
	link.lineWidth = 3; // 线宽
	Hik.metadata.scene.add(link);
	return link;
}

//画纵向分隔线
function newVerticalCutLine(x,y){
	var node1 = new JTopo.Node();
	node1.alpha = 0;
	//node1.setImage('metadata/image/arrow1.png', true);
	node1.setLocation(x, 0);
	node1.dragable = 0;
	node1.showSelected = false; // 不显示选中矩形
	node1.cutLine = 1;

	Hik.metadata.scene.add(node1);

	var node2 = new JTopo.Node();
	node2.alpha = 0;
	//node2.setImage('metadata/image/arrow1.png', true);
	node2.setLocation(x,y);
	node2.dragable = 0;
	node2.showSelected = false; // 不显示选中矩形
	node2.cutLine = 1;
	Hik.metadata.scene.add(node2);		

	var link = new JTopo.Link(node1, node2, '');	
	link.removeAllEventListener();
	link.lineWidth = 4; // 线宽
	link.showSelected = false;
	link.dashedPattern = 5; // 虚线
	link.strokeColor = '243,243,243';
	link.paintSelected = function(){};
	Hik.metadata.scene.add(link);
	
	
	
}
