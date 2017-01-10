/************************
 * JS对象的一些拓展方法 *
 ************************/

/**
 * 去掉字符串两端的空格
 * @return 去掉两端空格后的字符串
 */
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 去掉字符串左端的空格
 * @return 去掉左端空格后的字符串
 */
String.prototype.lTrim = function(){
    return this.replace(/(^\s*)/g, "");
}

/**
 * 去掉字符串右端的空格
 * @return 去掉右端空格后的字符串
 */
String.prototype.rTrim = function(){
    return this.replace(/(\s*$)/g, "");
}

/**
 * 字符串是否以指定字符开头
 * 
 * @param text 查询开头的字符
 * @return 如果以text开头则返回true, 反之则返回false
 */
String.prototype.startWith=function(str){
	var reg=new RegExp("^"+str);     
	return reg.test(this);       
}  

/**
 * 字符串是否以指定字符结尾
 * 
 * @param text 查询结尾的字符
 * @return 如果以text结尾则返回true, 反之则返回false
 */
String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}

/**
 * 替换全部
 * @param {} s1
 * @param {} s2
 * @return {}
 */
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};

/**
 * 获得URL路径中对应参数值
 * @param {} param
 * @return {}
 */
String.prototype.getURLParam = function(param) {
	var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
	var r = this.substr(this.indexOf("\?") + 1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}