/**
 * Created with JetBrains WebStorm.
 * User: yangyu3
 * Date: 14-12-11
 * Time: 下午2:19
 * To change this template use File | Settings | File Templates.
 */

// 面包屑模块
_model.define('position', ['menu'], function (model, menu) {
    var options = {
            templatecontent: '<ul>',
            isBindMenuClick: true,
            template: '<li><a href="{href}"><span>{name}</span></a></li>',
            nonHrefTempl : '<li><span>{name}</span></li>'
        },
        reg = /\{([^}]*)\}/g;
    return {
        options: options,
        init: function () {
            var that = this;
            if(menu.options.hasBreadcrumbs){
                menu.bind('inilize.positions',function(){
                    that.viewpos();
                });
                eventsManage.bind('positions', this.viewpos, this);
            }

        },
        viewpos: function (event, phtml, menuCode,frames) {
            if(!menu.options.hasBreadcrumbs)
                return;
            var that = this, $html = $($.trim(phtml));
            if (!menu.isInit()) {
                menu.bind('inilize.positions', function () {
                    that.viewpos(event, phtml);
                    menu.unbind('inilize.positions');
                });
                return false;
            }
            if(menuCode) {
                var cMenuCode = menu.getFirstChild(menuCode,menu.menudata);
                menu.resetActive(cMenuCode);
            }
            var actives = menu.getactive(),
                html = $(menu.options.hasBreadcrumbs).empty(),
                list,
                active, i, len;
            for (i=0, len=actives.length; i < len; i ++) {
                active = actives[i] ;
                if((i == len -1) && !$html.length){
                    list =  $(options.nonHrefTempl.replace(reg, function (a, b) {
                        if (active[b]) {
                            return active[b];
                        }
                    }));
                }else{
                    list = $(options.template.replace(reg, function (a, b) {
                        if (active[b]) {
                            return active[b];
                        }
                    }));
                    if (options.isBindMenuClick) {
                        list.bind('click', function (menuId,$a) {
                            return function () {
                                //$a.trigger('click', menuId);这里不知道为什么不触发事件
                                menu.menuClick.apply($a,[event,menu,menu.cachedata[menuId],menuId])
                                return false;//menu.clickval ? menu.clickval : false;
                            }
                        }(active['menuId'],list.find('a')))
                    }
                }
                html.append(list);
            }

            $html.find('a').each(function(i, a) {
                var href =  a.getAttribute('href'),frame = window;;
                if(/javascript:/g.test(href)){
                    a.setAttribute('href', href.replace(/.*?\(\'(.*)\'\)\;/, '$1'));
                }
                $(a).bind('click',function(){
                    return function () {
                        for ( var i = frames.length; i > 0; i--) {
                            if(!frame.frames[frames[i - 1]]) //防止页面缓存不存在的iframe
                                continue;
                            frame = frame.frames[frames[i - 1]];
                        }

                        var target = this.getAttribute('target');
                        target && (frame.location.target = target);
                        frame.location.href = $(this).attr('href');
                        frame.location.target = null;
                        return false;
                    }
                }())
            });
            html.append($html);
        }
    }
});





























