/**
 * Created with JetBrains WebStorm.
 * User: wanqiongyao
 * Date: 15-8-13
 * Time: 下午5:12
 * To change this template use File | Settings | File Templates.
 */
var hik= hik||{};
hik.baseMenu = Base.extend({
    version : '1.3',
    el : null,
    data : null,
    ulCss : 'menuUl',
    liCss :'menuLi',
    activeCss : "menu-active",
    pMenuId : 0,
    level : 10,
    activeId : null,
    iframeFix : false,
    context :[],
    constructor : function(opts){
        this.extend(opts);
        if(!this.el)
            return;
        this.el = $(this.el);
        this.data = this.getChildById(this.pMenuId,opts.data);
        this.addContext(this.el);
        this.registerEvents();
        this.render(this.data,this.el);
    },
    addContext : function(context){
        this.context.push(context);
    },
    render : function(data,context){
        var html = this.doLayout(data,this.pMenuId,this.level);
        this.activeId = this.getFirstChild(this.activeId,data); //找到第一个默认的子节点
        context.append(html);
    },
    getChildById : function(pId,data){
        if(pId == 0)
            return data.data;
        data = data.data;
        for(var i = 0,len = data.length; i < len; i++){
            if(data[i].menuId == pId)
                return data[i].data;
            else if(data[i].data){
                var cdata =  this.getChildById(pId,data[i].data);
                if(cdata)
                    return cdata;
            }
        }
    },
    registerEvents :function(){
        var that = this,target,context = this.context;
        for(var i = 0,len = context.length; i < len; i++){
            context[i].on('click',"li>a",function(e){
                var menuObj = that.findTargetItem(e);
                that.onClick.apply(that,[e,menuObj]);
            });
            context[i].on('mouseover',"li>a",function(e){
                that.onMouseOver.call(that,e);
            });
            context[i].on('mouseout',"li>a",function(e){
                that.onMouseOut.call(that,e);
            });
        }

    },
    getItem : function(menuId,data){
        for(var i = 0,len = data.length; i < len; i++){
            if(data[i].menuId == menuId)
                return data[i];
            else if(data[i].data){
                var cdata = this.getItem(menuId,data[i].data);
                if(cdata)
                    return cdata;
            }
        }
    },
    /**
     *
     * @param data  布局的数据
     * @param currentLevel  当前的层级
     * @param level      总共显示几级，如果为空，则显示全部
     * @param position     optional，显示的位置，会填充到data-position上，跟业务逻辑相关，可不传
     * @returns {*}
     */
    doLayout : function(data,currentLevel,level,position){
        if(!data)
            return '';
        if(!currentLevel)
            currentLevel = 0;
        currentLevel++;
        var ulItem = ['<ul class="nav ', this.ulCss ,'">'];
        if(this.iframeFix && currentLevel > 2){  //Fixedme ,这里的业务耦合过强
            ulItem.push('<iframe style="width:100%; height:100%; position: absolute; z-index: -1; left: 0px; "></iframe>');
        }
        for(var i = 0,len = data.length; i < len; i++){
            ulItem.push('<li class="', this.liCss ,' menu-', currentLevel ,' ', data[i].active ? this.activeCss : '' ,'" data-id="', data[i].menuId,'">');
            ulItem.push('<a href="javascript:void(0);" data-position="',position ,'">',data[i].name,'</a>');
            if(data[i].active){
                this.activeId = data[i].menuId;
            }
            if(data[i].data){
                if((level && (currentLevel < level)))
                    ulItem.push(this.doLayout(data[i].data,currentLevel,level,position));
                else if(!level){
                    ulItem.push(this.doLayout(data[i].data,currentLevel,'',position));
                }
            }
            ulItem.push('</li>');
        }
        ulItem.push('</ul>');
        return ulItem.join('');
    },
    getFirstChild : function(menuId,oriObj){
        var getMenu = (function f(obj){
            if(obj.selfSite){ //selfSite表示用自己的url而非第一个子节点的url
                return obj.menuId;
            }else{
                if(obj.data){
                    return f(obj.data[0]);
                }else{
                    return obj.menuId;
                }
            }
        });
        for(var i = 0,len = oriObj.length; i < len; i++){
            if(oriObj[i].menuId == menuId){
                return getMenu(oriObj[i]);
            }else{
                var cData = oriObj[i].data,res;
                if(cData){
                    res = this.getFirstChild(menuId,cData);
                    if(res)
                        return res;
                }
            }
        }
    },
    findTargetItem : function(e){
        return $(e.target).closest('.' +  this.liCss);
    },
    onClick : function(e,menuObj){
        if(menuObj && menuObj.length){
            this.activeId = this.getFirstChild(menuObj.attr('data-id'),this.data);
            var data = this.getItem(this.activeId,this.data),userClick;
            userClick = this.trigger('click',[e,data]); //触发用户的click
            this.setActiveItem(menuObj);
            if(userClick)  //用户返回false，则业务逻辑不走
                this.clickHandler(e,this,data,this.activeId);
        }
    },
    clickHandler : function(event, that, data, menuId){
        if(!data)
            return;
        if($.cookie)
            $.cookie('hik-menuId',menuId);   //最后一次的点击存储起来给门户用
        var $this = $(event.target),target = $this.attr('target') || data.target,url =  $this.attr('url')  || data.href;
        if(url){
            if(url.indexOf('?') > -1){
                url = url + '&random=' + Math.floor(Math.random()*100000);
            }else{
                url = url + '?random=' + Math.floor(Math.random()*100000);
            }
        }
        if(target == '_blank'){
            window.open(url);
        }else if(target == '_top'){
            top.location.href = url;
        }else if(target == "_self"){
            window.location.href = url;
        }else if(target == '_parent'){
            window.parent.location.href = url;
        }else{
            if(!target){
                target = 'mainFrame';
            }
            $('#' + target).attr("src",url);
        }
        return false;
    },
    setActiveItem : function(menuObj){
        menuObj.addClass(this.activeCss);
        menuObj.siblings().removeClass(this.activeCss).find('.' + this.liCss).removeClass(this.activeCss);//同级以及子级都去掉active状态
        if(/menu-1/i.test(menuObj[0].className)){
            return;
        }
        menuObj = menuObj.parents('.' + this.liCss).eq(0);
        if(menuObj.length){
            this.setActiveItem(menuObj);
        }
    },
    onMouseOver : function(e){
    },
    onMouseOut : function(e){
    },
    destroy : function(){
    }
}).extend(hik.events);

hik.blockMenu = hik.baseMenu.extend({
    blockMenuCss : 'nav_content',
    doLayout : function(data){
        var ulItem = ['<div class="block block-home">'];
        for(var i = 0,len = data.length; i < len; i++){
            if(data[i].data){
                ulItem.push('<div class="', this.blockMenuCss ,'">');
                ulItem.push('<h2><span>', data[i].name,'</span></h2>');
                ulItem.push('<ul>');
                for(var j = 0,len2 = data[i].data.length; j < len2; j++){
                    var cdata =   data[i].data[j];
                    ulItem.push('<li>');
                    ulItem.push('<a href="javascript:void(0);"><img /></a>');
                    ulItem.push('<span>', cdata.name,'</span>');
                    ulItem.push('</li>');
                }
                ulItem.push('</ul>');
                ulItem.push('</div>');
            }
        }
        ulItem.push('</div>');
        return ulItem.join('');
    }
});
hik.accessMenu = hik.baseMenu.extend({
    accessToggle : true,
    iClss: 'menuliIco',
    doLayout : function (data,currentLevel,level,position){
        if(!data)
            return '';
        if(!currentLevel)
            currentLevel = 0;
        currentLevel++;
        var ulItem = ['<ul class="nav ', this.ulCss ,'">'];
        if(this.iframeFix && currentLevel > 2){  //Fixedme ,这里的业务耦合过强
            ulItem.push('<iframe style="width:100%; height:100%; position: absolute; z-index: -1; left: 0px; "></iframe>');
        }
        for(var i = 0,len = data.length; i < len; i++){
            ulItem.push('<li class="', this.liCss ,' menu-', currentLevel ,' ', data[i].active ? this.activeCss : '' ,'" data-id="', data[i].menuId,'">');
            ulItem.push('<a href="javascript:void(0);" data-position="',position ,'">',data[i].name,'</a>');
            if(data[i].active){
                this.activeId = data[i].menuId;
            }
            if(data[i].data){
                ulItem.push('<i class="',this.iClss ,'">','</i>');
                if((level && (currentLevel < level)))
                    ulItem.push(this.doLayout(data[i].data,currentLevel,level,position));
                else if(!level){
                    ulItem.push(this.doLayout(data[i].data,currentLevel,'',position));
                }
            }
            ulItem.push('</li>');
        }
        ulItem.push('</ul>');
        return ulItem.join('');
    },
    onClick : function(e,menuObj){
        if(menuObj && menuObj.length){
            this.activeId = this.getFirstChild(menuObj.attr('data-id'),this.data);
            var data = this.getItem(this.activeId,this.data),userClick;
            userClick = this.trigger('click',[e,data]); //触发用户的click
            if(this.accessToggle&&/menu-active/i.test(menuObj[0].className)){
                menuObj = menuObj.removeClass('menu-active');
            } else {
                this.setActiveItem(menuObj);
            }
            if(userClick)  //用户返回false，则业务逻辑不走
                this.clickHandler(e,this,data,this.activeId);
        }
    }
})


hik.relatedMenu =  hik.baseMenu.extend({
    relMenuEl : '',
    relMenuLevel : 1,
    getActiveParent : function(currentLevel,data){
        for(var i =0 ,len = data.length; i < len; i++){
            if(data[i].active && currentLevel == this.relMenuLevel)
                return data[i].data;
            else if((currentLevel < this.relMenuLevel) && data[i].data){
                return this.getActiveParent(currentLevel++,data[i].data);
            }
        }
    },
    render : function(data){
        if(!this.relMenuEl)
            this.base(data);
        else{
            this.relMenuEl = $(this.relMenuEl);
            this.addContext(this.relMenuEl);
            if(this.extendMenu){
                this.extendMenu = $(this.extendMenu);
                this.addContext(this.extendMenu);
            }
            var html = this.doLayout(data,this.pMenuId,this.relMenuLevel,"top"),shtml;
            this.el.append(html);
            this.renderRelMenu(this.getActiveParent(this.relMenuLevel,data));
            this.renderExtendMenu(data);
        }
    },
    renderRelMenu : function(data){
        var chtml = this.doLayout(data,this.relMenuLevel,"","common");
        this.relMenuEl.html(chtml);
    },
    renderExtendMenu : function(data){
        if(this.extendMenu){
            this.extendMenu = $(this.extendMenu);
            var html =   this.doLayout(data,0,2,"commonLeft");
            this.extendMenu.html(html);
        }
    },
    onClick : function(e,menuObj){
        this.base(e,menuObj);
        var menuId = menuObj.attr('data-id'),data = this.getItem(menuId,this.data);
        if(!this.relMenuEl.find(menuObj).length)
            this.renderRelMenu(data.data);
    }
});

hik.breadCrumbs = Base.extend({
    cachedata : {},
    activeMenus : [],
    constructor : function(opts){
        var that = this;
        this.extend(opts);
        this.parseData(this.menu);
        this.breadCrumbs = $(this.hasBreadcrumbs);
        this.render();
        this.menu.bind('click',function(){
            that.render();
        });
        this.registerEvents([this.breadCrumbs]);
    },
    registerEvents :function(context){
        var that = this,target;
        for(var i = 0,len = context.length; i < len; i++){
            context[i].on('click',"li>a",function(e){
                var menuId = $(e.target).parent().attr('data-id');
                for(var j = 0,len2 = that.menu.context.length; j < len2; j++){
                    if(that.menu.context[j].find('[data-id= "' + menuId +'"]').length){
                        that.menu.onClick.call(that.menu,e,that.menu.context[j].find('[data-id= "' + menuId +'"]'));
                        that.render();
                    }
                }
            });
        }
    },
    getAllActives : function(id){
        var curObj = this.cachedata[id] ;
        this.activeMenus.unshift(curObj);
        if(curObj.parentId && curObj.parentId != id && this.cachedata[curObj.parentId]){
            this.getAllActives(curObj.parentId);
        }
    },
    render : function(html){
        this.activeMenus = [];
        this.getAllActives(this.menu.activeId);
        var html = ['<ul>'];
        for(var i = 0,len = this.activeMenus.length; i < len; i++){
            html.push('<li data-id = "',this.activeMenus[i].menuId ,'">');
            html.push('<a href="javascript:void(0)">',this.activeMenus[i].name,'</a>');
            html.push('</li>');
        }
        html.push('</ul>');
        this.breadCrumbs.html(html.join(''));
    },
    eraseData : function(obj){
        var result = {};
        for(var prop in obj){
            if(obj.hasOwnProperty(prop) && prop != 'data'){
                result[prop] = obj[prop];
            }
        }
        return result;
    },
    parseData: function (pobj) {
        var cdata = this.cachedata,
            datas = pobj.data,
            i=0, len=datas.length,
            chldata,obj;

        for (;i < len;i++) {
            chldata = datas[i];
            obj = this.eraseData(chldata);
            if (typeof obj.parentId!=null && pobj.menuId != null ) {
                obj.parentId = pobj.menuId;
            }
            if (obj.active == 1) {
                this.activeId = obj.menuId;
            }
            cdata[obj.menuId] = obj;
            if (chldata.data && chldata.data.length) {
                this.parseData(chldata);
            }
        }
    }
});
$.fn.accessMenu = function (opts){
    var obj  = this.data('accessMenu');
    if(obj)
        return obj;
    if(opts.hasBreadcrumbs){
    } else{
        opts.el = this;
        obj = new hik.accessMenu(opts);
        this.data('accessMenu', obj);
    }
    return obj;

}

$.fn.menu = function(opts){
    var obj  = this.data('menu');
    if(obj)
        return obj;
    if(opts.hasBreadcrumbs){
    } else{
        opts.el = this;
        obj = new hik.baseMenu(opts);
        this.data('menu', obj);
    }
    return obj;
}

$.fn.blockMenu = function(opts){
    var obj  = this.data('blockMenu');
    if(obj)
        return obj;

    opts.el = this;
    obj = new hik.blockMenu(opts);
    this.data('blockMenu', obj);
    return obj;
}

$.fn.relatedMenu = function(opts){
    var obj  = this.data('relatedMenu');
    if(obj)
        return this;
    opts.el = this;
    obj =new hik.relatedMenu(opts);
    this.data('relatedMenu', obj);
    if(opts.hasBreadcrumbs){
        opts.menu = obj;
        new hik.breadCrumbs(opts);
    }
    return obj;
}