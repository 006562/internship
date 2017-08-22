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


//格式化字符串
String.prototype.StringFormat = function () {
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



function btnCancelClick(url) {
    if (url) {
        window.location.href = url;
    }

    if (window.parent != window.self) {
        SP.SOD.executeFunc(
         'sp.ui.dialog.js',
         'SP.UI.ModalDialog.showModalDialog',
         function () {
             SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel)
         });
    } else {
        window.history.back();
    }
}

function openSPDialog(options) {
    SP.SOD.executeFunc(
     'sp.ui.dialog.js',
     'SP.UI.ModalDialog.showModalDialog',
     function () {
         SP.UI.ModalDialog.showModalDialog(options);
     });
}

function getSPWebUrl() { return _spPageContextInfo.webAbsoluteUrl; }

function validControls(obj) {
    var validPass = true;
    $(obj).each(function () {
        var $this = $(this);
        if (!validControlValue($this))
        {
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
    if (!valids || valids.length < 1)
    {
        return true;
    }

    //如果有必填要求，必填验证
    if (valids.indexOf('Required') >= 0) {
        if (!objValue || objValue.length < 1) {
            $this.parent().parent().addClass('has-error');
            return false;
        } else {
            $this.parent().parent().removeClass('has-error');
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
function validControls2(obj) {
    var validPass = true;
    $(obj).each(function () {
        var $this = $(this);
        if (!validControlValue2($this)) {
            validPass = false;
        }
    });
    return validPass;
}

function validControlValue2(obj) {
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
            $this.parent().addClass('has-error');
            return false;
        } else {
            $this.parent().removeClass('has-error');
        }

        //暂时只考虑data-valid只包含两个值： 必填和类型
        var dataType = valids.replace('Required', '').toLocaleLowerCase().trim();

        //通过必填验证，做数据类型验证
        var regx = RegxCollection[dataType];
        if (!regx) { return true; }

        if (!regx.test(objValue)) {
            $this.parent().parent().addClass('has-warning');
            return false;
        } else {
            $this.parent().parent().removeClass('has-warning');
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

function alertMsg(text,status) {
    var alert_tip = $('#alert-tip'),
        icon = (status) ? 'icon-warning' : 'icon-roundcheck';
    if (!alert_tip[0]) {
        var $alert = $('<div id="alert-tip" class="alert_tip am-scale-up"/>');
        var $temp = $('<div class="alert_content">' +
                        '<i class="icon '+icon+'"></i>' +
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
    return (r1 * factor / r2) * power/factor;
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

function getStringDate(strDate) {
    //var str = '/Date(1408464000000)/';
    if (!strDate) {
        return '';
    }
    var str = strDate.replace(new RegExp('\/', 'gm'), '');
    return eval('new ' + str);
}

var popup;

function showDialogPage(url, title, width, height, fnCallBack) {
    popup = $.anyDialog({
        width: width,
        height: height,
        title: title,
        url: url,
        mask:false,
        onClose: function () {
            if (fnCallBack) { fnCallBack(); }
            else { location.reload(); }
        }
    });
}

function refreshGrid() {
    popup.closePopup();
    $("#grid").data('kendoGrid').dataSource.read();
    $("#grid").data('kendoGrid').refresh();
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

$(function () {
    tabCloums();
})






function LoadLanguage(jsName, haskendo) {
    var set = getQueryString("set");
    switch (set) {
        case "en-US":
            document.write('<script src="../Scripts/Language/en-US/' + jsName + '.en-US.js"></script>');
            break;
        case "zh-CN":
        default:
            document.write('<script src="../Scripts/Language/zh-CN/' + jsName + '.zh-CN.js"></script>');
            if (haskendo) {
                document.write('<script src="../Scripts/Kendo/js/kendo.messages.zh-CN.js"></script>');
                document.write('<script src="../Scripts/Kendo/js/kendo.culture.zh-CN.js"></script>');
                //汉化kendo日历
                kendo.culture("zh-CN");
            }
            break;
    }
}


function Loading(isShow) {
    if (isShow) {
        if ($("#loading").length == 0) {
            var html = '<div id="loading" class="loadpage">' +
           ' <i class="icon icon-setting bigicon am-rotate pa"></i>' +
            '<i class="icon icon-setting smicon am-rotate pa"></i>' +
           ' <p class="text pa">加载配置中...</p>' +
           '</div>';
            $("body").prepend(html);
        }
    }
    else {
        $("#loading").remove();
    }
}


function ExecuteGetData(async, svcUrl, appDomain, executeParam, callback) {
    var executeParams = encodeURIComponent(JSON.stringify(executeParam));
    var sourceData = [];

    $.ajax({
        cache: false,
        type: "GET",
        async: async,
        url: svcUrl + 'appDomain=' + appDomain + '&executeParams=' + executeParams + '&resultType=commom',
        dataType: "json",
        contentType: "application/xml;charset=utf-8",
        data: {},
        success: function (response) {
            if (typeof response === 'string') { sourceData = JSON.parse(response); }
            else { sourceData = response; }
            if (callback)
                callback(sourceData);
        },
        error: function (response) { alert('Error occursed while requiring the remote source data!'); }
    });
    return sourceData;
}

function ExecutePostData(async, svcUrl, appDomain, executeParam, fileData, callback) {
    var executeParams = encodeURIComponent(JSON.stringify(executeParam));
    var sourceData = [];

    //fileData : document.getElementById(id).files[0];
    $.ajax({
        cache: false,
        url: svcUrl + "appDomain={0}&executeParams={1}&postType={2}&streamIdentity={3}".StringFormat(appDomain, executeParams, "", ""),
        type: 'POST',
        async: async,
        data: fileData,
        dataType: 'json',
        processData: false, // Don't process the files
        success: function (response) { //if (data.CommonExecutePostResult == true) 
            if (typeof response === 'string') { sourceData = JSON.parse(response); }
            else { sourceData = response; }
            if (callback)
                callback(sourceData);
        },
        error: function (data) {
            alert('Some error Occurred!');
        }
    });

    return sourceData;
}