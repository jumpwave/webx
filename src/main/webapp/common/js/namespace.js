/**
 * 注册命名空间，该方法是唯一全局对象，主要用于构建命名空间并注册至命名空间中，
 * 参数为名称空间全路径，如：sysmgr.user
 * 
 * @param {String}
 *            mynamespace
 * @return ns
 */
var Namespace = function(mynamespace) {
	// 判断命名空间是否为空
	if (!mynamespace || !mynamespace.length) {
		return null;
	}
	// 分隔出命名空间并创建对象
	var levels = mynamespace.split(".");
	// 记录当前对象
	var curNS = window;
	// 循环创建命名空间对象
	for (var i = 0; i < levels.length; i++) {
		var key = levels[i];
		if (i == levels.length - 1) {
			if (curNS != window && curNS.hasOwnProperty(key)) {
				curNS[key] = null;
				delete curNS[key];
			}
			curNS[key] = {};
		} else {
			curNS[key] = curNS[key] || {};
		}
		curNS = curNS[key];
	}
	// 返回对象
	return curNS;
}