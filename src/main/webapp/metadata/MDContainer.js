var MDContainer = function(){

	var container = new JTopo.Container('');
	container.dragable = 0;
	container.childDragble = 1;
	container.alpha = 0;
	//container.fillColor = '10,100,100';	
	jQuery.extend(container, {
		locAnchor: null, //位置锚
		constantCfg: {
			yMargin : 50,
			xMargin : 20
		},
		relocate: function(){ //以位置锚重新定位
			if(this.locAnchor){
				this.setLocation(this.locAnchor.x , this.locAnchor.y + this.locAnchor.height + this.constantCfg.yMargin) //当前只实现纵向位置重置
			}
		}
	});
	
	return container;
		
}