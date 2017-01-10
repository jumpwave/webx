/**
 * Created with JetBrains WebStorm.
 * User: yangyu3
 * Date: 14-12-1
 * Time: 上午9:47
 * To change this template use File | Settings | File Templates.
 */

// 菜单模块
_model.define('menu', function (model) {
    var options = {
            tmplurl: '',
            cssactive: 'active',
            csshover: 'hover',
            // 模板的属性映射 ,
            ajaxResponseReader: {data: 'data'},
            tmplcontent: '[data-menu],[data-menu-sub],[data-menu-common]',
            tmpl: '[tmpl-menu],[tmpl-menu-sub],[tmpl-menu-common]',
            'tmpl-menu' :'<script type="text/x-jquery-tmpl" tmpl-menu>{{each(i, d) data}}<li><a href="javascript:void(0);" data-position = "top" url="{{= d.href}}" menuType="{{= d.type}}" openType="{{= d.openType}}" menuId="{{= d.menuId}}" customAppUrl="{{= d.customAppUrl}}" >{{= d.name}}</a></li>{{/each}}<li id="navThirdMoreLink" class="displayNone"><a href="javascript:void(0);" class="more"><span>'+language.text('menu.more')+'</span></a><ul style="display:none"><iframe style="width:100%; height:100%; position: absolute; z-index: -1; left: 0px; top: 0px;opacity:0;filter: Alpha(opacity = 0);"></iframe>  </ul></li></script>',
            'tmpl-menu-sub' : '<script type="text/x-jquery-tmpl" tmpl-menu-sub><div class="block block-home">{{each(i, d) data}}{{if d.data != null && d.data.length !=0}}<div class="nav_content"><h2><a href="javascript:void(0);"><span>{{= d.name}}</span></a></h2><ul>{{each(i,dd) data}}<li> {{if dd.className == "dash-empty"}}<a href="javascript:void(0);" data-position="sub" url="{{=dd.href}}" menuType="{{= dd.type}}" openType="{{= d.openType}}" menuId="{{= dd.menuId}}" code="{{= dd.code}}" serviceType="{{= dd.serviceType}}" customHomeMenuUrl="{{= dd.customHomeMenuUrl}}" class="icon_log {{= dd.className}}">{{if dd.imgurl != "" && dd.imgurl != null}}<img src="{{= dd.imgurl}}" style="width:72px;height:72px;"/>{{else}}<img src="../assets/default/images/dash-empty.png" style="width:72px;height:72px;"/>{{/if}}</a>{{else}}<a href="javascript:void(0);" data-position="sub" url="{{=dd.href}}" menuType="{{= dd.type}}" openType="{{= d.openType}}" menuId="{{= dd.menuId}}" code="{{= dd.code}}" serviceType="{{= dd.serviceType}}" customHomeMenuUrl="{{= dd.customHomeMenuUrl}}" class="icon_log {{= dd.className}}"></a>{{/if}}<span>{{= dd.name}}</span></li>{{/each}}</ul></div>{{/if}}{{/each}}</div></'+'script>',
            'tmpl-menu-common' : '<script type="text/x-jquery-tmpl" tmpl-menu-common><li class="mainNav_map"><a href="javascript:void(0);" class="map_a"><i></i></a><div class="ddmenu"><iframe style="width:100%; height:100%; position: absolute; z-index: -1; left: -1px; top: 0px;opacity:0;filter: Alpha(opacity = 0);"></iframe><ul>{{each(i, d) data}}<li><a href="javascript:void(0);"  data-position="commonLeft" menucode="{{= d.menuId}}" menuid="{{= d.menuId}}" menuType="{{= d.type}}"  customAppUrl="{{= d.customAppUrl}}" openType="{{= d.openType}}" url="{{= d.href}}"><i></i><span>{{= d.name}}</span></a>{{if d.data != null && d.data.length != 0 }}<ul>{{each(i, d) data}}<li><a href="javascript:void(0);"  data-position="commonLeft" menucode="{{= d.menuId}}" menuid="{{= d.menuId}}" menuType="{{= d.type}}" customHomeMenuUrl="{{= d.customHomeMenuUrl}}" openType="{{= d.openType}}" url="{{= d.href}}"><i></i><span>{{= d.name}}</span></a></li>{{/each}}</ul>{{/if}} </li>{{/each}} </ul></div></li>{{each(i, d) data}}{{if data != null && data.length != 0 && active == 1}}{{each(i, d) data}}<li><a href="javascript:void(0);"  data-position="common" menucode="{{= d.menuId}}" menuid="{{= d.menuId}}" menuType="{{= d.type}}"  openType="{{= d.openType}}" url="{{= d.href}}"><i></i><span>{{= d.name}}</span></a>{{if data != null && data.length != 0}}<div class="ddmenu"><iframe style="width:100%; height:100%; position: absolute; z-index: -1; left: -1px; top: 0px;opacity:0;filter: Alpha(opacity = 0);"></iframe><ul>{{each(i, d) data}}<li><a href="javascript:void(0);" data-position="common"  menucode="{{= d.menuId}}" menuid="{{= d.menuId}}" menuType="{{= d.type}}"  openType="{{= d.openType}}" url="{{= d.href}}"><i></i><span>{{= d.name}}</span></a><ul>{{each(i, d) data}}<li><a href="javascript:void(0);"  menucode="{{= d.menuId}}" menuid="{{= d.menuId}}" menuType="{{= d.type}}"  openType="{{= d.openType}}" url="{{= d.href}}"><i></i><span>{{= d.name}}</span></a></li>{{/each}}</ul></li>{{/each}}</ul></div>{{/if}}</li>{{/each}}{{/if}}{{/each}}<li id="navThirdMoreLink1" style=""><a href="javascript:void(0);" class=""><span class="more"></span></a><div class="ddmenuMore"><iframe style="width:100%; height:100%; position: absolute; z-index: -1; left: 0px; top: 0px;opacity:0;filter: Alpha(opacity = 0);"></iframe><ul id="ddmenuUl"></ul></li></'+'script>',
            parentTag : 'li',
            params: ['menuId', 'href', 'target', 'active','parentId', 'name'] ,
            onMenuClick : null,
            onMenuMouseenter : null,
            onMenuMouseleave : null,
            data :null,
            hasBreadcrumbs : '#breadcrumbs'
        },
        menuId, subMenuId;

    return {
        options: options,
        inilize: false,
        activedata: [],  //当前激活菜单
        cachedata: {},  //菜单解析缓存
        menudata : {}, //以树形结构保存的关系
        domInit: function () {
            var that=this;
            this.elem = $(options.tmplcontent);
            this.template = $(options.tmpl);
            this.getdata();
            $(window).resize(function(){
                that.resizeWidth($("[data-menu-common]"));
            })
            that.resizeWidth($("[data-menu-common]"));
            options.data=null;   //为了解决后台一级菜单和二级菜单分别初始化，数据没有销毁
        },
        getdata: function () {
            var that = this, length = that.elem.length;
            if(length <= 0)
                return;
            if(options.data){
                this.generateMenu(options.data);
            }else if(options.tmplurl) {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: options.tmplurl,
                    success: function (obj) {
                       that.generateMenu.call(that,obj);
                    }
                })
            }
        },
        generateMenu : function(menuData){
            var content = this.options.tmplcontent.split(','),tmpl = this.options.tmpl.split(','),contentItem,tmplItem;
            this.menudata = menuData;
            this.parseData(menuData);
            for (var i=0, len=content.length; i < len ; i++ ){
                if ((contentItem=$(content[i])).length){
                    tmplItem = $(tmpl[i]).length ? $(tmpl[i]) : $(this.options[tmpl[i].replace(/[\[\]]/g,'')]);
                    contentItem.html(tmplItem.tmpl(menuData));
                }
            }
            this.resetActive(this.activeId);
            // 批量执行绑定事件
            this.batch(/^onEvent/);
            this.inilize = true;
            this.trigger('inilize');
        },
        getactive: function () {
            return this.activedata;
        },
        isInit: function () {
            return this.inilize;
        },
        getMenuById : function(menuId,obj){
            for(var prop in obj){
                if(obj.hasOwnProperty(prop)){
                    if(obj[prop]['menuId'] == menuId){
                        return obj[prop];
                    }
                }
            }
        },
        getFirstChild : function(menuId,oriObj){
            var getMenu = (function f(obj){
                if(obj.selfSite){ //selfSite表示用自己的url而非第一个子节点的url
                    return obj.menuId;
                }else{
                    if(obj.data && obj.data.length){
                        return f(obj.data[0]);
                    }else{
                        return obj.menuId;
                    }
                }
            })

            if(oriObj.menuId == menuId){
                return getMenu(oriObj);
            }else{
                var cData = oriObj.data,res;
                if(cData){
                    for(var i = 0,len = cData.length; i < len; i++){
                        res = this.getFirstChild(menuId,cData[i]);
                        if(res)
                            return res;
                    }
                }
                return res;
            }
        },
        eraseData : function(kdata,obj){
           var result = {};
            for(var prop in obj){
                if(obj.hasOwnProperty(prop) && prop != kdata){
                    result[prop] = obj[prop];
                }
            }
            return result;
        },
        parseData: function (pobj) {
            var cdata = this.cachedata,
                kData = this.options.ajaxResponseReader['data'],
                datas = pobj[kData],
                i=0, len=datas.length,
                chldata,obj;

            for (;i < len;i++) {
                chldata = datas[i];
                obj = this.eraseData(kData, chldata);
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
        },
        resetActive: function (menuId) {
            var cdata = this.cachedata,
                data = cdata[menuId], pId;
            if(data){
				 if(data.target&&data.target== '_blank'){
					 var csshover = this.options.csshover;
					 if(csshover){
						this.elem.find('.' + csshover).removeClass(csshover); 
					 }
					 return;
				 }
                this.activedata = [data];
                while (pId=data.parentId) {
                    data = cdata[pId];
                    this.activedata.unshift(data);
                }
            }
            this.changeActiveClass();
            return this.getactive();

        },
        resizeWidth: function(obj){
            var length=obj.width()-$('#navThirdMoreLink1').width(),widthLi=0,li=obj.children(),i= 0,len=li.length,temp="";
            $.each(li,function(i){
                if(i!==len-1){
                    widthLi=widthLi + li.eq(i).width();
                    li.eq(i).find(".ddmenu").removeAttr("style");
                    if(widthLi >length){
						$("#navThirdMoreLink1").css("display","block");
                        for(;i<len-1;i++){

                            if(li.eq(i).find("ul li").length!==0){
                                li.eq(i).find(".ddmenu").removeAttr("style");
                                li.eq(i).children("a").children("i").addClass("menuMoreIcon")
                            }
                            temp=temp+ li.eq(i)[0].outerHTML;
                            li.eq(i).remove();
                        }
                        $("#navThirdMoreLink1 ul#ddmenuUl").prepend(temp)
                        return false;
                    }
                    if(i==(li.length-2)&&widthLi<length){
                        if($("#navThirdMoreLink1  ul#ddmenuUl li").length!==0){
                            for(var k= 0;k<$("#navThirdMoreLink1  ul#ddmenuUl li").length;k++){
                                li.eq(i+k).children("a").children("i").removeClass("menuMoreIcon");
                                $($("#navThirdMoreLink1  ul#ddmenuUl li")[0]).insertAfter(li.eq(i+k));
                                li=obj.children(); widthLi=widthLi + li.eq(i+k+1).width();
                                if(widthLi>length){
                                    $("#navThirdMoreLink1 ul#ddmenuUl").prepend(li.eq(i+k+1));

                                    return false;
                                }
                            }
                        }else{
                            $("#navThirdMoreLink1").css("display","none");
                        }


                    }
                }

            });


        },
        changeActiveClass: function () {
            var that = this,
                css = this.options.cssactive,
                adata = this.activedata,
                pTag = this.options.parentTag;
            if(css)
                this.elem.find('.' + css).removeClass(css);
            $.each(adata, function (n, i) {
                $('[menuId='+i.menuId+']', that.elem).closest(pTag).addClass(css);
            });
        },
        onEventMenuClick: function () {
            var that = this;
            this.elem
                .on('click', 'a', function (event) {
                    var menuId = $(this).attr('menuId'),
                        data;
                    that.resetActive(menuId);
                    data = that.cachedata[menuId];
                    return that.clickval = that.menuClick.call(this, event, that, data, menuId);
                })
        }
    }

})
// 菜单模块
_model.define('menu', function (model) {
    return {
        // 页面操作逻辑
        // 容许覆盖
        menuClick: function (event, that, data, menuId) {
            if(!data)
                return;
            if($.cookie)
                $.cookie('hik-menuId',menuId);   //最后一次的点击存储起来给门户用
            if(typeof that.options.onMenuClick == 'function'){
                var aa = that.getMenuById(menuId,that.cachedata);
                if(that.options.onMenuClick.call($(this),aa) == false){
                    if(eventsManage){
                        eventsManage.trigger('positions','',menuId,data.target ? [data.target] : [window]);
                    }
                    return false;
                }
            }
            var target = $(this).attr('target') || data.target,url =  $(this).attr('url')  || data.href;
            if(that.options.hasBreadcrumbs && eventsManage && target != '_blank'){
                eventsManage.trigger('positions','',menuId,target ? [target] : [window]);
            }
            if (event && event.originalEvent && event.originalEvent.returnValue === false) {
                return false;
            }
            if(url.indexOf('?') > -1){
              url = url + '&random=' + Math.floor(Math.random()*100000);
            }else{
                url = url + '?random=' + Math.floor(Math.random()*100000);
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
                 var ctx = $('#' + target),$parent = ctx.parent();
				
                 var $iframes =(typeof ctx[0].contentWindow.$!=='function')?null:ctx[0].contentWindow.$('iframe');
				if($iframes!==null){
					$iframes.each(function() {
						var $target = $(this);
						if($target.length>0) {
                        $target[0].src = "about:blank";
                        $target[0].contentWindow.document.write('');
                        $target[0].contentWindow.close();
                        $target.remove();
                        if( typeof CollectGarbage == "function") {
                            CollectGarbage();
                        }
                        }
					});
					ctx[0].src = "about:blank;"
					ctx[0].contentWindow.document.write('');
					ctx[0].contentWindow.close();
					ctx.remove();
					if( typeof CollectGarbage == "function") {
						CollectGarbage();
					}
					
					 $parent.append('<iframe id="'+ target +'" name="'+target+'" src="'+ url +'" frameborder="0" class="autoIframe" scrolling="auto"></iframe>');

				}else{
					ctx.attr('src',url);
				}
			
               

            }
            return false;
        },
        menuEnter: function (event, that) {
            var target = $(this),
                csshover = that.options.csshover,
                child;
            var obj=target.parents("[data-menu-common]"),width=obj.width();
            if(csshover == 'hover'){
                target.addClass(csshover);
            }else{
                target.addClass('hover '+csshover)
            }
            if ((child=target.children('div')).length) {
                if($.isOcx && $.isOcx.needModal()){
                	target.data('hasModal',true);
                    $.isOcx.createModal(document.getElementById("mainFrame").contentWindow);
                }
                child.show();
               var childWidth=child.css('width'),childHeight=child.css('height');
                child.children('iframe').css({"width":childWidth,"height":childHeight});
                //检测最后一个元素的下拉div是否超过界限
                if(obj.width()-this.offsetLeft<child.width()&&(target.parents(".ddmenuMore").length==0&&target[0].id!=="navThirdMoreLink1")){
                    target.children(".ddmenu").css({"right":width-this.offsetLeft-target.width(),"-moz-box-shadow":" -3px 3px 4px #ababab","-webkit-box-shadow": "-3px 3px 4px #ababab","box-shadow": "-3px 3px 4px #ababab"});
                }
            }
        },
        menuLeave: function (event, that) {
            var target = $(this),
                csshover = that.options.csshover,
                child;

            if(csshover == 'hover'){
                target.removeClass(csshover);
            }else{
                target.removeClass('hover '+csshover)
            }
            if ((child=target.children('div')).length) {
                if($.isOcx && target.data('hasModal')){
                    target.removeData('hasModal');
                    $.isOcx.removeModal(document.getElementById("mainFrame").contentWindow);
                }
                child.hide();
            }
        },
        onEventMenuHover: function () {
            var that = this;

            this.elem
                .on('mouseenter', 'li', function (event) {
                    return that.menuEnter.call(this, event, that);
                })
                .on('mouseleave', 'li', function (event) {
                    return that.menuLeave.call(this, event, that);
                })
        }
    }
})

