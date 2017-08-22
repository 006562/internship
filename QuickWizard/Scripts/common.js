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

$(function () {
    tabCloums();
})


function showDialogPage(url, title, width, height, fnCallBack) {
    $.anyDialog({
        width: width,
        height: height,
        title: title,
        url: url,
        onClose: function () {
            if (fnCallBack) { fnCallBack(); }
            else { location.reload(); }
        }
    });
}
 




