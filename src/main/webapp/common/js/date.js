/**
 * 时间对象格式化方法
 * @param {} fmt	时间格式，如yyyy-MM-dd
 * @return {}
 */
Date.prototype.format = function(fmt) {
	// 默认时间格式
	var DEFAULT_PATTERN = 'yyyy-MM-dd HH:mm:ss';
	fmt = fmt || DEFAULT_PATTERN;
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"H+" : this.getHours(), // 小时，24小时制
		"h+" : this.getHours() > 12 ? this.getHours() % 12 : this.getHours(), // 小时 ，12小时制
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"w" : this.getDay(), // 星期
		"q" : Math.floor((this.getMonth() + 3) / 3) // 季度
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4
						- RegExp.$1.length));
	}
	if (/(S+)/.test(fmt)) {
		var milliSecond = this.getMilliseconds() + "";
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
							? milliSecond
							: ("000" + milliSecond).substr(milliSecond.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			var value = o[k] + "";
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
							? (o[k])
							: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};
/**
 * 时间工具类
 */
DateFormat = (function() {
	var SIGN_REGEXP = /([yMdHhmsS])(\1*)/g;
	var DEFAULT_PATTERN = 'yyyy-MM-dd HH:mm:ss';
	var NOW_DATE = new Date();
	/**
	 * 位数不够补零
	 */
	function padding(s, len) {
		var len = len - (s + '').length;
		for (var i = 0; i < len; i++) {
			s = '0' + s;
		}
		return s;
	};

	return ({
		// 将一个 Date 格式化为日期/时间字符串。
		format : function(date, pattern) {
			pattern = pattern || DEFAULT_PATTERN;
			return pattern.replace(SIGN_REGEXP, function($0) {
						switch ($0.charAt(0)) {
							case 'y' :
								return padding(date.getFullYear(), $0.length);
							case 'M' :
								return padding(date.getMonth() + 1, $0.length);
							case 'd' :
								return padding(date.getDate(), $0.length);
							case 'H' :
								return padding(date.getHours(), $0.length);
							case 'h' :
								return date.getHours() > 12 ? date.getHours() % 12 : date.getHours();
							case 'm' :
								return padding(date.getMinutes(), $0.length);
							case 's' :
								return padding(date.getSeconds(), $0.length);
							case 'S' :
								return padding(date.getMilliseconds(), $0.length);
						}
					});
		},
		// 从给定字符串的开始分析文本，以生成一个日期。
		parse : function(dateString, pattern) {
			pattern = pattern || DEFAULT_PATTERN;
			var matchs1 = pattern.match(SIGN_REGEXP);
			var matchs2 = dateString.match(/(\d)+/g);
			if (matchs1.length == matchs2.length) {
				var _date = new Date(1970, 0, 1);
				for (var i = 0; i < matchs1.length; i++) {
					var _int = parseInt(matchs2[i], 10);
					var sign = matchs1[i];
					switch (sign.charAt(0)) {
						case 'y' :
							_date.setFullYear(_int);
							break;
						case 'M' :
							_date.setMonth(_int - 1);
							break;
						case 'd' :
							_date.setDate(_int);
							break;
						case 'H' :
							_date.setHours(_int);
							break;
						case 'h' :
							_date.setHours(_int > 12 ? _int % 12 : _int);
							break;
						case 'm' :
							_date.setMinutes(_int);
							break;
						case 's' :
							_date.setSeconds(_int);
							break;
						case 'S' :
							_date.setMilliseconds(_int);
							break;
					}
				}
				return _date;
			}
			return null;
		}
	});
})();