var language = {
	"validator.required" : "此项为必填项!",
	"validator.ip" : "IP格式错误，请检查您的输入是否有误!",
    'validator.url': 'URl格式错误，请检查您的输入是否有误!',
	"validator.email" : "邮箱地址错误，请检查您的输入是否有误!",
	"validator.mobile" : "请输入正确的手机号码!",
	"validator.tel" : "电话（传真）号码错误，请检查您的输入是否有误!",
	"validator.unitLength" : "个字",
	"validator.unitLength.chinese" : "个字符,一个汉字代表$[0]个字符",
	"validator.maxLength" : "输入的项的长度不能超过$[0]",
	"validator.minLength" : "输入的项的长度不能少于$[0]",
	"validator.common" : "不允许输入如下特殊字符：$[0]",
	"validator.fixLength" : '必需是$[0]个字',
	"validator.noAllowDecimals" : "此项不能使用小数点",
	"validator.noAllowNegative" : "输入的值不能为负数",
	"validator.minValue" : "输入的值不能小于$[0]",
	"validator.maxValue" : "输入的值不能大于$[0]",
	"validator.number" : "请输入正确的数字",
	"validator.invalid" : " 此次操作无效",
	"validator.paste" : "粘贴内容不能包含以下特殊字符:",
	"validator.mac" : "输入的mac地址格式不正确",
    "validator.personID" : '请输入正确的身份证号',
    "validator.ipUrl" :'IP或域名格式错误',

	"form.info" : '请输入${labelName}',
	"info.mobile" : '请输入手机号码（11位数字）',
	"info.tel" : '请输入电话号码（区号-电话号码,或者400号码）',
    'info.url': '请输入有效的URL地址',
	"info.ip" : '请输入有效的IP地址',
	"info.email" : '请输入有效的邮箱地址',
	"info.maxLength" : '请输入$[0]~$[1]个字',
	"info.minLength" : '请输入至少$[0]个字',
	"info.fixLength" : '请输入$[0]个字',
	"info.min-maxLength" : '输入项的字符长度在$[0]和$[1]之间',
	"info.common" : '不能包含以下字符：$[0]个字',
	"info.number" : '请输入有效数字',
	"info.number.min-max" : '请输入$[0]~$[1]的数字',
	"info.number.min" : '请输入大于等于$[0]的数字',
	"info.number.max" : '请输入小于等于$[0]的数字',
	"info.number.allowDN" : '不能使用小数点和负数',
	"info.number.allowD" : '不能使用小数点',
	"info.number.allowN" : '不能使用负数',
	"info.mac" : "请输入有效的mac地址",
    "info.personID" : '请输入身份证号',
    "info.ipUrl":'IP或域名',

	"ajax.error.default" : '操作失败，请重试',
	"ajax.error.0" : '操作失败，请重试',
	"ajax.error.404" : '操作失败，错误码：404',
	"ajax.error.413" : '文件过大,错误码：413',
	"ajax.error.504" : '操作失败，请重试。错误码：504',
	"ajax.error.505" : '操作失败，请重试。错误码：505',
	"ajax.error.12029" : '请检查你的网络连接',
	"ajax.error_message" : '$[0]。错误码：$[1]',
	"ajax.error_inside_message" : '${get(0)||"未知错误"}。内部错误码：$[1]',
	"ajax.error_inside_message_without_errorcode" : '${get(0)||"未知错误"}。',
	"ajax.error_parse" : '网络不稳定，请检查',
	"ajax.error_title" : '错误',
	"ajax.error.network" : '请检查你的网络连接',
	"ajax.error.tomcat" : '服务器异常',
	
	"ocx.error" : "控件异常" ,
	"ocx.load" : "最新控件正在加载中…",
	"flash.error" : "使用该控件需要安装flash active插件...",
    "ocx.reUpdate" : "请重新更新控件！",
    "ocx.configKMS" : "视频上传失败，请配置kms服务!",
    "ocx.supportXmlHTTP" : '您的浏览器不支持XMLHTTP,检查文件失败!',
    "ocx.unload" : "控件未加载。",
    "ocx.nonExist" : "控件不存在，请联系管理员上传控件",
    "ocx.searchRecord" : "正在搜索录像",
    "ocx.searchRecordF" : "查询录像失败",
    "ocx.noRecord"  : "无录像文件",
    "ocx.playRecord" : "开始播放录像",
    "ocx.trustedSite" : '当前地址未被加入信任站点。请将当前地址加入信任站点，然后在刷新本页面。',
    "ocx.loading"  :"最新控件正在下载并安装（加载失败请跳转到首页进行手动下载和安装）",
    "ocx.load.error":"加载控件失败，请跳转到首页进行手动下载和安装" ,
	
	"shedule.copy" : "请选择要复制的日期模板",
	"shedule.delete" : "请选择要删除的时间段",
	"shedule.special.error" : "同一个日期不能配置两个特殊日模板",
	"shedule.starttime.empty" : "开始时间不能为空",
	"shedule.endtime.empty" : "结束时间不能为空",
	"shedule.starttime.invalid" : "开始时间无效",
	"shedule.endtime.invalid" : "结束时间无效",
	"shedule.time.error" : "开始时间不能大于等于结束时间",
	"shedule.time.repeat" : "输入无效，时间条不允许重叠",
    "shedule.config.sunccess" : "设置成功",
    "shedule.starttime" : "开始时间",
    "shedule.endtime" : "结束时间",
    "shedule.selectdata" : "选择日期",
    "shedule.maxBarNum.error" : "最多配置16个假日",
    "shedule.index" : "第",
    "shedule.undefined" : "个假日的开始时间或结束时间未设置",
    "shedule.conflict" : "个假日的时间设置有冲突",
    "shedule.plan.selectdelect" : "请选择需要删除的时间段",
    "shedule.time.selectcopy" : "请选择需要复制的时间段",
    "shedule.error" : "出错了！",
    "shedule.limit" : "每天只可以配置",
    "shedule.part" : "段",
    "shedule.time.reset" : "时间设置有误，请重新设置",
    "shedule.lastdate.error" : "最后一个假日不能删除！",
    "shedule.interval.min" : "最小时间间隔为",
    "shedule.reset" : "请重新设置",
    "copyto" :"复制到",
    "selectall" :"全选",
    "shedule.common":"普通",
    "shedule.urgent":"紧急",
    "shedule.open":"常开",
    "shedule.close":"常关",
    "shedule.setpassword":"请设置“卡+密码”认证时段",
    "shedule.min":'分钟',

    /*editableList*/
    "editableList.add":'添加',


	
	"form.change" : "数据已变更,确定要返回吗?",
	"dialog.confirm" : "确认",
	"dialog.info" : "提示",
	"dialog.ok" : "确定",
	"dialog.close" : "关闭",	
	"dialog.success" : "成功",
	"dialog.cancel" : "取消",
	"dialog.error" : "错误",
	"dialog.warn" : "警告",
	"dialog.forbid" : "禁止",
	"dialog.attention" : "注意",
    "dialog.input" :"请输入值",

    "dialog.alternateRes" :"备选资源",
    "dialog.selectedRes" :"已选资源",
    "dialog.resourceName" :"资源名称",
    "add" : "添加",
    "delete" : "删除",
    "save" : "保存",
    "dialog.deleteMessage" : "当前没有选中的项！",





	"form.error" : "表单存在错误，请查看！",
    "form.chooseFile" : "请选择文件",
	"loading" : "正在加载中，请稍候...",
    "searching" : '正在搜索中...',
	"error" : "错误",
	"ui.loadMore" : "加载更多",
	"ui.mismatching" : "无法匹配",
	"ui.progress.runBack" : "后台运行",
    "ui.loadError" : "您请求的内容无法加载！",
    "ui.tryAgain" : "请稍后重试",
    "ui.day": '天',
    "ui.hour" : '小时',
    "ui.minute" : '分',
    "ui.second" : '秒',
    "ui.finished" : '已完成',
    "ui.choose" : "您只能选择",
    "ui.item" : '项',
    "ui.show" : '显示',
    "ui.page.item" : '条',
     "ui.total" : "共",
    "page.pgText" : '$[0]/$[1]&nbsp;页',
    "page.recordText" : "共&nbsp;$[0]&nbsp;条",
    "page.pgTotal" : "每页显示",
    "page.firstPage" : "首页",
    "page.prePage" : "上一页",
    "page.nextPage" : "下一页",
    "page.lastPage" : "尾页",
    "page.jump" : "跳转",
    "page.toPage" : "到第",
    "page.unit" : "页",
    "page.item" : "条",

	"tree.noData" : "对不起，暂无数据！",
    "tree.error" : "错误",

    /*planTemplate*/
    "monday" : '星期一',
    "tuesday" : '星期二',
    "wednesday" : '星期三',
    "thursday" : '星期四',
    "friday" : '星期五',
    "saturday" : '星期六',
    "sunday" : '星期日',

    /*gridFilter*/
    "gridFilter.filter" :'过滤',
    "gridFilter.reset" :'重置',
    "gridFilter.addFilter" :'添加过滤条件',
    /*grid*/
    "grid.No":'序号' ,
    "treeGrid.operate" :'操作',
    "treeGrid.selectall":'全选',
    "grid.assign" : '分配该组织下点位权限',

    /*menu*/
    "menu.more" : '更多',

    /*timepicker*/
    "timepicker.Increment" : '增加',
    "timepicker.Decrement" : '减少'







};
Array.prototype.get = function(i) {
	return this[i];
};
language.templateSettings = {
	evaluate : /<%([\s\S]+?)%>/g,
	interpolate : /\$\{(.+?)\}/g,
	interpolate_get : /\$\[(.+?)\]/g,
	interpolate_text : /\$text\{(.+?)\}/g
};

language.template = function(str, data, templateSettings) {
	if (data == null) {
		return str;
	}
	var c = language.templateSettings || templateSettings;
	var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\''
			+ str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(c.interpolate, function(match, code) {
				return "'," + code.replace(/\\'/g, "'") + ",'";
			}).replace(c.interpolate_get, function(match, code) {
				return "',get(" + code.replace(/\\'/g, "'") + "),'";
			}).replace(c.evaluate || null, function(match, code) {
				return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
			}).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
	var func = new Function('obj', tmpl);
	return func(data);
};

language.text = function(message, param) {
	if (param != null && typeof(param) != 'object') {
		param = Array.prototype.slice.call(arguments, 1);
	}
	return language.template(language[message], param);
};


/*定义全局变量 hik*/
var lan = language,hik = function(o) {// 在页面加载前，被回调的函数可以载人，供加载并解析完后进行回调处理。
    return new hik.fn.init(o);
};

window.hik = hik;
hik.fn = hik.prototype = {
    init : function(o) {
        var selector;
        if (typeof o === "string") {
            selector = $(o);
        } else if (o.selector == null) {
            selector = $(o);
        } else {
            selector = o;
        }
        this.context = selector;
        return this;
    }
};
hik.fn = hik.prototype = {
    init : function(o) {
        var selector;
        if (typeof o === "string") {
            selector = $(o);
        } else if (o.selector == null) {
            selector = $(o);
        } else {
            selector = o;
        }
        this.context = selector;
        return this;
    }
};
hik.fn.init.prototype = hik.fn;
hik.call = function() {// 回调处理，这段代码没用使用
    for ( var i = 0, l = array.length; i < l; i++) {
        array[i].apply(null, arguments);
        array[i] = null;
    }
    array.length = 0;
    array = [];
};

hik.events = {// 事件处理机制
    _callbacks : null,
    register : function(ev){
        console.info('hello events');
    },
    bind : function(ev, callback) {
        var calls = this._callbacks || (this._callbacks = {});
        var list = this._callbacks[ev] || (this._callbacks[ev] = []);
        list.push(callback);
        return this;
    },
    unbind : function(ev, callback) {
        var calls;
        if (!ev) {
            this._callbacks = {};
        } else if (calls = this._callbacks) {
            if (!callback) {
                calls[ev] = [];
            } else {
                var list = calls[ev];
                if (!list)
                    return this;
                for ( var i = 0, l = list.length; i < l; i++) {
                    if (callback === list[i]) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }
        return this;
    },
    unbindAll : function() {
        for ( var callbakes in this._callbacks) {
            for ( var callback in callbakes) {
                callbakes[callback] = null;
                delete callbakes[callback];
            }
            callbakes = null;
            delete callbakes;
        }
    },
    trigger : function(ev) {
        var list, calls, i, l, result = true;
        if (!(calls = this._callbacks))
            return result;
        if (list = calls[ev]) {
            for (i = list.length - 1; i > -1; i--) {
                var r = list[i].apply(this, Array.prototype.slice.call(arguments, 1));
                result = result && r == false ? false : true;
            }
        }
        if (list = calls['all']) {
            for (i = 0, l = list.length; i < l; i++) {
                var r = list[i].apply(this, arguments);
                result = result && r == false ? false : true;
            }
        }
        return result;
    },
    _handleBefore : function(funName, fun) {
        var self = this;
        return _.wrap(fun, function(func) {
            var argArray = Array.prototype.slice.call(arguments, 1);
            if (self.trigger.apply(self, [ 'before' + funName ].concat(argArray))) {
                func.apply(this, argArray);
            }
            argArray = null;
        });
    },
    handleListeners : function() {// 处理监听器
        if (!(this.listeners instanceof Object)) {
            return;
        }
        for ( var key in this.listeners) {
            this.bind(key, this.listeners[key]);
            this.listeners[key] = null;
        }
        this.listeners = null;
    }
};
hik.argHandle = function(objs, array) {// 页面的参数处理
    if (typeof array[0] == 'object')
        return array[0];
    for ( var i = 0, l = objs.length; i < l; i++) {
        var obj = objs[i];
        var type0 = typeof array[0];
        if (type0 == obj.type || obj.type.indexOf(type0) > -1) {
            var o = {}, args = obj.args;
            for ( var j = 0, length = args.length; j < length; j++) {
                o[args[j]] = array[j];
            }
            return o;
        }
    }
    return {};
};
function extend(obj){
    var target={},copy;
    for (var name in obj){
        //name为对象属性
        //copy为属性值
        copy=obj[name];
        //防止循环调用
        if(target === copy) continue;
        //防止附加未定义值
        if(typeof copy === 'undefined') continue;
        //赋值
        target[name]=copy;
    }
    return target;
}
/*用原来的hik.language替代language全局变量*/
hik.language = extend(language);

