var viewFormAddInExcelRunTask = function (objRun) {

    var getRunTaskSessionVariables = function () {
        var variableXml = $.parseXML(retVariablesFromAddin(objRun.variableObj));
        var strReturn = "";
        var vVariableTemplate = "<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var vECSetTemplate = "<SessionVariable><Name>CashFlowECSet</Name><Value>{0}</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var vTaskCodeTemplate = "<SessionVariable><Name>TaskCode</Name><Value>{0}</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var vStartPeriodTemplate = "<SessionVariable><Name>StartPeriod</Name><Value>0</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var vEndPeriodTemplate = "<SessionVariable><Name>EndPeriod</Name><Value>11</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
       
        var isExistsECSet = false;
        var isExistsTaskCode = false;
        var isExistsStartPeriod = false;
        var isExistsEndPeriod = false;
        $(variableXml).find("SessionVariable").each(function (key, value) {
            var sname = ($($(this).find("Name"))).text() == null ? "" : ($($(this).find("Name"))).text();
            var svalue = ($($(this).find("Value"))).text() == null ? "" : ($($(this).find("Value"))).text();
            if (sname == "CashFlowECSet") {
                isExistsECSet = true;
            }
            if (sname == "TaskCode") {
                isExistsTaskCode = true;
            }
            if (sname == "StartPeriod") {
                isExistsStartPeriod = true;
            }
            if (sname == "EndPeriod") {
                isExistsEndPeriod = true;
            }
            strReturn += vVariableTemplate.format(sname, svalue);
        });
        if (!isExistsECSet) {
            strReturn += vECSetTemplate.format(objRun.criteriaSetCode);
        }
        if (!isExistsTaskCode) {
            strReturn += vTaskCodeTemplate.format(objRun.taskCode);
        }
        if (!isExistsStartPeriod) {
            strReturn += vStartPeriodTemplate;
        }
        if (!isExistsEndPeriod) {
            strReturn += vEndPeriodTemplate;
        }
        strReturn = "<SessionVariables>{0}</SessionVariables>".format(strReturn);
        return strReturn;
    }

    
    this.RunTask = function () {
        var wProxy = new webProxy();
        var sContext = {
            appDomain: objRun.appDomain,
            sessionVariables: getRunTaskSessionVariables(),
            taskCode: objRun.taskCode
        };

        wProxy.createSessionByTaskCode(sContext, function (response) {
            var sessionID = response;
            var taskCode = objRun.taskCode;
            var IndicatorAppDomain = objRun.appDomain;
            var sessionArray = retArrays(objRun.arrayObj);

            isSessionCreated = true;
            document.getElementById("taskProcessIndicator").Content.SL_Agent.InitParams(sessionID, IndicatorAppDomain, taskCode, "CashFlowProcess");
            window.returnValue = sessionID;
        });
    };

};