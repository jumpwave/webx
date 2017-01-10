(function ($) {

    var  treeOptions = {
        treeGrid : false,
        expandColumn : '',
        leafIcon : 'root-docu',
        parentIcon : 'root-close',
        expendPIcon : 'root-open',
        treeGridModel : {
            params : ['id']
        },
        rowMark : false,
        isFrozen : false,
        tristate : true,
        showLevel : 1
    },events = {
        'click|.grid-treeIcon' : 'addTreeRow',
        //'click|.ui-jqgrid-btable tr .button.chk' : 'toggleChecknode',
        'change|.ui-jqgrid-btable tr input' : 'toggleChecknode',//使用input的change事件避免和onTrSelect冲突
        'mouseenter mouseleave|.ui-jqgrid-btable tr .button.chk' : 'renderCheck',
        'change|.ui-jqgrid-btable td.jq-grid-multiselect [type=checkbox]': 'onTreeSelect'
    };

    $.extend(($.grid._classes || {}),{
       wrapClass: 'ui-jqgrid ui-tree-grid ui-widget ui-widget-content ui-corner-all'
    });

    $.grid.initExtend.push(function () {
        var settings = this.settings,colModel;
       if(settings.showHorizontalCheck){
           colModel = settings.colModel;
           for(var i = 0,len = colModel.length; i < len; i++){
               if(settings.expandColumn == colModel[i].name){
                   settings.colName.splice(i+1,0,language.text('treeGrid.operate'));
                   settings.colModel.splice(i+1,0,{name:'all',width : '80',fixed : true,resizAble : false,opcode : 0});
                   return;
               }
           }
       }
    },function(){
        var settings = this.settings,colModel,flag;
        if(settings.isFrozen){
            flag = 0;
            colModel = settings.colModel;
            for(var i = 0,len = colModel.length; i < len; i++){
                  if(colModel[i].frozen && !colModel[i+1].frozen ){
                      flag = i;
                      break;
                  }
            }
            settings.treeFrozenModal = colModel.slice(0,flag+1);
            settings.treeUnFrozenModal = colModel.slice(flag + 1);
        }
    });

    $.grid.domInitExtend.unshift(function(){
        var settings = this.settings,colModel,frozenWidth,length;
        if(settings.isFrozen){
            frozenWidth = 0;
            length = settings.treeFrozenModal.length;
            colModel = settings.colModel;
            for(var i = 0; i<length; i++){
                frozenWidth += parseInt(colModel[i].width) + (colModel[i].hidden ? 0 : settings.cellLayout);
                settings.frozenWidth =  frozenWidth;
            }
            this.frozenView = $('<div class="ui-grid-frozen-view" style="position: absolute;top: 0;left:0;width:'+frozenWidth +'px;"></div>');
            this.unFrozenView = $('<div class="ui-grid-unFrozen-view" style="position: absolute;top: 0;right:0;left:'+frozenWidth +'px;"></div>');
            this.view.append(this.frozenView).append(this.unFrozenView);
        }
    });

    $.extend($.grid.prototype,{
        addTreeRows : function(html,curTr){
            var elem = $(html.join(''));
            elem.insertAfter(curTr).show();
        },
        createRows : function(rows, rowData, m,level,colModel){
            if (!$.isArray(rows)) {
                rows = [rows];
            }
            if(!level)
                level = 0;
            var length = rows.length, settings = this.settings, colModel = colModel || settings.colModel,modelLength = colModel.length,
                i = 0, z, colval,additional = this.additionalCols,additionLength = additional.length, j,idr,childKey = settings.ajaxResponseReader.children || 'data',
                currentRow,childRow;

            for (; i < length; i++, m++) {
                z = 0;
                j =0;
                currentRow = rows[i];
                idr = this.createId(currentRow);
                this.viewTr(rowData, idr, 0,level);
                for (;z < additionLength;z++) {
                    colval = colModel[z];
                    additional[z].callback.call(this,rowData, idr, m, colval);
                    j++;
                }
                for (; j < modelLength; j++) {
                   this.viewCell(rowData, currentRow[colModel[j].name] || '', currentRow, colModel[j].formart, colModel[j],level);
                }
                this.viewTrEnd(rowData);
                childRow = currentRow[childKey];
                if(childRow && childRow.length){
                    this.createChildRows(childRow,rowData,level + 1,colModel);
                }
            }
        },
        createChildRows  : function(data,rowsHtml,level,colModel){
            var settings = this.settings,showCols = 0,colModel = colModel || settings.colModel;
            if(settings.showLevel && (level < settings.showLevel)){
                rowsHtml.push('<tr>');
            }else{
                rowsHtml.push('<tr style="display:none;">');
            }
            $.each(colModel,function(i,obj){
                if(!obj.hidden)
                    showCols++;
            });
            rowsHtml.push('<td colspan="',showCols ,'" style="border:none;">');
            rowsHtml.push('<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;table-layout: fixed;"><tbody>');
            rowsHtml.push(this.viewFirstRow(colModel).join(''));
            this.createRows(data,rowsHtml,0,level,colModel);
            rowsHtml.push('</tbody></table></td></tr>');
        },
        viewCell: function(rowdata, data, dataRow, fn, colModel,level) {
            var val = $.grid.dataFormart(data, dataRow, fn), style,id = this.id ,expandIcon = [],expandNode = val,colsData = dataRow.opcode,
                settings = this.settings,child = dataRow[settings.ajaxResponseReader.children || 'data'],treeNodeIcon;

            data = $.grid.stripHtml(data);
            if(colModel.name == settings.expandColumn){
                colModel.style = colModel.style ? colModel.style.textAlign = 'left' : {'textAlign':'left'} ;
                for(var i =0; i< level; i++){
                    expandIcon.push('<span class="treeGrid-indent"></span>');
                }
                
                if(child || dataRow.isParent || dataRow.allChilds > 0){ //判断是否是叶子
               		if(((level != undefined) && (level+1 < settings.showLevel) && !dataRow.__isExpand) || (dataRow.__isExpand && dataRow.allChilds > 0)){ //说明展开
               			if((child && child.length) || dataRow.allChilds > 0){
               				
               				if(dataRow.__isExpand == false){
               					treeNodeIcon = settings.parentIcon;
               				}else{
               					treeNodeIcon = settings.expendPIcon;
               					}
               				
               			}else{
               				treeNodeIcon = settings.leafIcon;
               				}
               	}else{
               		if(dataRow.__isExpand && dataRow.allChilds==0){
               		treeNodeIcon = settings.leafIcon;
               	}else{
               	treeNodeIcon = settings.parentIcon
               	}
               		
               	}
              	}else{//是
              		treeNodeIcon = settings.leafIcon;
              	}
                expandIcon.push( '<a href="javascript:void(0);" class="grid-treeIcon">',
                    '<span class="ui-icon ',treeNodeIcon,'"></span></a>');

                expandNode =  '<a class="treeGrid-cell"><span class="button ico-level'+(level < 3 ? level : 99)+'"></span><span>' + val + '</span></a>';
            }else if(settings.treeType == 'privilge'){
               if(this.selected){
                   //TODO 找到父亲节点，然后通过this.selected来重置子节点的选择情况---异步树 ,目前数据以后台为准
                   //tempArray = this.selected[this.active];
               }
                //这里测试出来，span标签的速度快于checkbox
                var isInArray =  false,isDisable = false;
                if(colsData && colModel.opcode){
                    for(var i = 0,len = colsData.length; i < len; i++){
                        if( /3|4/.test(colsData[i][colModel.opcode])){    //1正常不选中,2正常选中,3,不可选不选中，4不可选选中
                            isDisable = true;
                        }
                        if( /2|4/.test(colsData[i][colModel.opcode])){
                            isInArray = true;
                        }
                    }
                }
                if( this.changedNodes && this.changedNodes[dataRow.id] && this.changedNodes[dataRow.id]['opcode']){
                    if(typeof  this.changedNodes[dataRow.id]['opcode'][colModel.opcode] != 'undefined') {
                        isInArray  = this.changedNodes[dataRow.id]['opcode'][colModel.opcode];
                    }
                }else if(this.expandPId){
                    if(this.changedNodes && this.changedNodes[this.expandPId] && (typeof this.changedNodes[this.expandPId]['opcode'] != 'undefined')){
                        if(typeof this.changedNodes[this.expandPId]['opcode'][colModel.opcode] != 'undefined'){
                            isInArray =this.changedNodes[this.expandPId]['opcode'][colModel.opcode];
                            this.changedNodes[dataRow.id]  =  this.changedNodes[dataRow.id] || {id:dataRow.id};
                            if(this.changedNodes[dataRow.id]['opcode']){
                            } else{
                                this.changedNodes[dataRow.id]['opcode'] = {};
                            }
                            for(var props in this.changedNodes[this.expandPId]['opcode']){
                            	if(this.changedNodes[this.expandPId]['opcode'].hasOwnProperty(props)){
                            		this.changedNodes[dataRow.id]['opcode'][props] = this.changedNodes[this.expandPId]['opcode'][props];
                            		}	
                           	}
                        }
                    }
                }

                //将span换成checkbox
                expandNode =  '<input type="checkbox" ' + (isInArray ? 'checked = "checked" ': '') + (isDisable ? 'disabled="true"' : '') + 'data-group="'+ dataRow.id +'" data-code="'+ colModel.opcode +'" class="chk">';
                //expandNode =  '<span class="button chk checkbox_'+ (isInArray ? "true": "false") +'_'+ (isDisable ? "disable": "full")+ '" data-group="'+ dataRow.id +'" data-code="'+ colModel.opcode +'"></span>';
                if(colModel.opcode == 0){
                    expandNode += '<span style="display: inline-block;line-height:16px;vertical-align: middle;">'+language.text('treeGrid.selectall')+'</span>';
                }
                this.selected = this.selected || {};
                if(isInArray){
                    if(this.selected[dataRow.id]) {
                        this.selected[dataRow.id]['opcode'][colModel.opcode] = false;
                    }else{
                        this.selected[dataRow.id] = {"id":dataRow.id};
                        this.selected[dataRow.id]['opcode'][colModel.opcode] = false
                    }
                }else{
                    this.selected[dataRow.id] = this.selected[dataRow.id] || {"id" : dataRow.id,"opcode" : {}};
                }
            }
            style = this.setCellAttr(data, colModel);
            rowdata.push('<td role="gridcell" ',style,' aria-describedby="gd_', id , '_' , colModel.name ,'">', expandIcon.join('') ,expandNode
                ,'</td>');
        },
        viewTbody : function(){
            var settings = this.settings, tBody = [],that = this;
            if(settings.headerFixed){

                tBody.push("<div class='ui-jqgrid-bdiv ui-jqgrid-scroll' style='overflow: hidden;'>" +
                    "<div class='ui-grid-frozenbody-inner' style='padding-bottom:18px;'><table class='ui-jqgrid-btable' cellspacing= '0' cellpadding = '0' border = '0' style='width:"+
                    settings.frozenWidth +"px;' role='grid'>");
                tBody.push("<tbody>") ;
                tBody.push(this.viewFirstRow(settings.treeFrozenModal).join(''));
                tBody.push('</tbody></table></div></div>');
                this.frozenView.append(tBody.join(''));
                this.fbdiv = this.frozenView.find('.ui-jqgrid-bdiv');

                this.bdiv = $("<div class='ui-jqgrid-bdiv ui-jqgrid-scroll'></div>");
                this.bdiv.append(this.elem.css({width: (settings.tblwidth - settings.frozenWidth)}));
                //this.bdiv.append(this.elem);
                this.elem.append(this.viewFirstRow(this.settings.treeUnFrozenModal).join(''));
                this.bdiv.appendTo(this.unFrozenView);
                this.bdiv.topDis = 0;
                this.bdiv.leftDis = 0;
                var sibings = this.fbdiv[0],brothers = this.unFrozenView.find('.ui-jqgrid-frozen')[0];
                this.bdiv.scroll(function(){
                    if(this.scrollTop != that.bdiv.topDis){
                        that.bdiv.topDis =  this.scrollTop;
                        sibings.scrollTop = this.scrollTop;
                    }else if(this.scrollLeft != that.bdiv.leftDis) {
                        that.bdiv.leftDis =  this.scrollLeft;
                        brothers.scrollLeft = this.scrollLeft;
                    }
                });
            }
        },
        viewThead: function () {
            var settings = this.settings, tHead = [],colModel = settings.colModel;
            if(settings.isFrozen) {
                var tLength = settings.treeFrozenModal.length;
                settings.treeFrozenModal = colModel.slice(0,tLength);
                settings.treeUnFrozenModal = colModel.slice(tLength);
                if(settings.headerFixed){
                    var tHead2 = [];
                    tHead.push("<div class='ui-jqgrid-frozen'><table class='ui-jqgrid-htable' style='width:"+ settings.frozenWidth +"px;' role='grid'");
                    tHead.push(" aria-labelledby='gbox_"+this.id+"' cellspacing='0' cellpadding='0' border='0'>");
                    tHead.push("<thead>") ;
                    tHead.push(this.viewFirstRow(settings.treeFrozenModal).join(''))
                    tHead.push(this.viewHeaderTr(settings.treeFrozenModal).join(''));
                    tHead.push('</thead></table></div>');
                    this.frozenView.append(tHead.join(''));
                    this.hdiv = this.frozenView.find('.ui-jqgrid-frozen');
                    tHead2.push("<div class='ui-jqgrid-header-wrapper'><div class='ui-jqgrid-frozen'><table class='ui-jqgrid-htable' style='width:"+ (settings.tblwidth - settings.frozenWidth) +"px;' role='grid'");
                    tHead2.push(" cellspacing='0' cellpadding='0' border='0'>");
                    tHead2.push("<thead>") ;
                    tHead2.push(this.viewFirstRow(settings.treeUnFrozenModal).join('') );
                    tHead2.push(this.viewHeaderTr(settings.treeUnFrozenModal,settings.colName.slice(tLength)).join(''));
                    tHead2.push('</thead></table></div></div>');
                    //this.hdiv = $(tHead2.join('')); //把hdiv定义在这里的时候，滚动条联动的时候会出现这里的head总会滚到最左边
                    this.unFrozenView.append(tHead2.join(''));
                    this.viewTbody();
                }
            }else{
                if(!settings.headerFixed){
                    this.groupHeaderModel(tHead);
                    tHead.push(this.viewHeaderTr().join(''));
                    $('<thead>').appendTo(this.elem).append(tHead.join(''));
                }else{
                    tHead.push("<div class='ui-jqgrid-hTableBox' style='position: relative;padding: 0;overflow-x: hidden;border: none;'><table class='ui-jqgrid-htable' style='width:"+  settings.tblwidth +"px' role='grid'");
                    tHead.push(" aria-labelledby='gbox_"+this.id+"' cellspacing='0' cellpadding='0' border='0'>");
                    tHead.push("<thead>") ;
                    this.groupHeaderModel(tHead);
                    tHead.push(this.viewHeaderTr().join(''));
                    tHead.push('</thead></table></div>');
                    this.hdiv.append(tHead.join('')).insertBefore(this.elem);
                }
            }

            this.viewTable();
        },
        viewHeadWrap : function(){
            var settings = this.settings,headWrap = [],dir = settings.direction;
            if(settings.isFrozen){
            }else{
                headWrap.push("<div class='ui-state-default ui-jqgrid-hdiv' style='width:"+settings.tblwidth+"px'>");
                headWrap.push("<div class='ui-jqgrid-hbox" + (dir==="rtl" ? "-rtl" : "" )+"'>");
                headWrap.push('</div></div>');
                this.hdiv = $(headWrap.join(''));
            }

        },
        parseJsonData: function (data) {
            var settings = this.settings, rows = data.rows, rowData = [], rowData2 = [],page = data.page,
                 firstTr, firstTr2,table, table2,maxHeight = 0,pHeight = 0, trHeight = 28,checkall;
            if(settings.isFrozen){
                this.createRows(rows, rowData, 0,0,settings.treeFrozenModal);
                table = this.fbdiv.find('table.ui-jqgrid-btable').find('tbody');
                if(table.length > 1){
                    table = table.eq(0);
                }
                firstTr = table.find('tr:first')[0].outerHTML;
                rowData.unshift(firstTr);
                table.empty().append(rowData.join(''));
                this.createRows(rows, rowData2, 0,0,settings.treeUnFrozenModal);
                table2 = this.bdiv.find('#' + this.id).find('tbody');
                if(table2.length > 1){
                    table2 = table2.eq(0);
                }
                firstTr2 = table2.find('tr:first')[0].outerHTML;
                rowData2.unshift(firstTr2);
                table2.empty().append(rowData2.join(''));


                if(rows.length > 0)
                    trHeight = table.height()/rows.length;
                this.trHeight = trHeight;

                maxHeight = this.wrap.parent().height();
                if (this.wrap.parent()[0].scrollHeight < maxHeight) //某些情况，scrollHeight<clientHeight
                    maxHeight = this.wrap.parent()[0].scrollHeight;

                if (settings.pagerButtons) {
                    pHeight = this.dpage.height();
                }
                var extraHeight = 0;
                if(this.extraEl){
                    for(var i = 0,len = this.extraEl.length; i < len; i++){
                        extraHeight += this.extraEl[i][0].clientHeight;
                    }
                }
                if (settings.pagerFixed) {
                    if (!isNaN(settings.height)) {   //具体的数字
                        //this.wrap.css('height', parseInt(settings.height, 10) + this.hdiv.height() + pHeight + extraHeight);
                        this.wrap.css('height',settings.height);
                        this.bdiv.css('height',settings.height - this.hdiv.height() - pHeight - extraHeight);
                        this.fbdiv.css('height',settings.height - this.hdiv.height() - pHeight - extraHeight);
                    } else {  //100%和auto的情况（这两种情况等同），这种情况下父亲必须有高度
                        maxHeight = this.wrap.parent().height();
                       // this.wrap.parent().css('overflow','hidden');//这个设置的原因是，之前高度溢出的时候会出现横向滚动条导致分页的位置计算出错
                        this.wrap.css('height','100%');
                        this.bdiv.css('height', maxHeight - this.hdiv.height() - pHeight -  extraHeight);
                        this.fbdiv.css('height', maxHeight - this.hdiv.height() - pHeight -  extraHeight);
                    }
                } else {
                    if (!isNaN(settings.height)) {  //具体的数字
                        //this.wrap.css('height', parseInt(settings.height, 10) + this.hdiv.height());
                        this.wrap.css('height',settings.height);
                        this.bdiv.css('height',settings.height - this.hdiv.height() - extraHeight);
                    } else {  //100%和auto的情况（这两种情况等同），分情况对象
                        if (settings.height == 'auto') {
                            this.wrap.css('height', settings.height);
                        } else {
                            maxHeight = this.wrap.parent().height();
                            this.bdiv.css('height', maxHeight - this.hdiv.height() - pHeight);
                            table.css('height',maxHeight - this.hdiv.height() - pHeight);
                        }
                    }

                }

                if(this.bdiv.width() < this.bdiv.find('#' + this.id).width()){
                    this.unFrozenView.find('.ui-jqgrid-frozen').css('margin-right','18px');
                }

            }else{
                this.createRows(rows, rowData, (page-1)*settings.rowNum + 1);
                //if pagerFixed ,table is not unique
                table = this.bdiv.find('#' + this.id + ' tbody');
                if(table.length > 1){
                    table = table.eq(0);
                }
                firstTr = table.find('tr:first');

                //防止分页跳转时，上一次的全选状态需要重置
                checkall = this.hdiv.find('[aria-checkall=true]');
                if(checkall.length && (checkall.prop('checked') == 'checked')){
                    checkall.removeAttr('checked');
                }
                table.empty().append(firstTr).append(rowData.join(''));
                if(rows.length > 0)
                    trHeight = table.height()/rows.length;
                this.trHeight = trHeight;

                maxHeight = this.wrap.parent().height();
                if (this.wrap.parent()[0].scrollHeight < maxHeight) //某些情况，scrollHeight<clientHeight
                    maxHeight = this.wrap.parent()[0].scrollHeight;

                if (settings.pagerButtons) {
                    pHeight = this.dpage.height();
                }
                var extraHeight = 0;
                if(this.extraEl){
                    for(var i = 0,len = this.extraEl.length; i < len; i++){
                        extraHeight += this.extraEl[i][0].clientHeight;
                    }
                }
                if (settings.pagerFixed) {
                    if (!isNaN(settings.height)) {   //具体的数字
                        //this.wrap.css('height', parseInt(settings.height, 10) + this.hdiv.height() + pHeight + extraHeight);
                        this.wrap.css('height',settings.height);
                        this.bdiv.css('height',settings.height - this.hdiv.height() - pHeight - extraHeight);
                    } else {  //100%和auto的情况（这两种情况等同），这种情况下父亲必须有高度
                        maxHeight = this.wrap.parent().height();
                        this.wrap.parent().css('overflow','hidden');//这个设置的原因是，之前高度溢出的时候会出现横向滚动条导致分页的位置计算出错
                        this.wrap.css('height','100%');
                        this.bdiv.css('height', maxHeight - this.hdiv.height() - pHeight -  extraHeight);
                    }
                } else {
                    if (!isNaN(settings.height)) {  //具体的数字
                        //this.wrap.css('height', parseInt(settings.height, 10) + this.hdiv.height());
                        this.wrap.css('height',settings.height);
                        this.bdiv.css('height',settings.height - this.hdiv.height() - extraHeight);
                    } else {  //100%和auto的情况（这两种情况等同），分情况对象
                        if (settings.height == 'auto') {
                            this.wrap.css('height', settings.height);
                        } else {
                            maxHeight = this.wrap.parent().height();
                            this.bdiv.css('height', maxHeight - this.hdiv.height() - pHeight);
                            table.css('height',maxHeight - this.hdiv.height() - pHeight);
                        }
                    }

                }
                if (settings.showZebraCrossing) {
                    var tableH = maxHeight - this.hdiv.height() - pHeight, emptyTr = (tableH - table.height()) / trHeight, emptyRows = [];
                    if (settings.showZebraCrossing) {
                        for (var i = 0; i < Math.floor(emptyTr); i++) {
                            this.createEmptyRows(emptyRows, trHeight, !((rows.length + i) % 2 == 0));
                        }
                    }
                    table.append(emptyRows.join(''));
                }

                this.transferRowsData(data);

                this.viewPagerNum(data);
            }

        },
        viewTable: function () {
            var settings = this.settings,firstRow = [];
            if(settings.isFrozen){
                this.viewResizeMark();
                //firstRow.push(this.viewFirstRow(settings.treeFrozenModal));
            }else{
                this.elem.width(settings.tblwidth);
                this.elem.attr({cellspacing:"0",cellpadding:"0",border:"0","role":"grid"});
                this.viewResizeMark();
                firstRow.push(this.viewFirstRow(settings.colModel));
                $('<tbody>').appendTo(this.elem).append(firstRow.join(''));
                this.viewhDiv();
            }
        },
        expandTreeNode : function(data,level,curTr){
            var html = [],html2= [],trId = curTr.attr('id'),parentId = this.transToId(trId),settings = this.settings;
            if(settings.isFrozen){
                this.createChildRows(data,html, level + 1,settings.treeFrozenModal);
                this.addTreeRows(html,curTr);
                this.createChildRows(data,html2, level + 1,settings.treeUnFrozenModal);
                this.addTreeRows(html2,this.bdiv.find('#' + trId));
            }else{
                this.createChildRows(data,html, level + 1);
                this.addTreeRows(html,curTr);
            }
            var parentObj = this.fetchDataById(parentId),childKey = settings.ajaxResponseReader.children || 'data';
            parentObj[childKey] = data;
           // this._pageData.rows.push(data);
            settings.data.push(data);
            this.activeId =  parentId;
            this.updateKeyIndex(data);
        },
        updateKeyIndex : function(data){
               for(var i = 0,len = data.length; i< len; i++){
                   this._keyIndex[data[i][this._key]] = this._keyIndex[this.activeId];
               }
        },
       setChildState : function($curTr,index,isCheck){
            var childTrs = $curTr.find('tr'),that = this;
           childTrs.each(function(){
               var target = $(this).children().eq(index).find('.chk');
               if(target.length) {
                   that.toggleCheckboxState(target[0],index,isCheck);
               }

           })
        },
        getSelectById : function(id){
              if(this.selected){
                 for(var prop in this.selected){
                     if(id == prop)
                        return this.selected[prop];
                 }
              }
        },
        fetchDataById: function(id){
           var realId = this.transToId(id),keyIndex = this.getGridDataIndex(realId),pageData = this._pageData.rows,childKey = this.settings.ajaxResponseReader.children || 'data';
            var getNode = (function f(data,id){
               if(Object.prototype.toString.call(data) == '[object Array]'){
                   for(var i = 0,len = data.length; i < len; i++){
                       if(data[i]['id']== id){
                           return data[i];
                       } else if(data[i][childKey] && data[i][childKey].length){
                           var res = f(data[i][childKey],id);
                           if(res)
                               return res;
                       }
                   }
               }else{
                   if(data.id == id)
                    return data;
                   else if(data[childKey] && data[childKey].length){
                       var result = f(data[childKey],id);
                       if(result)
                            return result;
                   }
               }

            })
            return getNode(pageData[keyIndex],realId);
        },
        setParentState : function(parentTr,index,isCheck){
            var target = parentTr.children().eq(index).find('.chk'),level = parseInt(parentTr.attr('data-level'),10),trId = parentTr.attr('id'),
                parentObj = this.fetchDataById(trId),state = 'part',childKey = this.settings.ajaxResponseReader.children || 'data';

            parentObj[index] = parentObj[index] || {};
            if(isCheck){
                if(!parentObj[index].checkedNodes){
                    parentObj[index].checkedNodes = 1;
                }else{
                    ++parentObj[index].checkedNodes;
                }
            }else{
                --parentObj[index].checkedNodes;
            }


            if(parentObj[index].checkedNodes == 0){
                state = false;
            } else if(parentObj[index].checkedNodes == parentObj[childKey].length){
                state = true;
            }
            this.toggleCheckboxState(target[0],index,state);
            if(level > 0){
                this.setParentState(parentTr.parents('tr').eq(0).prev(),index,isCheck);
            }
        },
        addSelect : function($target){
            var group = $target.attr('data-group'),code = $target.attr('data-code'),selects = this.getSelectById(group);

            this.changedNodes = this.changedNodes || {};
            if(!selects){
                this.selected[group] = {"id" : group,"opcode" : [code]};
                this.selected[group]['opcode'][code] = true;
            } else{
                selects['opcode'][code] = true;
            }

           if(this.changedNodes[group]){
               this.changedNodes[group]['opcode'] = this.changedNodes[group]['opcode'] || {};
               this.changedNodes[group]['opcode'][code] = true;
           }else{
               this.changedNodes[group] = {};
               this.changedNodes[group] = {"id" : group,"opcode" : {}}
               this.changedNodes[group]['opcode'][code] = true;
           }
        },
        removeSelect : function($target){
            var group = $target.attr('data-group'),selects = this.getSelectById(group),code = $target.attr('data-code');
            this.changedNodes = this.changedNodes || {};
            if(selects){
                for(var prop in selects['opcode']){
                      if(prop == code) {
                          //selects['opcode'].splice(i,1);
                          delete selects['opcode'][prop];
                          if(this.changedNodes[group]){
                              this.changedNodes[group]['opcode'] = this.changedNodes[group]['opcode'] || {};
                              this.changedNodes[group]['opcode'][code] = false;
                          }else{
                              this.changedNodes[group] = {};
                              this.changedNodes[group] = {"id" : group,"opcode" : {}}
                              this.changedNodes[group]['opcode'][code] = false;
                          }
                          return;
                      }
                }
            }
        },
        toggleCheckboxState : function(target,index,flag){
            this.selected = this.selected || {},$target = $(target),
                trId = $target.closest('tr').attr('id'),currentObj = this.fetchDataById(trId),childKey = this.settings.ajaxResponseReader.children || 'data',
            classNm = target.className;
            if(/disable/gi.test(classNm) ||  $target.attr('disbaled')){
                return;
            }
//            if(flag == true){
//                if(/false/gi.test(classNm)){
//                    target.className = classNm.replace(/false/gi,'true');
//                    this.addSelect($target);
//                }else if(/part/gi.test(classNm)){
//                    //target.className = target.className.replace(/part/gi,'full');
//                    this.addSelect($target);
//                }
//                currentObj[index] = currentObj[index] || {};
//                currentObj[index].checkedNodes = currentObj[childKey] ? currentObj[childKey].length : 0;
//
//            }else if(flag == false){
//                if(/true/gi.test(classNm)){
//                    target.className = classNm.replace(/true/gi,'false');
//                    this.removeSelect($target);
//                }else if(/full/gi.test(classNm)){
//                    //target.className = target.className.replace(/full/gi,'part');
//                    this.removeSelect($target);
//                }
//            }else if(flag == 'part'){
//                if(!/true_part/gi.test(classNm)){
//                   // target.className =  target.className.replace(/false/gi,'true').replace(/full/gi,'part');
//                }
//            }else{
//                if(/true/gi.test(classNm)){
//                    target.className = classNm.replace(/true/gi,'false');
//                    this.removeSelect($target);
//                    currentObj[index] =  currentObj[index] || {};
//                    currentObj[index].checkedNodes =0;
//                    return false;
//                }else{
//                    currentObj[index] = currentObj[index] || {};
//                    currentObj[index].checkedNodes = currentObj[childKey] ? currentObj[childKey].length : 0;
//                    this.addSelect($target);
//                    target.className = classNm.replace(/false/gi,'true');
//                    return true;
//                }
//            }
            if(flag == true){
                $target.attr('checked','checked');
                this.addSelect($target);
            }else if(flag == false){
                $target.removeAttr('checked');
                this.removeSelect($target);
            }else{
                if($target.attr('checked') == 'checked'){
                    this.addSelect($target);
                    currentObj[index] =  currentObj[index] || {};
                    currentObj[index].checkedNodes =0;
                    return true;
                }else{
                    this.removeSelect($target);
                    currentObj[index] = currentObj[index] || {};
                    currentObj[index].checkedNodes = currentObj[childKey] ? currentObj[childKey].length : 0;
                    return false;
                }
            }

        },
        checkHorizontal : function(target,flag){
            var $target = $(target),tr = $target.closest('tr'),
               // childSpan = tr.find('span.chk'),
                childSpan = tr.find('input.chk'),//使用input替换span标签
                that = this,
                classNm = target.className;
//            if(flag == true){
//                if(/false/gi.test(classNm)){
//                    target.className = classNm.replace(/false/gi,'true');
//                    childSpan.each(function(index){
//                        if($(this).attr('data-code') != '0'){
//                            that.toggleCheckboxState(this,index,true);
//                        }
//                    })
//                }
//            }else if(flag == false){
//                    target.className = classNm.replace(/true/gi,'false');
//                    childSpan.each(function(index){
//                        if($(this).attr('data-code') != '0'){
//                            that.toggleCheckboxState(this,index,false);
//                        }
//                    })
//                    return false;
//            }else{
//                if(/false/gi.test(classNm)){
//                    target.className = classNm.replace(/false/gi,'true');
//                    childSpan.each(function(index){
//                        if($(this).attr('data-code') != '0'){
//                            that.toggleCheckboxState(this,index,true);
//                        }
//                    })
//                    return true;
//                }else if(/disable/gi.test(classNm)){
//                      return false;
//                }else{
//                    target.className = classNm.replace(/true/gi,'false');
//                    childSpan.each(function(index){
//                        if($(this).attr('data-code') != '0'){
//                            that.toggleCheckboxState(this,index,false);
//                        }
//                    })
//                    return false;
//                }
//            }
           if(flag == true){
               childSpan.each(function(index){
                   if($(this).attr('data-code') != '0'){
                       that.toggleCheckboxState(this,index,true);
                   }
               })
               $target.attr('checked','checked');
               return true;
           } else if(flag == false){
               childSpan.each(function(index){
                   if($(this).attr('data-code') != '0'){
                       that.toggleCheckboxState(this,index,false);
                   }
               })
               $target.removeAttr('checked');
               return false;
           }else{
               if($target.attr('checked') == 'checked'){
                   childSpan.each(function(index){
                       if($(this).attr('data-code') != '0'){
                           that.toggleCheckboxState(this,index,true);
                       }
                   })
                   return true;
               } else{
                   childSpan.each(function(index){
                       if($(this).attr('data-code') != '0'){
                           that.toggleCheckboxState(this,index,false);
                       }
                   })
                   return false;
               }
           }

        },
        populate: function (target) {
            var settings = this.settings, dataType = settings.dataType, pdata;
             this.selected = {};
            this.changedNodes = {};
            this.visibleData = [];
            this.populateInt();
            if (dataType == 'local') {
                this.beginReq();
                pdata = this.localDataFormart();
                this.parseJsonData(pdata);
                this.updatapager(pdata);
                this.setDataTip();
                this.endReq(target);
            } else if (dataType == 'ajax' || dataType == 'json') {
                this.ajaxDataFormart(target);
            }
        }
    });

    $.extend($.grid || {},{
        addTreeRow : function(event,obj){
            var $curTr = this.closest('tr'),trId = $curTr.attr('id'),id=obj.transToId(trId),target = event.target,classNm = target.className,
                nextTr = $curTr.next(), level = nextTr.attr('data-level'),$target = $(target),settings = obj.settings;
            if(classNm == 'grid-treeIcon'){
                $target = $target.find('span');
                classNm = $target[0].className;
            }
            obj.expandPId = id;
            if(classNm.indexOf(settings.leafIcon) > -1) //子节点
                return;
            else if(classNm.indexOf(settings.parentIcon) > -1){    //展开
                $target.removeClass(settings.parentIcon).addClass(settings.expendPIcon);
                if(settings.dataType == 'local'){
                    if(settings.isFrozen){
                        nextTr.show();
                        obj.unFrozenView.find('#' + obj.id + ' tbody tr').eq(nextTr.index()).show();
                    }else{
                        nextTr.show();
                    }

                }else if(settings.dataType == 'ajax'){
                    if((nextTr.length== 0) || nextTr.attr('data-level')){ //子节点已经展示出来过了
                        $.ajax({
                            url : obj.settings.url,
                            dataType : 'json',
                            data : {id : id},
                            success : function(data){
                                var lev = parseInt($curTr.attr('data-level'),10);
                                if(data.length == 0){
                                    $target.removeClass(settings.expendPIcon).addClass(settings.leafIcon);
                                }else{
                                    obj.expandTreeNode.apply(obj,[data,lev,$curTr]);
                                }

                                if(obj.unFrozenView.find('#' + obj.id).height() > obj.bdiv.height()){
                                    var btable =obj.unFrozenView.find('.ui-jqgrid-frozen');
                                    btable.css({
                                        "margin-right": '18px'
                                    });
                                }
                            }
                        });
                    }else{
                        if(settings.isFrozen){
                            nextTr.show();
                            obj.unFrozenView.find('#' + trId).next().show();
                        }else{
                            nextTr.show();
                        }
                    }
                }

                if(obj.unFrozenView.find('#' + obj.id).height() > obj.bdiv.height()){
                    var btable =obj.unFrozenView.find('.ui-jqgrid-frozen');
                    btable.css({
                        "margin-right": '18px'
                    });
                }
            }else{  //合并
                $target.removeClass(settings.expendPIcon).addClass(settings.parentIcon);
                nextTr.hide();
                obj.unFrozenView.find('#' + trId).next().hide();
                if(obj.unFrozenView.find('#' + obj.id).height() <= obj.bdiv.height()){
                    var btable2 =  obj.unFrozenView.find('.ui-jqgrid-frozen');
                    btable2.css({
                        "margin-right": "0"
                    });
                }
            }
            obj.changeMarkAndView();
            return false;
        },
        onTreeSelect : function(event, obj){
            var el = $(this), tr = $.grid.getThObj(el).el;
            if(el[0].checked){
                tr.find('.chk').each(function(){
                     obj.toggleCheckboxState.apply(obj,[this,true]);
                });
            }else{
                tr.find('.chk').each(function(){
                    obj.toggleCheckboxState.apply(obj,[this,false]);
                });
            }
        },
        onThMouseenter: function (event,obj) {
            var el = $(this),id = el.attr('id');
            if (!el.hasClass('ui-state-disabled') && el.find('tr').length == 0) {
                el.addClass($.grid._classes.hoverClass);
                obj.wrap.triggerHandler('onTrMouseenter',[el,obj]);
            }

            if(obj.settings.isFrozen){
                obj.frozenView.find('#' +  id).addClass($.grid._classes.hoverClass);
                obj.unFrozenView.find('#' +  id).addClass($.grid._classes.hoverClass);
            }
        },
        /**@ignore*/
        onThMouseleave: function (event,obj) {
            var el = $(this),id = el.attr('id');
            if (!el.hasClass('ui-state-disabled')) {
                el.removeClass($.grid._classes.hoverClass);
                obj.wrap.triggerHandler('onTrMouseleave',[el,obj]);
            }

            if(obj.settings.isFrozen){
                obj.frozenView.find('#' +  id).removeClass($.grid._classes.hoverClass);
                obj.unFrozenView.find('#' +  id).removeClass($.grid._classes.hoverClass);
            }
        },
        getThObj: function (el,obj) {
            var tagname;
            el = el.is('tr, th') ? el : el.closest('tr, th');
            tagname = el.get(0).tagName;
            if(obj.settings.isFrozen && el.closest('.ui-grid-unFrozen-view').length){
                return {
                    index: el.parent().find(tagname).index(el),
                    el: el
                }
            } else{
                return {
                    index: el.parent().find(tagname).index(el),
                    el: el
                }
            }

        },
        toggleChecknode : function(event,obj){
            var target = event.target,$curTr = this.closest('tr'),childT =$curTr.next().find('table'),level = parseInt($curTr.attr('data-level'),10),
                index = $(target).parent().index(),result;
            if($(target).attr('data-code') == 0){
                result = obj.checkHorizontal.apply(obj, [target]);
                if (childT.length && obj.settings.tristate) {
                    childT.find('tr').each(function () {
                        var target2 = $(this).find('[data-code= "0"]');
                        if (target2.length) {
                            obj.checkHorizontal.apply(obj, [target2[0], result]);
                        }
                    });
                }
            }else{
                result = obj.toggleCheckboxState.apply(obj,[target,index]);
                if(childT.length && obj.settings.tristate)
                    obj.setChildState.apply(obj,[childT,index,result]);
//                if(level > 0){    //保留父亲联动的代码，勿删wqy
//                    parentTr = $curTr.parents('tr').eq(0).prev();
//                    obj.setParentState.apply(obj,[parentTr,index,result]);
//                }
            }

            if(result){//用户输入选中状态

            }

           // return false;   ie8下面会导致无法选中

        },
        renderCheck : function(event){
            var target = event.target;
            if(/focus/gi.test(target.className)){
                target.className = target.className.replace(/_focus/gi,'');
            }else if(/disable/gi.test(target.className)){
               // return;
            }else{
                target.className = target.className + '_focus';
            }
        },
        onGridResize : function(width , height){
            var settings = this.settings, elem = $([]), colModel = settings.colModel,unfrozenWidth=0;
            width = parseInt(width);
            this.settings.width = width;
            if (isNaN(width)) {
                return
            }

            if(settings.isFrozen){
                elem.add(this.wrap).width(width);
                $.each(colModel, function (i) {
                    colModel[i].width = colModel[i].widthOrg;
                });
                this.bdiv.find(this.id).width(width - settings.scrollWidth);
                this.setColWidth();
                for(var i =0,len = settings.treeUnFrozenModal.length; i<len; i++){
                	unfrozenWidth = unfrozenWidth + settings.treeUnFrozenModal[i].width;
                }
                var htable = this.unFrozenView.find('.ui-jqgrid-htable'),btable=this.unFrozenView.find('table'),bheight;
              	
              	btable.each(function(){
              		var $this = $(this);
              		$this .find('tr:first td').each(function (i) {
                    var el = $(this);
                    el.width(settings.treeUnFrozenModal[i].width);
                });
              	});
                
                htable.width(unfrozenWidth);
                this.bdiv.find('.ui-jqgrid-btable').width(unfrozenWidth);

                this.wrap.height(height);
                bheight = height - this.hdiv.height();
                this.fbdiv.height(bheight);
                this.bdiv.height(bheight);
            }else{

                elem.add(this.wrap)
                    .add(this.bdiv)
                    .add(this.hdiv)
                    .add(this.dpage).width(width);
                $.each(colModel, function (i) {
                    colModel[i].width = colModel[i].widthOrg;
                });
                this.bdiv.find(this.id).width(width - settings.scrollWidth);
                if(settings.pagerButtons && !settings.pagerFixed){
                    this.dpage.width(width - settings.scrollWidth);
                }

                var bTable =  this.bdiv.find('#' + this.id);

                this.setColWidth();

                this.wrap.find('.ui-jqgrid-htable')
                    .add(bTable)
                    .width(settings.tblwidth);
                this.hdiv.find('td').each(function (i) {
                    var el = $(this);
                    el.width(colModel[i].width);
                });
                bTable.find('tr:first td').each(function (i) {
                    var el = $(this);
                    el.width(colModel[i].width);
                });

                var extraHeight = 0;
                if(this.extraEl){
                    for(var i = 0,len = this.extraEl.length; i < len; i++){
                        extraHeight += this.extraEl[i][0].clientHeight;
                    }
                }
                if(this.fhdiv){
                    this.fhdiv.find('.ui-jqgrid-htable')
                        .width(1);
                }
                if((settings.height == '100%' || settings.height == 'auto') && height){   //height不能设为为100%，这样会出bug
                    var tableH = this.bdiv.find('tr.jqgrow').not('.'+classes.zebraTrcss).length,
                        bdivH = height - this.hdiv.height()- ((settings.pagerButtons && settings.pagerFixed) ? this.dpage.height() : 0),emptyH,emptyL,exsitEmpty,balance,emptyRows=[];
                    this.bdiv.css('height',bdivH + 2 - extraHeight);
                    if(settings.showZebraCrossing){
                        emptyH = bdivH - tableH*this.trHeight;
                        if(emptyH <= 0){
                            this.bdiv.find('tr.' + classes.zebraTrcss).remove();
                        }else{  //有可能缩小或者放大

                            emptyL =  Math.floor(emptyH/this.trHeight);
                            exsitEmpty = this.bdiv.find('.' + classes.zebraTrcss);
                            balance =  emptyL - exsitEmpty.length;
                            if(balance > 0){ //页面由小变大的情况
                                for (var i = 0; i < balance; i++) {
                                    this.createEmptyRows(emptyRows, this.trHeight, !((tableH + exsitEmpty.length + i) % 2 == 0));
                                }
                                bTable.find('tbody').append(emptyRows.join(''));
                            }else{  //页面由大变小的情况
                                for(var i=emptyL; i >= emptyL + balance ; i--){
                                    exsitEmpty.eq(i-1).remove();
                                }
                            }
                        }
                    }

                } else{
                    if(settings.pagerButtons && settings.pagerFixed)  {
                        // this.wrap.css('height', parseInt(settings.height, 10) + extraHeight + this.hdiv.height() + this.dpage.height());
                        this.wrap.css('height',settings.height);
                        this.bdiv.css('height',settings.height - this.hdiv.height() - this.dpage.height() - extraHeight);
                    }else if(settings.pagerButtons && !settings.pagerFixed){
                        // this.wrap.css('height', parseInt(settings.height, 10) + extraHeight + this.hdiv.height());
                        this.wrap.css('height', settings.height);
                        this.bdiv.css('height',settings.height - this.hdiv.height()- extraHeight);
                    }
                }
            }

        },
        onTrSelect : function(event,obj){
           var settings = obj.settings;
            if(settings.isFrozen){
                if(/chk/gi.test(event.target.className)){  //避免input点击事件和行选中事件冲突
                    return true;
                }
                var el = $(this), tr = $.grid.getThObj(el,obj).el,isFrozen = tr.closest('.ui-grid-frozen-view').length;
                obj.preActiveTr = obj.curActiveTr;
                tr.toggleClass('ui-state-highlight');
                if(/ui-state-highlight/gi.test(tr[0].className)){
                    obj.curActiveTr = tr;
                    if(obj.preActiveTr && (obj.preActiveTr.attr('id') != obj.curActiveTr.attr('id'))){
                        obj.preActiveTr.removeClass('ui-state-highlight');
                        if(obj.preActiveTr.closest('.ui-grid-frozen-view').length){
                            obj.unFrozenView.find('#' + obj.preActiveTr.attr('id')).removeClass('ui-state-highlight');
                        }else{
                            obj.frozenView.find('#' + obj.preActiveTr.attr('id')).removeClass('ui-state-highlight');
                        }
                    }

                    if(isFrozen){
                        obj.unFrozenView.find('#' + tr.attr('id')).addClass('ui-state-highlight');
                    }else{
                        obj.frozenView.find('#' + tr.attr('id')).addClass('ui-state-highlight');
                    }

                }else{

                    if(obj.preActiveTr){
                        if(obj.preActiveTr.closest('.ui-grid-frozen-view').length){
                            obj.unFrozenView.find('#' + obj.preActiveTr.attr('id')).removeClass('ui-state-highlight');
                        }else{
                            obj.frozenView.find('#' + obj.preActiveTr.attr('id')).removeClass('ui-state-highlight');
                        }
                    }
                    obj.curActiveTr = null;
                    obj.preActiveTr = null;
                }

                return false;
            }else{
                if(obj.settings.multiSelSingle && event.target.type != 'checkbox'){
                    var el = $(this), tr = $.grid.getThObj(el).el, isCheck = el.attr('aria-selected') === 'true';
                    if (isCheck) {
                        obj.nselSelect(tr);
                    } else {
                        obj.selSelect(tr);
                    }
                    obj.resetSelect();
                    obj.isAllSelect();
                }
            }
            return true;
        }

    });

    $.extend($.grid._drag,
        /**@ignore*/
        {
            dragStart: function (event, obj, oth, offset){
                var resize = obj.resize, that = this, move = {}, index = oth.index, left = offset[0] - resize.width();

                if(oth.el.closest('.ui-grid-unFrozen-view').length){
                    left += oth.el.closest('.ui-grid-unFrozen-view').position().left;
                }
                resize.css({
                    top: offset[1],
                    height: offset[2],
                    left: left
                }).show();

                if(obj.fhdiv)
                    obj.fhdiv.bind('mousemove.grid', function (e) {
                        that.dragMove(e, obj, index, move, event, left,oth)
                    });
                obj.hdiv.bind('mousemove.grid', function (e) {
                    that.dragMove(e, obj, index, move, event, left,oth)
                });
                if(obj.unFrozenView) {
                obj.unFrozenView.bind('mousemove.grid',function(e){
                    that.dragMove(e, obj, index, move, event, left,oth);
                })
                }
                $(document).bind('mouseup.grid', function (e) {
                    resize.hide();
                    that.dragEnd(e, obj, oth, move);
                    obj.hdiv.unbind('mousemove.grid');
                    $(document).unbind('mouseup.grid')
                        .unbind('selectstart');
                })
                    .bind('selectstart', function () {return false;}) // 去除拖动时默认选择
            },
            /** @ignore*/
            dragMove: function (event, obj, index, move, sEvent, left,oth) {
                var resize = obj.resize,
                    settings = obj.settings,
                    dis = event.clientX - sEvent.clientX,
                    nWidth = settings.colModel[index].width + dis,th = oth.el;

                if(settings.isFrozen){
                    var resizeEl =th.closest('.ui-grid-frozen-view');
                    if(!resizeEl.length){
                        nWidth = settings.colModel[index + settings.treeFrozenModal.length].width + dis;
                    }

                }
                if (nWidth > 33) {
                    resize.css('left', left + dis);
                    move.dis = dis
                }
            },
            /**@ignore*/
            dragEnd: function (event, obj, oth, move) {
                var th = oth.el, index = oth.index, bth = obj.bdiv.find('table'),
                    dis = move.dis, settings = obj.settings,
                    w = th.width() + dis, tableWidth = obj.hdiv.find('table').width() + dis;
                var hth = obj.hdiv.find('table');
                $(document).unbind('.grid');
                obj.hdiv.unbind('.grid');
                    if(settings.isFrozen){
                        obj.unFrozenView.unbind('.grid');
                     if(dis){
                         var resizeEl =th.closest('.ui-grid-frozen-view'),sibingsEl = resizeEl.siblings('.ui-grid-unFrozen-view'),mdis,resizeTable,sibingsTable;
                         if(!resizeEl.length){
                             resizeEl = th.closest('.ui-grid-unFrozen-view');
                             sibingsEl = resizeEl.siblings('.ui-grid-frozen-view');
                             mdis =th.closest('table').width() +  dis;
                             if(resizeEl.width() < mdis){
                                 resizeEl.find('table').eq(0).css('margin-right', '18px')
                             }

                             resizeTable = resizeEl.find('table');
                             resizeTable.width(mdis);
                             //resizeEl.find('table').width(mdis);
                             resizeTable.each(function(){
                                $(this).find('tr:first td').eq(index).width(w);
                             });
                             obj.settings.colModel[index + settings.treeFrozenModal.length].width = w;
                             if(resizeEl.height()  < (resizeEl.eq(0).height() + resizeEl.eq(1).height())){
                                // sibingsEl.find('table').eq(1).css('margin-bottom', '18px');
                             }

                         }else{
                             mdis =resizeEl.width() +  dis;
                             resizeEl.width(mdis);
                             resizeTable =  resizeEl.find('table');
                             resizeTable.width(mdis);
                             resizeTable.each(function(){
                                 $(this).find('tr:first td').eq(index).width(w-obj.settings.cellLayout);
                             });

                             sibingsEl.css('left',mdis);
                             sibingsTable = sibingsEl.find('table');
                             if(sibingsEl.width() < sibingsTable.eq(1).width()){
                                 sibingsTable.eq(0).css('margin-right', '18px');
                             }

                             if(sibingsEl.height()  < (sibingsTable.eq(0).height() + sibingsTable.eq(1).height())){
                                // resizeTable.eq(1).css('margin-bottom', '18px');
                             }

                         }
                     }
                }else{
                    if (dis) {
                        $([]).add(obj.hdiv.find('table')).add(obj.bdiv.find('table')).width(tableWidth);
                        if(obj.fhdiv){
                            var fbth = $('.frozen-bdiv').find('tr:first td').eq(index),fhth = $('.frozen-hdiv').find('tr:first td').eq(index);
                            $([]).add(fbth).add(fhth).width(w);
                        }
                        //resizeTds.add(th);
                        bth.each(function(){
                            $(this).find('tr:first td').eq(index).width(w);
                        });
                        hth.each(function(){
                            $(this).find('tr:first td').eq(index).width(w);
                        });
                        th.width(w);
                        settings.colModel[index].width = w;

                    }
                        //解决调整列宽后拖动下方滑动条，列表对应不齐
                        if((obj.hdiv.width()-18)<obj.hdiv.find("table").width()&&obj.bdiv.get(0).scrollHeight>obj.bdiv.get(0).clientHeight){
                            obj.hdiv.find(".ui-jqgrid-hTableBox").css({"margin-right":"18px"});
                        }else{
                            obj.hdiv.find(".ui-jqgrid-hTableBox").css({"margin-right":"0"});
                        }
                }

            }
        });

    $.extend($.grid.fn,{
       unCheckChildren : function(){
           if(this.curActiveTr) {
               var childT = this.curActiveTr.next().find('table'),obj = this;

               if (childT.length && this.settings.tristate) {
                   childT.find('tr').each(function () {
                       var target2 = $(this).find('[data-code= "0"]');
                       if (target2.length) {
                           obj.checkHorizontal.apply(obj, [target2[0], false]);
                       }
                   });
               }
           }
       },
        getChangedNodes : function(){
            return this.changedNodes || {};
        }
    });

        $.grid.prototype.exSetting(treeOptions);
    $.grid.prototype.exEvents(events);

    $.fn.privilegeGrid = function(options){
        var opts = $.extend({
            ajaxRequestReader: {page: 'start', rowNum: 'limit', sortname:'sortName', sortorder: 'sortOrder'},
            ajaxResponseReader: {page: 'pageNo', rows: 'result',records: 'total',totalPage: 'totalPage',children : 'children'},
            rowMark : false,
            treeGrid:true,
            treeType : 'privilge',
            pagerButtons : false,
            multiSelect : false,
            multiSelSingle :true,
            showHorizontalCheck : true,
            trHeight : 29,
            colModelTmp: {width: 150, fixed: false, resizAble: true, sortable: false, sorttype: 'init',showTitle : true},
            events : {
                onTrMouseenter : function(event,el,obj){
                	if(el[0].tagName.toLowerCase() == 'th'){
                		return;
                	}
                  var $span = $('<span class="ico i-assign2" style="position:absolute;display:inline-block;margin-left:2px;cursor: pointer;width:24px;height:24px;vertical-align: middle;"></span>'),
                      $cell =  el.find('.treeGrid-cell');

                      $span.attr('title',language.text('grid.assign'));

                   if(!$cell.length){
                       $cell = obj.frozenView.find('#' + el.attr('id')).find('.treeGrid-cell');
                   }
                    $cell.after($span);
                  $span.on('click',function(){
                      var trId  = $(this).closest('tr').attr('id'),id = obj.transToId(trId);
                      obj.settings.view.defaultActions.call(obj,id);
                  });
                },
                onTrMouseleave : function(event,el,obj){
                		if(el[0].tagName.toLowerCase() == 'th'){
                			return;
                		}
                    var  $cell =  el.find('.treeGrid-cell') ;
                    if(!$cell.length){
                        $cell = obj.frozenView.find('#' + el.attr('id')).find('.treeGrid-cell');
                    }
                    $cell.next().remove();
                }
            }
        },options);
        return this.grid(opts);
    }

}) (jQuery);
