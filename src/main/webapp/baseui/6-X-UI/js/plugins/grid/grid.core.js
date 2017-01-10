/**
 * @fileOverview Grid组件
 * @author yangyu
 * @description Gird组件 {@link http://www.github.com|<strong>Demo</strong>}
 * @version 0.1
 */
;(function ($) {
	
	/**
     * @lends $.fn.grid.prototype
     */
    $.grid = function() {
        this.additionalCols = [];
        this.init.apply(this, arguments);
    };
     
    $.extend($.grid, 
    	/**
     	 * @lends $.fn.grid
 	     * @property {number}  height    - 高度，默认250px
 	     * @property {boolean} shrinkToFit  - 此属性用来说明当初始化列宽度时候的计算类型，如果为ture，则按比例(不用带上百分号)初始化列宽度。如果为false，则列宽度使用colModel指定的宽度，设置入口colModel的width属性里
 	     * @property {string}  url    - 请求数据的url，当dataType为local时失效
 	     * @property {string}  dataType  - 数据类型 local / ajax
 	     * @property {array}  colName   - 表头标题，例如 ['序号', '用户名', '登陆账号','状态','性别','邮箱','电话','手机','传真','创建时间']
 	     * @property {array}  colModel  - 常用到的属性：name列显示名称；width列宽，默认150px；,fixed列宽是否固定，默认false，不固定；resizAble是否可缩放，默认false；,sortable是否排序，默认false,sorttype排序方式，可选init，string，datatype为local才有用；,formart当前列数据格式化,key是否以本列的值作为key。和options的keyIndex属性配合使用,默认为false；style设置本列的CSS。attachEvent表示当前列需要绑定的事件attachEvent : {click:{el : '.className',callback:function(){}}}
 	     * @property {number} page  - 当前第几页,初始值为1
 	     * @property {string} pager   -分页容器
 	     * @property {boolean} headerFixed   -表头是否固定，默认true
 	     * @property {boolean} pagerFixed   -分页是否固定，默认true
 	     * @property {number}  rowNum  - 默认显示几条数据，默认20
 	     * @property {array}  rowList  - 一页显示多少条的配置项，默认[10,20,30,50,100]
 	     * @property {boolean} resizable  -是否可拉伸，默认true
 	     * @property {boolean} key
 	     * @property {number}  cellLayout   -定义了单元格padding + border宽度。通常不必修改此值。初始值为5
 	     * @property {object}  colModelTmp  -简化colModel的公用配置，默认{width: 150, fixed: false, resizAble: true, sortable: true, sorttype: 'init'}
 	     * @property {object}  ajaxStatic   -静态参数
 	     * @property {function} ajaxDynamic -动态参数
 	     * @property {object}  ajaxRequestReader -前台发送参数动态配置，{page: '_page', rowNum: 'rowNum', sortname:'sortname', sortorder: 'sortorder'}，_page表示发送给后台的参数名，可配置
 	     * @property {object} ajaxResponseReader  -后台接受参数可配置， {page: 'page', rowNum: '_rowNum', sortname:'sortname', sortorder: 'sortorder'} ,_rowNum表示接受的参数名，可配置
 	     * @property {boolean} multiSelect - 是否有多选框
 	     * @property {boolean} rowMark     - 是否显示编号
 	     * @property {boolean} sortable  - 是否可以排序，与sortName一起使用，可以到colModal配置，不建议使用
 	     * @property {string} sortname  - 排序的名字，与sortable一起使用，可以到colModal配置，不建议使用
 	     * @property {string} sortorder  - 默认的排序 
 	     * @property {boolean} headTitle  -表头是否显示title，默认显示
 	     * @property {number} rowMarkWidth -编号栏的宽度，默认20
 	     * @property {number} multiSelectWidth  - 多选框的宽度 ，默认25
 	     * @property {number}  scrollWidth    - 滚动条的宽度，默认18
 	     * @property {boolean} pagerButtons  - 是否显示分页条，默认true
         */
    	{
        defaults: {
            height: 150,
            shrinkToFit: true,
            url: '',
            dataType: 'local',
            colName: [],
            colModel: [],
            headerFixed : true,
            page: 1,
            pager: '',
            pagerFixed : true,
            /**暂未实现，另外设置了direction为rtr,表头的高度会变高，未列入配置项，表格中文字的显示方向，从左向右（ltr）或者从右向左（rtr） */
            direction: 'ltr',
            //tofixed  页面条数显示异常
            rowNum: 20,
            rowList: [10, 20,30, 50,100],
            //toFixed resizable设置为false不生效
            resizable: true,
            key: true,
            cellLayout: 5,
            colModelTmp: {width: 150, fixed: false, resizAble: true, sortable: true, sorttype: 'init',showTitle : true},
            ajaxStatic: {},
            ajaxOptions: {type: 'post', dataType: 'json'},
            ajaxDynamic: {},
            ajaxRequestReader: {page: '_page', rowNum: 'rowNum', sortname:'sortname', sortorder: 'sortorder'},
            ajaxResponseReader: {page: 'page', rows: '_rows',records: 'records',totalPage: 'totalPage',isLastPage:'isLastPage'},
            multiSelect: true,
            multiSelSingle : false,
            rowMark: true,
            sortable: true,
            sortname: '',
            sortorder: 'asc',
            headTitle: true,
            rowMarkWidth: 25,
            multiSelectWidth: 20,
            scrollWidth: 18,
            showZebraCrossing : false,
            //toFixed 要隐藏哪些按钮要因布局而定，暂时不放开，默认全部显示
            pagerButtons: true,
            subGrid : false,
            isGroupheaders:false,
            groupHeaders:[] ,
            userCookies : true,
            isEasyPager:false,
            isGlobalResizAble:true,//定义全局的不可拉伸
            modelList: null


            }
    });

   
    var formart = $.extend(($.grid._formart = {}), 
    	{

    });
	

    $.extend(($.grid._classes = {}),
    	{
        defalutId: 'grid',
        viewClass: 'ui-jqgrid-view',
        viewId: 'view_',
        wrapClass: 'ui-jqgrid ui-widget ui-widget-content ui-corner-all',
        wrapId: 'wrap_',
        loadedClass: 'loading ui-state-default ui-state-active',
        loadedId: 'load_',
        hoverClass: 'ui-state-hover',
        btableClass: 'ui-jqgrid-btable',
        zebraTrcss : 'noclick-event',
        defaultCls:'ui-jqgrid-default'
    });


    var classes = $.grid._classes;

    /**
     * TODO： 分离ui的选择器
     */
    $.extend(($.grid._events = {}), {
        'mouseenter|thead tr th,.ui-jqgrid-bdiv tr,[aria-pager]': 'onThMouseenter',
        'mouseleave|thead tr th,.ui-jqgrid-bdiv tr,[aria-pager]': 'onThMouseleave',
        'mousedown|.ui-jqgrid-resize': 'onResize',
        'change|.ui-pg-selbox': 'onChangeRowNum',
        'keypress|.ui-pg-input': 'onChangePager',
        'change|.ui-jqgrid-bdiv td.jq-grid-multiselect [type=checkbox]': 'onSelect',
        'click|.ui-jqgrid-bdiv tr' : 'onTrSelect',
        'click|[aria-pager]':  'onClickPager',
        'change|[aria-checkall=true]': 'onAllSelect',
        'click|.ui-jqgrid-sortable': 'onSort',
        'scroll#.ui-jqgrid-bdiv': 'onScroll'
    });

    /**
     * 拖动模块
     */
    $.extend(($.grid._drag = {}), 
    	/**@ignore*/
    	{
        dragStart: function (event, obj, oth, offset){
            var resize = obj.resize, that = this, move = {}, index = oth.index, left = offset[0] - resize.width();

            resize.css({
                top: offset[1],
                height: offset[2],
                left: left
            }).show();
            if(obj.fhdiv)
            obj.fhdiv.bind('mousemove.grid', function (e) {
                that.dragMove(e, obj, index, move, event, left)
            });
            obj.hdiv.bind('mousemove.grid', function (e) {
                that.dragMove(e, obj, index, move, event, left)
            });
            $(document).bind('mouseup.grid', function (e) {
                resize.hide();
                that.dragEnd(e, obj, oth, move);
                obj.hdiv.unbind('mousemove.grid');
                $(document).unbind('mouseup.grid')
                    .unbind('selectstart');
            })
                .bind('selectstart', function () {return false}) // 去除拖动时默认选择
        },
		 /** @ignore*/
        dragMove: function (event, obj, index, move, sEvent, left) {
            var resize = obj.resize,
                settings = obj.settings,
                dis = event.clientX - sEvent.clientX,
                nWidth = settings.colModel[index].width + dis;

            if (nWidth > 33) {
                resize.css('left', left + dis);
                move.dis = dis
            }
        },
		/**@ignore*/
        dragEnd: function (event, obj, oth, move) {
            var th = oth.el, index = oth.index, bth = obj.bdiv.find('table'), nth = th.next(),
                dis = move.dis, settings = obj.settings, isFix = settings.shrinkToFit,
                w = th.width() + dis, thbdis, nw,tableWidth = obj.hdiv.find('table').width() + dis,resizeTds = $([]);
            var hth = obj.hdiv.find('table');
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
    })

    // event model
    $.extend($.grid, 
    	/**@ignore*/
    	{
        onThMouseenter: function (event,obj) {
            var el = $(this);
            if (!el.hasClass('ui-state-disabled') && el.find('tr').length == 0) {
                el.addClass(classes.hoverClass);
                obj.wrap.triggerHandler('onTrMouseenter',[el,obj]);
            }
        },
        /**@ignore*/
        onThMouseleave: function (event,obj) {
            var el = $(this);
            if (!el.hasClass('ui-state-disabled')) {
                el.removeClass(classes.hoverClass);
                obj.wrap.triggerHandler('onTrMouseleave',[el,obj]);
            }
        },
        /**@ignore*/
        onResize: function (event, obj) {
            var el = $(this), th = $.grid.getThObj(el,obj), offset = $.grid.getOffset(th.el, obj);

            $.grid._drag.dragStart(event, obj, th, offset);
        },
        /**@ignore*/
        onChangeRowNum: function (event, obj) {
            var el = $(this), settings = obj.settings;
            settings.page = 1;
            settings.rowNum = parseInt(el.val(), 10);
            if(settings.userCookies && obj.storage){
                
                obj.storage.setItem('limit', settings.rowNum) ;
            }
            obj.populate();
        },
        /**@ignore*/
        onChangePager: function (event, obj) {
            var el = $(this), settings = obj.settings, key = event.charCode,
                val=el.val();

            if (key === 13) {
                settings.page = $.grid.parseInt(val, 1);
                if (settings.page < 1) {
                    settings.page = 1;
                }
                if(settings.page > obj._pageData.totalPage){
                    settings.page = obj._pageData.totalPage;
                }
                obj.populate();
            }
        },
        /**@ignore*/
        onScroll: function (event, obj) {
            var el = $(this);
            if(obj.settings.headerFixed)
            obj.hdiv.find("table").parent().get(0).scrollLeft = el.get(0).scrollLeft;
        },
        /**@ignore*/
        onSelect: function (event, obj) {
            var el = $(this), tr = $.grid.getThObj(el).el, isCheck = el.attr('aria-selected') === 'true';

            if(el[0].checked){
                obj.selSelect(tr);
            }else{
                obj.nselSelect(tr);
            }
            //obj.resetSelect();
            obj.isAllSelect();
        },
        onTrSelect : function(event,obj){
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
            return true;
         },
        /**@ignore*/
        onAllSelect: function (event, obj) {
            var el = $(this), isCheck = el.is(':checked'), allCheck = obj.bdiv.find('tr').not(':first');

            if (isCheck) {
                allCheck.each(function (i, n) {
                    obj.selSelect($(n));
                })
            } else {
                allCheck.each(function (i, n) {
                    obj.nselSelect($(n));
                })
            }
            obj.resetSelect();
            if(allCheck.length)
							obj.isAllSelect();
        },
        /**@ignore*/
        onClickPager: function (event, obj) {
            var el = $(this), attr = el.attr('aria-pager'), settings = obj.settings, page = settings.page;
            if (el.hasClass('ui-state-disabled') || el.attr('disabled')) { return;}

            el.attr('disabled','disabled');

            if (attr == 'first') {
                settings.page = 1;
            } else if (attr === 'last') {
                settings.page = obj._pageData['totalPage'];
            } else if (attr === 'prev') {
                settings.page = Math.max(page - 1, 1);
            } else if (attr === 'next') {
                if (settings.isEasyPager) {
                    settings.page = page + 1;
                } else {
                    settings.page = Math.min(page + 1, obj._pageData['totalPage']);
                }
            } else if(attr === 'jump'){
                var value =  parseInt(el.parent().find('.ui-pg-input').val(),10);
                if($.isNumeric(value)){
                    if (value <= 1) {
                            value = 1
                    } else if (value > obj._pageData['totalPage']) {
                            value = obj._pageData['totalPage'];
                    } else {
                            value = value;
                    }
                    settings.page = value;
                }
                el.parent().find('.ui-pg-input').val(settings.page == 0 ? 1 : settings.page);
            }
            obj.populate(el)
        },
        /**@ignore*/
        onSort: function (event, obj) {
            var el = $(this), bsort = el.find('.s-ico'), dsort = el.find('[sort]'), settings = obj.settings, colModel = settings.colModel,
                ssort = dsort.filter('.ui-state-disabled').eq(0), index = $.grid.getThObj(el).index, asc;

            obj.wrap.find('.s-ico').hide();
            bsort.show();

            ssort.removeClass('ui-state-disabled');
            dsort.not(ssort).addClass('ui-state-disabled');

            settings.sortname = colModel[index]['sortname'] || colModel[index]['name'];
            settings.sortorder = ssort.attr('sort');
            settings.page = 1;
            if(settings.userCookies && obj.storage){
                obj.storage.setItem('sortorder', settings.sortorder) ;
            }
            obj.populate();
        } ,
        /**
         * @ignore
         * @description
         *  window做resize时触发的动作
         * */
        onGridResize : function(width , height){
            var settings = this.settings, elem = $([]), colModel = settings.colModel;
            width = parseInt(width);

            if (isNaN(width)) {
                return
            }
            this.settings.width = width;
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
				if(colModel[i].width == colModel[i].widthOrg){
					el.width(colModel[i].width +1);
					el.width(colModel[i].width);
				}else{
					el.width(colModel[i].width);
				}
                //el.width(colModel[i].width);
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
    });

    // $.grid 静态方法
    $.extend($.grid, /**@ignore*/{
        getAccessor: function (obj, name) {
           return obj[name];

        },
        /**@ignore*/
        createDom: function (tag, attr) {
            if (typeof tag === 'object') {
                attr = tag;
                tag = '<div>';
            }
            return $(tag).attr(attr);
        },
        /**@ignore*/
        substring: function (str, i) {
            return str.substring(i) || '';
        },
        /**@ignore*/
        stripHtml: function (data) {
            if(Object.prototype.toString.call(data) == '[object object]')
                return data;
           var res = String(data || '').replace(/<[^>]*>([\S\s]*?)<[^>]*>/img, '');
            return res;
        },
        /**@ignore*/
        getThObj: function (el) {
            var tagname;
            el = el.is('tr, th') ? el : el.closest('tr, th');
            tagname = el.get(0).tagName;
            return {
                index: el.parent().find(tagname).index(el),
                el: el
            }
        },
        /**@ignore*/
        getOffset: function (el, obj) {
            var left, top, height;

            left = el.position().left + el.outerWidth();
            top = obj.hdiv.position().top;
            height = obj.hdiv.height() + obj.bdiv.height();

            return [left, top, height]
        },
        /**@ignore*/
        formart: function () {
            var str = arguments[0], arg = Array.prototype.slice.call(arguments, 1);

            return str.replace(/{(\d+)}/g, function (m, i) {
                return arg[i];
            })
        },
        /**@ignore*/
        dataFormart: function (data, dataRow, fn) {
            if (typeof dataRow == 'function') {
                fn = dataRow;
                dataRow = null;
            }
            var type = typeof fn;

            if (type === 'function') {
                return fn.call(null, data, dataRow, $.grid.formart);
            } else if (type === 'string') {
                fn = $.grid.formart(fn);

                if (fn) {
                    return fn.call(null, data, dataRow);
                } else {
                    return data;
                }
            }
            return data;
        },
        /**@ignore*/
        parseInt: function (val, defult) {
            val = parseInt(val, 10);

            return isNaN(val) ? defult || 0 : val;
        },
        initExtend: [],
        domInitExtend : []
    });

	
    /**@lends $.grid.prototype*/
    $.extend($.grid.prototype, 
    	{
        init: function (elem, options) {
        	if(typeof hikStorage != undefined && typeof hikStorage != "undefined"){
        		this.storage= new hikStorage('cookie',{path:'/'});
        		}
            this.id = elem.attr('id') || classes.defalutId;
            this.elem = elem;
            $.grid.init = $.grid.initExtend.concat();
            $.grid.domInit = $.grid.domInitExtend.concat();
            this.setOptions(elem, options);
            this.viewWrap();
            this.prepareColModel();
            this.viewDomModel();
            this.clientEvent();
            this.delegateEvent();
            this.wrap.triggerHandler('init',[this.wrap]);
        },
        exSetting : function(s){
            $.extend(true, $.grid.defaults,s);
        },
        exEvents : function(e){
            for(var prop in e){
                if(!$.grid._events[prop]){
                    $.grid._events[prop] = e[prop];
                }else{
                    var fn = $.grid._events[prop];
                    if(typeof fn == 'string')
                        fn = [fn];
                    fn.push(e[prop]);
                    $.grid._events[prop] = fn;
                }
            }
           // $.extend(true, $.grid._events,e);
        },
        prepareColModel : function(){
            $.grid.init.push(this.setColName,this.addSelectAndMark, this.addAdditional,this.setAdditional,this.setColModel,this.setColWidth);
            for (var i=0 , len = $.grid.init.length; i < len; i ++) {
                $.grid.init[i].call(this);
            }
        },
        viewDomModel : function(){
            $.grid.domInit.push(this.viewHeadWrap,this.viewThead,this.populate);
            for (var i=0 , len = $.grid.domInit.length; i < len; i ++) {
                $.grid.domInit[i].call(this);
            }
        },
        clientEvent: function () {
            var events = this.settings.events,that = this;

            for (var i in events) {
                this.wrap.bind(i,function(index){
                    return events[index];
                }(i));
            }
        },
        unClientEvent : function(){
            var events = this.settings.events;

            for (var i in events) {
                this.wrap.unbind(i, function(index){
                    return events[index];
                }(i));
            }
        },
        delegateEvent: function () {
            var events = $.grid._events, view = this.wrap, that = this, settings = this.settings,
                sEvents = settings.events,
                i, eventName, selector, method, methodName, pars, arr, proxy, isBind,table = $('#' + this.id + ' tbody'),that = this;

            for (i in events) {
                pars = i.split('|');

                if (pars.length != 1) {
                    isBind = false;
                } else {
                    pars = i.split('#');
                    isBind = true;
                }
                eventName = pars[0] + '.grid';
                selector = pars[1];
                methodName = events[i];
                if(typeof methodName == 'string'){
                    method = $.grid[events[i]];
                }else{
                    method = [];
                    for(var i = 0,len = methodName.length; i < len; i++){
                        method.push($.grid[methodName[i]]);
                    }
                }
                //method = $.grid[events[i]];
                !isBind ? (proxy='delegate', arr=[selector, eventName])
                    : (proxy='bind', arr=[eventName], selector = that.wrap.find(selector));

                (function (m, a, p, md) {
                    function fn (event) {
                        var target = $(this), ret = true;
                        if(Object.prototype.toString.call(md) == '[object Array]') {
                            for(var i = 0, len = md.length; i< len; i++){
                                if(ret)
                                    ret = md[i].call(target, event, that, view,that.id);
                                else{
                                    md[i].call(target, event, that, view,that.id);
                                }
                            }
                        } else{
                            ret = md.call(target, event, that, view,that.id);
                        }

                        that.wrap.triggerHandler(m, [target, that]);
                        return ret;
                    };

                    a.push(fn);
                    if (isBind) {
                        selector[p].apply(selector, a);
                    } else {
                        that.wrap[p].apply(that.wrap, a);
                    }
                }(methodName, arr, proxy, method));
               //sEvents[methodName] && that.wrap.bind(methodName, sEvents[methodName]);
            }

            for (var i = 0, len = settings.colModel.length; i < len; i++) {
                if (settings.colModel[i].attachEvent) {
                    for (var ev in settings.colModel[i].attachEvent) {
                        if (!settings.colModel[i].attachEvent.hasOwnProperty(ev))
                            continue;
                        var obj = settings.colModel[i].attachEvent[ev], that = this;
                        table.off('.grid',obj.el).on(ev+".grid", obj.el, function (objT) {
                            return function(e){
                                var target = $(e.target),tr = target.parents('tr').eq(0),trId = tr.attr('id'),realId = that.transToId(trId);
                                !(/ui-state-disabled/.test(tr[0].className)) && objT.callback && objT.callback.call(that, event, trId, target.text(),realId);
                            }
                        }(obj))
                    }

                }
            }
            $(window).bind("resize.grid",function(){
//              var $parent = that.wrap.parent();
//              if(that.wrap.outerHeight() == $parent.height() && Math.abs(that.wrap.outerWidth() - $parent.width()) <= 2) {
//                  return;
//              } 页面向下拖动是不会触发onGridResize事件，that.wrap.outerHeight() 和$parent.height()数值一样，被认为页面没有resize操作
              var fn =  $.grid['onGridResize'];
              //这里如果使用width，会导致宽度一下变小一下变大的bug,用scrollwidth会导致放大缩小grid不会随之缩小
                fn.apply(that,[that.wrap.parent()[0].clientWidth,that.wrap.parent().height()]);
            });
        },
        unDelegateEvent : function(){
            var events = $.grid._events, view = this.wrap, that = this, settings = this.settings,
                sEvents = settings.events,
                i, eventName, selector, method, methodName, pars, arr, proxy, isBind,table = this.bdiv.find('#' + this.id + ' tbody');

            for (i in events) {
                pars = i.split('|');

                if (pars.length != 1) {
                    isBind = false;
                } else {
                    pars = i.split('#');
                    isBind = true;
                }
                eventName = pars[0] + '.grid';
                selector = pars[1];
                methodName = events[i];
                method = $.grid[events[i]];
                !isBind ? (proxy='delegate', arr=[selector, eventName])
                    : (proxy='bind', arr=[eventName], selector = that.wrap.find(selector));

                (function (m, a, p, md) {
                    function fn (event) {
                        var target = $(this), ret;

                        ret = md.call(target, event, that, view);
                        that.wrap.triggerHandler(m, [target, that]);
                        return ret;
                    };

                    a.push(fn);

                    if (isBind) {
                        selector["un" + p].apply(selector, a);
                    } else {
                        that.wrap["un" + p].apply(that.wrap, a);
                    }
                }(methodName, arr, proxy, method));
                sEvents[methodName] && that.wrap.unbind(methodName, sEvents[methodName]);
            }

           table.off('.grid');
            $(window).unbind(".grid");
        },
        createId: function (data) {
            var  key = this._key;

            var id = $.grid.getAccessor(data, key);

            if (id === '' || id === 'undefined' || id === undefined) {
                id = this._count;
                this._count++;
            }
            return id;
        },
        // 通过id创建TagId
        createTagId: function (id, issel) {
            var sid = this.id + '_' + id;

            return issel ? '#' + sid : sid;
        },
		isCreateCell: function (i) {
			var colModel = this.settings.colModel;
			
			/*if (colModel[i].hidden) {
				return false;	
			} else {
				return true;	
			}  */
            return true;
		},
        // 通过Id获取Tr元素
        getTrById: function (id) {
            var sid;

            id = this.transToId(id);
            sid = this.createTagId(id, true);
            return this.bdiv.find(sid);
        },
        // 转换tagId为id
        transToId: function (sid) {
            var id,ids,len;
            if (typeof sid === 'string') {
                ids = sid.split('_'),len = ids.length;
                return ids[len-1];
            } else {
                return sid
            }
        },
        setOptions: function (elem, options) {
            var settings;
            if(options.treeType == 'privilge') {
                settings= $.extend(false, {}, $.grid.defaults, options || {});
            }else{
                settings= $.extend(true, {}, $.grid.defaults, options || {});
            }

            if(options.rowList){
                settings.rowList=options.rowList;
            }
            if(!isNaN(settings.height)){
                settings.height = parseInt(settings.height,10) < 150 ? 150 : parseInt(settings.height,10);
            }
            this.settings = settings;
        },
        addSelectAndMark: function () {
            if(this.settings.multiSelect){ 
                 var obj = {};
                obj.name = "sl";
                obj.el = this.addMultiSelect;
                obj.callback = this.viewMultiSelect;
                this.additionalCols.push(obj);
            }
            if(this.settings.rowMark){
                var obj1 = {};
                 obj1.name = "rl";
                obj1.el = this.addRowsMark;
                obj1.callback = this.viewRowMark;
                this.additionalCols.push(obj1);
            }
        },
        /**
        * @description  empty function for inherity
        */
        addAdditional : function(){},
        setAdditional: function () {
            var that = this;
          for(var len = this.additionalCols.length,i= len -1;i >= 0;i--){//保证头按照顺序插入
              this.additionalCols[i].el.call(that,this.additionalCols[i].name);
          }
        },
        setColName: function () {
            var settings = this.settings, colModel = settings.colModel, colName = settings.colName, len = colModel.length;

            if (!colName.length) {
                for (; len--;) {
                    colName[len] = colModel[len].label || colModel[len].name;
                }
            }
            if (colName.length !== colModel.length) {
                throw new Error('colName\'s length unequal colModel\' length...');
            }
        },
        setColModel: function () {
            var colModel = this.settings.colModel, tmp = this.settings.colModelTmp,
                isFixed = this.settings.shrinkToFit, len = colModel.length, i = 0;


            for (; i < len; i++) {
                colModel[i] = $.extend(true, {}, tmp, colModel[i]);

                // 当自动宽度时，固定最后一列 ,removed by wqy
                /*if (isFixed && (i == len-1)) {
                    colModel[i].resizAble = false
                } */
            }
        },
        setColWidth: function () {
            var width = 0, settings = this.settings, scw = settings.scrollWidth,
                gw = 0, clt = settings.cellLayout,
                cr;

            $.each(settings.colModel, function (i) {
                if(this.hidden){
                    return;
                }
                var iwidth = this.width = parseInt(this.width);

                this.widthOrg = iwidth;
                width += this.widthOrg+clt;

                if (this.fixed === true) {
                    gw += iwidth+clt
                }
            });

            settings.tblwidth = width;
            if (settings.shrinkToFit) {
                width = 0;

                $.each(settings.colModel, function (i) {
                    if(this.hidden)
                        return;
                    if (this.fixed !== true) {
                        this.width = Math.round((settings.width - gw - scw)*(this.width+clt)/(settings.tblwidth -gw)) - clt;
                    }
                    width += this.width+clt;
                });

                if ((cr = settings.width - scw - width) !== 0) {
                    if((cr +  settings.colModel[settings.colModel.length-1].width) < 0){   //防止用户设置的都是fixed，做resize的时候出问题。
                        width += cr;
                        settings.colModel[settings.colModel.length-1].width += cr;
                    }
                }
                settings.tblwidth = width;
            }
        },
        addMultiSelect: function (name) {
            var settings = this.settings;

            if (settings.multiSelect) {
                settings.colName.unshift('<input type="checkbox" class="cb_'+this.id+'" aria-checkall=true />');
                settings.colModel.unshift({
                    name: name,
                    width: settings.multiSelectWidth,
                    sortable: false,
                    style: {textAlign: 'center'},
                    resizAble: false,
                    fixed: true
                })
            }
        },
        addRowsMark: function (name) {
            var settings = this.settings;

            if (settings.rowMark) {
                settings.colName.unshift(language.text('grid.No'));//编号名字
                if(settings.isGlobalResizAble==false){
                    settings.colModel.unshift({
                        name: name,
                        width: 40,
                        sortable: false,
                        style: {textAlign: 'center'},
                        //grid序号列实现可拖拽功能
                        resizAble: false,
                        fixed: true
                    })
                }else{
                    settings.colModel.unshift({
                        name: name,
                        width: 40,
                        sortable: false,
                        style: {textAlign: 'center'},
                        //grid序号列实现可拖拽功能
                        resizAble: true,
                        fixed: true
                    })
                }

            }
        },
        selSelect: function (el) {
            var id = el.attr('id'), isMulti = this.settings.multiSelect,className = el[0].className;

            if(className.indexOf(classes.zebraTrcss) > -1)
                return;

            if (!isMulti && !this.settings.multiSelSingle) {
                this.bdiv.find('[aria-selected=true]')
                    .removeAttr('aria-selected')
					.removeClass('ui-state-highlight')
                    .find('input[type=checkbox]')
                    .attr('checked', false);
            }


            var obj=el.find('input[type=checkbox]');
            if(obj.length && !obj[0].disabled){
                el.attr('aria-selected', 'true')
                    .addClass('ui-state-highlight')
                obj.attr('checked', true);

            }
            this.selected =  this.selected || [];
            this.selected.push(id);

        },
        nselSelect: function (el) {
            var id = el.attr('id'), isMulti = this.settings.multiSelect, ia;

            el.attr('aria-selected', 'false')
                .removeClass('ui-state-highlight')
                .find('input[type=checkbox]').attr('checked', false);

            this.selected =  this.selected || [];

            for(var i = 0,len = this.selected.length; i< len; i++){
                if(this.selected[i] == id){
                    this.selected.splice(i,1);
                    i = len -1;
                }
            }
        },
        resetSelect: function () {
            var selected = this.selected = [];

            this.bdiv.find('[aria-selected=true]').each(function () {
                selected.push($(this).attr('id'))
            })
        },
        setDataTip: function () {
            var tips = this.wrap.find('.jqgrid-tips');
            if (this._pageData['rows'].length === 0) {
                tips.length === 0&&this.bdiv.append('<div class="jqgrid-tips msg-weak msg-tips nodata"><i></i><div class="msg-cnt"><span>'+language.text('tree.noData')+'</span></div></div>')
            } else {
                tips.remove();
            }
        },
        isAllSelect: function () {
            var allCheck = $('.cb_' + this.id);
            var disabledChecboxLen=this.view.find('table input[role=checkbox][disabled]').length
            if ((this.view.find('table input[role=checkbox]').length-disabledChecboxLen) === this.view.find('table input[role=checkbox]:checked').length) {
                allCheck.attr('checked', true)
            } else {
                allCheck.attr('checked', false)
            }
            //console.info('checkbox:' + (+new Date() - bb));
        },
        updatapager: function (data) {

            if (this.dpage) {
                var page = data.page, ppage = page-1, npage= page+1, fpage = 1,
                    lpage = data.totalPage;

                if (this.settings.pagerButtons&&!this.settings.isEasyPager) {
                    this.dpage.find('[aria-pager=prev]')[ppage < 1 ? 'addClass' : 'removeClass' ]('ui-state-disabled');
                    this.dpage.find('[aria-pager=next]')[npage > lpage ? 'addClass' : 'removeClass' ]('ui-state-disabled');
                    this.dpage.find('[aria-pager=first]')[page == 1 ? 'addClass' : 'removeClass' ]('ui-state-disabled');
                    this.dpage.find('[aria-pager=last]')[page == lpage || lpage == 0 ? 'addClass' : 'removeClass' ]('ui-state-disabled');
                    this.dpage.find('.ui-pg-input').val(page);
                }
                if(this.settings.isEasyPager){
                    var dataLen=data.rows.length,isLastPager=data.isLastPage;
                    this.dpage.find('[aria-pager=first]')[page == 1 ? 'addClass' : 'removeClass' ]('ui-state-disabled');
                    this.dpage.find('[aria-pager=prev]')[ppage < 1 ? 'addClass' : 'removeClass' ]('ui-state-disabled');
                    this.dpage.find('[aria-pager=next]')[isLastPager? 'addClass' : 'removeClass' ]('ui-state-disabled');
                }
                this.resetSelect();
            }
        }
    });

    $.grid._queue = function (data) {
        this.data = data;
    }

    $.grid._queue.order = {
        init: function (a, b, isasc) {
            var b = parseInt(a) >= parseInt(b);

            return isasc ? b : !b
        },
        string: function (a, b, isasc) {
            var b = a.toString() >= b.toString();

            return isasc ? b : !b
        }
    }

    $.grid._queue.prototype = {
        select: function () {
            return this.data
        },

        order: function (obj, name, type, order, fuc) {
            var data = this.select(), map = [], fuc = fuc || $.grid._queue.order[type];

            $.each(data, function (i, n) {
                var j=map.length, f=0;
                if (j == 0) {
                    map.push(n);
                }

                for (; f < j; f++) {
                    if (!fuc(n[name], map[f][name], order)) {
                        map.splice(f, 0, n);
                        break;
                    }

                    if (f == j-1) {
                        map.splice(f+1, 0, n);
                    }
                }
            })
            this.data = obj.data = map;
            return map
        }
    }

    // data model
    $.extend($.grid.prototype, 
    	/**@ignore*/
    	{
       groupHeaderModel:function(header){
           var settings = this.settings, id = this.id,
               colName = settings.colName,colModel = settings.colModel,
               dir = settings.direction,
               i, length = colModel.length,tmpModel0, title,temp,numberOfColumns,w,isHidden = false;
//           header.push("<tr class='jqgfirstrow' role='row' style='height:0;'>");
//           for (i=0; i < length; i++) {
//                w = colModel[i].width;
//                isHidden = colModel[i].hidden;
//                header.push("<td role='columnheader' style='height:0px; width: "+w+"px;"+ (isHidden ? 'display:none' : '') +"' aria-describedby='gd_"+id+ "_" +colModel[i].name+"'></td>");
//           }
//           header.push('</tr>');

           header.push(this.viewFirstRow(colModel).join(''));
           if(settings.isGroupheaders){
               header.push("<tr class='ui-jqgrid-labels' style='border-bottom: 1px solid #CCCFD4' role='rowheader'>") ;
               var k,hiddenNum,num,dir,dis0,groupHead = settings.groupHeaders,groupHeadLength = groupHead.length;
               for (i=0; i < length;i++) {
                   tmpModel0 = colModel[i];
                    k = hiddenNum = num = 0;
                    dir = tmpModel0.dir || settings.direction;
                   dis0 = tmpModel0.hidden ?'display:none;' : '';
                   for( ;k<groupHeadLength;k++){
                       if(tmpModel0.name==groupHead[k].startColumnName){
                           numberOfColumns = groupHead[k].numberOfColumns;
                           //判断起止列是否隐藏，若隐藏则向后查询不隐藏列， 若当前跨列中所有元素隐藏，则不显示该一级标题
                           if(tmpModel0.hidden){
                               for(var n= i,len = (i+numberOfColumns) ;n<len;n++){
                                   if(!colModel[n].hidden){
                                       groupHead[k].startColumnName=colModel[n].name ;
                                       groupHead[k].numberOfColumns=numberOfColumns-num ;
                                       dis0 = colModel[n].hidden ?'display:none;' : '';
                                       break;
                                   }
                                   num++;
                               }
                               if(num==numberOfColumns){
                                   groupHead[k].startColumnName="";
                                   groupHead[k].numberOfColumns=0;
                                   groupHead[k].titleText="";
                                   dis0 ='display:none';
                               }
                           }
                           numberOfColumns =groupHead[k].numberOfColumns;
                           //当设定的列数大于剩余长度时，默认为列数为剩余长度
                           if(numberOfColumns>(length-i-num)){
                               numberOfColumns=length-i-num ;
                           }
                           //获取当前跨越的列数内隐藏的元素个数
                           //判断是都有交集，或有，默认为前一个
                           for(var j=0 ;j<numberOfColumns;j++){
                               if(colModel[i+num+j].hidden){
                                   hiddenNum=hiddenNum+1;
                               }
                               if((groupHeadLength>1)&&(k+1)<groupHeadLength&&colModel[i+num+j].name==groupHead[k+1].startColumnName){
                                   groupHead[k+1].numberOfColumns=groupHead[k+1].numberOfColumns-numberOfColumns+j;
                                   if((i+numberOfColumns+num)>(length-1)){
                                       groupHead[k+1].startColumnName="";
                                   } else  if(groupHead[k+1].numberOfColumns<=0) {
                                       groupHead[k+1].numberOfColumns=0;
                                       groupHead[k+1].startColumnName="";
                                   }
                                   else {
                                       groupHead[k+1].startColumnName=colModel[i+numberOfColumns+num].name   ;
                                   }
                               }
                           }
                           temp=groupHead[k].titleText;
                           i=i+numberOfColumns+num-1;
                           break;
                       }else{
                           temp="";
                           numberOfColumns=1;
                       }
                   }

                   header.push("<th id='gd_0_" + id + '_' + tmpModel0.name + "' colspan='"+(numberOfColumns-hiddenNum)+"' style='"+ dis0 +"' role='columnheader'");
                   header.push(" class='ui-state-default ui-th-column ui-th-"+dir +"' title='" + temp+ "'>");
                   header.push(settings.isGlobalResizAble&&colModel[i].resizAble !== false ? "<span class='ui-jqgrid-resize ui-jqgrid-resize-"+ dir + "'>&nbsp;</span>" : "");
                   header.push("<div id='gdd_0_" + id + '_' + tmpModel0.name + "'"+(tmpModel0.sortable ? "class='ui-jqgrid-sortable'" : "")+">" + temp);
                   header.push("</div></th>");

               }
           }
       },


        populate: function (target) {
            var settings = this.settings, dataType = settings.dataType, pdata;

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
        },
        /**@ignore*/
        populateInt: function () {
            this._count = 1;
            this._keyIndex = {};
        },
        /**@ignore*/
        beginReq: function () {
            var events = this.settings.events;

            this.loaded.show();
            this.wrap.triggerHandler('onBeginRequest', [this]);
        },
        /**@ignore*/
        endReq: function (target) {
            var events = this.settings.events;

            this.loaded.hide();
            if(target && target.length)
                target.removeAttr('disabled');
            if(this.settings.modelList!==null && this._pageData)
                this.settings.modelList.add(this._pageData.rows);
            this.wrap.triggerHandler('onEndRequest', [this]);

        },
        parseDynamicData : function(dyData){
            var data;
            if(typeof dyData == 'function')
                data= dyData();
            else if(Object.prototype.toString.call(dyData) == '[object Array]'){
                data = dyData;
            }else if(Object.prototype.toString.call(dyData) == '[object Object]'){
                data = [dyData];
            }
            return data;
        },
        /**@ignore*/
        ajaxDataFormart: function (target) {
            var data = {}, settings = this.settings, dcData = settings.ajaxRequestReader,
                dyData, stData = settings.ajaxStatic, that = this;
						if(settings.userCookies && this.storage &&this.storage.getItem('sortorder')!==undefined)
                settings.sortorder=this.storage.getItem('sortorder')!==null? this.storage.getItem('sortorder'): settings.sortorder;
            for (var i in dcData) {
                data[dcData[i]] = settings[i];
            }

            data = $.extend(true, data, stData,{
                _time : new Date()
            });

           dyData = this.parseDynamicData(settings.ajaxDynamic);
            if(typeof dyData != 'undefined'){
                for(var i = 0,len = dyData.length; i < len; i ++){
                    if(dyData[i].name)
                        data[dyData[i].name] = dyData[i].value;
                    else{
                        for(var prop in dyData[i]){
                            if(dyData[i].hasOwnProperty(prop)){
                                data[prop] = dyData[i][prop];
                            }
                        }
                    }
                }
            }


            var ajaxOpts = $.extend({
                url: settings.url,
                data: data,
                dataType: settings.dataType,
                beforeSend: function () {
                    that.beginReq();
                },
                success: function (d) {

                    var rData = {}, aoptions = settings.ajaxResponseReader, records, rows, page;
										if(!d[aoptions['rows']]){//数据格式不正确。
                        return;
                    }
                    page = rData['page'] = d[aoptions['page']] || settings.page;
                    records = rData['records'] = d[aoptions['records']];
                    rData['totalPage'] = d[aoptions['totalPage']] || Math.ceil(records/settings.rowNum);
                    rows = rData['rows'] = (typeof d[aoptions['rows']] == 'string') ? $.parseJSON(d[aoptions['rows']]) : d[aoptions['rows']];
                    rData['isLastPage']=d[aoptions['isLastPage']]==1?true:false;
                    //单独在这里做的原因是因为把rows和settings.data赋为同一个对象，后面addRowData的时候同时对rows和settings.data进行push会做两次动作
                    if(Object.prototype.toString.apply(rows)  === '[object Array]'){
                        settings.data = rows.concat();
                    }
                    that._pageData = rData;
                    if(!that._pageData.rows){
                        return;
                    }else{
                        that.refreshIndex();
                    }
                    that.parseJsonData(rData);
                    that.updatapager(rData);
                    that.setDataTip();


                },
                error: function (e) {
                },
                complete : function(){
                    //解决调整列宽后拖动下方滑动条，列表对应不齐
                    if((that.hdiv.width()-18)<that.hdiv.find("table").width()&&that.bdiv.get(0).scrollHeight>that.bdiv.get(0).clientHeight){
                        that.hdiv.find(".ui-jqgrid-hTableBox").css({"margin-right":"18px"});
                    }else{
                        that.hdiv.find(".ui-jqgrid-hTableBox").css({"margin-right":"0"});
                    }
                    that.endReq(target);
                }
            }, settings.ajaxOptions)

            
                $.ajax(ajaxOpts);


        },
        /**@ignore*/
        localDataFormart: function () {
            var settings = this.settings, data = settings.data = settings.data || [], rData = {}, rowNum = settings.rowNum, page = settings.page,
                queueObj, queue, colModel = settings.colModel, records, i;

            if(Object.prototype.toString.call(data) == '[object Object]'){
                queueObj = this.dataForm(data[settings.ajaxResponseReader.rows]);
            }else{
                queueObj = this.dataForm(data);
            }
            queue =  queueObj.select();

            if (settings.sortable && settings.sortname) {
                $.each(colModel, function (j, n) {
                    if (n.name === settings.sortname) {
                        i = j;
                        return false;
                    }
                })
                queue = queueObj.order(this, settings.sortname, colModel[i]['sorttype'],
                    settings.sortorder == 'asc' ? true : false, colModel[i]['sortfuc']);
            }
            records = queue.length;

			if(settings.pagerButtons){
				rData['page'] = page;
				rData['rows'] = records ? queue.slice((page-1)*rowNum, page*rowNum) : [];
				if(settings.isEasyPager){
					rData['isLastPage']=page*rowNum>=records&&records>(page-1)*rowNum? true:false;
				}else{
					rData['totalPage'] = records ? Math.ceil(records/settings.rowNum) : 0;
				}

			}else{
				rData['page'] = 1;
				//rData['rows']=queue;
				rData['rows']=records ? [].concat(queue):[];
				rData['totalPage']=1;
			}
            rData['records'] = records ? records : 0;
            this._pageData = rData;
            this.refreshIndex();
            return rData;
        },
        /**@ignore*/
        dataForm: function (data) {
            return new $.grid._queue(data);
        },
		/**@ignore*/
        parseJsonData: function (data) {
            var settings = this.settings, rows = data.rows, rowData = [], page = data.page, m, idr,
                j, firstTr, table, maxHeight = 0,pHeight = 0, trHeight = 28,checkall;
            this.createRows(rows, rowData, (page-1)*settings.rowNum + 1);
            //if pagerFixed ,table is not unique
            table = this.bdiv.find('#' + this.id + ' tbody');
            if(table.length > 1){
                table = table.eq(0);
            }
            firstTr = table.find('tr.jqgfirstrow').eq(0);

            //防止分页跳转时，上一次的全选状态需要重置
            checkall = this.hdiv.find('[aria-checkall=true]');
            if(checkall.length && (checkall.attr('checked') == 'checked')){
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
        },
        /**@ignore*/
        getDataIndex: function (id) {
            var index = this.getGridDataIndex(id), data = this.settings.data,
                pageData = this._pageData.rows;

            return $.inArray(pageData[index], data);
        },
        /**@ignore*/
        getGridDataIndex: function (id) {
            id = this.transToId(id);

            return this._keyIndex[id];
        },
        getcolModelIndexByName: function (name) {
                var index,
                    colModel = this.settings.colModel;

                $.each(colModel, function (i, n) {
                    if (name === n.name) {
                        index = i;
                    }
                });

                return index;
            },
        /**
         * 刷新id与_pageData的映射关系
         * 和createId创建规则对应
         * @ignore
         */
        refreshIndex: function () {
            var settings = this.settings, colModel = settings.colModel, data = this._pageData.rows,
                key, row, that = this,childKey = settings.ajaxResponseReader.children || 'data';

            if (settings.key) {
                for (var i=0; i < colModel.length; i++) {
                    if (colModel[i].key) {
                        this._key = colModel[i].name
                        break;
                    } else if (colModel[i].name == 'id') {
                        key = 'id'
                    }
                }
                !this._key && (this._key = key);
            }
           var count = -1,setKeyIndex = (function f(data,baseCount){
               if(Object.prototype.toString.call(data) != '[object Array]'){
                   data = [data];
               }
               for (var j=0; j < data.length; j++) {
                   if (that._key) {
                       row = data[j][that._key];
                       that._keyIndex[row] = baseCount >= 0 ? baseCount : j;
                   } else {
                       that._keyIndex[j+1] = baseCount >= 0 ? baseCount : j;
                   }
                   if(data[j][childKey] && data[j][childKey].length){
                       f(data[j][childKey], baseCount >= 0 ? baseCount : j);
                   }
               }
           })
            setKeyIndex(data,count);
        },
        transferRowsData:function(data){},
        /**@ignore*/
        createRows: function (rows, rowData, m) {
            if (!$.isArray(rows)) {
                rows = [rows]
            }
            var length = rows.length, settings = this.settings, colModel = settings.colModel,
                i = 0, z, colval,additionLength = this.additionalCols.length, j;

            for (; i < length; i++, m++) {
				z = 0;
                j =0;
                idr = this.createId(rows[i]);
                this.viewTr(rowData, idr, m%2 === 0);
                for (;z < additionLength;z++) {
                    colval = colModel[z];

                    this.additionalCols[z].callback.call(this,rowData, idr, m, colval,rows[i]);
                    j++;
                }

                for (; j < colModel.length; j++) {
                    this.viewCell(rowData,  rows[i][colModel[j].name]==(undefined||null)? '':rows[i][colModel[j].name], rows[i], colModel[j].formart, colModel[j]);
                }
                this.viewTrEnd(rowData);
            }

        },
        createEmptyRows : function(rows,height,isEven){
            var colModel = this.settings.colModel;
            rows.push('<tr style="height:',height,'px;" class="', classes.zebraTrcss,' ui-widget-content jqgrow ui-row-ltr ', isEven ? 'grid-even': '','">');
                for(var i = 0 , len = colModel.length; i < len; i++){
                    rows.push('<td style="display:',colModel[i].hidden? "none":"",'" aria-describedby="',colModel[i].name,'"></td>');
                }
            rows.push('</tr>')
        },
		/**@ignore*/
        changeMarkAndView: function () {
            var elem = this.bdiv.find('.jq-grid-rowmark');

            $.each(elem, function (i, n) {
                var el = $(this), parent = el.parents('tr'), index = i+1;

                el.html(index)
                    .attr('title', index);

                parent[i%2 === 0 ? 'removeClass':'addClass']('grid-even');
            });
        }
    })

    // view Model
    $.extend($.grid.prototype, 
    	/**@ignore*/
    	{
        viewWrap: function () {
            if(this.elem[0].tagName.toLowerCase() != 'table'){
                var newId = this.id + '_table';
                this.elem.append('<table id="'+ newId +'"></table>');
                this.elem = this.elem.find('table');
                this.id = newId;
            }
            var id = this.id, elem = this.elem.addClass(classes.btableClass),
                view =this.view = $.grid.createDom({'class': classes.viewClass, id: classes.viewId + id}),
                wrap = this.wrap = $.grid.createDom({'class': classes.wrapClass+' '+ classes.defaultCls, id: classes.wrapId + id}),
                loaded = this.loaded = $.grid.createDom({'class': classes.loadedClass, id: classes.loadedId + id});

            view.insertBefore(elem).append(elem);
            wrap.insertBefore(view).append(view);
            loaded.insertBefore(view).html(language.text('loading'));

            //TOFIXED ie6下this.wrap.innerWidth()为0
            this.settings.width = this.wrap.parent().innerWidth();
            this.wrap.width(this.settings.width);
        },

        viewHeadWrap : function(){
            var settings = this.settings,headWrap = [],dir = settings.direction;
            headWrap.push("<div class='ui-state-default ui-jqgrid-hdiv' style='width:"+settings.width+"px'>");
            headWrap.push("<div class='ui-jqgrid-hbox" + (dir==="rtl" ? "-rtl" : "" )+"'>");
            headWrap.push('</div></div>');
            this.hdiv = $(headWrap.join(''));
        },
        viewHeaderTr : function(colModel,colName){
            var settings = this.settings,tHead = [], i, length,colName = colName || settings.colName,colModel = colModel || settings.colModel,tmpName, tmpModel, title,id = this.id,dir,allSelect;
            tHead.push("<tr class='ui-jqgrid-labels' role='rowheader'>") ;
            for (i = 0, length = colModel.length; i < length; i++) {
                tmpName = colName[i];
                tmpModel = colModel[i];
                dir = tmpModel.dir || settings.direction;
                title = settings.headTitle && (tmpModel.name !== 'sl') ? tmpName : '';
                allSelect=(tmpModel.name !== 'sl') ? "":"allSelect";
                var dis = tmpModel.hidden ? 'display:none;' : '';
                tHead.push("<th id='gd_" + id + '_' + tmpModel.name + "' style='" + dis + "' role='columnheader'");
                tHead.push(" class='ui-state-default "+allSelect+" ui-th-column ui-th-" + dir + "' title='" + title + "'>");
                tHead.push(settings.isGlobalResizAble&&colModel[i].resizAble !== false ? "<span class='ui-jqgrid-resize ui-jqgrid-resize-" + dir + "'>&nbsp;&nbsp;</span>" : "");
                tHead.push("<div id='gdd_" + id + '_' + tmpModel.name + "'" + (tmpModel.sortable ? "class='ui-jqgrid-sortable'" : "") + ">" + tmpName);
                tHead.push("<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc ui-i-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + dir + "'></span>");
                tHead.push("<span sort='desc' class='ui-grid-ico-sort ui-icon-desc ui-i-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + dir + "'></span>");
                tHead.push("</div></th>");
            }
            tHead.push('</tr>');
            return tHead;
        },
        /**@ignore*/
        viewThead: function () {
            var start = +new Date();
            var settings = this.settings, tHead = [];

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
            var end = +new Date();
            this.viewTable();
        },

        /**@ignore*/
        viewResizeMark: function () {
            this.resize = $("<div class='ui-jqgrid-resize-mark' id='rs_m"+this.id+"'>&#160;</div>");
            this.view.append(this.resize);
        },
        /**@ignore*/
        viewTable: function () {
            var settings = this.settings,firstRow = [];
            this.elem.width(settings.tblwidth);
            this.elem.attr({cellspacing:"0",cellpadding:"0",border:"0","role":"grid"});
            this.viewResizeMark();
            firstRow.push(this.viewFirstRow(settings.colModel).join(''));
            $('<tbody>').appendTo(this.elem).append(firstRow.join(''));
            this.viewhDiv();
        },
        /**@ignore*/
        viewFirstRow: function (model) {
            var firstRow = [], settings = this.settings, colModel = model || settings.colModel,
                i, length, w,isHidden = false,id = this.id;

            firstRow.push("<tr class='jqgfirstrow' role='row' style='height:0;'>");

            for (i=0, length=colModel.length; i < length; i++) {
               w = colModel[i].width;
               isHidden = colModel[i].hidden;
               firstRow.push("<td role='gridcell' style='height:0px; width: "+w+"px;"+ (isHidden ? 'display:none' : '') +"' aria-describedby='gd_"+id+ "_" +colModel[i].name+"'></td>");
			}
            firstRow.push('</tr>');
            return firstRow;
        },
        /**@ignore*/
        viewPager: function () {
            var settings = this.settings, pager = [], id = /^#/.test(settings.pager) ? settings.pager : "#"+settings.pager, gid = $.grid.substring(id, 1),
                dir = settings.direction, str = '', i = 0, length = settings.rowList.length, pinput, sep;
            if(!id || id == '#'){
                id = 'pager_' + this.id;
                this.view.after('<div id="'+ id +'"></div>');
                id = '#' + id;
            }
            if (id && (this.dpage = $(id))) {
                if(settings.pagerFixed){
                    this.view.addClass('pager-fixed');
                    this.dpage.addClass('ui-pagination-fixed').appendTo(this.wrap)
                        .addClass('ui-state-default ui-jqgrid-pager ui-corner-bottom')
                        .width(this.wrap.parent()[0].clientWidth);
                }else{
                    this.dpage.appendTo(this.bdiv)
                        .addClass('ui-state-default ui-jqgrid-pager ui-corner-bottom')
                        .width(this.wrap.parent()[0].clientWidth);
                }

                pager.push("<div id='pg_"+gid+"' class='ui-pager-control' role='group'>");
                pager.push("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'>");
                pager.push("<tbody><tr><td id='"+gid+"_left' align='left'>");
                pager.push("<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table ui-pg-left'><tbody><tr>");
            
								 if(!settings.isEasyPager){
                    pager.push("<td><div class='ui-paging-info' id='ip_l_"+gid+"'></div></td>");
                    pager.push("<td><div id='sp_1_"+gid+"' class='ui-pg-current'></div></td>");
                }

                if(settings.userCookies && this.storage &&this.storage.getItem('limit')!==undefined ){
                    
                    settings.rowNum=this.storage.getItem('limit')!==null? parseInt(this.storage.getItem('limit')):settings.rowNum;
                }
                if (length > 0) {
                    pager.push("<td>"+language.text('page.pgTotal')+"</td>");
                    pager.push("<td dir='"+dir+"'>");
                    pager.push("<select class='ui-pg-selbox' role='listbox'>");
                    for (; i < length; i++) {
                        pager.push("<option role='option' value='"+settings.rowList[i]+"'"+((settings.rowNum === settings.rowList[i]) ? " selected='selected'":"")+">"+settings.rowList[i]+"</option>");
                    }
                    pager.push("</select></td><td>"+language.text('page.item')+"</td>");
                }
                pager.push("</tr></tbody></table>");
                pager.push("</td><td id='"+gid+"_center' align='center' style='white-space:pre;'>");



                pager.push("</td><td id='"+gid+"_right' align='right' class='floatR'>" );
                pager.push("<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table ui-pg-right'><tbody><tr>");
                pinput ="<td dir='"+dir+"'><input class='ui-pg-input notvalidate' type='text' size='2' maxlength='7' value='0' role='textbox'/>"+
                    "<span id='sp_1_"+gid+"'></span></td>";
                sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>";


                if (settings.pagerButtons) {
                    pager.push("<td id='first_"+gid+"' aria-pager = 'first' class='ui-state-first ui-pg-button ui-corner-all'><a href='javascript:void(0);'>"+language.text('page.firstPage')+"</a></td>");
                    pager.push("<td id='prev_"+gid+"' aria-pager = 'prev' class='ui-state-prev ui-pg-button ui-corner-all'><a href='javascript:void(0);'>"+language.text('page.prePage')+"</a></td>");
                    pager.push("<td id='next_"+gid+"' aria-pager = 'next' class='ui-state-next ui-pg-button ui-corner-all'><a href='javascript:void(0);'>"+language.text('page.nextPage')+"</a></td>");

                		if(!settings.isEasyPager){
                        pager.push("<td id='last_"+gid+"' aria-pager = 'last' class='ui-state-last ui-pg-button ui-corner-all'><a href='javascript:void(0);'>"+language.text('page.lastPage')+"</a></td>");
                        pager.push("<td>"+language.text('page.toPage')+"&nbsp;<input class='ui-pg-input notvalidate' type='text' size='2' maxlength='7' value='1' vtype='number' role='textbox'/>&nbsp;"+language.text('page.unit')+"</td>");
                        pager.push("<td id='last_"+gid+"' aria-pager = 'jump' class='ui-state-jump ui-pg-button ui-corner-all'><a href='javascript:void(0);'>"+language.text('page.jump')+"</a></td>");
                    }
                } else {
                    pager.push(pinput)
                }

                pager.push("</tr></tbody></table>");

                pager.push("</td></tr></tbody></table></div>");
                this.dpage.append(pager.join(''));

                //限制input的输入
                this.dpage.find('.ui-pg-input').on({
                    keypress : function(){
                        var code = (event.keyCode ? event.keyCode : event.which);  //兼容火狐 IE
                        if(!$.browser.msie&&(event.keyCode==0x8))  //火狐下不能使用退格键
                        {
                            return ;
                        }

                        if (code === 13) {
                            settings.page = $.grid.parseInt(this.value, 1);
                            if(settings.page)
                                return true;
                            else
                                return false;
                        }
                        return code >= 48 && code<= 57;
                    },
                    keyup : function(){
                        if (/(^0+)/.test(this.value) && this.value.length > 1) {
                            this.value = this.value.replace(/^0*/, '');
                        }
                    } ,
                    blur : function() {
                        var val = this.value;
                        val = val.replace(/\.$/, '');
                        var pattern = /^\d+(\.\d*)?$/;
                        this.value = pattern.test(val) ? val : '';
                    },
                    paste : function() {
                        if (window.clipboardData) {
                            var s = window.clipboardData.getData('text');
                            if (!/\D/.test(s));
                            this.value = s.replace(/^0*/, '');
                        }
                        return false;
                    }
                });
            }
            //this.viewhDiv();
        },
        /**@ignore*/
        viewhDiv: function () {
            var settings = this.settings, wrap;//, height = isNaN(settings.height) ? settings.height /*this.view.parent().parent().height() - 25*/ : settings.height + 'px';
            this.bdiv = $('<div class="ui-jqgrid-bdiv" style="width:'+settings.width+'px;"></div>');
            this.bdiv.append(this.elem).appendTo(this.view);
           if(settings.pagerButtons)
                this.viewPager();
        },
        /**@ignore*/
        viewRowMark: function (rowdata, idr, i, colModel) {
            var style = this.setCellAttr(i, colModel);

            rowdata.push('<td role="gridcell" class="jq-grid-rowmark"'+style+'>'+i+'</td>');
        },
        /**@ignore*/
        viewMultiSelect: function (rowdata, idr, i, colModel,data) {
            var id = this.id, style = this.setCellAttr('', colModel),isDisable;
                isDisable=data.disabled==true ? 'disabled':'';
            rowdata.push('<td role="gridcell" class="jq-grid-multiselect ',isDisable,'"'+style+'>');
            rowdata.push('<input role="checkbox" ',isDisable,' type="checkbox" id="gq_'+id+"_"+idr+'" class="cbox" name="gq_'+id+"_"+idr+'"/>');
            rowdata.push("</td>");
        },
        /**@ignore*/
        viewCell: function (rowdata, data, dataRow, fn, colModel) {
            var val = $.grid.dataFormart(data, dataRow, fn), style,id = this.id;

            data = $.grid.stripHtml(data);
            style = this.setCellAttr(val, colModel);
            rowdata.push('<td role="gridcell" ',style,' aria-describedby="gd_',id , '_' , colModel.name ,'">',val,'</td>');
        },
        /**@ignore*/
        setCellAttr: function (data, colModel) {
            var style,td="",settings = this.settings;
            if(colModel.showTitle){
                if(colModel.rowTitle && colModel.treeCol){
                    style = 'title="'+colModel.rowTitle+'" style="';
                }else {
                    var titleContent=(/<[^>]+>/g).test(data) ? "": data         //判断是否为标签元素
                    style = 'title="'+titleContent +'" style="';
                }
            }else{
                style = 'style="'
            }
            if(Object.prototype.toString.call(colModel.style) == '[object Object]'){
                for(var props in colModel.style){
                    if(colModel.style.hasOwnProperty(props)){
                        td += props.replace(/([A-Z])/g,"-$1").toLowerCase() + ':' + colModel.style[props] + ';';
                    }
                }
            }
            //td = colModel.style ? (td = $('<td></td>'), td.css(colModel.style), td.attr('style')) : '';为了性能改进做的改动
            if (settings&&(!settings.resizable || colModel.fixed)) {
                style += 'width: '+colModel.width+'px; ';
            }
            if(colModel.hidden){
                style += 'display:none;'
            }
            style += td;
            return style + '"'
        },
        /**@ignore*/
        viewTr: function (rowdata, i, even,level) {
            rowdata.push('<tr role="row" id="',this.createTagId(i),'" tabindex="-1" data-level = "',level,'" class="ui-widget-content jqgrow ui-row-ltr ',(even ? "grid-even" : ""),'">');
        },
        /**@ignore*/
        viewTrEnd: function (rowdata) {
            rowdata.push('</tr>');
        },
        /**@ignore*/
        viewPagerNum: function (data) {
            if (this.dpage &&!this.settings.isEasyPager) {
                var settings = this.settings, dpager = this.dpage, gid = $.grid.substring(settings.pager, 1);

                if (dpager) {
                    dpager.find('#sp_1_' + gid).html(language.text('page.pgText',[data.page > data.totalPage ? data.totalPage : data.page, data.totalPage]));
                    dpager.find('#ip_l_' + gid).html(language.text('page.recordText',  data.records));
                }
            }
        }
    })

    // 外部调用的接口
    $.extend(($.grid.fn = {}), {
        /**@ignore*/
        setOptions: function (name, val) {
            var tempOptions = {};

            if (typeof name === 'object' && val == null) {
                tempOptions = name;
            } else {
                tempOptions[name] = val;
            }

            $.extend(true, this.settings, tempOptions);
            return this
        },
        /** @ignore*/
        getOptions: function (name) {
            return this.settings[name]
        },
        clearGridData : function(){
            var data = this.settings.data, pageData = this._pageData,table = this.bdiv.find('#'+ this.id  + ' tbody'),height = table.height(),mHeight = this.wrap.height(), that = this;
            table.find('tr').not('.jqgfirstrow').empty();
            data = [],pageData.rows = [],pageData.records = 0,pageData.totalPage = pageData.page = 1;
            this.selected = [];
             this.settings.data = [];
            this.changeMarkAndView();
            this.viewPagerNum(pageData);
            this.refreshIndex();
            if(this.settings.height == 'auto'){
                var fn =  $.grid['onGridResize'];
                //这里如果使用width，会导致宽度一下变小一下变大的bug
                fn.apply(that,[that.wrap.parent()[0].clientWidth,mHeight-height]);
            }
            if(this.settings.modelList!==null)
                this.settings.modelList.add(pageData.rows);
        },
        destroy : function(){
            this.unClientEvent();
            this.unDelegateEvent();
            $.grid.fn.clearGridData.call(this);
            this.wrap.empty();
            this.elem.data('grid',  null);
        },
        /**
         * 删除表格行
         * @method
         * @param {array} sid 当前行Id，可以通过getSelRow获取
         * @example
         * var id = $('table').grid('getSelRow')[0]
         * $('table').grid('delRowData', id)
         */
        delRowData: function (sid) {
            var data = this.settings.data, pageData = this._pageData,that = this,
                index, pIndex, elem,elemLen,indexArray=[],indexObj = {},deleArray=[];

            if (!$.isArray(sid)) {
                sid = [sid];
            }
            elemLen = sid.length;
			$.each(sid,function(i,n){
				elem = that.getTrById(n);
				if(that._key){
					 index = that.getDataIndex(n);
				}else{
					index = elem.index()-1;
				}

				indexObj[parseInt(index)]=elem;
				indexArray.push(index);
			})
            $.each(indexObj, function (i, n) {
				elem = n;
                if(elem.length){
                   // data.splice(index, 1);
                  //  pageData.rows.length && pageData.rows.splice(index,1);
                    elem.remove();
                    that.wrap.triggerHandler('onDelRowData', [elem])
                }else{
                    elemLen--;
                }

            });

			this.settings.data=$.map(data,function(item,index){
				if($.inArray(index,indexArray)<0){
					return item;
				}else{
					deleArray.push($.extend(true,{},item));
				}

			})
			if(pageData.rows.length)
				pageData.rows=$.map(pageData.rows,function(item,index){
					if($.inArray(index,indexArray)<0)
					return item;
				})



             if((pageData.totalPage == this.settings.page) && (pageData.rows.length == elemLen)){
                 this.settings.page = this.settings.page > 1 ? this.settings.page -1 : this.settings.page;
             }
            //清空选中的列表
            this.selected = [];
            pageData.records -= elemLen;
            if(this.settings.pagerButtons)
                this.populate();
            else {
                this.changeMarkAndView();
                this.viewPagerNum(pageData);
                this.refreshIndex();
                if(this.settings.modelList!==null)
                    this.settings.modelList.add(pageData.rows);
            }
			return deleArray;


        },
        /**
         * 通过Id获取data
         * @method
         * @param {array} sid 数据里有key属性的一列，没有设置key，默认行号，可以通过getSelRow获取
         * @param {string} 要查询的某列的属性值
         */
        getDataByID: function (sid, str) {
            var val = [], that = this, rows = this._pageData.rows;
            if (!$.isArray(sid)) {
                sid = [sid];
            }

            $.each(sid, function (i, n) {
                var index = that.getGridDataIndex(n);
				if(index!=undefined)
					val.push(str ? rows[index][str] : rows[index]);
            })
            return val;
        },
        /**@ignore*/
        setRowData: function (sid, d) {
            var data = this.settings.data, that = this,
				rows = this._pageData.rows,
                colModel = that.settings.colModel,map = {};

            if (!$.isArray(sid)) {
                sid = [sid];
            }

            $.each(colModel, function (i, n) {
                if (n.name in d) {
                    map[n.name] = i;
                }
            })
            $.each(sid, function (i, n) {
                var index = that.getGridDataIndex(n),
                    html, formart, title, tr, mapIndex;
					
                for (var j in d) {
                    rows[index][j] = d[j];
                    mapIndex = map[j];
                    formart = colModel[mapIndex].formart;
                    html = $.grid.dataFormart(d[j], d,formart);
                    title = $.grid.stripHtml(html);
                    tr = that.getTrById(n);
                    tr.find('[role=gridcell]').eq(mapIndex)
                      .html(html).attr('title', title);
                }
                that.wrap.triggerHandler('onSetRowData', [tr, d])
            });

            this.changeMarkAndView();
            if(this.settings.modelList!==null)
                this.settings.modelList.add(rows);
        },
        /**
         * 重设表格的宽度
         * @method
         * @param {Number} width 重设的宽度
         * @example 当浏览器缩放时调整表格大小
         *  $(window).resize(function () {
         *      var width = $('body').width();
         *      $('table').grid('setGridWidth', width)
         *  })
         */
        setGridWidth: function (width) {
            var settings = this.settings, elem = $([]), colModel = settings.colModel;
            width = parseInt(width);

            if (isNaN(width)) {
                return;
            }
            this.settings.width = width;
            elem.add(this.wrap)
                .add(this.bdiv)
                .add(this.hdiv)
                .add(this.dpage).width(width);
            $.each(colModel, function (i) {
                colModel[i].width = colModel[i].widthOrg;
            });
            this.bdiv.find(this.id).width(width - settings.scrollWidth);
            if(!settings.pagerFixed){
                this.bdiv.find(settings.pager).width(width - settings.scrollWidth);
            }

            var bTable =  this.bdiv.find('#' + this.id);

            this.setColWidth();

            this.wrap.find('.ui-jqgrid-htable')
                .add(bTable)
                .width(settings.tblwidth);
            this.hdiv.find('th').each(function (i) {
                var el = $(this);
                el.width(colModel[i].width);
            });
            bTable.find('tr:first td').each(function (i) {
                var el = $(this);
                el.width(colModel[i].width);
            });

        },
        resizeWidth : function(){
            var fn =  $.grid['onGridResize'];
            fn.apply(this,[this.wrap.parent()[0].clientWidth,this.wrap.parent().height()]);
        },
        /**
         * 刷新表格
         * @method
         * @example
         * $('table').grid('reload')
         */
        reload: function () {
			//页面重置
			if(this.settings.page&&this.settings.page!==1){
				this.settings.page=1;
			}
            this.populate();
        },

        dofiltler : function(){
            this.settings.page = 1;
            this.populate();
        },
        /**
         * 获取选中行的ID
         * @method
         * @returns {Array} 所有选中的列的id集合
         * @example
         * $('table').grid('getSelRow')
         */
        getSelRow: function () {
            return this.selected ? this.selected : [];
        },
        /**
         * 插入一行或多行数据到table
         * @method
         * @param {Object} data 插入的数据
         * @param {String} pos 插入位置 ‘first’, 'last', 'before', 'after', 默认first
         * @param {String} offset 相对第一个元素做的偏移，配合before,after使用
         * @example
         * $('table').grid('addRowData', {name: 'yy', age: '10'}, 'first')
         */
        addRowData: function (data, pos, offset) {
            var pageData = this._pageData, settings = this.settings,
                rows = pageData.rows, colModel = this.settings.colModel,that = this,
                i, elem;

            if (!$.isArray(data)) {
                data = [data];
            }

            switch(pos) {
                case 'first':
                default :
                    pos = 0;
                    break;
                case 'last':
                    pos = rows.length;
                    break;
                case 'before':
                    i  = this.bdiv.find('tr').index(this.getTrById(offset)) - 1 ;
                    pos = (i >= 0 && i <= rows.length) ? i : 0;
                    break;
                case 'after':
                    i = this.bdiv.find('tr').index(this.getTrById(offset)) + 1
                    pos = (i >= 1 && i <= rows.length) ? i : 1;
                    break;
            }

            if(data.length){
                this.bdiv.find('.jqgrid-tips').hide();
            }

            $.each(data, function (i, n) {
                var rowData = [], elem, id;
                that.createRows(n, rowData, pos+i);
                elem = $(rowData.join(''));
                elem.insertAfter(that.bdiv.find('tr').eq(pos+i));

                id = that.transToId(elem.attr('id'));

                //that._keyIndex[id] = pos + i;
				rows.splice(pos,0,n);
                settings.data.splice(pos,0,n);
                if(settings.pagerButtons && (rows.length > settings.rowNum)){
                    that.bdiv.find('tr').eq(rows.length).remove();
                    rows.pop();
                }
                //todo 这里事件触发的过早，如果用户在这里的代码出错会导致下面的代码执行不到
                that.wrap.triggerHandler('onAddRowData', [elem, n])
            })
			this.refreshIndex();
            this.changeMarkAndView();
            pageData.records += data.length;
            if(settings.pagerButtons)
                pageData.totalPage =  Math.ceil(pageData.records/settings.rowNum);
            this.viewPagerNum(pageData);
            if(settings.pagerButtons)
                this.updatapager(pageData);
            if(this.settings.modelList!==null)
                this.settings.modelList.add(rows);

        },
        getAllRow : function(){
             return [].concat(this.settings.data);
        },
        getCurrentPageRow : function(){
             var page = this.settings.page,rowNum = this.settings.rowNum,cacheData = this.settings.data;
             return cacheData.slice((page-1)*rowNum , rowNum);
        },
        getPagerdata : function(){
            return [].concat(this._pageData);
        },
        showCol : function(colName){
            if (!$.isArray(colName)) {
                colName = [colName]
            }
            var id = this.id,colModel = this.settings.colModel;
            for(var i= 0,lenN = colName.length;i<lenN;i++){
                var realId = "gd_"+id+"_"+colName[i];
                for(var j = 0,lenM = colModel.length;j<lenM;j++){
                    if(colModel[j].name == colName[i]){
                        colModel[j].hidden = false;
                        break;
                    }
                }
                this.hdiv.find("#"+realId).show();
                this.bdiv.find('[aria-describeby='+realId+']').show();
            }
        },
        hideCol : function(colName){
            if (!$.isArray(colName)) {
                colName = [colName]
            }
            var id = this.id,colModel = this.settings.colModel;
            for(var i= 0,lenN = colName.length;i<lenN;i++){
                var realId = "gd_"+id+"_"+colName[i];
                for(var j = 0,lenM = colModel.length;j<lenM;j++){
                    if(colModel[j].name == colName[i]){
                        colModel[j].hidden = true;
                        break;
                    }
                }
                this.hdiv.find("#"+realId).hide();
                this.bdiv.find('[aria-describeby='+realId+']').hide();
            }

        },
        getTotalRecords : function(){
            return this._pageData['records'];
        },
        disabledSelRow : function(rowId){
            var rows = rowId ? rowId : this.selected,tr;
            for(var i= 0,len = rows.length; i < len; i++){
                  tr = this.getTrById(rows[i]);
                   tr.removeAttr('aria-selected').removeClass('ui-state-highlight').addClass('ui-state-disabled')
                       .find('input[type=checkbox]').removeAttr('checked').attr('disabled','disabled');
            }
        }
    })

    /**创建一个新的组件
     * 
	 * @class 
	 * @alias  grid组件
     * @param {object} 生成grid的配置项，详见下面的field配置
	 * @example
     * $('table').grid({dataType: 'ajax', url: 'http://grid.com'})
	*/
    $.fn.grid = function (options) {

        var elem = this, object = this.data('grid'),
            fn;
        if(!elem.length)
            return;
        if (typeof options === 'string') {
            if (!(fn = $.grid.getAccessor($.grid.fn, options))) {
                throw new Error('Grid has no Function: ' + options);
            }

            if (!object) {
                throw new Error('Grid has not Initialization');
            }
            return fn.apply(object, Array.prototype.slice.call(arguments, 1));
        }

        if (object) {
            return this;
        }
        this.data('grid',  new $.grid(elem, options));
        return this;
    }
}) (jQuery);