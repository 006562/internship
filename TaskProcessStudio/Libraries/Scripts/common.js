/*!
 *  公用方法库
 *
 *  对内置函数的扩展或封装
 *
*/

var newguid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });
}

String.prototype.format = function () {
    var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
};

Date.prototype.dateFormat = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

var dateDiff = function (interval, date1, date2)
{  
    var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
    interval = interval.toUpperCase();
   // var dt1 = Date.parse(date1.replace(/-/g, '/'));
   // var dt2 = Date.parse(date2.replace(/-/g, '/'));
    try {
        return Math.round((date1 - date2) / ('(objInterval.' + interval + ')'));
    }
    catch (e) {
        return e.message;
    }


}




var getUrlParam = function (name) {
    var s = location.search;  
    if (s != null && s.length > 1) {
        var sarr = s.substr(1).split("&");
        var tarr;
        for (i = 0; i < sarr.length; i++) {
            tarr = sarr[i].split("=");
            if (tarr.length == 2 && tarr[0].toLowerCase() == name.toLowerCase()) {
                return tarr[1];
            }
        }
        return null;
    }

	//var url = window.location.search.substr(1).toLowerCase() , reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)");
    //var param = url.match(reg);  //匹配目标参数
    //return (param != null) ? unescape(param[2]) : null; //返回参数值
}
// 配置参数
var config = {
	path : '../Libraries/Scripts/',
	filesload : [],
	moduleMap : {},
	data: {},
	status: { e_new: "new", e_update: "update", e_copy:"copy" },
	categoryCode: { e_action: "ProcessActionType", e_task: "ProcessTaskType", e_ec:"CriteriaSetType" }
}
// 加载js文件
function require(paths,callback) {
	for(var i = 0; i < paths.length ; i++){
		loadFile(paths[i]);
	}
	function loadFile(file){
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', config.path + file + '.js');
		script.onload = script.onreadystatechange = function () {
			// IE bug fix
			if ((!this.readyState || /complete|loaded/.test(this.readyState))) {
				config.filesload[file] = true;
				head.removeChild(script);
				checkAllFiles();
			}
		};
		head.appendChild(script);
	}
	function checkAllFiles(){
		var allLoaded = true;
		for (var i = 0; i < paths.length; i++) {
			if (!config.filesload[paths[i]]) {
				allLoaded = false;
				break;
			}
		}
		if (allLoaded && callback)
			callback();
	}
}
// 定义模块
function define(name,factory){
	if (!config.moduleMap[name]){
		var module = {
			name:name,
			factory: (factory)? factory : {}
		};
		config.moduleMap[name] = module;
	}else{
		throw("Warn: Module name '"+name+"' is already defined.");
	}
	return config.moduleMap[name];
}
// 调用某个模块
function use(name){
	var module = config.moduleMap[name];
	if(module){
		return module.factory;
	}else{
		throw("Warn: Undefined module is '"+name+"'. Using define('"+name+"',{}) ;");
	}
}
// 模块视图渲染
function renders(views){
	var modules = (views) ? views : config.moduleMap;
	for(var i in modules){
		var module = (views) ? config.moduleMap[views[i]] : modules[i];
		if(module.factory.render){
			module.factory.render();
		}
	}
}
//运行CashFlow
function SessionStatus(status) {
    var statusDesc = "";
    switch (status) {
        case "Active":
            statusDesc = "运行中";
            break;
        case "Expired":
            statusDesc = "过期";
            break;
        case "Failed":
            statusDesc = "失败";
            break;
        case "Completed":
            statusDesc = "完成";
            break;
        case "ToBeContinued":
            statusDesc = "继续";
            break;
        case "Closed":
            statusDesc = "关闭";
            break;
        default:
        break;
    }
    return statusDesc;
}
 