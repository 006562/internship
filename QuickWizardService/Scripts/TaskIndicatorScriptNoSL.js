/// <reference path="jquery.min.js" />
/// <reference path="common.js" />
/// <reference path="App.Global.js" />

var TaskProcessIndicatorHelper = function () {
    this.Variables = [];
    this.VariableTemp = '<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>{3}</IsConstant><IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>';

    this.AddVariableItem = function (name, value, dtatType, isConstant, isKey, keyIndex) {
        this.Variables.push({ Name: name, Value: value, DataType: dtatType, IsConstant: isConstant || 0, IsKey: isKey || 0, KeyIndex: keyIndex || 0 });
    };

    this.BuildVariables = function () {
        var pObj = this;

        var vars = '';
        $.each(this.Variables, function (i, item) {
            vars += pObj.VariableTemp.format(item.Name, item.Value, item.DataType, item.IsConstant, item.IsKey, item.KeyIndex);
        });

        var strReturn = "<SessionVariables>{0}</SessionVariables>".format(vars);
        return strReturn;
    };

    this.ShowIndicator = function (app, code, fnCallBack, client) {
        Loading.Show();
        var sContext = {
            appDomain: app,
            sessionVariables: this.BuildVariables(),
            taskCode: code
        };

        clientName = client ? client : 'TaskProcess';

        this.CreateSessionByTaskCode(sContext, function (response) {
            sessionID = response;
            taskCode = code;
            IndicatorAppDomain = app;

            var serviceUrl = GlobalVariable.TaskProcessEngineServiceURL + "RunTask?vSessionId=" + response + "&applicationDomain=" + app;
            $.ajax({
                type: "GET",
                url: serviceUrl,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (d) {
                    Loading.Close();
                    fnCallBack(d);
                },
                error: function (d) {
                    alert('任务执行发生错误');
                    Loading.Close();
                    fnCallBack(d);
                }
            });
        });
    };

    this.CreateSessionByTaskCode = function (sContext, callback) {
        var sessionVariables_p = encodeURIComponent(sContext.sessionVariables);
        var serviceUrl = GlobalVariable.TaskProcessEngineServiceURL + "CreateSessionByTaskCode?applicationDomain=" + sContext.appDomain + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + sContext.taskCode;

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
};
