(function() {
	var p = '', tp = '.', lp = '.', cp = '.', ltp = '.';

    if(typeof pt == 'undefined'){
        pt = {
            debug : false,
            ctx : '',
            lang : 'zh_cn'
        }
    }
	if (pt.debug == 'true') {
		p = '_debug';
	}

	seajs.config({
		base : pt.ctx + '/',
		alias : {
			'{web}' : 'web',
			'{hikui}' : 'baseui/js/sea/plugins' + p
		}
	});

}());

(function($) {
	$.hikui = $.hikui || {};
	$.hikui.map = {};
	$.extend($.hikui, (typeof hik != 'undefined') ? hik.events : {});
	function destroy() {
		try {
			$.hikui.trigger('unload');
			$.hikui.unbindAll();
		} catch (e) {
		}
	}
	$(window).bind('unload', destroy);
	var modules = {
		swf_schedule : {},
		ocx_preview : {},
		ocx_playback : {},
		ocx_download : {},
		ocx_playback_alarmcenter : {},
		ocx_draw : {},
		calendar : {},
		pdTangram:{},
		ocx_kmsfileupload:{}
	};
	function hikloader(modules) {
		var plugins = [];
		for ( var v in modules) {
			modules[v].auto != false && plugins.push('[hikui=' + v + ']');
            if(typeof hik != 'undefined'){
                hik.fn[v] = function() {
                    var cv = v, url = (modules[v].alias || '{hikui}/') + (modules[v].js || v);
                    return function(opt) {
                        var self = this;
                        seajs.use(url, function(C) {
                            var o = opt || {};
                            o.el = self.context;
                            new C(o);
                        });
                        return this.context;
                    };
                }();
            }
		}
		return plugins.join(',');
	}
    var hikPlugins = hikloader(modules);
	$._parser = {
		auto : true,
		add : function(alias, obj) {
			seajs.config({
				alias : alias
			});
			$.extend(modules, obj);
			hikPlugins = hikPlugins + "," + hikloader(obj);
		},
		parse : function() {
			if (!$._parser.auto)
				return;
			$(hikPlugins).each(function() {
                if($(this).attr('auto-init') == false || $(this).attr('auto-init') ==  'false'){
                    //用户自配置属性，则系统默认不做初始化
                }else{
                    if(typeof hik != 'undefined')
				        hik(this)[this.getAttribute('hikui')]();
                }
			});
		}
	};
    $.parser = $.parser||{};
    $.parser.add=function(alias, obj){
        $._parser.add(alias, obj);
    };
	$(function() {
		$._parser.parse();
	});
})(jQuery);
