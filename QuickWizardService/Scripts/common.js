/// <reference path="jquery.min.js" />
/// <reference path="App.Global.js" />

//格式化字符串
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
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            return i;
        }
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.jsonArrayRemove = function (prop, value) {
    var array = $.map(this, function (v, i) {
        return v[prop] === value ? null : v;
    });
    this.length = 0;
    this.push.apply(this, array);
}
function htmlEncodeDom(str) {
    var ele = document.createElement('span');
    ele.appendChild(document.createTextNode(str));
    return ele.innerHTML;
}
function htmlDecodeDom(str) {
    var ele = document.createElement('span');
    ele.innerHTML = str;
    return ele.textContent;
}

function getRequest() {
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function getOperatorByName(oprtName) {
    var operator = 'NA';
    switch (oprtName) {
        case 'gt':
            operator = '>';
            break;
        case 'ge':
            operator = '>=';
            break;
        case 'ne':
            operator = '!=';
            break;
        case 'eq':
            operator = '==';
            break;
        case 'lt':
            operator = '<';
            break;
        case 'le':
            operator = '<=';
            break;
        default:
            break;
    }
    return operator;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function validControls(obj) {
    var validPass = true;
    $(obj).each(function () {
        var $this = $(this);
        if (!validControlValue($this)) {
            validPass = false;
        }
    });
    return validPass;
}

function validControlValue(obj) {
    var $this = $(obj);
    var objValue = $this.val();
    var valids = $this.attr('data-valid');

    //无data-valid属性，不需要验证
    if (!valids || valids.length < 1) {
        return true;
    }

    //如果有必填要求，必填验证
    if (valids.indexOf('Required') >= 0) {
        if (!objValue || objValue.length < 1) {
            $this.parent().parent().parent().addClass('has-error');
            return false;
        } else {
            $this.parent().parent().parent().removeClass('has-error');
        }

        //暂时只考虑data-valid只包含两个值： 必填和类型
        var dataType = valids.replace('Required', '').toLocaleLowerCase().trim();

        //通过必填验证，做数据类型验证
        var regx = RegxCollection[dataType];
        if (!regx) { return true; }

        if (!regx.test(objValue)) {
            $this.parent().parent().parent().addClass('has-warning');
            return false;
        } else {
            $this.parent().parent().parent().removeClass('has-warning');
        }

    }
    return true;
}

var RegxCollection = {
    //int: /^[-]{0,1}[1-9]{1,}[0-9]{0,}$/,
    int: /^[-]?[1-9]+\d*$|^0$/,
    //decimal: /^[-]?[1-9]+\d*(\.{1}\d+){0,1}$/,
    //decimal: /^[-]?[1-9]+\d*(\.{1}\d+){0,1}$|^[-]{1}0\.\d*[1-9]\d*$|^0(\.\d+)?$/,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    datetime: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
};

function alertMsg(text, status) {
    var alert_tip = $('#alert-tip'),
        icon = (status) ? 'icon-warning' : 'icon-roundcheck';
    if (!alert_tip[0]) {
        var $alert = $('<div id="alert-tip" class="alert_tip am-scale-up"/>');
        var $temp = $('<div class="alert_content">' +
                        '<i class="icon ' + icon + '"></i>' +
                        '<p>' + text + '</p>' +
                    '</div>');
        $temp.appendTo($alert);
        $alert.appendTo(document.body);
        setTimeout(function () {
            $('#alert-tip').fadeOut(function () {
                $(this).remove();
            });
        }, 1500);
    }
}

// 两个浮点数求和（解决JS float运算精度问题）
function accAdd(num1, num2) {
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
}

// 两个浮点数相减（解决JS float运算精度问题）
function accSub(num1, num2) {
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
}
// 两个浮点数相除（（解决JS float运算精度问题）
function accDiv(num1, num2) {
    var t1, t2, r1, r2;
    try {
        t1 = num1.toString().split('.')[1].length;
    } catch (e) {
        t1 = 0;
    }
    try {
        t2 = num2.toString().split(".")[1].length;
    } catch (e) {
        t2 = 0;
    }
    var factor = 100000;
    r1 = Number(num1.toString().replace(".", ""));
    r2 = Number(num2.toString().replace(".", ""));
    var power = Math.pow(10, t2 - t1);
    return (r1 * factor / r2) * power / factor;
}

//两个浮点数相乘（解决JS float运算精度问题）
function accMul(num1, num2) {
    var m = 0, s1 = num1.toString(), s2 = num2.toString();
    try { m += s1.split(".")[1].length } catch (e) { };
    try { m += s2.split(".")[1].length } catch (e) { };
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


/* 列切换 */
function tabCloums() {
    $('.tab-columns>.btn').click(function () {
        var $this = $(this),
        col = $(this).attr('data-col');
        $this.siblings()
            .removeClass('btn-active')
            .end()
            .addClass('btn-active');
        autoLayout(columns(col));
    });
    // 根据参数显示列
    var columns = function (col) {
        if (parseInt(col) >= 4) col = 4;
        return 12 / parseInt(col);
    }
    // 自动布局
    var autoLayout = function (col) {
        $('.autoLayout-plugins').each(function () {
            var _class = $(this).attr('class');
            $(this).attr('class', _class.replace(/(\d)/, col));
        });
    }
}
tabCloums();

/* 侧栏切换隐藏*/
function siderToggle() {
    $(".step-menu").click(function () {
        $(".page").toggleClass("fold");
        if ($(".page").hasClass("fold")) {
            $(".page").css({ 'padding-left': '65px' });
            $(".aside").css({ 'width': '65px' });
            $(".step-head").height("27px");
            $(".step-box h2").hide();
            $(".step-box .flag").hide();
            $(".step-box i").css({ "margin-right": '5px' });
            $(".step-title").hide();
            $(".step-text").hide();
            $(".step-box a").height("36px");
        } else {
            $(".page").css({ 'padding-left': '220px' });
            $(".aside").css({ 'width': '220px' });
            $(".step-head").height("auto");
            $(".step-box h2").show();
            $(".step-box .flag").show();
            $(".step-box i").css({ "margin-right": '0' });
            $(".step-title").show();
            $(".step-text").show();
            $(".step-box a").height("auto");
        }
    })
}
siderToggle()

// 自动布局
var AutoLayoutFromFrame = function (col) {
    $('.autoLayout-plugins').each(function () {
        var _class = $(this).attr('class');
        $(this).attr('class', _class.replace(/(\d)/, col));
    });
}

//切换界面语言
function switchLang() {
    var targetlang;
    var currentLang = $.cookie(GlobalVariable.Language_Set);
    if (currentLang == GlobalVariable.Language_CN) {
        targetlang = GlobalVariable.Language_EN;
    } else {
        targetlang = GlobalVariable.Language_CN;
    }
    $.removeCookie(GlobalVariable.Language_Set);
    $.cookie(GlobalVariable.Language_Set, targetlang, { expires: 7, path: '/' });
    window.location.reload();
}
function getLanguageSet() {
    var cookieSet = $.cookie(GlobalVariable.Language_Set);
    if (!cookieSet) {
        cookieSet = GlobalVariable.Language_CN;
        $.cookie(GlobalVariable.Language_Set, cookieSet, { expires: 7, path: '/' });
    }

    return cookieSet;
}
function ChangeStep(obj) {
    var $obj = $(obj);
    $obj.addClass('active').siblings().removeClass('active');
}


/************页面间数据临时保存（生命周期为浏览器打开期间）*************/
var pageStorage = {
    _isSessionStorage: false
    , _storageKey: 'ck_gs_qw_sessionStoreage'

    , _getStorageObj: function () {
        this._isSessionStorage = window.sessionStorage;

        var strObj = this._isSessionStorage ? window.sessionStorage.getItem(this._storageKey) : $.cookie(this._storageKey);
        var storageObj = strObj ? JSON.parse(strObj) : {};

        return storageObj;
    }
    , _updateStorageObj: function (sObj) {
        var strObj = JSON.stringify(sObj);

        if (this._isSessionStorage) {
            window.sessionStorage.setItem(this._storageKey, strObj);
        } else {
            $.cookie(this._storageKey, strObj, { path: '/' });
        }
    }


    , Set: function (key, value) {
        var sObj = this._getStorageObj();
        sObj[key] = value;
        this._updateStorageObj(sObj);
    }
    , Get: function (key) {
        var sObj = this._getStorageObj();
        return sObj[key];
    }
}

var Loading = (function () {

    function show(text) {
        close();
        if (typeof (text) == undefined || text == null) {
            text = '正在执行，请稍后...';
        }
        var html = '<div id="div_task_loading" class="task-loadpage">' +
             '<div class="loading-wraper">' +
             ' <i class="icon icon-setting bigicon am-rotate pa"></i>' +
             ' <i class="icon icon-setting smicon am-rotate pa"></i>' +
             ' <p class="text pa">' + text + '</p>' +
             '</div>' +
             '</div>'

        var div = document.createElement("div");
        div.innerHTML = html;
        document.body.appendChild(div);
    }


    function close() {
        var _element = document.getElementById('div_task_loading');
        if (_element) {
            var _parentElement = _element.parentNode;
            if (_parentElement) {
                _parentElement.removeChild(_element);
            }
        }
    }

    return {
        Show: show,
        Close: close,
    }
})();
