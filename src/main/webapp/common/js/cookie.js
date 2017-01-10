/**
 * Cookie对象
 * 
 * @author 丁杰
 */
var Cookie = {
	/**
	 * 检测浏览器是否支持cookie
	 */
	checkEnabled : function() {
		// 判断cookie是否开启
		var cookieEnabled = (navigator.cookieEnabled) ? true : false;
		// 如果浏览器不是ie4+或ns6+
		if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
			document.cookie = "testcookie";
			cookieEnabled = (document.cookie == "testcookie") ? true : false;
			document.cookie = "";
		}
		return cookieEnabled;
	},
	
	/**
	 * 判断对象是否为空对象，空对象：undefined null '' []
	 * 
	 * @param {}
	 *            obj
	 * @return {Boolean}
	 */
	isEmpty : function(obj) {
		return typeof obj == 'undefined'
				|| obj == null
				|| ((obj.constructor === String || obj.constructor === Array) && obj.length == 0);
	},

	/**
	 * 判断对象是否不为空对象，空对象：undefined null '' []
	 * 
	 * @param {}
	 *            obj
	 * @return {}
	 */
	isNotEmpty : function(obj) {
		return !this.isEmpty(obj);
	},
	
	/**
	 * 设置Cookie
	 * 
	 * @param {String}
	 *            name 名称 *必须
	 * @param {Object}
	 *            value 值
	 * @param {Number}
	 *            hours 过期时间，小时，未设置时，关闭浏览器后被清除
	 */
	set : function(name, value, hours) {
		if (!this.checkEnabled()) {
			return;
		}
		// 判断名称是否为空
		if (this.isNotEmpty(name)) {
			name = escape(name.replace(/^\s*|\s*$/, ''));
			// 参数
			var args = arguments;
			// 参数长度
			var argLen = arguments.length;
			// 过期时间
			var expires = null;
			// 判断过期时间设置
			if (this.isNotEmpty(hours) && !isNaN(hours)) {
				expires = new Date();
				expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
			}
			// 路径
			var path = (argLen > 3) ? args[3] : '/';
			// 域名
			var domain = (argLen > 4) ? args[4] : null;
			// 是否加密
			var secure = (argLen > 5) ? args[5] : false;
			document.cookie = name
					+ "="
					+ escape(value)
					+ ((expires == null) ? "" : ("; expires=" + expires
							.toGMTString()))
					+ ((path == null) ? "" : ("; path=" + path))
					+ ((domain == null) ? "" : ("; domain=" + domain))
					+ ((secure == true) ? "; secure" : "");
		}
	},

	/**
	 * 读取Cookie
	 * 
	 * @param {}
	 *            name 名称
	 */
	get : function(name) {
		if (!this.checkEnabled()) {
			return;
		}
		// 判断名称是否为空
		if (this.isNotEmpty(name)) {
			name = escape(name.replace(/^\s*|\s*$/, ''));
			// 读cookie属性，这将返回文档的所有cookie
			var allcookies = document.cookie;
			// 查找名为name的cookie的开始位置
			name += "=";
			var pos = allcookies.indexOf(name);
			// 如果找到了具有该名字的cookie，那么提取并使用它的值
			if (pos != -1) { // 如果pos值为-1则说明搜索"version="失败
				var start = pos + name.length; // cookie值开始的位置
				var end = allcookies.indexOf(";", start); // 从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
				if (end == -1)
					end = allcookies.length; // 如果end值为-1说明cookie列表里只有一个cookie
				var value = allcookies.substring(start, end); // 提取cookie的值
				return unescape(value); // 对它解码
			}
		}
		// 没有找到相应的cookie时
		return "";
	},

	/**
	 * 清除Cookie
	 * 
	 * @param {}
	 *            name 名称
	 */
	clear : function(name) {
		var This = this;
		if (!This.checkEnabled()) {
			return;
		}
		// 判断名称是否为空，且存在此cookie
		if (This.isNotEmpty(name) && This.isNotEmpty(This.get(name))) {
			This.set(name, "", -1);
		}
	}
};