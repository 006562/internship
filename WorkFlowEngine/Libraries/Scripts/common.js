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
};

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

var __popupReference = null; // 保持子窗口对象句柄

// 打开弹出框
function openPopupWindow(url, width, height) {
    var width = width || 1000;
    var height = height || window.screen.height * 0.8;

    var x = (window.screen.width - width) / 2;
    var y = (window.screen.height - height) / 2;

    closePopupWindow() // 关闭已打开的弹出

    if (url.length > 0) {
        __popupReference = window.open(url, 'connect_window', 'height='+height+', width='+width+', toolbar =no, menubar=no, scrollbars=yes, resizable=no,top=' + y + ',left=' + x + ', location=no, status=no');
    }
}
// 关闭弹出框
function closePopupWindow() {
    if ((null != __popupReference) && (undefined != __popupReference)) {
        __popupReference.close();
    }
}
// 定时关闭
function auto_redirect(sec,callback) {
    var num = document.getElementById('num');
    num.innerText = sec;
    sec--;
    if (sec > 0) {
        setTimeout(function () {
            auto_redirect(sec,callback);
        }, 1000);
    } else {
        callback();
    }
}
// 文本转义
function htmlspecialchars(str) {
    var s = "";
    if (str.length == 0) return "";
    for (var i = 0; i < str.length; i++) {
        switch (str.substr(i, 1)) {
            case "<": s += "&lt;"; break;
            case ">": s += "&gt;"; break;
            case "&": s += "&amp;"; break;
            case " ":
                if (str.substr(i + 1, 1) == " ") {
                    s += " &nbsp;";
                    i++;
                } else s += " ";
                break;
            case "\"": s += "&quot;"; break;
            case "\n": s += "<br>"; break;
            default: s += str.substr(i, 1); break;
        }
    }
    return s;
}

function alertMsg(text, status) {
    var alert_tip = $('#alert-tip');
    var icon = 'icon-attention-alt';
    var color = '#f33737';
    switch (status) {

        case 0://提醒
            icon = 'icon-attention-alt';
            color = '#f33737';
            break;
        case 1://成功
            icon = 'icon-ok-2';
            color = '#60cc35';
            break;
    }

    if (!alert_tip[0]) {
        var $alert = $('<div id="alert-tip" class="alert_tip am-scale-up"/>');
        var $temp = $('<div class="alert_content">' +
                        '<i class="' + icon + '" style="color:' + color + '"></i>' +
                        '<p class="warning-text">' + text + '</p>' +
                    '</div>');
        $temp.appendTo($alert);
        $alert.appendTo(document.body);
        setTimeout(function () {
            $('#alert-tip').fadeOut(function () {
                $(this).remove();
            });
        }, 1000);
    }
}