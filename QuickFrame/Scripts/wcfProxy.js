webProxy = function () {
    var sessionServiceBase = location.protocol + "//" + location.host + '/' + siteApp() + '/SessionManagementService.svc/jsAccessEP/';
    var createSessionByTaskCode = function (sContext, callback) {

        var sessionVariables_p = encodeURIComponent(sContext.sessionVariables);
        var serviceUrl = sessionServiceBase + "CreateSessionByTaskCode?applicationDomain=" + sContext.appDomain + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + sContext.taskCode;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (sessionId) {
                callback(sessionId);
            },
            error: function (response) { alert(response); }
        });
    };



    return {
        createSessionByTaskCode: createSessionByTaskCode
    };
};







