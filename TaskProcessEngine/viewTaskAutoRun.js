var viewTaskAutoRun = function () {
    var taskProcessEngineService = location.protocol + "//" + location.host + "/TaskProcessEngine/SessionManagementService.svc/jsAccessEP/";
    var objRun = new Object();
    var time = 0;
    var cache = null;
    var $status = $('#runResult');

    //// 开始计时
    function startTime() {
        var hour = (Math.floor(time / 60 / 60) + 100 + ':').substr(1);
        var min = (Math.floor(time / 60 % 60) + 100 + ':').substr(1);
        var sec = (Math.floor(time % 60) + 100).toString().substr(1);
        time += 1;
        $status.html('已用时：' + hour + min + sec);
        cache = setTimeout(function () { startTime(); }, 1000);
    }
    //// 停止计时
    function stopTime() {
        clearTimeout(cache);
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
    }

    var setDefaultValue = function () {
        objRun.sessionId = getUrlParam('sessionId');
        objRun.appDomain = getUrlParam('appDomain');
    }
 
    var runTaskComplete = function (response) {
        //getSessionProcessStatusList(objRun.appDomain, objRun.sessionId, loadSessionProcessStatusComplete);
        stopTime();
        if (response) {
            var tempStr = $("#runResult").html();
            $("#runResult").html("任务成功完成。</br>" + tempStr);
        } else {
            $("#runResult").html("任务执行失败");
        }
        $("#divLoading").fadeOut();
    }

    var runTask = function (sessionId, appDomain, callback) {
        var serviceUrl = taskProcessEngineService + "RunTask?vSessionId=" + sessionId + "&applicationDomain=" + appDomain;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                callback(false);
            }
        });
    }

    var startTask = function () {
        $("#divLoading").show();
        startTime();
        runTask(objRun.sessionId, objRun.appDomain, runTaskComplete);
    }

    this.createSession = function () {
        setDefaultValue();
        startTask();
    }
};