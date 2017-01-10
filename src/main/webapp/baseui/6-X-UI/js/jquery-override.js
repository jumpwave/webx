(function($) {
    if(typeof _ != 'undefined'){
        _.templateSettings = {
            evaluate : /<#([\s\S]+?)#>/g,
            interpolate : /<#=([\s\S]+?)#>/g
        };
    }
	$(function(){
        if (window != top) {
            try{
                if(typeof top.jAlert == 'function'){
                    window.jAlert = top.jAlert;
                    window.jConfirm = top.jConfirm;
                    window.jPrompt = top.jPrompt;
                    window.jSticky = top.jSticky;
                }
            }catch(e){}


        }


        $.extend({
            dialog :  function(option){
		option= $.extend(option,{dialogClass:"pop-dialog"});
                if(option.id && $('#'+option.id).length)
                    return;
                $.extend(option || {},{closeDestroy:true});
                if(option.displayCtx && typeof option.displayCtx.popWin === 'function'){   //用户自己定义显示在哪一层
                    return option.displayCtx.popWin($.extend(option, {
                        originalPage: option.displayCtx,
                        originalHref: option.displayCtx.location.href
                    }));
                }else{
                    try{
                        if(typeof top.popWin ===  'function'){
                            return top.popWin($.extend(option, {
                                originalPage: window,
                                originalHref: location.href
                            }));
                        }else {
                            return window.popWin($.extend(option, {
                                originalPage: window,
                                originalHref: location.href
                            }));
                        }
                    }catch(e){
                        return window.popWin($.extend(option, {
                            originalPage: window,
                            originalHref: location.href
                        }));
                    }

                }

            },
            sticky : function(message, title, level, callback,options){
                jSticky(message, title, level, callback,options);
            }
        });

        $.isOcx = (function(){
            var inUse  = 0;

            return {
                needModal : function(){
                    if(window.navigator.userAgent.indexOf("Chrome") !== -1){
                        return $('embed').length || (window.frames["mainFrame"] && window.frames["mainFrame"].$ && window.frames["mainFrame"].$('body').find('embed').length)
                            || (document.getElementById('mainFrame') && document.getElementById('mainFrame').getAttribute('needModal'));
                    }
                    return false;
                },
                getContext : function(ctx){
                    var context = ctx;
                    if(document.getElementById('mainFrame').getAttribute('needModal')){
                        var t =document.getElementById('mainFrame').getAttribute('needModal'), path = t.split('.');
												context = window;
                        
                        while(path && path.length){
                            var tempPath = path.splice(0,1)[0];
                            context = context.document.getElementById(tempPath).contentWindow;
                        }
                    }
                    return context;
                },
                createModal : function(context){
                    inUse++;
                    context = this.getContext(context);
                    var $dialog = context.$('.popWrap'),maxZIndex = 100; //防止弹窗的场景
										$dialog.each(function(){
											if(this.style.zIndex > maxZIndex)
												maxZIndex = this.style.zIndex;
										});
                    if(context.$('#ocxModal').length && context.$('#ocxModal')[0].style.zIndex >= maxZIndex)
                        return;
                    var width = context.$('body').width();
                    var html = '<div class="pop_overlay" id="ocxModal" style="background: none;position: absolute;top: 0px;left: 0;opacity: 0; width:'+width +'px; height: 100%; z-index: '+ maxZIndex +'; display: block;"><iframe style="position: absolute; z-index: -1; width: 100%; height: 100%; top: 0px; left: 0px;" frameborder="no" border="0"></iframe></div>';
                    context.$('body').append(html);
                },
                removeModal : function(context){
                    if(inUse  == 0 || --inUse == 0){
                        context = this.getContext(context);
                        (typeof context.$=='function')&& context.$('#ocxModal').remove();
                    }
                }
            }
        })();

        try{
		    if(top.iframeOn_El==null){
			    return;
		    }
		    if(top.iframeOn_El.attr('name')==window.name){
			    return;
		    }
		    if('gridFrame'!=window.name&&'mainFrame'!=window.name&&window!=top){
                return;
            }
		    var href = location.href.split('?');
		    var temSrc = top.iframeOn_El.attr('parentSrc');
		    if(!temSrc)//for ie6
			    return;
            var parentSrc = top.iframeOn_El.attr('parentSrc').split('?');
		    if(href.length > 0 && parentSrc.length > 0 && parentSrc[0].replace(/#/g, '')==href[0].replace(/#/g, '')){
			    return;
		    }
		    top.iframeOn_El.data('dialog').close();
        }catch(e){}


    });
	

	$(function() {
		$('body').ajaxError(function(html, request, response,errorMsg) {
			if(errorMsg=="Service Unavailable"){
				jSticky(language.text('ajax.error.tomcat'), 'error');
				return;
			}
			if(!request || request.status == 0)
				return;
			if (request.status == 200) {
				var inFefresh = request.getResponseHeader('is-refresh');
				var inLogin = request.getResponseHeader('in-login');
				var refreshUrl = request.getResponseHeader('refresh-url');
				if (inFefresh == '1' || inFefresh == 1 || inLogin == '1' || inLogin == 1) {
					if (refreshUrl == null || refreshUrl == '') {
						window.location.reload();
					} else {
						try {
							refreshUrl = decodeURI(refreshUrl);
                            top.location.href = refreshUrl;
						} catch (e) {
							window.location.reload();
						}

					}
				}
				return;
			}
			var errorText = null;
			if ((request.status >= 12000 && request.status <= 13000)) {
				jSticky(language.text('ajax.error.network'), 'error');
				return;
			}
			var statusCode = request.getResponseHeader('ErrorCode');
			var statusMsg = request.getResponseHeader('ErrorMsg');
			//statusMsg = decodeURI(statusMsg);
            statusMsg = decodeURIComponent(statusMsg);
            statusMsg = unescape(statusMsg);

            if (request.status != '900') {
				if(statusMsg != null && statusMsg != '' && statusMsg != 'null'){
					jAlert(lan.text("ajax.error_message", statusMsg, statusCode), language.text('ajax.error_title'), 'error');
				}else{
					var errorMsg = lan.text("ajax.error." + request.status) || language.text('ajax.error.default');
					jAlert(lan.text("ajax.error_message", errorMsg, request.status), language.text('ajax.error_title'), 'error');
				}
				return;
			}

			var islogOut = request.getResponseHeader('LogOut') == 'true' ? true : false;
			var fun = null;
			if (islogOut) {
				fun = function() {
                    try{
                        top.logout();
                    }catch(e){}
				}
			}
			if (statusCode == '-1') {
				jSticky(lan.text("ajax.error_inside_message", [ statusMsg, statusCode ]), 'error', fun);
			} else if(statusCode == '0'){
				jAlert(lan.text("ajax.error_inside_message_without_errorcode", [ statusMsg ]), language.text('ajax.error_title'), 'error', fun);
			}else{
				jAlert(lan.text("ajax.error_inside_message", [ statusMsg, statusCode ]), language.text('ajax.error_title'), 'error', fun);
			}
		}).ajaxComplete(function(e, request, response) {
            try{
                var inFefresh = request.getResponseHeader('is-refresh');
                var inLogin = request.getResponseHeader('in-login');
                var refreshUrl = request.getResponseHeader('refresh-url');
                if (inFefresh == '1' || inFefresh == 1 || inLogin == '1' || inLogin == 1) {
                    if (refreshUrl == null || refreshUrl == '') {
                        window.location.reload();
                    } else {
                        try {
                            refreshUrl = decodeURI(refreshUrl);
                            top.location.href = refreshUrl;
                        } catch (e) {
                            window.location.reload();
                        }
                    }
                }
            }catch(e){
                   //后台没有设置responseHeader则不做处理
            }

		});
	});
	
	$.extend($.ajaxSettings, {
		traditional : true,
		type : "POST",
        statusCode: {
            413: function(){
                jAlert(language.text('ajax.error.413'), language.text('ajax.error.title'), 'error');
            }
        }
	});

	jQuery.ajaxSettings.accepts.json = jQuery.ajaxSettings.accepts.json + ' ,text/json';

	var cookieIframeId = 'cookieIframeId';
	var sl = [ '&', '<', '>' ];
	var rl = [ '&amp;', '&lt;', '&gt;' ];
	var rel = [];
	for ( var i = 0; i < sl.length; i++) {
		rel.push(new RegExp(sl[i], "gm"));
	}


    try{
        if (top.loader)
            window.loader = top.loader;
        if (top.progress)
            window.progress = top.progress;
    }catch(e){}


	Array.prototype.indexOf = function(Object) {
		for ( var i = 0; i < this.length; i++) {
			if (this[i] == Object) {
				return i;
			}
		}
		return -1;
	};
	/*
	 * 为栅格系统增加收缩/展开的功能
	 */
	$.gridtrigger = function(callback) {
        if ($('.withTrigger').length) {
            $('.withTrigger[autoTrigger!=false]').delegate('.trigger-s a', 'click', function() {
                if($(this).parent().hasClass('trigger-left') ||$(this).parent().hasClass('trigger-right'))
                    return;
                var $wrapper = $(this).parents('.withTrigger');
                $wrapper.hasClass('grid-m') ? $wrapper.removeClass('grid-m') : $wrapper.addClass('grid-m');
                callback && callback();
                return false;
            });

            $('.withTrigger[autoTrigger!=false]').delegate('.trigger-left a', 'click', function(){
                var $wrapper = $(this).parents('.withTrigger');
                $wrapper.hasClass('withoutLTrigger') ? $wrapper.removeClass('withoutLTrigger') : $wrapper.addClass('withoutLTrigger');
                return false;
            });

            $('.withTrigger[autoTrigger!=false]').delegate('.trigger-right a', 'click', function(){
                var $wrapper = $(this).parents('.withTrigger');
                $wrapper.hasClass('withoutRTrigger') ? $wrapper.removeClass('withoutRTrigger') : $wrapper.addClass('withoutRTrigger');
                return false;
            });
        }
	};
	/*
	 * 一组checkbox，全选，全不选，半选 @trigger: selector of trigger @triggers: selector of
	 * triggers
	 */
	(function($) {

		var defaults = {
			trigger : null,
			triggers : null
		};
		function checkboxSelectAll(elements, config) {
			var $panels = $(elements);
			$panels.unbind('.checkboxSelectAll');

			if ($.isPlainObject(config)) {
				bindCheck(config);
			} else if ($.isArray(config)) {
				$.each(config, function(idx, conf) {
					bindCheck(conf);
				});
			}
			function bindCheck(config) {
				var options = $.extend({}, defaults, config);
				if (options.trigger == null || options.triggers == null || options.trigger == "" || options.triggers == "") {
					return;
				}

				var $trigger = $panels.find(options.trigger), $triggers = $panels.find(options.triggers);
				if ($trigger.length < 1) {
					return;
				}
				$panels.delegate(options.trigger, 'click.checkboxSelectAll', function(e) {
					$panels.find(options.triggers).each(function(index, ck) {
						ck.checked = $trigger[0].checked;
					});
				}).delegate(options.triggers, 'click.checkboxSelectAll', function(e) {
					update();
				});
				function update() {
					var allChecked = true;
					var allNotChecked = true;
					if ($panels.find(options.triggers).length > 0) {
						$panels.find(options.triggers).each(function(index, c) {
							if (c.checked) {
								allNotChecked = false;
							} else {
								allChecked = false;
							}
						});
					} else {
						allNotChecked = true;
						allChecked = false;
					}
					var ck = $trigger[0];
					if (allChecked) {
						ck.checked = true;
						ck.indeterminate = false;
					} else if (allNotChecked) {
						ck.checked = false;
						ck.indeterminate = false;
					} else {
						ck.indeterminate = true;
					}
				}
				update();
			}
		}
		$.fn.checkboxSelectAll = function(config) {
			return this.each(function() {
				checkboxSelectAll(this, config);
			});
		};

	})(jQuery);
	/**
	 * 自动清除文本框内容;
	 */
	(function(jQuery) {
		jQuery.iTextClear = function(obj, options) {
			var self = this, stat = false, clearBtn = jQuery('<a class="iTextClearButton"></a>');
			self.$el = jQuery(obj);
			self.el = obj;
			self.$el.data("iTextClear", self);
			self.init = function() {
				self.options = jQuery.extend({}, jQuery.iTextClear.defaultOptions, options);
				self.$el.wrap('<span class="iTextClearButtonContainer"></span>').after(clearBtn.hide()).bind("focus.itextclear", function() {
					clearBtn.show()
				}).bind("focusout.itextclear", function() {
					stat ? stat = false : clearBtn.hide()
				});
				clearBtn.bind("mousedown.itextclear", function() {
					stat = true;
					self.$el.val("");
                    clearBtn.hide(); /*取消点击关闭按钮后input聚焦，避免和autocompelete的blur事件冲突，使删除的值重现*/
//					setTimeout(function() {
//						self.$el.focus()
//					}, 0)
				})
			};
            if(/rv:11\./i.test(navigator.userAgent)){
                self.init();
                clearBtn.remove();
                self.$el.css({'margin-right':'0','width':parseInt(self.$el.css('width')) + 25+'px'})
            }else{
                self.init();
            }
		};
		jQuery.iTextClear.defaultOptions = {};
		jQuery.fn.iTextClear = function(options) {
			return this.each(function() {
				new jQuery.iTextClear(this, options)
			})
		}
	})(jQuery);
	/**
	 * 局部使用loading蒙版;
	 */
	(function(jQuery) {
		jQuery.Loading = function(obj, action, options, callback) {
			var self = this, stat = false;
			self.$el = jQuery(obj);
			self.el = obj;
			if (callback != null && $.isFunction(callback)) {
				self.callback = callback;
			} else {
				self.callback = function() {
				}
			}
			self.show = function(callback) {
				var id = self.$el.data('Loading');
				if (id) {
					$('#' + id).show(function() {
						callback();
					});
				} else {
					self.options = jQuery.extend({}, jQuery.Loading.defaultOptions, options);
					self.options.id = self.options.id || 'loading_' + Math.floor(99999 * Math.random());
					self.$el.data("Loading", self.options.id);
					var html = [], $loader;
					html.push('<div id="', self.options.id, '" class="loading-overlay');
					if (!self.options.overlay) {
						html.push(' transparent');
					}
					html.push('"><div class="loading-', self.options.size, '"><i></i>');
					if (self.options.text != '') {
						html.push('<span>', self.options.text, '</span>');
					}
					html.push('</div><div class="shadow"></div></div>');
					$loader = $(html.join(''));
					self.options.css.top = self.$el.offset().top;
					self.options.css.left = self.$el.offset().left;
					self.options.css.width = self.$el.outerWidth();
					self.options.css.height = self.$el.outerHeight();
					$loader.css(self.options.css);
					$('body').append($loader);
					var marginLeft = parseInt($loader.children().first().outerWidth()) / 2;
					$loader.children().first().css('marginLeft', -marginLeft);
					if ($.fn.bgiframe) {
						$loader.bgiframe();
					}
					callback();
				}
			};
			self.hide = function(callback) {
				var id = self.$el.data('Loading');
				if (id) {
					$('#' + id).hide('fade', function() {
						$(this).remove();
						self.$el.data("Loading", "");
						callback();
					});
				}
			};
			switch (action) {
			case "show":
				self.show(self.callback);
				break;
			case "hide":
				self.hide(self.callback);
				break;
			}
		};
		jQuery.Loading.defaultOptions = {
			id : null,
			text : '',
			size : 'm',
			overlay : true,
			css : {
				position : "absolute",
				top : 0,
				left : 0,
				width : "100%",
				height : "100%"
			}
		};
		jQuery.fn.loading = function(action, options, callback) {
			var self = this, callbackFn;
			if (action) {
				if ($.isPlainObject(action)) {
					action = "show";
					options = action;
					callback = options;
				} else if ($.isFunction(action)) {
					action = "show";
					callback = action;
				}
				if ($.isFunction(options)) {
					callback = options;
					options = null;
				}
			} else {
				action = "show";
			}
			return this.each(function(idx) {
				if (idx == (self.length - 1)) {
					callbackFn = callback;
				}
				new jQuery.Loading(this, action, options, callbackFn)
			});
		}
	})(jQuery);


	/**
	 * 时间对象的格式化;
	 */
	Date.prototype.format = function(format) {
		/*
		 * eg:format="yyyy-MM-dd hh:mm:ss";
		 */
		var o = {
			"M+" : this.getMonth() + 1, // month
			"d+" : this.getDate(), // day
			"h+" : this.getHours(), // hour
			"m+" : this.getMinutes(), // minute
			"s+" : this.getSeconds(), // second
			"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
			"S" : this.getMilliseconds()
		// millisecond
		};

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for ( var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};
	/*if (window != top) {
		$.sticky = window.jSticky;
		$.fn._dialog = $.fn.dialog;
	}
	if (window != top) {
		$.fn.dialog = function() {
			var $dialog = $.fn.dialog;
			return function(opt) {
				if (top.dialog) {
					opt = opt || {};
					opt.el = this.clone();
					return top.dialog(opt);
				}
				return $dialog.apply(this, arguments);
			}
		}();
	}*/
	$.extend({
		callback : {
			callbacks : {},
			add : function(type, fun) {
				if (!this.callbacks[type]) {
					this.callbacks[type] = [];
				}
				var callback = this.callbacks[type];
				callback.push(fun);
			},
			remove : function(type, fun) {
				if (!this.callbacks[type]) {
					return;
				}
				if (fun == null) {
					this.callbacks[type] = null;
					return;
				}
				var callback = this.callbacks[type];
				for ( var i = callback.length - 1; i > -1; i--) {
					if (callback[i] === fun) {
						callback.slice(i, 1);
					}
				}
			},
			fireBackAll : function(type, args) {
				var callback = this.callbacks[type];
				if (!callback) {
					return;
				}
				var result = [];
				for ( var i = 0; i < callback.length; i++) {
					result.push(callback[i].apply(this, Array.prototype.slice.call(arguments, 1)));
				}
				return result;
			},
			fireLast : function(type, args) {
				var callback = this.callbacks[type];
				if (!callback) {
					return;
				}
				return callback[callback.length - 1].apply(this, Array.prototype.slice.call(arguments, 1));
			},
			fire : function(type, args) {
				var callback = this.callbacks[type];
				if (!callback) {
					return;
				}
				var result = null;
				for ( var i = 0; i < callback.length; i++) {
					result = callback[i].apply(this, Array.prototype.slice.call(arguments, 1));
				}
				return result;
			}
		},
		getCurrentFrames : function() {
			var frames = [ window.name ];
			var current = window;
			var parentName = null;
            while ((parentName = current.parent.name) && (parentName !== '0') && parentName !== frames[frames.length-1] ) {
				current = current.parent;
				frames.push(parentName);
			}
			return frames;
		},
		absURL : function(url, isFilterParam) {
			url = url == null ? location.href : url;
			if (isFilterParam) {
				url = url.split('?')[0];
			}
			if (url.indexOf('/') == 0) {
				return url;
			}
			var result = null;
			if ( /https?:/g.test(url)) {
				result = url;
			} else {
                var baseEl = $('base'), baseHref = baseEl.length ? baseEl.attr('href') : location.href;
				var end = baseHref.lastIndexOf('/');
				var prefHref = end < 0 ? baseHref : baseHref.substring(0, end);
				result = prefHref + '/' + url;
			}
			result = result.replace(/https?:\/\/[^\/]*/, '');
			
			return result;
		},
		cutStr : function(str, cutLen, ellipsis) {// 截取中英字符串 双字节字符长度为2
			// ASCLL字符长度为1
			if (str == null) {
				return null;
			}
			var returnStr = '', // 返回的字符串
			reCN = /[^\x00-\xff]/, // 双字节字符
			strCNLen = str.replace(/[^\x00-\xff]/g, '**').length, endStr = ellipsis || "…";
			if (cutLen >= strCNLen) {
				return str;
			}
			for ( var i = 0, len = 0; len < cutLen; i++) {
				returnStr += str.charAt(i);
				if (reCN.test(str.charAt(i))) {
					len += 2;
				} else {
					len++;
				}
			}
			return returnStr + endStr;
		},
		htmlToText : function(html) {
			if (html == null || typeof html != 'string') {
				return html;
			}
			for ( var i = 0; i < rel.length; i++) {
				html = html.replace(rel[i], rl[i]);
			}
			return html;
		},
		commonCookie : function(a, b, c) {
			var $iframe = $('iframe[id=' + cookieIframeId + '][name=' + cookieIframeId + ']');
			if ($iframe.length == 0) {
				return null;
			}
			return frames[cookieIframeId].cookie(a, b, c);
		},
        string2Xml : function(xmlstring){
            if (window.ActiveXObject) {
                var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
                xmlobject.async = "false";
                xmlobject.loadXML(xmlstring);
                return xmlobject;
            }
            // for other browsers
            else {
                var parser = new DOMParser();
                var xmlobject = parser.parseFromString(xmlstring, "text/xml");
                return xmlobject;
            }
        },
        detectOS : function(){
            var sUserAgent = navigator.userAgent,isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows"),
                isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) return "Mac";
            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return "Unix";
            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux) return "Linux";
            if (isWin) {
                var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
                if (isWin2K) return "Win2000";
                var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
                if (isWinXP) return "WinXP";
                var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
                if (isWin2003) return "Win2003";
                var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
                if (isWinVista) return "WinVista";
                var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
                if (isWin7) return "Win7";
            }
            return "other";
        },
		urlSplice:function(url,string){
			//url拼接
			var baseUrl=url.split("?")[0];
			var parm=url.split("?").length>1?url.split("?")[1].split("&"):[];
			var tempParm="";
			$.each(parm,function(i){
				switch(parm[i].split("=")[0]){
					case "limit":break;
					case "sortname":break;
					case "sortorder":break;
					default:tempParm=tempParm+(tempParm==""?"?":"&")+parm[i];
				} 
			})
			var parmString=tempParm=="" ? "?"+string:"&"+string;
			return (tempParm=="")?baseUrl+(string==undefined?"":parmString):(baseUrl+tempParm+(string==undefined?"":parmString));
		}
	});
	$.getAbsolute = $.absURL;
	$.fn.extend({
		xml : function() {
			var xmls = [];

            this.each(function (i, n) {
                if (n.xml) {
                    xmls.push(n.xml)
                } else {
                    xmls.push(new XMLSerializer().serializeToString(n))
                }
            })

            return xmls.join('');
		},
		$each : function() {
			var emptyGlobalJquery = $(false);
			return function(fun, args, isNotUseEmptyGlobal) {
				var emptyJquery = isNotUseEmptyGlobal === false ? emptyGlobalJquery : $(false);
				emptyJquery.length = 1;
				if (args) {
					return this.each(function() {
						emptyJquery.context = emptyJquery[0] = this;
						return fun.apply(emptyJquery, arguments);
					}, args);
				}
				return this.each(function(i, input) {
					emptyJquery.context = emptyJquery[0] = input;
					return fun.call(this, i, emptyJquery);
				});
			};
		}(),
		hikui : function() {// 获取该el的被创建出来的hik组件
			if (this.attr('hikmap')) {
				return $.hikui.map[this.attr('hikmap')];
			}
			return null;
		},
		hik : function() {
			return hik(this);
		},
		insert : function(_m, callback, stopKH, cal2) {
			var _o = $(this).get(0);
			var maxLength = _o.getAttribute('maxLength');
			if (maxLength != null) {
				maxLength = parseInt(maxLength);
			}
			var hasChinese = this[0].getAttribute('hasChinese');
			hasChinese = hasChinese == 'true' ? true : false;
			var lengthLastInfo;
			if (hasChinese) {
				var chineseUnitLength = this[0].getAttribute('chineseUnitLength');
				lengthLastInfo = language.text("validator.unitLength.chinese", [ chineseUnitLength ]);
			} else {
				lengthLastInfo = language.text("validator.unitLength");
			}
			if (callback != null && !$.isFunction(callback)) {
				var startKH = callback;
				callback = function(len, value) {
					var vLength = value == null ? 0 : value.length;
					var mLength = _m == null ? 0 : _m.length;
					if (maxLength < vLength + mLength) {
						jAlert(language.text('validator.maxLength',  maxLength + lengthLastInfo), language.text('dialog.info'), 'attention');
						return -1;
					}
					if (value == null || value.length < len) {
						return 0;
					}
					var preValue = value.substring(0, len), lastValue = value.substring(len);

					var preIndexOf = preValue.lastIndexOf(startKH);

					if (preIndexOf < 0 || preIndexOf < preValue.lastIndexOf(stopKH)) {
						return len;
					}
					var lastIndexOf = lastValue.indexOf(stopKH);
					var lastStarIndexOf = lastValue.indexOf(startKH);
					if (lastIndexOf < 0 || (lastStarIndexOf > 0 && lastIndexOf > lastValue.indexOf(startKH))) {
						return len;
					}
					var nv = value.substring(preIndexOf, preValue.length + lastIndexOf + 1);
					if (cal2(nv)) {
						return preIndexOf + nv.length;
					}
					return len;
				}

			}

			if ($.browser.msie) {
				_o.focus();
				sel = document.selection.createRange();
				if (callback != null) {
					if (_o.nodeName.toLowerCase() == 'textarea') {
						var rng = document.body.createTextRange();
						rng.moveToElementText(_o);
						sel.setEndPoint("StartToStart", rng);
					} else {
						sel.setEndPoint("StartToStart", _o.createTextRange());
					}
					var length = sel.text.length;
					var newLength = callback(length, _o.value);
					if (newLength < 0) {
						return;
					}
					if (length != newLength) {
						var r = _o.createTextRange();
						r.moveStart('character', newLength);
						r.collapse(true);
						r.select();
					}
					sel = document.selection.createRange();
				}
				sel.text = _m;
				sel.select();
			} else if (_o.selectionStart || _o.selectionStart == '0') {
				var startPos = _o.selectionStart;
				var endPos = _o.selectionEnd;
				var restoreTop = _o.scrollTop;
				if (callback != null) {
					var newLength = callback(startPos, _o.value);
					if (newLength < 0) {
						return;
					}
					if (startPos != newLength) {
						startPos = newLength;
						endPos = newLength;
					}
				}
				_o.value = _o.value.substring(0, startPos) + _m + _o.value.substring(endPos, _o.value.length);
				if (restoreTop > 0) {
					_o.scrollTop = restoreTop;
				}
				_o.focus();
				_o.selectionStart = startPos + _m.length;
				_o.selectionEnd = startPos + _m.length;
			}
		}
	});

	// 为element增加对append事件的监控
	var origAppend = $.fn.append;
	$.fn.append = function() {
		return origAppend.apply(this, arguments).trigger("append");
	}
})(jQuery);
