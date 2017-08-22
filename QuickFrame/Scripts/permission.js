$(function () {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var appName = pathName.substring(1, pathName.substr(1).indexOf('/') + 1);

    var index = 0;
    index = curWwwPath.indexOf("?");
    if (index > 0) {
        curWwwPath = curWwwPath.substring(0, index);
    }

    var userName = $.cookie('gs_UserName');
    if (userName == null) {
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var siteApp = pathName.substring(1, pathName.substr(1).indexOf('/') + 1);
        var loginURL = location.protocol + "//" + location.host + '/' + siteApp + '/login.html';
        window.top.location.href=loginURL;
        return;
    }
    var result = 0;
    var sContent = "{'Schema':'QuickFrame','SPName':'usp_PathPermission','DBName':'QuickFrame','Params':{" +
             "'ApplicationName':'" + appName + "'" +
             ",'Path':'" + curWwwPath + "'" +
             ",'UserName':'" + userName + "'" +
             "}}";
    var json = "<SessionContext>{0}</SessionContext>".format(sContent);
    var serviceUrl = RoleOperate.roleService + "DataCUD";
    $.ajax({
        type: "POST",
        url: serviceUrl,
        dataType: "json",
        contentType: "application/xml;charset=utf-8",
        data: json,
        beforeSend: function () {
            Loading(true);
        },
        success: function (result) {
            Loading(false);
            if (result == "0") {
                var curWwwPath = window.document.location.href;
                var pathName = window.document.location.pathname;
                var pos = curWwwPath.indexOf(pathName);
                var siteApp = pathName.substring(1, pathName.substr(1).indexOf('/') + 1);
                //var loginURL = location.protocol + "//" + location.host + '/' + siteApp + '/login.html';
                //window.top.location.href = loginURL;
                top.document.getElementById("page").contentWindow.document.body.innerText = "";
                alert("没有权限访问该页面！");
                var loginURL = GlobalVariable.SslHost + 'QuickFrame/index.html';
                window.top.location.href = loginURL;
            }
        },
        error: function (error) {
            alert("error:" + error);
        }
    });
   
});


jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


 