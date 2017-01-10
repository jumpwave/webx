/**
 * jQuery基础控制，jQuery版本：1.6
 */
(function($, document) {
	// 页面加载完成执行公共事件的绑定处理
	$(document).ready(function(){
		// 对所有标签进行屏蔽“BackSpace”键回退事件，以及屏蔽右键点击事件
		$('html').delegate('*', {
			keydown: function(event) {
				// 判断是否为“BackSpace”键
			    if (event.keyCode == 8) {
			        var $this = $(event.target);
			        if ((!$this.is('input[type=text]')
							&& !$this.is('input[type=password]')
							&& !$this.is('input[type=file]') && !$this.is('textarea'))
							|| $this.attr('readonly')) {
			            return false;
			        }
			    }
			    return true;
			},
			contextmenu: function() {
				return false;
			}
		});
		
		// 判断当前是否为IE6内核浏览器，对BUTTON以及文本输入框等做hover、focus效果处理
		if (Tool.isIE6()) {
			$('body').delegate('BUTTON,INPUT.text,INPUT.button,SELECT,TEXTAREA', {
				focus: function() {
					$(this).addClass('focus');
				},
				blur: function() {
					$(this).removeClass('focus');
				}
			});
			$('body').delegate('BUTTON,INPUT.button,INPUT[type=button],INPUT[type=submit],INPUT[type=reset]', {
				mouseenter: function() {
					$(this).addClass('hover');
				},
				mouseleave: function() {
					$(this).removeClass('hover');
				}
			});
		}
	});

	// 全局设置ajax请求蒙板配置：load：true/false，text: ''
	$.ajaxLoad = {auto: false};
	// 全局设置ajax请求蒙板是否有效
	$.ajaxLoadAble = function(enable) {
		debugger
		$.ajaxLoad.able = enable;
		if (!enable) {
			$(window).closeLoad();
			$.ajaxLoad.auto = false;
		}
	};
	// 全局设置ajax请求蒙板文本
	$.ajaxLoadText = function(loadText) {
		$.ajaxLoad.text = loadText;
	};
	// 全局设置ajax请求蒙板是否有效
	$.ajaxLoadSetting = function(enable, loadText) {
		$.ajaxLoadAble(enable);
		$.ajaxLoadText(loadText);
	};
	// ajax请求对应各状态处理事件
	$(document).ajaxSend(function(event, jqXHR, ajaxOptions) { // 发送前
	}).ajaxStart(function() { // 开始
	}).ajaxSuccess(function(event, jqXHR, ajaxOptions) { // 成功
	}).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) { // 异常
	}).ajaxComplete(function(event, jqXHR, ajaxOptions) { // 完成
		jqXHR.abort();
		jqXHR = null;
		// 判断是否关闭加载蒙板
		if ($.ajaxLoad.auto) {
			$(window).closeLoad();
		}
		// 重置ajax请求全局设置
		$.ajaxLoad = {auto: false};
	}).ajaxStop(function() { // 停止
		// 判断是否关闭加载蒙板
		if ($.ajaxLoad.auto) {
			$(window).closeLoad();
		}
		// 重置ajax请求全局设置
		$.ajaxLoad = {auto: false};
	});
	
	
	/**
	 * 跳转到错误页面
	 * @param {} errorCode 错误编码
	 */
	var gotoErrorPage = function(errorCode) {
		var errorPage = Tool.getAppPath() + '/web/500.html';
		switch (errorCode) {
			case 401:
				errorPage = Tool.getAppPath() + '/web/403.html';
				break;
			case 403:
				errorPage = Tool.getAppPath() + '/web/403.html';
				break;
			case 404:
				errorPage = Tool.getAppPath() + '/web/404.html';
				break;
			case 408:
				errorPage = Tool.getAppPath() + '/web/408.html';
				break;
			case 500:
				errorPage = Tool.getAppPath() + '/web/500.html';
				break;
			case 503:
				errorPage = Tool.getAppPath() + '/web/503.html';
				break;
			case 505:
				errorPage = Tool.getAppPath() + '/web/505.html';
				break;
		}
		window.location.href = errorPage;
	};
	
	/**
	 * 定制ajax请求公共参数
	 */
	$.ajaxSetup({
		// 设置请求编码类型为UTF-8
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		// 是否缓存数据
		cache: true,
		// 超时时间，默认30秒
		// timeout : 30000,
		// 自定义请求加载蒙板配置，在创建ajax请求时，通过load参数设置蒙板信息，注意：此属性需依赖Load插件，见\hikui\load
		load: {
			able: false,
			text: ''
		},
		// 请求返回数据类型
		dataType: 'json',
		// 解决缓存问题
		beforeSend : function(jqXHR, settings) {
			jqXHR.setRequestHeader("If-Modified-Since", "0");
			var This = this;
			// 判断是否为异步请求
			if (This.async) {
				var load = $.extend({}, This.load, $.ajaxLoad || {});
				// 是否显示蒙板
				if (load.able && $.isFunction($.fn.Load)) {
					Tool.isEmpty(load.text) ? $(window).Load() : $(window).Load(load.text);
					$.ajaxLoad.auto = true;
				}
			}
			return true;
		},
		// 处理系统信息，注意系统信息属性需要唯一，否则会引起错误提示
		dataFilter : function(data, type) {
			if (Tool.isNotEmpty(data)) {
				try {
					var dataTemp = '';
					var returnValue = "";
					type = type.toLowerCase();
					if ('json' == type) {
						returnValue = {};
						dataTemp = $.parseJSON(data);
					} else if ('jsonp' == type) {
						// 获取返回信息首尾索引号
						var start = data.indexOf('{');
						var end = data.lastIndexOf('}');
						// 判断是否首尾索引号是否获取到
						if (start > -1 && end > -1) {
							// 获取返回的信息部分并转化成JSON对象
							dataTemp = $.parseJSON(data.substring(start, end + 1));
							returnValue = data.substring(0, start + 1) + data.substring(end);
						}
					} else {
						returnValue = "";
						dataTemp = $.parseJSON(data);
					}
					
					if (Tool.isNotEmpty(dataTemp)) {
						var pathName = window.location.pathname.substring(1);
						var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
						// 判断是否登录超时
						if (dataTemp.sessionTimeout
								|| dataTemp.tokenError
								|| (Tool.isNotEmpty(dataTemp.errorCode) && dataTemp.errorCode == 'CMS_00_5000')) {
							window.location.reload();
							return returnValue;
						}
						// 判断是否未单点登录
						if (dataTemp.hasOwnProperty('resultCode')
								&& dataTemp.resultCode.toString() === 'redirect') {
							var redirectUrl = dataTemp.message;
							var currentUrl = window.location.href;
							if (/([\w\W]+)(\?service=)([\w\W]*)/.test(redirectUrl)
									&& !/([\w\W]+)(\.jsp)$/.test(currentUrl)
									&& !/([\w\W]+)(\.jsp?)([\w\W]+)/.test(currentUrl)) {
								redirectUrl = redirectUrl.replace(RegExp.$3,
										encodeURIComponent(currentUrl));
							}
							window.location.href = redirectUrl;
							return returnValue;
						}
						// 数据库异常
						if (dataTemp.hasOwnProperty('errorCode')) {
							var errorPage = '/' + webName
									+ '/web/500.html';
							if (dataTemp.errorCode.toString() == 'AE_00_0001') {
								errorPage = '/' + webName
									+ '/web/503.html'
							}
							window.location.href = errorPage;
							return returnValue;
						}
					} else {
						return returnValue;
					}
				} catch (ee) {
					return data;
				}
			} else {
				data = '';
				if (type == 'json') {
					data = {};
				}
			}
			return data;
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var errorCode = parseInt(jqXHR.status);
			gotoErrorPage(errorCode);
		}
	});
	
	/**
	 * 拓展jQuery对象方法
	 */
	$.fn.extend({
		/**
		 * 序列化数据为JSON对象
		 */
		serializeJSON : function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
						if (o[this.name]) {
							if (!o[this.name].push) {
								o[this.name] = [o[this.name]];
							}
							o[this.name].push(this.value || '');
						} else {
							o[this.name] = this.value || '';
						}
					});
			return o;
		},
		
		/**
		 * 定义添加enter快键事件 注意：请在对象添加keyup事件前执行此方法，否则之前的keyup事件将无效
		 * 
		 * @param {}
		 *            handler 事件处理函数
		 */
		addEnterListener : function(handler) {
			return this.each(function() {
						var $this = $(this);
						// 事件方法
						var fn = function(event) {
							// 判断是否为textarea
							if ($(this).is('textarea'))
								return;
							// 判断是否为Enter键
							if (event.keyCode == 13 && $.isFunction(handler)) {
								handler();
							}
							return false;
						};
						// 解绑对象对应keyup事件
						$this.unbind('keyup', fn);
						// 绑定对象对应keyup事件
						$this.bind('keyup', fn);
						return this;
					});
		},
		
		/**
		 * 自定义加入hover事件处理
		 * 
		 * @param {}
		 *            hoverCss 自定义hover样式名称
		 */
		setHover : function(hoverCss) {
			return this.each(function() {
				var $this = $(this);
				// 判断当前是否为IE6内核浏览器
				if (Tool.isIE6()) {
					$this.hover(function() {
								$this.addClass(hoverCss || 'hover');
							}, function() {
								$this.removeClass(hoverCss || 'hover');
							});
				}
			});
		},
		
		/**
		 * 自定义加入focus事件处理
		 * 
		 * @param {}
		 *            focusCss 自定义focus样式名称
		 */
		setFocus : function(focusCss) {
			return this.each(function() {
				var $this = $(this);
				// 判断当前是否为IE6内核浏览器
				if (Tool.isIE6()) {
					$this.bind('focus', function() {
								$this.addClass(focusCss || 'focus');
							}).bind('blur', function() {
								$this.removeClass(focusCss || 'focus');
							});
				}
			});
		},
		
		/**
		 * 自定义设置最小高度方法
		 * 
		 * @param {}
		 *            minHeight 最小高度
		 */
		minHeight : function(minHeight) {
			if (Tool.isIE6()) {
				$(this).css({
							'min-height': minHeight + 'px',
							'height': minHeight + 'px'
						});
			} else {
				$(this).css({
							'min-height': minHeight + 'px'
						});
			}
		},
		
		/**
		 * @param {} url		加载页面路径
		 * @param {} data		请求参数
		 * @param {} success	完成回调函数
		 */
		loadPage: function() {
			var url = '', data = null, complete = null;
			// arguments 数组含有调用函数时传递给函数的参数
			var argCount = arguments.length;
			// 解析参数，并设置参数信息
			switch (argCount) {
				case 0:
					break;
				case 1:
					url = arguments[0];
					break;
				case 2 :
					url = arguments[0];
					if ($.isFunction(arguments[1])) {
						complete = arguments[1];
					} else {
						data = arguments[1];
					}
					break;
				default :
					url = arguments[0];
					data = arguments[1];
					complete = arguments[2];
					break;
			}
			// 加载页面
			$(this).load(url, data, function(response, status, xhr) {
				// 判断是否成功
				if (status == 'success') {
					if ($.isFunction(complete)) {
						complete(response, status, xhr);
					}
				} else {
					var errorCode = parseInt(xhr.status);
					gotoErrorPage(errorCode);
				}
			});
		}
	});
	
	/**
	 * 拓展jQuery对象属性，定时器对象
	 */
	$.extend({
		/**
		 * 缓存timer
		 * @param {} name	定时器名称，唯一
		 * @param {} timer	定时器对象
		 */
		cacheTimer: function(name, timer) {
			// 缓存定时器
			var timers = $('body').data('timers_cache') || {};
			if (timers.hasOwnProperty(name)) {
				if (Tool.isNotEmpty(timers[name])) {
					clearInterval(timers[name]);
				}
			}
			timers[name] = timer;
			$('body').data('timers_cache', timers);
		},
				
		/**
		 * 清除缓存timer
		 * @param {} name	定时器名称
		 */
		clearTimer: function(name) {
			// 缓存定时器
			var timers = $('body').data('timers_cache') || {};
			if (timers.hasOwnProperty(name)) {
				if (Tool.isNotEmpty(timers[name])) {
					clearInterval(timers[name]);
				}
				timers[name] = null;
				delete timers[name];
			}
			$('body').data('timers_cache', timers);
		},
		
		/**
		 * 清除缓存所有timer
		 */
		clearTimers: function() {
			// 缓存定时器
			var timers = $('body').data('timers_cache') || {};
			for (var name in timers) {
				if (Tool.isNotEmpty(timers[name])) {
					clearInterval(timers[name]);
				}
				timers[name] = null;
				delete timers[name];
			}
			$('body').data('timers_cache', {});
		}
	});
	
})(jQuery, document);