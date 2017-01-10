Hik.metadata.ModelIcons = {
	'DataSource': 'metadata/image/metamodel/Schema.gif',	
	'Table': 'metadata/image/metamodel/Table.gif',
	'Column': 'metadata/image/metamodel/Column.gif',
	'Transformation': 'metadata/image/metamodel/ETLTransformer.gif',
	'TableMapping': 'metadata/image/metamodel/TableMapping.gif',
	'ColumnMapping': 'metadata/image/metamodel/ColumnMapping.gif',
	'SpagoBI_Chart': 'metadata/image/metamodel/Cognos8_Dashboard.gif',
	'SpagoBI_Report': 'metadata/image/metamodel/Congnos8_Report.gif',
	'SpagoBI_Model': 'metadata/image/metamodel/Cognos8_Model.gif',
	'SpagoBI_Dimension': 'metadata/image/metamodel/Cognos8_Dimension.gif',
	'SpagoBI_Measure': 'metadata/image/metamodel/Cognos8_Measure.gif',
	'default': 'metadata/image/metamodel/Column.gif'
}

//Hik.metadata.ModelColors = {
//	'SpagoBI_Chart': '249,173,73',
//	'SpagoBI_Report':'249,173,73',
//	'SpagoBI_Model': '69,182,127',
//	'SpagoBI_Dimension': '97,212,123',
//	'SpagoBI_Measure': '97,212,123',
//	'Table':'53,142,242',
//	'Column': '76,191,255',
//	'TableMapping':'53,142,242',
//	'ColumnMapping':'76,191,255',
//	'default':'210,210,210'
//}

Hik.metadata.ModelColors = {
		'SpagoBI_Chart': '249,173,73',
		'SpagoBI_Report':'249,173,73',
		'SpagoBI_DataItem':'249,173,73',
		'SpagoBI_Model': '69,182,127',
		'SpagoBI_Dimension': '69,182,127',
		'SpagoBI_Measure': '69,182,127',
		'Table':'53,142,242',
		'Column': '53,142,242',
		'TableMapping':'53,142,242',
		'ColumnMapping':'53,142,242',
		'default':'210,210,210'
	}


Hik.metadata.ModelSizes = {
		'SpagoBI_Chart': 55,
		'SpagoBI_Model': 55,
		'SpagoBI_Report': 55,
		'SpagoBI_Dimension': 40,
		'SpagoBI_Measure': 40,
		'Table':55,
		'Column': 40,
		'TableMapping':55,
		'ColumnMapping':40,
		'default':40
	}


var MDNode = function(classifier){
	var node = new JTopo.MetaNode('', Hik.metadata.ModelIcons[classifier] || Hik.metadata.ModelIcons['default']);  
	jQuery.extend(node, {
		id: null,
		children: [],
		parent: [],
		links:[],
		depended: [],
		expanded: false,
		data:null,
		constantCfg: {
			yMargin : 20,
			xMargin : 20,
			dependedXMargin: 270,
			dependedYMargin: 20
		},
		container: null,
		
		showChildren:function(){
			var This = this;
			for(var c in This.children){
				This.children[c].visible = true;
				//This.links[This.children[c]._id].visible = true;
				This.showLink(this,This.children[c] );
			}
		},
		hideChildren: function(){
			var This = this;
			for(var c in This.children){
				This.children[c].visible = false;
				//This.links[This.children[c]._id].visible = false;
				This.hideLink(this,This.children[c]);
			}		
		},
		showLink: function(from, to){
			var This = this;
			for(var i=0;i<This.links.length;i++){
				if(This.links[i].nodeA._id == from._id && This.links[i].nodeZ._id == to._id){
					This.links[i].visible = true;
				}				
			}					
		},
		hideLink: function(from,to){
			var This = this;
			for(var i=0;i<This.links.length;i++){
				if(This.links[i].nodeA._id == from._id && This.links[i].nodeZ._id == to._id){
					This.links[i].visible = false;
				}				
			}				
		},
		remove: function(){
			var This = this;
			var childs = Hik.metadata.scene.childs;
			for(var i=0;i<This.children.length;i++){
				Hik.metadata.scene.remove(This.children[i]);
				if(This.container){
					This.container.remove(This.children[i]);
				}
			}				
			This.children = [];
			
		},
		appendChild: function(child){
			var This = this;
			var last = This.children[This.children.length-1];
			if(null == last){ //如果还没有子节点,以父节点位置为锚
				child.setLocation(This.x + This.constantCfg.xMargin, This.y+This.height+This.constantCfg.yMargin);
			}else{ //以最后一个子节点位置为锚
				child.setLocation(last.x,last.y+last.height + This.constantCfg.yMargin);
			}
			This.children.push(child);

			newHeaderFoldLink(This, child);
			if(null != This.container){				
				This.container.add(child);
			}
		},
		appendDepened : function(child){
			var This = this;
			var last = This.depended[This.depended.length-1];
			if(null == last){ //如果还没有子节点,以父节点位置为锚
				child.setLocation(This.x + This.constantCfg.dependedXMargin, This.y);
			}else{ //以最后一个子节点位置为锚
				child.setLocation(last.x,last.y+last.height + This.constantCfg.dependedYMargin);
			}
			This.depended.push(child);		
			newLink(This,child);
		}
		
	});
	
	node.textPosition = 'Middle_Center';// 文字居中
	//defaultNode.textOffsetY = 8; // 文字向下偏移8个像素
	node.font = '14px 微软雅黑'; // 字体
	node.fontColor = '255,255,255';
	node.fillColor =  Hik.metadata.ModelColors[classifier] || Hik.metadata.ModelColors['default'];
	node.setSize(140, Hik.metadata.ModelSizes[classifier] || Hik.metadata.ModelSizes['default']);  // 尺寸
	node.borderRadius = 5; // 圆角
	node.borderWidth = 2; // 边框的宽度
	node.borderColor = '255,255,255'; //边框颜色			
	//node.alpha = 0.7; //透明度
	return node;
}
