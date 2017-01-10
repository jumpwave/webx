/**
 * Created with JetBrains WebStorm.
 * User: wanqiongyao
 * Date: 15-10-13
 * Time: 上午9:39
 * To change this template use File | Settings | File Templates.
 */
(function($,undefined){

    var editableList = function(element,options){
         var settings = $.extend(true,{
             source : [],
             ajaxOpts : {
                type : 'post',
                dataType : 'json'
             },
             type : 'default',
             placehoder : '',
             elementCls : 'edit-select',
             elementName : 'id',
             width : 200,
             vtype : ''

         },options),selectList,that = this;

        this.settings = settings;
        this.element = element;
        this.renderDom();
        this.list = this.renderList(function(){
            that.list.on('click','li>a',function(){
                var input = that.activeElement.find('input');
                input.eq(0).val($(this).text());
                input.eq(1).val($(this).attr('value'));
                that.list.hide();
            });

            that.list.on('click','.ui-select-button',function(){
                 var val = $(this).prev().val(),isExist = false;
                for(var i= 0,len = that.data.length; i< len; i++){
                    if(that.data[i].name === val)
                        isExist = true;
                }
                if(isExist)
                    return false;
                if(val){
                    $.ajax($.extend({
                        url : that.settings.addItemUrl,
                        data : {name :val},
                        success : function(data){
                            $.hik.createList.call(that,that.settings,data.data);
                            that.data = data.data;
                        }
                    },that.settings.ajaxOpts,{type:'post'}));
                }
            });

            /*that.list.on('click',function(){
                $(document).one('mousedown',function(event){
                    if(event.target !== that.element[0] && !$(event.target).parents('.ui-select-list').length)
                        that.list.hide();
                });
            }); */
        });
        this.element.on('click',function(e){
            var $this = $(this).find('input').eq(0),pos = $this.offset();
            that.activeElement = $(this);
            that.renderList(function(list){

                list.css({
                    'position' :'absolute',
                    'top' : pos.top + $this.outerHeight() + 5,
                    'left' : pos.left,
                    'width' : $this.width() < 164 ? 164 : $this.outerWidth()
                });

                var isHeightOverflow = (that.activeElement.offset().top + list.height()) > ($('body').offset().top + $('body')[0].scrollHeight);

                if(isHeightOverflow){
                    list.css({
                        'top' :  that.activeElement.offset().top - list.height()- $this.outerHeight()
                    });
                }

                list.find('.ui-select-button').prev().width(($this.width() - 80) < 80 ? 80 :($this.width() - 80) );
                list.show();


                list.on('click',function(){
                    return false;
                })

                $(document).on('mousedown',function(event){
                   if(event.target !== that.element[0] && !$(event.target).parents('.ui-select-list').length)
                     that.list.hide();
                });
            });
        });


    }

    editableList.prototype.renderDom = function(){
        for(var i= 0,len = this.element.length; i< len; i++){
            var cur = this.element.eq(i),$input = cur.find('input');
            cur.addClass(this.settings.elementCls);
            $input .attr('readonly','readonly').addClass('edit-select-input');
           cur.append('<input type="hidden" name="'+ (this.settings.inputName || ($input.attr('name')+'_id')) +'" vtype="'+(this.settings.vtype ? this.settings.vtype : '')+'" isoverflown="true"/><span class="arrow-down"></span>');
        }
    }

    editableList.prototype.hideList = function(target){
        if(target !== this.element[0] && !$(target).parents('.ui-select-list').length)
            this.list.hide();
    }

    editableList.prototype.renderList = function(callback){
        var that = this,list;
        this.getData(this.settings.source,this.settings,function(data){
            that.data = data;
            if(data.length){ //填充第一个值
                for(var i =0,len = that.element.length; i<len; i++){
                    var elem = that.element.eq(i),input = elem.find('input');
                    if(!input.eq(0).val()){
                        input.eq(0).val(data[0].name);
                        input.eq(1).val(data[0].id);
                    }
                }
            }
            that.list = list = new $.hik.createList(that.settings,data);
            if(callback){
                callback.call(that,list);
            }
        });
        return list;
    }

    editableList.prototype.getData = function(source,opts,callback){
            if(typeof source == 'string'){
                $.ajax($.extend({
                    url : source,
                    success : function(data){
                        callback(data);
                    }
                },opts.ajaxOpts))
            }
    }


    $.hik = $.hik || {};
    $.hik.createList = function(opts,data){
        var renderLiItem = function(d){
             var liHtml = [];
            for(var i= 0,len = d.length; i < len; i++){
                liHtml.push('<li>');
                liHtml.push('<a href="javascript:void(0);" value="', d[i].id,'" title="',d[i].name ,'">', d[i].name ,'</a>')
                liHtml.push('</li>');
            }
            return liHtml.join('');
        }
        var $list =  $('[data-type='+ opts.type +']');
        if($list.length){
           $list.find('ul').empty().append(renderLiItem(data));
            return $list;
        }
        $list = $('<div class="ui-select-list" data-type="'+ opts.type + '">');
        this.ul = $('<ul>');
        var inputHtml = [];
        this.ul.append(renderLiItem(data)).appendTo($list);

        if(opts.addItemUrl){
            var vtype = opts.vtype.split(','),attrHtml = [];
            for(var i= 0,len = vtype.length; i<len; i++){
                  if(/=/g.test(vtype[i])){
                      attrHtml.push(vtype[i]);
                  }
            }
            inputHtml.push('<form style="padding:5px 0;"><input type="text" style="width:80px;" vtype="'+ opts.vtype +'" isoverflown="true" promptposition="topRight" '+ (attrHtml.join(' ')) +' /><a class= "ui-select-button ui-disabled" data-action="add"> '+language.text('editableList.add')+'</a></form>');
        }
        $list.append(inputHtml.join('')).appendTo($('body'));
        if($.fn.ajaxForm)
            $list.find('form').ajaxForm({ajaxSubmit:false});
        return $list;
    }

    $.fn.editableSelect = function(options){
        var element = this,obj = this.data('editableSelect');
        if(!element.length)
            return;
        if (obj) {
            return this;
        }
        this.data('editableSelect',  new editableList(element, options));
        return this;
    }
})(jQuery)
