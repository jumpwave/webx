;(function ($) {

    $.extend($.grid.prototype,{
        createRows : function(rows, rowData, m,level,colModel,isExpand){
            if (!$.isArray(rows)) {
                rows = [rows];
            }
            if(!level)
                level = 0;

            if(this.startRowNo < 0){
                this.startRowNo = 0;
            }
            var length = rows.length, settings = this.settings, colModel = colModel || settings.colModel,modelLength = colModel.length,
                i = this.startRowNo, z, colval,additional = this.additionalCols,additionLength = additional.length, j,idr,childKey = settings.ajaxResponseReader.children || 'data',
                currentRow,childRow;

            for (; (i < length && i < this.maxVisibleTrs + this.startRowNo ); i++, m++) {
                    z = 0;
                    j =0;
                    currentRow = rows[i];
                    idr = this.createId(currentRow);
                    this.viewTr(rowData, idr, 0,currentRow.level || level);
                    for (;z < additionLength;z++) {
                        colval = colModel[z];
                        additional[z].callback.call(this,rowData, idr, m, colval);
                        j++;
                    }
                    for (; j < modelLength; j++) {
                        this.viewCell(rowData, currentRow[colModel[j].name] || '', currentRow, colModel[j].formart, colModel[j],currentRow.level || level);
                    }
                    this.viewTrEnd(rowData);
//                    childRow = currentRow[childKey];
//                    if(childRow && childRow.length){
//                        this.createChildRows(childRow,rowData,level + 1,colModel,rows[i].__isExpand || false);
//                    }
            }
        },
        createChildRows  : function(data,rowsHtml,level,colModel,isExpand){
            var settings = this.settings,showCols = 0,colModel = colModel || settings.colModel;
            if((level >= settings.showLevel) && !isExpand){
                return;
            }
            if(settings.showLevel && ((level < settings.showLevel) || isExpand)){
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
            this.createRows(data,rowsHtml,0,level,colModel,isExpand);
            rowsHtml.push('</tbody></table></td></tr>');
        },
        parseJsonData : function(data){
            var settings = this.settings, rows = data.rows, rowData = [], rowData2 = [],
                firstTr, firstTr2,table, table2,maxHeight = 0,pHeight = 0, trHeight = settings.trHeight || 29,checkall,thHeight = this.hdiv.height(),
                visibleTableHeight = 0,childKey = settings.ajaxResponseReader.children || 'data' ;

            if(settings.treeType == 'privilge'){
            	
            		//把level调整为从0开始
            	 if(rows[0].level == 1){
            	 		var changeLevel = (function f(rows){
            	 				for(var i =0,len = rows.length; i< len; i++){
            	 					rows[i].level && rows[i].level--;
            	 					if(rows[i][childKey] && rows[i][childKey].length){
            	 						f(rows[i][childKey]);
            	 					}	
            	 				}
            	 			});
            	 			
            	 			changeLevel(rows);
            	 }
                if (!isNaN(settings.height)) {   //具体的数字
                    visibleTableHeight = settings.height - thHeight;
                    this.wrap.css('height',settings.height);
                } else {  //100%和auto的情况（这两种情况等同），这种情况下父亲必须有高度
                    visibleTableHeight = this.wrap.parent().height() - thHeight;
                    this.wrap.css('height','100%');
                }
                this.bdiv.css('height', visibleTableHeight);
                this.fbdiv.css('height', visibleTableHeight);

                this.maxVisibleTrs = Math.ceil(visibleTableHeight/trHeight)*2; //预加载两屏
                this.avaliableRows = this.totalRows = this.getVisibleRecords(rows);
                this.countChilds();
               
                this.renderBody(this.visibleData);
                if(this.bdiv.width() < this.bdiv.find('#' + this.id).width()){
                    this.unFrozenView.find('.ui-jqgrid-frozen').css('margin-right','18px');
                }
            }

        },
        countChilds : function(){
        	var childKey = this.settings.ajaxResponseReader.children || 'data';
            if(this.visibleData){
                for(var i = 0,len = this.visibleData.length; i<len; i++){
                   var childs = this.visibleData[i].childs,k = i+ 1,level = this.visibleData[i].level,
                       childNode = this.visibleData[k];
                    while(k < len && level < childNode.level){
                        this.visibleData[i].allChilds++;
                        this.visibleData[i][childKey] = [1];
                        k++;
                    }
                }
            }
        },
        renderBody : function(data){
            var settings = this.settings, rows = data, rowData = [], rowData2 = [],
                firstTr, firstTr2,table, table2,maxHeight = 0,pHeight = 0, trHeight = settings.trHeight || 29,checkall,thHeight = this.hdiv.height(),
                visibleTableHeight = 0;
            this.startRowNo = this.startRowNo || 0;
            this.involvedNo = 0;
            this.createRows(rows, rowData, 0,0,settings.treeFrozenModal,false);
            if(!this.fbdiv.find('.ui-jqgrid-btable-top').length){
              this.fbdiv.prepend('<div class="ui-jqgrid-btable-top" style="height:0;"></div>');
              this.bdiv.prepend('<div class="ui-jqgrid-btable-top" style="height:0;"></div>');
            }
            table = this.fbdiv.find('table.ui-jqgrid-btable').find('tbody');
            if(table.length > 1){
                table = table.eq(0);
            }
            firstTr = table.find('tr:first')[0].outerHTML;
            rowData.unshift(firstTr);
            table.empty().append(rowData.join(''));
            this.involvedNo = 0;
            this.createRows(rows, rowData2, 0,0,settings.treeUnFrozenModal,false);
            table2 = this.bdiv.find('#' + this.id).find('tbody');
            if(table2.length > 1){
                table2 = table2.eq(0);
            }
            firstTr2 = table2.find('tr:first')[0].outerHTML;
            rowData2.unshift(firstTr2);
            table2.empty().append(rowData2.join(''));
            var height = settings.trHeight * (this.totalRows - this.maxVisibleTrs > 0 ? this.totalRows - this.maxVisibleTrs : 0);
            if(!this.fbdiv.find('.ui-jqgrid-btable-bottom').length){
                this.fbdiv.append('<div class="ui-jqgrid-btable-bottom" style="height:'+ height+'px;"></div>');
                this.bdiv.append('<div class="ui-jqgrid-btable-bottom" style="height:'+ height+'px;"></div>');
            }
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
                    that.expandPId = null;
                    if(this.scrollTop != that.bdiv.topDis){
                        var scrollTimer;
                        if (scrollTimer){
                            clearTimeout(scrollTimer);
                        }
                        scrollTimer = setTimeout(function(){
                            that.scroll.call(that);
                        }, 50);

                        that.bdiv.topDis = this.scrollTop;
                       sibings.scrollTop = this.scrollTop;
                    }else if(this.scrollLeft != that.bdiv.leftDis) {
                       that.bdiv.leftDis =  this.scrollLeft;
                       brothers.scrollLeft = this.scrollLeft;
                    }
                });
            }
        },
        getVisibleRecords : function(data){
            var upLevel = this.settings.showLevel,count =0,settings = this.settings,childKey = settings.ajaxResponseReader.children || 'data',
                that = this;
            this.visibleData = this.visibleData || [];
            var getTotal = (function f(d,level){
                 if(level >= upLevel)
                    return;
                else{
                     level++;
                    for(var i = 0,len = d.length; (i<len); i++){
                        count++;
                        that.visibleData.push({id : d[i].id,parentId : d[i].parentId,level : level - 1,allChilds : 0,name :d[i].name,opcode: d[i].opcode,isParent : d[i].isParent});
                        if(d[i][childKey] && d[i][childKey].length){
                            f(d[i][childKey],level);
                        }
                    }
                 }
            });
            getTotal(data,0);
            return count;
        },
        setTotalRecords : function(data){
//            var count = 0,settings = this.settings,childKey = settings.ajaxResponseReader.children || 'data';
//            var countNodes = (function f(d){
//               for(var i = 0,len = d.length; i <len; i++){
//                   count++;
//                   if(d[i][childKey] && d[i][childKey].length){
//                       f(d[i][childKey]);
//                   }
//               }
//
//            });
//            countNodes(data);
//            return count;
            var settings = this.settings,childKey = settings.ajaxResponseReader.children || 'data';
            function count(d){
                var result = d.length;
                for(var i = 0,len = d.length; i <len; i++){
                    if(d[i][childKey] && d[i][childKey].length){
                        result +=count(d[i][childKey]);
                    }
                }
                return result;
            };
            return count(data);
        },
        scroll : function(){
           var scropTop = this.bdiv.scrollTop(),settings = this.settings,trs = Math.ceil(scropTop/settings.trHeight);
           var topDiv = this.bdiv.children('div.ui-jqgrid-btable-top'),bottomDiv=this.bdiv.children('div.ui-jqgrid-btable-bottom'),
               offsetTop = topDiv.position().top,top = offsetTop + topDiv.height(),bottom = bottomDiv.position().top, dividUpTrs = Math.floor(this.maxVisibleTrs/4),
               minTopH = dividUpTrs*settings.trHeight,topDivH;
            if(bottom < this.bdiv.height() || top > 0){
            		this.startRowNo = this.startRowNo - Math.floor(top/settings.trHeight) - 1;
            		if(Math.abs(offsetTop) <= minTopH){//保留top的高度为0
            			dividUpTrs = Math.floor(Math.abs(offsetTop)/settings.trHeight);
            		}
                if(this.startRowNo >= dividUpTrs){
                    this.startRowNo =  this.startRowNo - dividUpTrs;
                }
                topDivH = this.startRowNo*settings.trHeight;
                
                if(this.startRowNo + this.maxVisibleTrs > this.avaliableRows){
                    this.startRowNo = this.avaliableRows - this.maxVisibleTrs;
                }
                this.fbdiv.children('div.ui-jqgrid-btable-top').css('height',topDivH);
                topDiv.css('height',topDivH);
                this.fbdiv.children('div.ui-jqgrid-btable-bottom').css('height', (this.avaliableRows- this.maxVisibleTrs)*settings.trHeight-topDivH);
                bottomDiv.css('height',(this.avaliableRows- this.maxVisibleTrs)*settings.trHeight-topDivH);
                //this.bdiv.scrollTop(scropTop);
                this.renderBody(this.visibleData);
            }

        },
        getVisibleData : function(start,count,rowData){
            var settings = this.settings,visibleData,involvedNum = 0,childKey = settings.ajaxResponseReader.children || 'data';
            if(settings.treeType == 'privilge'){
                var setNodes =  (function f(data,level){
                    for(var i = 0,len = rowData.length; i < length && (involvedNum < settings.showLevel); i++){
                        for(var props in rowData[i]){
                            if(props != childKey && rowData[i].hasOwnProperty(props) ){
                                visibleData[i][props] = rowData[i][props];
                            }
                        }
                        involvedNum++;
                        while(rowData[i][childKey] && rowData[i][childKey].length && involvedNum < settings.showLevel){
                            involvedNum++;
                        }
                    }
                });
            }
        },
        fetchDataInArray : function(pid){
           if(this.visibleData){
               for(var i = 0,len = this.visibleData.length; i < len; i++){
                   if(this.visibleData[i].id == pid){
                       return i;
                   }
               }
           }
           return -1;
        },
        expandTreeNode : function(data,level,curTr){
            var html = [],html2= [],trId = curTr.attr('id'),parentId = this.transToId(trId),settings = this.settings,
                childLength = data.length,avalibleLength = curTr.nextAll().length, parentObj = this.fetchDataById(parentId),childKey = settings.ajaxResponseReader.children || 'data',
                tData,indexInArray = this.fetchDataInArray(parentId);

            parentObj.__isExpand = true;//标识为，标识树是否展开
            this.visibleData[indexInArray].__isExpand = true;
            this.avaliableRows += data.length;
            if(!this.visibleData[indexInArray].allChilds)
             this.visibleData[indexInArray].allChilds = 0;
						 this.visibleData[indexInArray].allChilds += data.length;
            if(this.totalRows < this.maxVisibleTrs){
                avalibleLength = avalibleLength + this.maxVisibleTrs - this.totalRows;
            }

            for(var i = 0,len = data.length; i< len; i++){
                data[i].level = level +1;
                this.visibleData.splice(indexInArray+1 + i,0,data[i]);
            }
            if(childLength >= avalibleLength){
                curTr.nextAll().remove();
                if(settings.isFrozen){
                    this.bdiv.find('#' + trId).nextAll().remove();
                }
                tData = data.slice(0,avalibleLength);
            }else{
                //TODO 如果没有子节点则可以省略掉这里的remove逻辑
                if(this.totalRows < this.maxVisibleTrs){
                	curTr.parent().children().eq(this.maxVisibleTrs - childLength).nextAll().remove();
                	if(settings.isFrozen){
                    this.bdiv.find('#' + trId).parent().children().eq(this.maxVisibleTrs - childLength).nextAll().remove();
                	}
                }else{
                	curTr.parent().children().eq(this.totalRows - childLength).nextAll().remove();
                	if(settings.isFrozen){
                    this.bdiv.find('#' + trId).parent().children().eq(this.totalRows - childLength).nextAll().remove();
                	}
                } 
               
                tData = data;
            }
            var bottomDiv = this.bdiv.children('div.ui-jqgrid-btable-bottom');
            if(settings.isFrozen){
                this.involvedNo = 0;
                this.createRows(tData,html, 0,level + 1,settings.treeFrozenModal,true);
                this.addTreeRows(html,curTr);
                this.involvedNo = 0;
                this.createRows(tData,html2,0, level + 1,settings.treeUnFrozenModal,true);
                this.addTreeRows(html2,this.bdiv.find('#' + trId));
                this.fbdiv.children('div.ui-jqgrid-btable-bottom').css('height',bottomDiv.height()+data.length*settings.trHeight);
                bottomDiv.css('height',bottomDiv.height()+data.length*settings.trHeight);
            }else{
                this.createRows(tData,html, level + 1,null,true);
                this.addTreeRows(html,curTr);
                bottomDiv.css('height',bottomDiv.height()+data.length*settings.trHeight);
            }
            parentObj[childKey] = data;
            settings.data.push(data);
            this.activeId =  parentId;
            this.updateKeyIndex(data);
        },
        countAllChilds : function(data,childKey){
        	var count = 0;
        	var countFn = (function f(data){
        				if(data[childKey] && data[childKey].length){
        					 count += data[childKey].length; 
        					 for(var i =0,len = data[childKey]; i < len; i++){
        					 	f(data[childKey][i]);
        					 }
        				}
        		});
        		
        		countFn(data);
        	return count;
        },
        collapseTreeNode : function(curTr){
            var trId = curTr.attr('id'),parentId = this.transToId(trId),settings = this.settings,parentObj = this.fetchDataById(parentId),
                childKey = settings.ajaxResponseReader.children || 'data',indexInArray = this.fetchDataInArray(parentId);
            parentObj.__isExpand = false;//标识位，标识树是否展开,
            this.visibleData[indexInArray].__isExpand = false;
            this.visibleData[indexInArray].allChilds -= parentObj[childKey].length;
            if(parentObj[childKey]){
            		var pLevel = parentObj.level,i,spliceCount = 0,result,child = parentObj[childKey];
            		for(var i =indexInArray + 1,len = this.visibleData.length; i < len; i++){
            			if(this.visibleData[i].level <= pLevel){
            				 break;
            			}	
            			spliceCount++;
            		}
                this.avaliableRows -= spliceCount;
                this.visibleData.splice(indexInArray+1,spliceCount);
                this.totalRows -= this.countAllChilds(parentObj,childKey);
                
                this.renderBody(this.visibleData);
                var bottomDiv = this.bdiv.children('div.ui-jqgrid-btable-bottom');
                if(settings.isFrozen){
                    this.fbdiv.children('div.ui-jqgrid-btable-bottom').css('height',bottomDiv.height()- parentObj[childKey].length*settings.trHeight);
                    bottomDiv.css('height',bottomDiv.height() - parentObj[childKey].length*settings.trHeight);
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
            if(flag == true){
                $target.attr('checked','checked');
               //this.addSelect($target);
            }else if(flag == false){
                $target.removeAttr('checked');
                //this.removeSelect($target);
            }else{
                if($target.attr('checked') == 'checked'){
                   // this.addSelect($target);
                    currentObj[index] =  currentObj[index] || {};
                    currentObj[index].checkedNodes =0;
                    return true;
                }else{
                   // this.removeSelect($target);
                    currentObj[index] = currentObj[index] || {};
                    currentObj[index].checkedNodes = currentObj[childKey] ? currentObj[childKey].length : 0;
                    return false;
                }
            }

        },
        checkHorizontal : function(target,flag){
            var $target = $(target),tr = $target.closest('tr'),
                childSpan = tr.find('input.chk'),//使用input替换span标签
                that = this,
                classNm = target.className;

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
        setChildState : function($curTr,index,isCheck,level){
            var childTrs = $curTr,that = this;
            var isChild = true;
            childTrs.each(function(){
                if($(this).attr('data-level') >= level + 1 &&  isChild){
                    var target = $(this).children().eq(index).find('.chk');
                    if(target.length) {
                        that.toggleCheckboxState(target[0],index,isCheck);
                    }
                }else if($(this).attr('data-level') <= level){
                    isChild = false;
                    return false;
                }

            });
        }
    });

    $.extend($.grid || {},{
        addTreeRow : function(event,obj){
            var $curTr = this.closest('tr'),trId = $curTr.attr('id'),id=obj.transToId(trId),target = event.target,classNm = target.className,
                nextTr = $curTr.next(), level = parseInt($curTr.attr('data-level'),10) + 1,$target = $(target),settings = obj.settings,childKey = settings.ajaxResponseReader.children || 'data',
                childT =$curTr.nextAll();
            if(classNm == 'grid-treeIcon'){
                $target = $target.find('span');
                classNm = $target[0].className;
            }

            if(classNm.indexOf(settings.leafIcon) > -1) //子节点
                return;
            else if(classNm.indexOf(settings.parentIcon) > -1){ //展开
                obj.expandPId = id;
                $target.removeClass(settings.parentIcon).addClass(settings.expendPIcon);
                if(settings.dataType == 'local'){
                    if(nextTr.length && !nextTr.attr('role')){   //页面已经加载
                        if(settings.isFrozen){
                            nextTr.show();
                            obj.unFrozenView.find('#' + obj.id + ' tbody tr').eq(nextTr.index()).show();
                        }else{
                            nextTr.show();
                        }
                    }else{ //页面没有加载，从数据中读取
                         var dd = obj.fetchDataById(id),lev = parseInt($curTr.attr('data-level'),10);
                        if(dd[childKey] && dd[childKey].length){
                            obj.expandTreeNode.apply(obj,[dd[childKey],lev,$curTr]);
                        }else{
                        	var indexInArray = obj.fetchDataInArray(id);
                        	obj.visibleData[indexInArray].allChilds = 0;
                        	obj.visibleData[indexInArray].__isExpand = true;
                        }
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
                        	          var indexInArray = obj.fetchDataInArray(id);
                        						obj.visibleData[indexInArray].allChilds = 0;
                        						obj.visibleData[indexInArray].__isExpand = true;
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
                obj.expandPId = null;
                $target.removeClass(settings.expendPIcon).addClass(settings.parentIcon);
                
                childT.each(function(){
                	if($(this).attr('data-level') >= level){
                		$(this).hide();
                	}else{
                		return false;
                		}
                });
                
                var frozenChilds = obj.unFrozenView.find('#' + trId).nextAll();
                frozenChilds.each(function(){
                	if($(this).attr('data-level') >= level){
                		$(this).hide();
                	}else{
                		return false;
                		}
                });

                obj.collapseTreeNode.apply(obj,[$curTr]);
            }
            obj.changeMarkAndView();
            return false;
        },
        toggleChecknode : function(event,obj){
            var target = event.target,$curTr = this.closest('tr'),childT =$curTr.nextAll(),level = parseInt($curTr.attr('data-level'),10),
                index = $(target).parent().index(),result,trId = $curTr.attr('id'),parentId = obj.transToId(trId), parentObj = obj.fetchDataById(parentId),
                childKey = obj.settings.ajaxResponseReader.children || 'data',that = this;

            var updateData = (function f(o,code,isCheck,childKey){
                var pId = o.id;
                obj.selected = obj.selected || {};
                obj.selected[pId] = obj.selected[pId] || {};
                if(obj.selected[pId]['id']){
                    obj.selected[pId]['opcode'] = obj.selected[pId]['opcode'] || {};
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.selected[pId]['opcode'][code[i]] = isCheck;
                    }

                }else{
                    obj.selected[pId] = {"id" : pId,"opcode" : {}} ;
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.selected[pId]['opcode'][code[i]] = isCheck;
                    }
                }

                obj.changedNodes = obj.changedNodes || {};
                if(obj.changedNodes[pId]){
                    obj.changedNodes[pId]['opcode'] = obj.changedNodes[pId]['opcode'] || {};
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.changedNodes[pId]['opcode'][code[i]] = isCheck;
                    }
                }else{
                    obj.changedNodes[pId] = {};
                    obj.changedNodes[pId] = {"id" : pId,"opcode" : {}}
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.changedNodes[pId]['opcode'][code[i]] = isCheck;
                    }
                }

                if(o[childKey] && o[childKey].length){
                    for(var i = 0,len =o[childKey].length; i < len; i++ ){
                        f(o[childKey][i],code,isCheck,childKey);
                    }
                }
            });


            if($(target).attr('data-code') == 0){
                result = obj.checkHorizontal.apply(obj, [target]);
                if (childT.length && obj.settings.tristate) {
                    var isChild = true;
                    childT.each(function () {
                        if($(this).attr('data-level') >= level + 1 &&  isChild){
                            var target2 = $(this).find('[data-code= "0"]');
                            if (target2.length) {
                                obj.checkHorizontal.apply(obj, [target2[0], result]);
                            }
                        } else{
                            isChild = false
                        }

                    });
                }
                var codes = [];
                for(var i = 0,len = obj.settings.treeUnFrozenModal.length; i<len; i++){
                    if(obj.settings.treeUnFrozenModal[i].opcode){
                        codes.push(obj.settings.treeUnFrozenModal[i].opcode);
                    }
                }
                updateData(parentObj,codes,result,childKey);
            }else{
                result = obj.toggleCheckboxState.apply(obj,[target,index]);
                if(childT.length && obj.settings.tristate)
                    obj.setChildState.apply(obj,[childT,index,result,level]);

                updateData(parentObj,[$(target).attr('data-code')],result,childKey);
            }
            // return false;   ie8下面会导致无法选中

        }
    });

    $.extend($.grid.fn,{
        unCheckChildren : function(){
            var obj = this;
            var updateData = (function f(o,code,isCheck,childKey){
                var pId = o.id;
                obj.selected = obj.selected || {};
                obj.selected[pId] = obj.selected[pId] || {};
                if(obj.selected[pId]['id']){
                    obj.selected[pId]['opcode'] = obj.selected[pId]['opcode'] || {};
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.selected[pId]['opcode'][code[i]] = isCheck;
                    }

                }else{
                    obj.selected[pId] = {"id" : pId,"opcode" : {}} ;
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.selected[pId]['opcode'][code[i]] = isCheck;
                    }
                }

                obj.changedNodes = obj.changedNodes || {};
                if(obj.changedNodes[pId]){
                    obj.changedNodes[pId]['opcode'] = obj.changedNodes[pId]['opcode'] || {};
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.changedNodes[pId]['opcode'][code[i]] = isCheck;
                    }
                }else{
                    obj.changedNodes[pId] = {};
                    obj.changedNodes[pId] = {"id" : pId,"opcode" : {}}
                    for(var i = 0,len = code.length; i< len;  i++){
                        obj.changedNodes[pId]['opcode'][code[i]] = isCheck;
                    }
                }

                if(o[childKey] && o[childKey].length){
                    for(var i = 0,len =o[childKey].length; i < len; i++ ){
                        f(o[childKey][i],code,isCheck,childKey);
                    }
                }
            });

            if(this.curActiveTr) {
                var trId = this.curActiveTr.attr('id'),parentId = obj.transToId(trId), parentObj = obj.fetchDataById(parentId),level = parseInt(this.curActiveTr.attr('data-level'),10),
                    childKey = obj.settings.ajaxResponseReader.children || 'data';
                var childT = this.curActiveTr.nextAll(),obj = this;
                if (childT.length && this.settings.tristate) {
                    var isChild = true;
                    childT.each(function () {
                        if($(this).attr('data-level') == level + 1 &&  isChild){
                            var target2 = $(this).find('[data-code= "0"]');
                            if (target2.length) {
                                obj.checkHorizontal.apply(obj, [target2[0], false]);
                            }
                        }else{
                            isChild = false;
                        }

                    });

                }

                if(parentObj[childKey] && parentObj[childKey].length){
                    var codes = [];
                    for(var i = 0,len = obj.settings.treeUnFrozenModal.length; i<len; i++){
                        if(obj.settings.treeUnFrozenModal[i].opcode){
                            codes.push(obj.settings.treeUnFrozenModal[i].opcode);
                        }
                    }
                    for(var i= 0,len = parentObj[childKey].length; i < len; i++){
                        updateData(parentObj[childKey][i],codes,false,childKey);
                    }
                }

            }
        },
         reload: function () {
            this.fbdiv.find('.ui-jqgrid-btable-top').remove();
            this.bdiv.find('.ui-jqgrid-btable-top').remove();
            this.fbdiv.find('.ui-jqgrid-btable-bottom').remove();
            this.bdiv.find('.ui-jqgrid-btable-bottom').remove();
            this.populate();
        }
    });
}) (jQuery);
