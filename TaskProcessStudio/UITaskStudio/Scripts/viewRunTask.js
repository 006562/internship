var viewRunTask = function () {
    //var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";
    //var gridHeadTemplate = "<dl><dt>步骤</dt><dd>用时</dd></dl>";
    //var gridRowTemplate = "<li><span>{0}</span><span class='status'>{1}</span><span class='status'>{2}</span></li>";
    
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
    
    var setDefaultValue = function () {
        objRun.sessionId = getUrlParam('sessionId');
        objRun.appDomain = getUrlParam('appDomain');
    }
      
    //var loadSessionProcessStatusBegin=function(response){
    //    $("#divProcessStatusList").empty();        
    //    if (response.length > 0) {
    //        var content = "";
    //        for (var i = 0; i < response.length; i++) {
    //            content += gridRowTemplate.format(response[i].ProcessActionName, "&nbsp;", "&nbsp;");
    //        };
    //        content = "<ul>{0}</ul>".format(content);
    //        $("#divProcessStatusList").append(content);
    //    }
    //    $("#divLoading").fadeOut();
    //    $("#runResult").html("计算任务加载完成");
    //}
    
    //var loadSessionProcessStatusComplete = function (response) {
    //    $("#divProcessStatusList").empty();
    //    if (response.length > 0) {
    //        var content = "";
    //        for (var i = 0; i < response.length; i++) {
    //            content += gridRowTemplate.format(response[i].ProcessActionName, getRunStatus(response[i].ProcessActionStatus), getRunTime(response[i].StartTime, response[i].EndTime));
    //        };
    //        content = "<ul>{0}</ul>".format(content);
    //        $("#divProcessStatusList").append(content);
    //    }
    //    $("#divLoading").fadeOut();
    //}

    //var getRunStatus = function (runStatus) {
    //    if (runStatus == "Success") {
    //        return "<img src='./Images/success.png' width='20'>";
    //    } else if (runStatus == "Failed") {
    //        return "<img src='./Images/error.png' width='20'>";
    //    } else {
    //        return "&nbsp;";
    //    }
    //}

    //var getRunTime = function (timeBegin, timeEnd) {
    //    if (timeBegin == null) {
    //        return "&nbsp;";
    //    } else {
    //        return (parseInt(timeEnd.slice(6, 19)) - parseInt(timeBegin.slice(6, 19))).toString() + "ms";
    //    }
    //}

    //var getSessionProcessStatusList = function (appDomain, sessionId, callback) {
    //    webProxy.getSessionProcessStatusList(appDomain, sessionId, callback);
    //}
    
    var runTaskComplete = function (response) {
        //getSessionProcessStatusList(objRun.appDomain, objRun.sessionId, loadSessionProcessStatusComplete);
        stopTime();
        $("#runStart").attr("disabled", true);
        if (response) {
            var tempStr = $("#runResult").html();
            $("#runResult").html("任务成功完成。</br>" + tempStr);
        } else {
            $("#runResult").html("任务执行失败");
        }
        $("#divLoading").fadeOut();
    }

    var startTask = function () {
        $("#divLoading").show();
        startTime();
        webProxy.runTask(objRun.appDomain, objRun.sessionId, runTaskComplete);
    }    

    this.createSession = function () {
        setDefaultValue();
        startTask();
    }
};