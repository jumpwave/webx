/**
 * Created with JetBrains WebStorm.
 * User: wanqiongyao
 * Date: 15-9-2
 * Time: 上午11:18
 * To change this template use File | Settings | File Templates.
 */
;(function ($) {
	var ASCII_UN_USE = "\\\/:*?\"<|'%>";
    var  filterOpt = {
        multiFilter : false,
        multiField : [],
        filterClass : 'filterForm',
        btnClass : 'btn-toolbar',
        toolbar : false,
        hiddenToggleButton : false,
        filterFormClass : ''
    },str2array= function(str){
       var arr= [],nstr = str.replace(/^\[\{/g,'').replace(/\}\]$/g,''),astr = nstr.split('},{');
       for(var i = 0,len = astr.length; i< len; i++){
           var prop = astr[i].split(',');arr[i] = arr[i] || {};
           for(var j = 0,len2 = prop.length; j < len2; j ++){
               str2Obj(prop[j],arr[i]);
           }
       }
        return arr;

    },str2Obj = function(str,opts){
        var propArray;
        if(!str)
            return opts;
        propArray = str.split(';');
        for(var i = 0, len = propArray.length; i < len; i++){
            var index =  propArray[i].indexOf(':'), key =  propArray[i].substring(0,index),value = propArray[i].substring(index + 1);
            if(/^\[(.+?)\]$/g.test(value)){
                opts[key] = str2array(value);
            }else{
                opts[key] = value;
            }
        }
        return opts;
    };

    $.extend($.grid._events || {},{
        'click|.filterForm .button-filter' : 'filterGrid' ,
        'click|.filterForm [type=reset]' : 'resetGrid',
        'click|.formRow .config' : 'toggleConfigPanel',
        'change|.auto-filter [type=checkbox]' : 'toggleFilterPanel',
        'click|.btn-toolbar .toggleFilter' : 'togglePanel',
		'keypress|.filterForm [type=text]':'unexpectChart'
    });

    $.grid._searchDomTmpl = $.extend($.grid._searchDomTmpl || {},{
        rangeDateTime : function(options){
            var callback =  options.callback;
            options.callback = function(){
               $('[hikui=calendar]').each(function(){
                   $(this).hik().calendar();
               });
                if(!/\./.test(options.firstField)){
                    $('[name='+ options.firstField +']').closest('.control-group').addClass('cols2');
                }else{
                    $('[hikui=calendar]').closest('.control-group').addClass('cols2');
                }

                callback && callback();
            }
                if(options.isRelated){
                     var dateFixed = 0,fieldDom;
                    if(options.dateFixed) {
                        dateFixed = parseInt(options.dateFixed,10);
                        fieldDom = ['<input type="text" hikui="calendar" showtime="true" auto-init="false"  maxDate="#F{$dp.$N(\'', options.secondField ,'\');}" name="',options.firstField ,'"> '];
                        fieldDom.push('-');
                        fieldDom.push('<input type="text" hikui="calendar" showtime="true" auto-init="false" minDate="#F{$dp.$N(\'', options.firstField ,'\');}"  maxDate="#F{$dp.$N(\'', options.firstField ,'\',{d:'+ dateFixed +'}); }" name="',options.secondField ,'">');
                    } else{
                        fieldDom = ['<input type="text" hikui="calendar" showtime="true" auto-init="false"  maxdate="#F{$dp.$N(\'', options.secondField ,'\');}" name="',options.firstField ,'">'];
                        fieldDom.push('-');
                        fieldDom.push('<input type="text" hikui="calendar" showtime="true" auto-init="false" mindate="#F{$dp.$N(\'', options.firstField ,'\');}" name="',options.secondField ,'">');
                    }
                }else{
                    var fieldDom = ['<input type="text" hikui="calendar" showtime="true" auto-init="false" name="',options.firstField ,'">'];
                    fieldDom.push('-');
                    fieldDom.push('<input type="text" hikui="calendar" showtime="true" auto-init="false" name="',options.secondField ,'">');
                }
                 return fieldDom.join('');
            },
        select : function(options,name){
              var fieldDom = ['<select name="', options.fieldName,'">'];
              for(var i = 0, len = options.data.length; i< len; i++){
                  fieldDom.push('<option value="', options.data[i].value,'" ', options.data[i].selected ? 'selected' : '','>', options.data[i].name,'</option>')
              }
               fieldDom.push('</select>');
            return fieldDom.join('');
        },
        autocomplete : function(options,name){
            var callback =  options.callback;
            options.callback = function(){
                $('[name='+ name +']').autocomplete(options);
                callback && callback();
            }
           return '<input type="text" name="'+ name + '"/>';
        }
    });

    $.extend($.grid.prototype,{
        viewFilterDiv : function(){
            if(this.settings.multiFilter == false)
                return;
            var filterDiv = this.filterDiv = $.grid.createDom({'class': this.settings.filterClass}),that = this;
            var formRow = ['<form class="form-horizontal">'],searchModel = [];
            for(var i =0 ,len = this.settings.colModel.length;i < len;i++){
                if(this.settings.colModel[i].searchField || this.settings.colModel[i].searchField == 0){
                    searchModel[this.settings.colModel[i].searchField] = this.settings.colModel[i];
                    searchModel[this.settings.colModel[i].searchField]['label']  = this.settings.colName[i];

                }
            }
            //扩展用户自定义的必填项
            if(this.settings.extendSearchField) {
                for(var i = 0,len = this.settings.extendSearchField.length;i < len;i++){
                    searchModel[this.settings.extendSearchField[i].searchField] = this.settings.extendSearchField[i];
                }
            }
            this.hasConfigFilter = false;
            this.callbackFn = [];
            this.optArray = [];

            formRow = formRow.concat(this.viewFilterContent(searchModel));

            formRow.push('<div class="btn-set"><a type="button" class="buttonS bBlue button-filter">'+language.text('gridFilter.filter')+'</a><a type="reset" class="buttonS bGreyish">'+language.text('gridFilter.reset')+'</a></div></form>');
            filterDiv.append(formRow.join('')).insertBefore(this.view);

            for(var i= 0,len = this.callbackFn.length; i < len; i++){
                this.callbackFn[i](this.optArray[i]);
            }

            if(this.settings.configFilter ||  this.hasConfigFilter){
                this.viewDropDownFilter(searchModel);
            }
            if(!this.settings.hiddenToggleButton && (this.settings.toolbar && !this.settings.hiddenToggleButton))
                this.filterDiv.hide();
            this.extraEl = this.extraEl || [];
            this.extraEl.push(this.filterDiv);
        },
        viewFilterContent : function(searchModel){
            var formRow = ['<ul class="formRow">'];
            for(var i = 0,len = searchModel.length; i < len; i++){
                if(!this.hasConfigFilter && (searchModel[i].showInSearch == false))
                    this.hasConfigFilter = true;
                formRow.push('<li class="control-group  auto-by-filter ',(searchModel[i].xtype == 'datatime') ? 'cols2': '','" style="', (searchModel[i].showInSearch == false) ? 'display:none;': '' ,searchModel[i].extendStyle==true? 'width:auto;height:auto':'','">');
                formRow.push('<label class="control-label">',searchModel[i].label,'：</label>');
                formRow.push('<div class="controls">');
                formRow = formRow.concat(this.viewCellLi(searchModel[i]));
                formRow.push('</div></li>');
            }
            formRow.push('</ul>');
            return formRow;
        },
        viewCellLi : function(seachModel){
            var  formRow = [];
            if(seachModel.searchDomTmpl){
                var options = {},dom;
                if(seachModel.dataOptions){
                    str2Obj(seachModel.dataOptions,options);
                }
                if($.grid._searchDomTmpl[seachModel.searchDomTmpl]){
                    if((typeof $.grid._searchDomTmpl[seachModel.searchDomTmpl]) == 'function'){
                        dom = $.grid._searchDomTmpl[seachModel.searchDomTmpl].apply(null,[options,seachModel.searchName || seachModel.name]);
                    }
                    formRow.push(dom);
                }else{
                    formRow.push(seachModel.searchDomTmpl);
                }

                if(options.callback){
                    this.callbackFn.push(options.callback);
                    this.optArray.push(options);
                }

            }else{
                formRow.push('<input type="text" name="',seachModel.searchName || seachModel.name,'" unusechars="',seachModel.unUseChars||"",'"/>');
            }
            return formRow;
        },
        viewDropDownFilter : function(searchModel){
            var html = ['<div class="formRow filterRow"><div class="btn-group btn-filter">'],index = 0;
            html.push('<a class="buttonS bBlue config" href="javascript:void(0);"><span class="ico i-add"></span><span>'+language.text('gridFilter.addFilter')+'</span><span class="caret"></span></a>');
            html.push('<ul class="dropdown-menu auto-filter">');
            for(var i =0 ,len = searchModel.length;i < len;i++){
                if(!searchModel[i].notShowInDropDown){
                    html.push('<li><a href="javascript:void(0);"><span class="check"><label>');
                    html.push('<input type="checkbox" ', (searchModel[i].showInSearch == false) ? '' : 'checked' ,' index = "',searchModel[i].searchField ,'">');
                    html.push('<span>',searchModel[i].label,'</span>');
                    html.push('</label></span></a></li>');
                }
                    
            }
            html.push('</ul></div></div>');
            this.filterDiv.append(html.join(''));
        },
        viewToolbar : function(){
            if(this.settings.toolbar == false)
                return;
            var btnDiv = this.btnDiv = $.grid.createDom({'class': this.settings.btnClass}),that = this,$btnRow = $('<div class="btn-padding clearfix"></div>'),rightBar;
            if(this.settings.toolbarButtons) {
                for(var i = 0,len = this.settings.toolbarButtons.length; i< len; i++){
                    var buttonEl;

                    if(this.settings.toolbarButtons[i].html){
                        buttonEl = $(this.settings.toolbarButtons[i].html);
                    }else{
                        buttonEl = $('<a class="buttonS" href="javascript:void(0);"></a>').append('<span class="'+this.settings.toolbarButtons[i].icoCls +'"></span>').append('<span>'+this.settings.toolbarButtons[i].text +'</span>');
                    }

                    for(var ee in this.settings.toolbarButtons[i].events){
                        buttonEl.on(ee,function(fn){
                            return function(e){
                                fn.call(that,that,e);
                            }
                        }(this.settings.toolbarButtons[i].events[ee]))
                    }
                    if(this.settings.toolbarButtons[i].position == 'right'){
                        buttonEl.addClass('floatR');
                        if(rightBar){
                            rightBar.after(buttonEl);
                        }else{
                            rightBar = buttonEl.clone(true);
                        }
                    } else{
                        $btnRow.append(buttonEl);
                    }

                }
            }
            if(this.settings.multiFilter && !this.settings.hiddenToggleButton){
                $btnRow.append('<a class="buttonS floatR toggleFilter" href="javascript:void(0);"><span class="ico i-filter"></span><span class="ico i-down"></span></a>');
            }
            btnDiv.append($btnRow.append(rightBar || ''));
            this.wrap.prepend(btnDiv);
            this.extraEl = this.extraEl || [];
            this.extraEl.push(this.btnDiv);
        }
    });

    $.extend($.grid,{

        filterGrid : function(event,obj,wrap,tableId){
            var $form = $(event.target).closest('form'),formData =[];
            var userClick=true;
            if(obj.settings.beforeFilter){
                userClick=obj.settings.beforeFilter.apply(this);
            }
            if(userClick){
                if(obj.settings.ajaxDynamic && !obj.settings.orgAjaxDynamic){
                    obj.settings.orgAjaxDynamic = obj.settings.ajaxDynamic;
                }
                obj.settings.ajaxDynamic = function(){
                    formData =  $form.formToArray();
                    if(obj.settings.orgAjaxDynamic){
                        var arrays =  obj.parseDynamicData(obj.settings.orgAjaxDynamic);
                        if(arrays){
                            for(var i = 0,len = arrays.length; i < len; i++){
                                var isRightFormart = false;
                                for(var prop in arrays[i]){
                                    if((prop == 'name') || (prop == 'value')){
                                        isRightFormart = true;
                                    } else{
                                        formData.push({name: prop,value : arrays[i][prop]});
                                    }
                                }
                                if(isRightFormart){
                                    formData.push(arrays[i]);
                                }
                            }
                            var orgData = obj.parseDynamicData(obj.settings.orgAjaxDynamic);
                            if(Object.prototype.toString.call(orgData) == '[object Array]'){
                                return formData.concat(orgData);
                            }else{
                                formData.push(orgData);
                            }

                        }
                    }

                return formData;
                };
            obj.settings.page = 1;
            obj.populate();
            }
        },
        resetGrid : function(event,obj,wrap,tableId){
            var $form = $(event.target).closest('form');
            $form[0].reset();
            obj.settings.page = 1;
            obj.populate();
        },
        toggleConfigPanel : function(event){
            var $target =  $(event.target).closest('a'),$panel = $target.next('.dropdown-menu');
            $panel.toggle();
            event.preventDefault();
            event.stopPropagation();
            $(document).on('mousedown',function(e){
                if($(e.target).parents('.auto-filter').length > 0)
                    return;
                $panel.hide();
            });
            return false;
        },
        toggleFilterPanel : function(event,obj,wrap){
            var targetEl = $(event.target),formEl = targetEl.parents('.filterForm:first'),index = targetEl.attr('index'),
            liEl = formEl.find('ul.formRow li.auto-by-filter:eq(' + index + ')'),fn;
			var datatableWidth;
			datatableWidth=wrap.parent()[0].clientWidth;
            if(targetEl.attr('checked') == 'checked' || targetEl.attr('checked') == true){
                liEl.show();
            }else{
                var selectItem = liEl.find(".controls select option");
                if(selectItem.length){
                    selectItem[0].selected = "selected";
                }
                var defaultValue = liEl.find(".controls input").attr('defaultValue')||'',type=liEl.find(".controls input").attr('type')||'';
                if(type=='checkbox'||type == 'radio'){
                    if(defaultValue==true||defaultValue=="true")
                        liEl.find(".controls input").attr('checked','checked');
                }else{
                    liEl.find(".controls input").val(defaultValue);
                }
                liEl.hide();
            }
            fn =  $.grid['onGridResize'];
            fn.apply(obj,[datatableWidth,wrap.parent().height()]);
        },
        togglePanel : function(event,obj,wrap){
            var formEl =  wrap.find('.' +  obj.settings.filterClass),wrapH = wrap.height(),fn,datatableWidth;
			datatableWidth=wrap.parent()[0].clientWidth;
            formEl.toggle();
            fn =  $.grid['onGridResize'];
            fn.apply(obj,[datatableWidth,wrap.parent().height()]);
            var $el=wrap.find('.toggleFilter').find('span :last');
            $el.toggleClass('i-up i-down');
        },
		unexpectChart : function(event,obj){
			if (($(event.target).attr('unusechars') ||ASCII_UN_USE).indexOf(String.fromCharCode(event.keyCode)) > -1) {
					return false;
				}
				return true;
		}
    });

    $.extend($.grid.fn,{
        getAjaxDynamic : function(){
            return this.parseDynamicData(this.settings.ajaxDynamic);
        }
    });
    $.grid.domInitExtend.push($.grid.prototype.viewFilterDiv,$.grid.prototype.viewToolbar);
    $.grid.prototype.exSetting(filterOpt);
}) (jQuery);