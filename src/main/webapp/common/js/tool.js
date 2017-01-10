/**
 * 工具类，此工具类部分方法依赖jQuery
 * @auther 丁杰
 */
var Tool = {
	/**
	 * 格式化url路径，使其以一个“/”结尾
	 * @param {} url
	 */
	formatURLEnd : function(url) {
		// 判断url是否为空
		if (this.isNotEmpty(url)) {
			// 判断是否存在多个“/”结尾的情况
			if (/(\/{2,})$/.test(url)) {
				url = url.substring(0, url.length - RegExp.$1.length + 1);
			}
			// 判断是否以“/”结尾
			if (!/\/$/.test(url)) {
				url += '/';
			}
		}
		return url;
	},
	
	/**
	 * 获得项目根目录路径
	 * 
	 * @return 根目录，如/kms/
	 */
	getAppPath : function() {
		// 协议
		var protocol = window.location.protocol;
		var rootPath = "";
		// 判断是本地文件访问协议
		if ('file:' != protocol) {
			if (typeof appPath != 'undefined' && appPath != null) {
				rootPath = appPath;
			} else {
				var pathName = window.location.pathname.substring(1);
				var webName = pathName == '' ? '' : pathName.substring(0, pathName
								.indexOf('/'));
				rootPath = '/' + webName;
			}
		}
		return rootPath;//this.formatURLEnd(rootPath);
	},
	
	/**
	 * 获得项目web根目录路径
	 * 
	 * @return web根目录路径，如http://10.196.147.66:8080/kms/
	 */
	getAppAddress : function() {
		// 协议
		var protocol = window.location.protocol;
		var headerUrl = "";
		// 判断是本地文件访问协议
		if ('file:' != protocol) {
			if (typeof appBasePath != 'undefined' && appBasePath != null) {
				headerUrl = appBasePath;
			} else if (typeof appPath != 'undefined' && appPath != null) {
				headerUrl = window.location.protocol + '//' + window.location.host + appPath + '/';
			} else {
				var pathName = window.location.pathname.substring(1);
				var webName = pathName == '' ? '' : pathName.substring(0, pathName
								.indexOf('/'));
				headerUrl = window.location.protocol + '//' + window.location.host + '/' + webName + '/';
			}
		}
		return this.formatURLEnd(headerUrl);
	},
	
	/**
	 * 获得联网远程地址
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 */
	getRemoteAddress : function(remote) {
		var remoteAddress = this.getAppAddress();
		// 判断是否存在联网平台信息
		remote={};
		if (this.isNotEmpty(remote) && this.isNotEmpty(remote.ip)
				&& this.isNotEmpty(remote.port)) {
			var path = this.empty2def(remote.path);
			// 判断是否非空，且未以“/”开头时加入“/”
			if (this.isNotEmpty(path) && !/^\//.test(path)) {
				path = '/' + path;
			}
			remoteAddress = ['http://', remote.ip, ':', remote.port, path, '/'].join('');
		}
		return this.formatURLEnd(remoteAddress);
	},
	
	/**
	 * 获取视频、图片、文件等下载路径
	 * @param {} remote
	 * @return {}
	 */
	getDownloadAddress : function(id, type) {
		var baseUrl = "";
		switch(type)
		{
			case "videos": 
				baseUrl = 'VideoSlices/';
				break;
			case "files": 
				baseUrl = 'Files/';
				break;
			default: 
				baseUrl = 'Images/';
//			case "images": 
//				
//				break;
//			case "persons": 
//				
//				break;
//			case "faces": 
//				
//				break;
//			case "motorVehicles": 
//				
//				break;
//			case "nonMotorVehicles": 
//				
//				break;
//			case "things": 
//				
//				break;
//			case "scenes": 
		}
		
		return this.formatURLEnd([this.getAppAddress(), baseUrl, id , '/Data'].join(''));
	},
	
	/**
	 * 获取下载资源所属平台ip和端口信息
	 * @param {} remote
	 * @return {}
	 */
	getDownloadInfo : function(remote) {
		var downloadInfo = {};
//		var downloadInfo = $.extend({}, remote || {});
//		// 非远程资源
//		if(this.isEmpty(downloadInfo.ip))
//		{
			var hostInfo = window.location.host.split(":");
			if(hostInfo.length > 0)
			{
				downloadInfo.ip = hostInfo[0];
			}
			
			if(hostInfo.length > 1)
			{
				downloadInfo.port = hostInfo[1];
			}
//		}
		return downloadInfo;
	},

	/**
	 * 加载Javascript文件
	 * 
	 * @param {}
	 *            src 文件路径
	 */
	importScript : function(src) {
		var scriptElem = document.createElement('script');
		scriptElem.setAttribute('src', src);
		scriptElem.setAttribute('type', 'text/javascript');
		document.getElementsByTagName('head')[0].appendChild(scriptElem);
	},

	/**
	 * 加载CSS文件
	 * 
	 * @param {}
	 *            href 文件路径
	 */
	importLink : function(href) {
		var linkElem = document.createElement('link');
		linkElem.setAttribute('href', href);
		linkElem.setAttribute('type', 'text/css');
		linkElem.setAttribute('rel', 'stylesheet');
		document.getElementsByTagName('head')[0].appendChild(linkElem);
	},
	
	/**
	 * 判断是否为IE浏览器
	 */
	isIE : function() {
		var ua = navigator.userAgent.toLowerCase();
		return ua.indexOf('msie') > -1 && ua.indexOf('opera') == -1;
	},
	
	/**
	 * 判断是否为32为IE浏览器
	 */
	check32BitIE : function() {
		var bit = window.navigator.platform;
		if (bit.indexOf('32') > -1) {
			return this.isIE();
		}
		return false;
	},
	
	/**
	 * 判断是否为IE6内核浏览器
	 */
	isIE6 : function() {
		return 'undefined' == typeof(document.body.style.maxHeight);
	},
	
	/**
	 * 使用IE hasLayout重新渲染页面
	 */
	hasLayout : function() {
		// 判断是否为IE浏览器
		if (this.isIE()) {
		    // 触发重新渲染
		    document.body.style.zoom = 1.1;
		    // 还原页面比例
		    document.body.style.zoom = '';
		}
	},
	
	/**
	 * 获得对象背景图片路径
	 * @param {} $target
	 */
	getBackImage: function($target) {
		var imageUrl = '';
		if ($target.length > 0) {
			imageUrl = $target.css('backgroundImage');
			if (/(url\(\")([\W\w]*)(\"\))/.test(imageUrl)) {
				imageUrl = RegExp.$2;
			}
		}
		return imageUrl;
	},
	
	/**
	 * 获得图片路径Hover效果
	 * @param {} imagePath	正常状态图片路径
	 * @param {} suffix		悬停状态图片路径后台，此规则正常为'_O'
	 */
	getBackImage4Hover: function(imagePath, suffix) {
		// 判断后缀参数是否未定义，则默认为_O
		if (typeof suffix === 'undefined' || suffix == null) {
			suffix = '_O';
		}
		// 判断图片路径是否为空，且是否已.png结尾
		if (this.isNotEmpty(imagePath) && /(.png)$/.test(imagePath)) {
			imagePath = imagePath.replace(RegExp.$1, suffix + RegExp.$1);
		}
		return this.empty2def(imagePath);
	},
	
	/**
	 * 通过className来进行PNG图片的透明处理
	 * @param {} $box 		透明png图片容器
	 * @param {} selector 	图片对象选择器
	 */
	clarityPNG : function($box, selector, hoverSelector) {
		// 判断是否为IE6，设置透明背景
		if (this.isIE6()) {
			this.setBackImage4IE6($box.find(this.empty2def(selector, '.ie6png')));
			this.setBackImage4IE6($box.find(this.empty2def(hoverSelector, '.ie6png_O')), true);
		}
	},
	
	/**
	 * 针对IE6设置透明图片背景，依赖jQuery
	 * @param $target	设置对象
	 * @param isHover	是否悬停效果
	 */
	setBackImage4IE6 : function($target, isHover) {
		// 判断是否为IE6，设置透明背景
		if (this.isIE6()) {
			$target.each(function() {
				var $this = $(this);
				// 获得图片路径
				var imagePath = Tool.getBackImage($this);
				if (Tool.isNotEmpty(imagePath)) {
					$this.css({
						'background-image': 'none',
						'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader' +
							'(src="' + imagePath + '", sizingMethod="crop"'
					});
					// 是否加入hover效果
					if (isHover) {
						// 获得悬浮图片背景
						var hoverImagePath = Tool.getBackImage4Hover(Tool.empty2def(imagePath));
						// 判断悬浮状态图片是否存在
						if (Tool.isNotEmpty(hoverImagePath) && hoverImagePath != imagePath) {
							$this.hover(function() {
								$(this).css({
									'background-image': 'none',
									'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader' +
										'(src="' + hoverImagePath + '", sizingMethod="crop"'
								});
							}, function() {
								$(this).css({
									'background-image': 'none',
									'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader' +
										'(src="' + imagePath + '", sizingMethod="crop"'
								});
							});
						}
					}
				}
			});
		}
	},
	
	/**
	 * 针对IE6设置透明图片背景，依赖jQuery
	 * @param $this 设置对象
	 * @param imagePath 图片路径，绝对路径或相对与页面的路径
	 * @param hoverImagePath 鼠标悬停hover图片路径，绝对路径或相对与页面的路径
	 */
	setBackPath4IE6 : function($target, imagePath, hoverImagePath) {
		// 判断是否为IE6，且图片路径参数是否存在
		if (this.isIE6() && this.isNotEmpty(imagePath)) {
			$target.css({
				'background-image': 'none',
				'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader' +
					'(src="' + imagePath + '", sizingMethod="crop"'
			});
			// 是否加入hover效果
			if (this.isNotEmpty(hoverImagePath)) {
				$target.hover(function() {
					$(this).css({
						'background-image': 'none',
						'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader' +
							'(src="' + hoverImagePath + '", sizingMethod="crop"'
					});
				}, function() {
					$(this).css({
						'background-image': 'none',
						'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader' +
							'(src="' + imagePath + '", sizingMethod="crop"'
					});
				});
			}
		}
	},

	/**
	 * 获得最大z-index的值，依赖jQuery
	 */
	getMaxZIndex : function() {
		var max = 1;
		$('body').find('*').each(function() {
					var zIndex = $(this).css("z-index");
					if (!isNaN(zIndex) && zIndex > max) {
						max = zIndex;
					}
				});
		return parseInt(max);
	},
	
	/**
	 * 按指定格式获得当前时间，依赖date.js
	 * @param {} fmt 时间格式，如yyyy/MM/dd HH:mm，默认yyyy-MM-dd HH:mm:ss
	 */
	getTime: function(fmt) {
		fmt = this.empty2def(fmt, 'yyyy-MM-dd HH:mm:ss');
		return DateFormat.format(new Date(), fmt);
	},
	
	/**
	 * 格式化指定日期对象，依赖date.js
	 * @param {} date 日期对象
	 * @param {} fmt 时间格式，如yyyy/MM/dd HH:mm，默认yyyy-MM-dd HH:mm:ss
	 * @return {}
	 */
	getFmtTime: function(date, fmt) {
		fmt = this.empty2def(fmt, 'yyyy-MM-dd HH:mm:ss');
		return DateFormat.format(new Date(date), fmt);
	},
	
	/**
	 * 解析时间字符串
	 * @param {} dateString 时间字符串
	 * @param {} fmt 时间格式，如yyyy/MM/dd HH:mm，默认yyyy-MM-dd HH:mm:ss
	 */
	parseTime: function(dateString, fmt) {
		fmt = this.empty2def(fmt, 'yyyy-MM-dd HH:mm:ss');
		return DateFormat.parse(dateString, fmt);
	},
	
	/**
	 * 获得两个数之间的随机数，整数
	 * 
	 * @return {}
	 */
	getRandomDigit : function(min, max) {
		var range = max - min;
		var rand = Math.random();
		return (min + Math.round(rand * range));
	},

	/**
	 * 获得制定长度的随机字符串，通过获取系统当前毫秒时间（17位），再加上部分随机字符组成
	 * 
	 * @param {}
	 *            length 默认为32位，且在18与64位之间
	 * @return {}
	 */
	generateUUID : function(length) {
		// 随机数可选字符组，可按需求进行增减
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		// 默认长度
		var defaultLength = 32;
		// 最小长度
		var minLength = 18;
		// 最大长度
		var maxLength = 64;
		
		// 判断参数length是否为数字，默认为32
		if (isNaN(length)) {
			length = defaultLength;
		} else {
			length = Math.round(length);
			// 控制长度在18 到 64 位之前
			if (length < minLength) {
				length = minLength;
			} else if (length > maxLength) {
				length = maxLength;
			}
		}
		// 记录随机数
		var uuid = this.getTime('yyyyMMddHHmmssSSS');
		// 长度
		var uuidLen = uuid.length;
		// 生成随机数
		for (var i = 0; i < length - uuidLen; i++) {
			// ceil的使用使得获得0的几率极小
			var index = Math.ceil(Math.random() * (chars.length - 1));
			uuid += chars.charAt(index);
		}
		return uuid;
	},

	/**
	 * 格式化长数字，按每三位加入分隔符
	 * 
	 * @param {Number}
	 *            number 需格式化数字
	 * @param {}
	 *            separator 分隔符，默认“,”
	 * @return
	 */
	formatLongNumber : function(number, separator) {
		if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(number)) {
			return number;
		}
		if (this.isEmpty(separator)) {
			separator = ',';
		}
		var operator = RegExp.$1, integer = RegExp.$2, decimal = RegExp.$3;
		integer = integer.split('').reverse().join('').replace(/(\d{3})/g,
				'$1' + separator).split('').reverse().join('');
		var reg = new RegExp("^" + separator);
		if (reg.test(integer)) {
			integer = integer.substring(separator.length);
		}
		return operator + "" + integer + "" + decimal;
	},
	
	/**
	 * 获得字符串字节长度
	 * @param {} target		字符串对象
	 * @param {} CNBytes	中文字符代表字节数，默认为2
	 */
	getBytes : function(target, CNBytes) {
		// 判断是否定义中文字符代表字节数，则默认为2
		if (isNaN(CNBytes) || CNBytes <= 0) {
			CNBytes = 2;
		}
		var replaceInfo = '';
		for (var i = 0; i < CNBytes; i++) {
			replaceInfo += '*';
		}
		return this.isEmpty(target) ? 0 : (target + '').replace(/[^\x00-\xFF]/g, replaceInfo).length;
	},

	/**
	 * 截取字符串对象限定字节数的字符串
	 * @param {} target		字符串对象
	 * @param {} showBytes	需要显示的字节数
	 * @param {} CNBytes	中文字符代表字节数，默认为2
	 * @return {}
	 */
	clip : function(target, showBytes, CNBytes) {
		// 判断显示字节数是否定义，默认至少为1
		if (isNaN(showBytes) || showBytes <= 1) {
			showBytes = 1;
		}
		// 判断是否定义中文字符代表字节数，则默认为2
		if (isNaN(CNBytes) || CNBytes <= 0) {
			CNBytes = 2;
		}
		// 判断对象是否超出限制字节数
		if (this.getBytes(this.filterHTML(target), CNBytes) > showBytes) {
			var clip = '';
			for (var i = 0; i < target.length && showBytes > -1; i++) {
				var ch = target.charAt(i);
				if (ch > '~') {
					showBytes -= CNBytes;
				} else {
					showBytes -= 1;
				}
				
				if (showBytes > -1) {
					clip += '' + ch;
				} else {
					break;
				}
			}
			return clip;
		}
		return target;
	},
	
	/**
	 * 截取字符串对象限定字节数的字符串，加入省略（适用于多行文本时超出部分显示）
	 * @param {} target		字符串对象
	 * @param {} showBytes	需要显示的字节数
	 * @param {} CNBytes	中文字符代表字节数，默认为2
	 * @return {}
	 */
	ellipsis : function(target, showBytes, CNBytes) {
		// 判断是否定义中文字符代表字节数，则默认为2
		if (isNaN(CNBytes) || CNBytes <= 0) {
			CNBytes = 2;
		}
		// 判断显示字节数是否定义，默认至少为1
		if (isNaN(showBytes) || showBytes < CNBytes + 1) {
			showBytes = CNBytes + 1;
		}
		// 判断对象是否超出限制字节数
		if (this.getBytes(this.filterHTML(target), CNBytes) > showBytes) {
			// 省略信息
			var ellipsis = '…';
			// 除去省略信息所占字节数
			showBytes -= this.getBytes(ellipsis);
			return this.clip(target, showBytes, CNBytes) + ellipsis;
		}
		return target;
	},
	
	/**
	 * 判断对象是否为空对象，空对象：undefined null '' []
	 * @param {} obj
	 * @return {Boolean}
	 */
	isEmpty: function(obj) {
		return typeof obj == 'undefined'
				|| obj == null
				|| (obj.constructor === String && obj.length == 0);
	},
	
	/**
	 * 判断对象是否不为空对象，空对象：undefined null '' []
	 * @param {} obj 
	 * @return {}
	 */
	isNotEmpty: function(obj) {
		return !this.isEmpty(obj);
	},
	
	/**
	 * 判断值为空时取默认值返回，可传递多个参数
	 */
	empty2def: function() {
		var value = '';
		for (var i = 0; i < arguments.length; i++) {
			if (this.isNotEmpty(arguments[i])) {
				value = arguments[i];
				break;
			}
		}
		return value;
	},
	
	/**
	 * 解析获得对象对应字段映射值，支持键值用“.”连写递归的方式
	 * @param {} data
	 * @param {} key
	 * @return {} value
	 */
	getValueByKey: function(data, key) {
		var keys = key.split('.');
		for (var i = 0; i < keys.length; i++) {
			if (data.hasOwnProperty(keys[i])) {
				data = data[keys[i]];
			} else {
				data = '';
				break;
			}
		}
		return data;
	},
	
	/**
	 * 过滤掉HTML信息
	 * @param {} source
	 */
	filterHTML : function(source) {
		source = this.empty2def(source);
		return $.isFunction(source.replace) ? source.replace(/<[^>]*>/g, '') : source;
	},
	/**
	 * 采用Http方式通过浏览器下载url对应文件
	 * @param {} url	下载地址
	 */
	download: function(url) {
//		// 获得下载IFrame对象
//		var $downloadIFrame = $('IFRAME#targetFrame');
//		// 判断对象是否存在
//		if ($downloadIFrame.length == 0) {
//			$downloadIFrame = $('<IFRAME/>').attr('id', 'targetFrame').appendTo($('body'));
//		}
//		// 设置下载路径
//		$downloadIFrame.empty().attr('src', url);
		var downloadWin = this.openwin(url, {
			width: 500,
			height: 150,
			location: 'no'
		});
		// 防止浏览器安全问题导致页面未打开的情况
		try {
			// 构建提示信息DOM对象
			var element = downloadWin.document.createElement('body');
			element.innerHTML = '<center><h1>下载准备中...</h1></center>';
			downloadWin.document.appendChild(element);
		} catch (e) {
			// ignore
		}
	},
	
	/**
	 * 下载远程文件
	 * @param {} url
	 * @param {} fileName
	 */
	downloadRemoteFile: function(url, fileName) {
		url = appPath + '/docMgrAction!downloadRemoteFile.action?docPath=' + url + '&fileName=' + fileName;
		this.download(url);
	},
	
	/**
	 * 换算文件大小单位
	 * 
	 * @param {Number}
	 *            fileSize 文件内容字节长度，如1025
	 * @return {}
	 * 			  转换成对应单位后的结果
	 */
	convertUnit : function(fileSize) {
		// 对数字进行四舍五入处理
		if (isNaN(fileSize)) fileSize = 0;
		fileSize = Math.round(fileSize);
		
		// 文档大小单位
		var unit = '字节';
		// 单位级别换算阀值
		var threshold = 1024;
		// 存储单位
		var units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB'];
		/**
		 * 转换单位
		 * @param {} fileSize	文件大小
		 * @param {} level		当前级别
		 */
		var convertUnit = function(fileSize, level) {
			// 判断单位是否需要进一步转换，且为允许级别
			if (fileSize >= threshold && level < units.length) {
				unit = units[level];
				// 递归获取
				return convertUnit(fileSize / threshold, ++level);
			} else {
				// 返回转换后的结果
				return parseFloat(fileSize.toFixed(2)) + '&nbsp;&nbsp;' + unit;
			}
		};
		return convertUnit(fileSize, 0);
	},
	
	/**
	 * 打开窗口，默认居中显示（支持通过post方式传递参数）
	 * @param {String} url	窗口页面路径
	 * @param {Boolean} [alwaysSame]	是否始终打开同一个窗口，可选，默认false
	 * @param {Object} [options]	窗口显示属性，可选
	 * 				尺寸：width、height
	 * 				位置：left、top
	 * 				地址栏：location yes|no
	 * 				缩放：resizable yes|no
	 * 				滚动条：scrollbars yes|no
	 * 				工具栏：toolbar yes|no
	 * 				菜单栏：menubar yes|no
	 * 				状态栏：status yes|no
	 * @return {Window} openWindow	打开的窗口对象
	 */
	openwinPost: function(url, data) {
		var This = this;
		var alwaysSame = false, // 是否始终打开同一个窗口
			options = {}; // 窗口显示属性
		// 判断参数个数
		if (arguments.length == 2) {
			if (typeof arguments[1] === 'boolean') {
				alwaysSame = arguments[1];
			} else {
				options = arguments[1];
			}
		} else if (arguments.length >= 3) {
			alwaysSame = arguments[1];
			options = arguments[2];
		}
		// 继承自定义属性
		var config = $.extend({}, options || {});
		// 窗口显示配置
		var winoptions = [];
		// 配置属性名称
		var fields = ['location', 'resizable', 'scrollbars', 'toolbar', 'menubar', 'status'];
		// 循环设置配置
		for (var index in fields) {
			var field = fields[index];
			if (This.isNotEmpty(config[field])) {
				winoptions.push(field + '=' + config[field]);
			}
		}
		// 窗口尺寸
		var width = config.width, height = config.height;
		// 判断宽与高均设置，则计算并设置居中显示窗口页面
		if (!isNaN(width) && !isNaN(height)) {
			// 判断计算默认居中显示
			var clientWidth = window.screen.availWidth, clientHeight = window.screen.availHeight;
			var left = config.hasOwnProperty('left') ? config.left : (clientWidth - width) / 2;
			var top = config.hasOwnProperty('top') ? config.top : (clientHeight - height) / 2 - 40;
			winoptions.push(['width=' + width, 'height=' + height, 'left=' + left, 'top=' + top]);
		}
		// 打开窗口，窗口名称null时此方法打开的窗口将在同一个窗口中显示
		var newWindow = window.open('', alwaysSame ? null : '_blank', winoptions.join(','));
		if (!newWindow) {
			return false;
		}
		if (This.isNotEmpty(data)) {
			var postDataHtml = "<html><head></head><body>";
			postDataHtml += "<form id='postDataForm' method='post' action='" + url + "'>";
			for(var key in data)
			{
				postDataHtml += "<input type='hidden' name='" + key + "' value='" + data[key] + "'/>";
			}
			postDataHtml += "</form><script type=\"text/javascript\">document.getElementById(\"postDataForm\").submit()</script></body></html>";
			newWindow.document.write(postDataHtml);
			newWindow.document.close();
		}
		// 激活窗口
		newWindow.focus();
		return newWindow; 
	},
	
	/**
	 * 打开窗口，默认居中显示
	 * @param {String} url	窗口页面路径
	 * @param {String} [windowName]	窗口名称
	 * @param {Object} [options]	窗口显示属性，可选
	 * 				尺寸：width、height
	 * 				位置：left、top
	 * 				地址栏：location yes|no
	 * 				缩放：resizable yes|no
	 * 				滚动条：scrollbars yes|no
	 * 				工具栏：toolbar yes|no
	 * 				菜单栏：menubar yes|no
	 * 				状态栏：status yes|no
	 * @return {Window} openWindow	打开的窗口对象
	 */
	openwin: function(url) {
		var This = this;
		var windowName = '_blank', // 窗口名称
			options = {
			}; // 窗口显示属性
		// 判断参数个数
		if (arguments.length == 2) {
			if (typeof arguments[1] === 'string') {
				windowName = arguments[1];
			} else {
				$.extend(options, arguments[1] || {});
			}
		} else if (arguments.length >= 3) {
			windowName = arguments[1];
			$.extend(options, arguments[2] || {});
		}
		// 窗口显示配置
		var winoptions = [];
		// 配置属性名称
		var fields = ['location', 'resizable', 'scrollbars', 'toolbar', 'menubar', 'status'];
		// 循环设置配置
		for (var index in fields) {
			var field = fields[index];
			if (This.isNotEmpty(options[field])) {
				winoptions.push(field + '=' + options[field]);
			}
		}
		// 窗口尺寸
		var width = options.width, height = options.height;
		// 判断宽与高均设置，则计算并设置居中显示窗口页面
		if (!isNaN(width) && !isNaN(height)) {
			// 判断计算默认居中显示
			var clientWidth = window.screen.availWidth, clientHeight = window.screen.availHeight;
			var left = options.hasOwnProperty('left') ? options.left : (clientWidth - width) / 2;
			var top = options.hasOwnProperty('top') ? options.top : (clientHeight - height) / 2 - 40;
			winoptions.push(['width=' + width, 'height=' + height, 'left=' + left, 'top=' + top]);
		}
		// 打开窗口
		var openWindow = window.open(url, windowName, winoptions.join(','));
		if (!openWindow) {
			return false;
		}
		// 激活窗口
		openWindow.focus();
		return openWindow;
	},
	
	/**
	 * 关闭窗口
	 * @param {} closeWindow	待关闭窗口对象
	 * @param {} unforce		非强制关闭
	 */
	closewin: function(closeWindow, unforce) {
		try {
			// 默认为当前窗口
			closeWindow = this.empty2def(closeWindow, window);
			if (!unforce) {
				closeWindow.opener = null;
				closeWindow.open('','_self');
			}
			closeWindow.close();
		} catch(e) {
			closeWindow.opener = null;
			closeWindow.open('','_self');
			closeWindow.close();
		}
	},
	
	/**
	 * 当前窗口发送POST请求
	 * @param {} win		窗口对象
	 * @param {} postData	参数，JSON对象
	 * @param {} actionUrl	POST请求地址路径，默认为win窗口路径
	 */
	postwin: function(win, postData, actionUrl) {
		// 判断参数是否存在，且为JSON对象
		if (this.isEmpty(postData) || !$.isPlainObject(postData)) {
			postData = {};
		}
		if (!$.isWindow(win)) {
			win = window;
		}
		// 获得当前页面路径
		var url = this.empty2def(actionUrl, win.location.href);
		// 模拟POST请求上传页面
		var postHtml = [
			'<html>',
				'<body>',
					'<form name="postForm" method="post" action="' + url + '">',
					'</form>',
				'</body>',
				'<script>document.forms[0].submit();</script>',
			'</html>'
		];
		// 获得所有POST请求参数标签
		var postInput = [];
		for (var key in postData) {
			postInput.push('<input type="hidden" name="' + key + '" value="' + this.empty2def(postData[key]) + '" />');
		}
		// 将POST请求标签加入到form表单中
		postHtml.splice(3, 0, postInput);
		try {
			// 发送POST请求
			win.document.write(postHtml.join(''));
			win.document.close();
			// 激活窗口
			win.focus();
		} catch (e) {
			// ignore
		}
	},
	getOvitPath : function() {
		return appPath + '/download/tool.exe';
//		var path = '';
//		var errorMsg = '';
//		var url = this.getRemoteAddress() + 'kms/services/rest/CRL/getOvitPath';
//		// 获取mp4海康视频rtsp路径
//		$.ajax({
//			url : url,
//			async : false,
//			jsonp : "callback",
//			success : function(data) {
//				if (Tool.isNotEmpty(data)) {
//					if (data.ret == 0) {
//						path = data.msg;
//					} else {
//						errorMsg = data.msg;
//					}
//				} else {
//					errorMsg = '获取最新视侦通下载地址失败！';
//				}
//			},
//			error : function() {
//				errorMsg = '获取最新视侦通下载地址异常！';
//			}
//		});
//		// 判断是否错误
//		if (this.isNotEmpty(errorMsg)) {
//			if ($.isFunction($.fn.tipbox)) {
//				$(window).tipbox(errorMsg, {
//					close : false
//				});
//			} else if ($.isFunction(window.Alert)) {
//				window.Alert(3000, errorMsg);
//			} else {
//				alert(errorMsg);
//			}
//		}
//		return this.empty2def(path, this.getAppAddress() + 'web/404.html');
	},
	/**
	 * 移除所有加载蒙板对象
	 */
	closeLoad: function() {
		$('.hikui_load_dialog').remove();
		$('.hikui_dj_mask').remove();
		$('.hikui_dj_loading').remove();
	},
	
	/**
	 * 获得图片或视频缩略图路径
	 * @param {} id		图片id
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 */
	getThumbnail : function(id, remote) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		return this.getRemoteAddress(remote) + 'kms/services/rest/CRL/getThumbnail?id=' + id + token;
	},
	
	/**
	 * 获得预览文件路径
	 * @param {} id		预览文件id
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 */
	getPreviewFile : function(id, remote) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		return this.getRemoteAddress(remote) + 'kms/services/rest/dataInfoService/getDocumentPreviewFile?id=' + id + token;
	},
	
	/**
	 * 获取视频第一帧图片
	 * @param {} id
	 * @param {} remote
	 * @return {}
	 */
	getPreviewFileForVideo : function(id, remote) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		return this.getRemoteAddress(remote) + 'kms/services/rest/CRL/getVoidFirstImage?id=' + id + token;
	},
	
	/**
	 * 获得源文件路径
	 * @param {} id		源文件id
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 */
	getSourceFile : function(id, remote,filename) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		var filename = this.isNotEmpty(filename) ? '&filename=' + this.encodeStr(filename) : '' ;
		return this.getRemoteAddress(remote) + 'kms/services/rest/CRL/downloadFile?id=' + id + token+filename;
	},
	getSourceFileSrc : function(id, remote) {
//		id=id.replace(new RegExp("%","gm"),"%25").replace(new RegExp("&","gm"),"%26");
		id = encodeURI(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		return this.getRemoteAddress(remote) + 'kms/services/rest/CRL/downloadFile?id=' + id + token;
	},
	encodeStr : function(id) {
		//替换%
		var reg =/[%]+/i;
		if(reg.test(id)&&id.indexOf("%25")==-1){
			//转特殊字符
			id=id.replace(new RegExp("%","gm"),"%25");
		}
		//替换&符号
		reg =/[&]+/i;
		if(reg.test(id)){
			//转特殊字符
			id=id.replace(new RegExp("&","gm"),"%26");
		}
		id = encodeURI(id);
		return id;
	},
	/**
	 * 获得智能源文件路径
	 * @param {} id 文件唯一索引
	 * @param {} recordType 
	 * @param {} imageType
	 * @param {} remote
	 * @return {}
	 */
	getIntelliSourceFile : function(id, recordType, imageType, remote) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		return this.getRemoteAddress(remote) + 'kms/services/rest/CRL/getIntellFile?id=' + id 
			+ '&recordType=' + recordType 
			+ '&imageType=' + imageType + token;
	},
	
	/**
	 * 获得海康视频rtsp播放路径
	 * @param {} id 文件id
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 * @param {} onSuccess 	获取成功回调函数
	 * @param {} onError 	获取失败回调函数
	 * @param {} onComplete	获取完成回调函数
	 */
	getRTSPUrl : function(id, remote, onSuccess, onError, onComplete) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		var dataType = this.isEmpty(token) ? 'json' : 'jsonp';
		var url = this.getRemoteAddress(remote) + 'kms/services/rest/CRL/getRtspPath?id=' + id + token;
		// 获取mp4海康视频rtsp路径
		$.ajax({
			url: url,
			dataType: dataType,
			jsonp: "callback",
			complete: function() {
				if ($.isFunction(onComplete)) {
					onComplete();
				}
			},
			success: function(data) {
				if (Tool.isNotEmpty(data)) {
					if (data.ret == 0) {
						if ($.isFunction(onSuccess)) {
							onSuccess(data);
						}
					} else if ($.isFunction(onError)) {
						onError('获取视频RTSP播放地址失败：' + data.msg);
					}
				} else if ($.isFunction(onError)) {
					onError('获取视频RTSP播放地址失败！');
				}
			},
			error: function() {
				if ($.isFunction(onError)) {
					onError('获取视频RTSP播放地址异常！');
				}
			}
		});
	},
	
	/**
	 * 获得调用视侦通播放路径
	 * @param {} id		源文件id
	 * @param {} name	源文件名称
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 */
	getOvitUrl : function(id, name, remote,fileinfo) {
		//启动播放器时需要转码
//		var url = this.getRemoteAddress(remote) + 'kms/services/rest/archive/ovit/base64Encode';
//		$.ajax({
//			type : 'POST',
//			url : url,
//			contentType:'text/xml',
//			dataType : 'json',
//			data : id,
//			async:false,
//			success : function(result) {
//				id=result.value;
//			},
//			error : function() {
//				Fail('获取base64Encode异常！');
//			}
//		});
//		id="BASE64:"+id;
		// 初始化远程信息
		remote = this.empty2def(remote, {});
		remote={};
		// 获得视图库ip
		var ip = this.empty2def(remote.ip, window.location.hostname),
			port = this.empty2def(remote.port, window.location.port, '80'),
			token = this.empty2def(remote.token, window.TOKEN);
		var ovitUrl= ['HikVideoPlayer://kms://', ip, ':', port, '/playvideo?id=', id, '&name="', name, '"&token=', token,'&fileinfo=',fileinfo, ' /utf8'].join('');
//		alert(ovitUrl);
		return ovitUrl;
	},
	
	/**
	 * 获得调用视侦通播放路径
	 * @param {} id		源文件id
	 * @param {} name	源文件名称
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 */
	getOvitOCXUrl : function(id, name, remote) {
		id = encodeURI(id);
		// 初始化远程信息
		remote = this.empty2def(remote, {});
	    remote={};
		// 获得视图库ip
		var ip = this.empty2def(remote.ip, window.location.hostname),
			port = this.empty2def(remote.port, window.location.port, '80'),
			token = this.empty2def(remote.token, window.TOKEN);
		
		return ['kms25://', ip, ':', port, '/playvideo?id=', id, '&name="', name, '"&token=', token].join('');
	},
	
	/**
	 * 获得海康视频rtsp播放路径
	 * @param {} id 文件id
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 * @param {} onSuccess 	获取成功回调函数
	 * @param {} onError 	获取失败回调函数
	 * @param {} onComplete	获取完成回调函数
	 */
	getPreviewInfo : function(id, remote, onSuccess, onError, onComplete) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		var dataType = this.isEmpty(token) ? 'json' : 'jsonp';
		var url = this.getRemoteAddress(remote) + 'kms/services/rest/dataInfoService/getPreviewInfo?id=' + id + token;
		// 获取mp4海康视频rtsp路径
		$.ajax({
			url: url,
			dataType: dataType,
			jsonp: "callback",
			complete: function() {
				if ($.isFunction(onComplete)) {
					onComplete();
				}
			},
			success: function(data) {
				if (Tool.isNotEmpty(data)) {
					if (data.ret == 0 && data.canPreview) {
						if ($.isFunction(onSuccess)) {
							onSuccess(data);
						}
					} else if ($.isFunction(onError)) {
						onError(Tool.empty2def(data.msg, '很抱歉！当前文件无法预览！'));
					}
				} else if ($.isFunction(onError)) {
					onError('很抱歉！当前文件无法预览！');
				}
			},
			error: function() {
				if ($.isFunction(onError)) {
					onError('很抱歉！获取文件预览信息出错！');
				}
			}
		});
	},
	
	/**
	 * 获得文件预览路径
	 * @param {} id			文件id
	 * @param {} remote		级联平台信息
	 */
	getPreviewUrl : function(id, remote) {
		id = encodeURI(id);
		if (Tool.isEmpty(id)) {
			return '';
		}
		remote = this.empty2def(remote, {});
		// 参数信息
		var params = ['id=' + id];
		// 判断是否存在级联平台信息
		if (Tool.isNotEmpty(remote)) {
			for (var name in remote) {
				if (this.isNotEmpty(remote[name])) {
					params.push(name + '=' + remote[name]);
				}
			}
		}
		// 构建预览路径
		return this.getAppAddress() + 'web/preview/preview.jsp?' + params.join('&');
	},
	
	/**
	 * 文件预览
	 * @param {} id		文件id
	 * @param {}
	 *            remote 联网平台信息
	 *            	ip/port/token/path
	 * @return {Window} openWindow	打开的窗口对象
	 */
	preview : function(id, remote) {
		id = encodeURI(id);
		return this.openwin(this.getPreviewUrl(id, remote), {
			width: 1200,
			height: 600,
			resizable: 'yes',
			scrollbars: 'yes'
		});
	},
	
	/**
	 * 删除文件
	 * @param {} id		文件id
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 * @param {} onSuccess 	删除成功回调函数
	 * @param {} onError 	删除失败回调函数
	 * @param {} onComplete	删除完成回调函数
	 */
	deleteFile : function(id, remote, onSuccess, onError, onComplete) {
		id=this.encodeStr(id);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? '&token=' + remote.token : '' ;
		var dataType = this.isEmpty(token) ? 'json' : 'jsonp';
		var url = this.getRemoteAddress(remote) + 'kms/services/rest/CRL/deleteFiles?id=' + id + token;
		$.ajax({
			type: 'POST',
			url: url,
			dataType: dataType,
			complete: function() {
				if ($.isFunction(onComplete)) {
					onComplete();
				}
			},
			success: function(result) {
				if (Tool.isNotEmpty(result) && result.ret == 0) {
					if ($.isFunction(onSuccess)) {
						onSuccess(result);
					}
				} else if ($.isFunction(onError)) {
					onError(result);
				}
			},
			error: function(err) {
				if ($.isFunction(onError)) {
					onError();
				}
			}
		});
	},
	
	/**
	 * 批量删除文件
	 * @param {} ids		文件ids，多个用逗号隔开
	 * @param {} remote	联网平台信息 {ip: , port: '', token: '', path: ''}
	 * @param {} onSuccess 	删除成功回调函数
	 * @param {} onError 	删除失败回调函数
	 * @param {} onComplete	删除完成回调函数
	 */
	deleteFiles : function(ids, remote, onSuccess, onError, onComplete) {
		ids=this.encodeStr(ids);
		// token参数
		var token = (this.isNotEmpty(remote) && this.isNotEmpty(remote.token)) ? remote.token : '' ;
		var dataType = this.isEmpty(token) ? 'json' : 'jsonp';
		var url = this.getRemoteAddress(remote) + 'kms/services/rest/CRL/deleteMultiFiles';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				ids: ids,
				token: token
			},
			dataType: dataType,
			load: {able: true, text: '删除中'},
			complete: function() {
				if ($.isFunction(onComplete)) {
					onComplete();
				}
			},
			success: function(result) {
				if (Tool.isNotEmpty(result) && result.ret == 0) {
					if ($.isFunction(onSuccess)) {
						onSuccess(result);
					}
				} else if ($.isFunction(onError)) {
					onError(result);
				}
			},
			error: function(err) {
				if ($.isFunction(onError)) {
					onError();
				}
			}
		});
	},
	
	/**
	 * 针对URL请求参数进行编码返回，防止特殊字符传输错误
	 */
	urlParamEncode : function(url) {
		//在前面已经转过了
//		if (this.isNotEmpty(url)) {
//			var reg = new RegExp('(^|&)([\w\W]*)=([^&]*)(&|$)', 'gm');
//			var urls = url.split('?');
//			if (urls.length == 2 && /(^|&)([\w\W]*)=([^&]*)(&|$)/g.test(urls[1])) {
//				url = urls[0] + '?' + urls[1].replace(/(^|&)([\w\W]*)=([^&]*)(&|$)/g, RegExp.$1 + RegExp.$2 + '=' + encodeURIComponent(RegExp.$3) + RegExp.$4);
//			}
//		}
		return url;
	},
	urlParamEncode_old : function(url) {
		if (this.isNotEmpty(url)) {
			var reg = new RegExp('(^|&)([\w\W]*)=([^&]*)(&|$)', 'gm');
			var urls = url.split('?');
			if (urls.length == 2 && /(^|&)([\w\W]*)=([^&]*)(&|$)/g.test(urls[1])) {
				url = urls[0] + '?' + urls[1].replace(/(^|&)([\w\W]*)=([^&]*)(&|$)/g, RegExp.$1 + RegExp.$2 + '=' + encodeURIComponent(RegExp.$3) + RegExp.$4);
			}
		}
		return url;
	},
	/**
	 * 复制链接到剪切板
	 * @parma {} txt	待复制的内容
	 */
	copyLink : function(link, i) {
		if(this.isEmpty(i))
		{
			i = 0;
		}
		
		try {
			// 判断是否存在剪切板对象
			if (window.clipboardData) {
				window.clipboardData.clearData();
				window.clipboardData.setData("Text", link);
				if (window.clipboardData.getData("Text") == link) {
					Success("复制链接成功！");
				} else {
					// 拷贝异常重新拷贝，重试次数不能太多，太多代表浏览器不允许访问剪贴板
					if(i < 10)
					{
						this.copyLink(link, ++i);
					}
					else
					{
						Fail(0, "当前浏览器不允许访问“剪贴板”<br/><br/>点击打开复制的链接：<br/><a onclick='Tool.openwin(\"" + link + "\")'>" + link + "</a>");
					}
				}
			} else if (window.netscape) {
				try {
					netscape.security.PrivilegeManager
							.enablePrivilege("UniversalXPConnect");
					var clip = Components.classes['@mozilla.org/widget/clipboard;1']
							.createInstance(Components.interfaces.nsIClipboard);
					var trans = Components.classes['@mozilla.org/widget/transferable;1']
							.createInstance(Components.interfaces.nsITransferable);
					trans.addDataFlavor('text/unicode');
					var str = Components.classes["@mozilla.org/supports-string;1"]
							.createInstance(Components.interfaces.nsISupportsString);
					var copytext = link;
					str.data = copytext;
					trans.setTransferData("text/unicode", str, copytext.length * 2);
					var clipid = Components.interfaces.nsIClipboard;
					clip.setData(trans, null, clipid.kGlobalClipboard);
					Success("复制链接成功！");
				} catch (e) {
					// 拷贝异常重新拷贝，重试次数不能太多，太多代表浏览器不允许访问剪贴板
					if(i < 10)
					{
						this.copyLink(link, ++i);
					}
					else
					{
						Fail(0, "复制被浏览器拒绝<br/><br/>请在浏览器地址栏输入'about:config'并回车<br/>然后将'signed.applets.codebase_principal_support'设置为'true'<br/><br/>复制的链接：<br/><a href='"
							+ link + "' target='_blank'>" + link + "</a>");
					}
				}
			} else {
				Fail(0, "当前浏览器不允许访问“剪贴板”<br/><br/>复制的链接：<br/><a href='" + link + "' target='_blank'>"
						+ link + "</a>");
			}
		} catch (err) {
			// 拷贝异常重新拷贝，重试次数不能太多，太多代表浏览器不允许访问剪贴板
			if(i < 10)
			{
				this.copyLink(link, ++i);
			}
			else
			{
				Fail(0, "当前浏览器不允许访问“剪贴板”<br/><br/>点击打开复制的链接：<br/><a onclick='Tool.openwin(\"" + link + "\")'>" + link + "</a>");
			}
		}
	},
	
	/**
	 * 对象深度拷贝
	 */
	deepCopy : function(o) {
		
		if ($.isArray(o) && o.length > 0) {
			var arr = [];
			for (var i = 0; i < o.length; i++) {
				var value = o[i];
				if (typeof value !== 'object') {
					arr.push(value);
				} else {
					arr.push($.extend(true, {}, value));
				}
			}
			return arr;
		}
		else
		{
			
			var ret = o, b;
		    if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
		        ret = b ? [] : {};
		        for(var i in o){
		            if(o.hasOwnProperty(i)){
		                ret[i] = this.deepCopy(o[i]);
		            }
		        }
		    }
	    	return ret;
		}
	},
	
	/**
	 * 插件对象方法
	 */
	plugin : {
		// 插件缓存
		cache : {
			// 新版本上传插件2.7，通过视侦通OCX上传
			uploadByOvit : null,
			// 新版本视频预览控件2.7，通过视侦通OCX播放
			playerByOvit : null,
			// 上传插件
			upload : null,
			// 图片插件
			image : null,
			// 视频插件
			video : null
		},
		/**
		 * 插件检测对象
		 */
		detect : {
			/**
			 * 根据插件注册名称检测activeX是否已安装
			 * 插件注册名称获取方法：根据clsid在注册表中根据“项”搜索，查看progid即为controlName
			 * HKEY_LOCAL_MACHINE-> SOFTWARE->Classes->CLSID->我的控件CLSID->progID
			 * @param {} progid
			 */
			activeX : function(progid) {
				var activeX = null;
				try {
					activeX = new ActiveXObject(progid);
				} catch (e) {
					activeX = null;
				}
				return activeX;
			},
			
			/**
			 * 检测flash插件是否安装
			 */
			flash : function() {
				var isInstall = false;
				var _app = navigator.appName;
				if (_app == 'Microsoft Internet Explorer') {
					// iE
					isInstall = this.activeX("ShockwaveFlash.ShockwaveFlash") != null;
				} else if (_app == 'Netscape') {
					// 火狐
					if (!navigator.plugins["Shockwave Flash"]) {
						isInstall = false;
					} else {
						isInstall = true;
					}
				}
				return isInstall;
			},
			
			/**
			 * 检测海康上传插件是否安装2.7
			 * @describe D57D2CFF-4470-4FDA-8FF6-1505860F37B5
			 */
			uploadByOvit : function() {
				var progid = 'HikUpFileToKmsOCX.IUpFileToKms.1';
				if (Tool.isEmpty(Tool.plugin.cache.uploadByOvit)) {
					Tool.plugin.cache.uploadByOvit = this.activeX(progid);
				}
				return Tool.plugin.cache.uploadByOvit != null;
			},
			
			/**
			 * 检测海康预览插件是否安装2.7
			 * @describe 90DFAF9F-1FDC-4786-9C60-86FCEAFF88AE
			 */
			playerByOvit : function() {
				var progid = 'HIKPLAYCTRL.HikPlayCtrlCtrl.1';
				if (Tool.isEmpty(Tool.plugin.cache.uploadByOvit)) {
					Tool.plugin.cache.playerByOvit = this.activeX(progid);
				}
				return Tool.plugin.cache.playerByOvit != null;
			},
			
			/**
			 * 检测海康上传插件是否安装
			 * @describe 1.2--40D84F0D-FE72-47A6-A92F-A5368A85006F|1.3--62266AA4-666E-4aa8-9451-9E33B1D22FEF
			 */
			ocxForUpload : function() {
				var progid = 'HikDossierOCXAcap.IHikDossierAcap.1';
				if (Tool.isEmpty(Tool.plugin.cache.upload)) {
					Tool.plugin.cache.upload = this.activeX(progid);
				}
				return Tool.plugin.cache.upload != null;
			},
			
			/**
			 * 检测海康视频插件是否安装
			 * @describe D3C7F259-94AD-40b4-BE2C-F00FA6D6BD84
			 */
			ocxForVideo : function() {
				var progid = 'HikActualOcxAcap.IHikActualOcxAcap.1';
				if (Tool.isEmpty(Tool.plugin.cache.video)) {
					Tool.plugin.cache.video = this.activeX(progid);
				}
				return Tool.plugin.cache.video != null;
			},
			
			/**
			 * 检测海康图片插件是否安装
			 * @describe 1.2--49F4D53E-5220-42d9-86D8-BC01235AD8E8|1.3--2F7F8B44-A54E-4eca-8D52-2113A2FBC75E
			 */
			ocxForImage : function() {
				var progid = 'ShowGraphUI.IHikShowGraphUI.1';
				if (Tool.isEmpty(Tool.plugin.cache.image)) {
					Tool.plugin.cache.image = this.activeX(progid);
				}
				return Tool.plugin.cache.image != null;
			},
			
			/**
			 * 检测ocx是否全部正常
			 */
			ocx : function() {
				return this.ocxForImage() && this.ocxForVideo() && this.ocxForUpload();
			},
			
			/**
			 * 检测exe安装包是否安装
			 */
			checkExe : function(exe) {
				var progid = 'HikToolCheckActivex.IHikCheckToolActi.1';
				var isInstall = true;
				try {
					var HikToolCheckOCX = new ActiveXObject(progid);
					isInstall = HikToolCheckOCX.CheckToolStatus(exe) == '1';
				} catch (e) {
					isInstall = false;
				}
				return isInstall;
			},
			
			/**
			 * 检测视侦通是否安装
			 */
			ovit : function() {
				return this.checkExe('HikVideoPlayer');
			},
			
			/**
			 * 检测标注工具是否安装
			 */
			mark : function() {
				return this.checkExe('HikImageMarkCompareTool');
			},
			
			/**
			 * 检测警务微信是否安装
			 */
			share : function() {
				return this.checkExe('HikSharer');
			},
			
			/**
			 * 检测工具是否全部正常
			 */
			tool : function() {
				return this.ovit() && this.mark();
			}
		},
		
		/**
		 * 插件下载对象
		 */
		download : {
			/**
			 * 下载flash插件
			 */
			flash : function() {
				Tool.download(Tool.getAppAddress() + "download/flashplayer11-6_install_win_ax.exe");
			},
		
			/**
			 * 下载系统控件
			 */
			ocx : function() {
				Tool.download(Tool.getAppAddress() + "download/AcapOcx.exe");
			},
			
			/**
			 * 下载系统工具
			 */
			exe : function() {
				Tool.download(Tool.getAppAddress() + "download/ovit.exe");
			}
		}
	}
};