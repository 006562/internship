var webProxy = {
    sessionServiceBase: location.protocol + "//" + location.host + "/TaskProcessEngine/SessionManagementService.svc/jsAccessEP/",
    CashFlowEngineServieBase: location.protocol + "//" + location.host + "/CashFlowEngine/CashFlowStudioService.svc/jsAccessEP/",
    TaskProcessStudioService: location.protocol + "//" + location.host + "/TaskProcessStudio/TaskProcessStudioService.svc/jsAccessEP/",

    runTask: function (appDomain, sessionId, callback) {
        var serviceUrl = this.sessionServiceBase + "RunTask?vSessionId=" + sessionId + "&applicationDomain=" + appDomain;
        if (appDomain.toUpperCase() == "CASHFLOW") {
            serviceUrl = this.CashFlowEngineServieBase + "RunTask/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;
        }

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
    },
    getQueryStoredProcedureProxy: function (appDomain, context, callback) {
        var serviceUrl = this.TaskProcessStudioService + "GetQueryStoredProcedure/" + appDomain + "?r=" + Math.random() * 150;
        $.ajax({
            url: serviceUrl,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(context),
            success: function (response) {
                if (response == "") {
                    response = undefined;
                } else {
                    response = JSON.parse(response);
                }
                callback(response);
            },
            error: function (response) { alert(response.responseText); }
        });
    },
    getNonQueryStoredProcedureProxy: function (appDomain, context, callback) {
        var serviceUrl = this.TaskProcessStudioService + "GetNonQueryStoredProcedure/" + appDomain + "?r=" + Math.random() * 150;
        $.ajax({
            url: serviceUrl,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(context),
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert(response.responseText); }
        });
    },
    getSessionListWithPager: function (appDomain, sContent, isAsync, callback) {
        var sourceData;
        var serviceUrl = this.TaskProcessStudioService + "GetSessionListWithPager/" + appDomain + "?r=" + Math.random() * 150;
        $.ajax({
            url: serviceUrl,
            async: isAsync,
            type: 'POST',
            dataType: 'jsonp',
            data: JSON.stringify(sContent),
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                if (response) {
                    sourceData = response;
                }

                if (callback) callback(sourceData);
            },
            error: function (response) { alert(response.responseText); }
        });
        if (!isAsync) { return sourceData; }
    },
    getSessionContext: function(appDomain,spName,sessionId,callback){
        var serviceUrl = this.TaskProcessStudioService + "GetSessionContext/" + appDomain + "/" + spName + "/" + sessionId + "?r=" + Math.random() * 150;
        $.ajax({
            url: serviceUrl,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                if (response == "") {
                    response = undefined;
                } else {
                    response = JSON.parse(response);
                }
                callback(response);
            },
            error: function (response) { alert(response.responseText); }
        });
    },
    getSessionProcessStatus: function (appDomain, spName, sessionId, isAsync, callback) {
        var serviceUrl = this.TaskProcessStudioService + "GetSessionContext/" + appDomain + "/" + spName + "/" + sessionId + "?r=" + Math.random() * 150;
        var sourceData;
        $.ajax({
            url: serviceUrl,
            async: isAsync,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                if (response) {
                    sourceData = JSON.parse(response);
                }
                if (callback) callback(sourceData);
            },
            error: function (response) { alert(response.responseText); }
        });
        if (!isAsync) { return sourceData; }
    },
    getTaskCodeListByTaskType: function (appDomain, callback) {
        var taskType = "Process";
        var sContent = "{'SPName':'usp_GetTaskCodeListByTaskType'," +
                      "'TaskType':'" + taskType + "'" +
                      "}";
        this.getQueryStoredProcedureProxy(appDomain, sContent, callback);
    },
    getTaskXmlByTaskCode: function (appDomain, code, callback) {
        var sContent = "{'SPName':'usp_GetProcessTask'," +
                      "'ProcessTaskCode':'" + code + "'" +
                      "}";
        this.getQueryStoredProcedureProxy(appDomain, sContent, function (response) {
            if (response != undefined) {
                response = $.parseXML(response[0].XMLProcessTask);
            }
            callback(response);
        });
    },
    getTaskSessionContextByTaskCode: function (appDomain, taskCode, callback) {
        var sContent = "{'SPName':'[usp_GetProcessTaskContextByTaskCode]'," +
                      "'TaskCode':'" + taskCode + "'" +
                      "}";
        this.getQueryStoredProcedureProxy(appDomain, sContent, function (response) {
            var strVariable = "";
            if (response != undefined) {
                var strTemplate = "<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>{3}</IsConstant><IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>";
                $.each(response, function (i) {
                    strVariable += strTemplate.format(response[i].VariableName, response[i].VariableValue, response[i].VariableDataType, response[i].IsConstant, response[i].IsKey, response[i].KeyIndex);
                })
                strVariable = "<SessionVariables>{0}</SessionVariables>".format(strVariable);
            }
            callback(strVariable);
        });
    },
    getProcessTaskArrayByTaskCode: function (appDomain, taskCode, callback) {
        var sContent = "{'SPName':'usp_GetProcessTaskArrayByTaskCode'," +
                      "'TaskCode':'" + taskCode + "'" +
                      "}";
        this.getQueryStoredProcedureProxy(appDomain, sContent, function (response) {
            var arrReturn = [];
            if (response != undefined) {                
                $.each(response, function (i) {
                    var itemName = response[i].ItemName;
                    var itemValue = [];
                    for (var p in response[i]) {
                        if (p != "ItemName") {
                            itemValue.push(response[i][p]);
                        }
                    }
                    arrReturn.push({ "ItemName": itemName, "ItemValue": itemValue });
                })
            }
            callback(arrReturn);
        });
    },
    getLastRunSessionIdByTaskCode: function (appDomain, taskCode, callback) {
        var sContent = "{'SPName':'[usp_GetLastRunSessionIdByTaskCode]'," +
                      "'TaskCode':'" + taskCode + "'" +
                      "}";
        this.getQueryStoredProcedureProxy(appDomain, sContent, callback);
    },
    isNewDictionaryCode: function (appDomain, dictionaryCode, categoryCode, callback) {
        var sContent = "{'SPName':'[usp_GetCodeDictionaryValue]'," +
                      "'Code':'" + dictionaryCode + "'," +
                      "'CategoryCode':'" + categoryCode + "'" +
                      "}";

        this.getQueryStoredProcedureProxy(appDomain, sContent, function (response) {
            if (response != undefined) {
                response = false;
            }
            else {
                response = true;
            }
            callback(response);  
        });
    },
    checkCodeDictionaryList: function (appDomain, codeList, categoryCode, callback) {
        var strCode = "";
        $.each(codeList, function (i) {
            strCode += "('" + codeList[i] + "'),";
        })
        strCode = strCode.substring(0, strCode.length - 1);
        var sContent = "{\"SPName\":\"[usp_CheckCodeDictionaryList]\"," +
                      "\"Code\":\"" + strCode + "\"," +
                      "\"CategoryCode\":\"" + categoryCode + "\"" +
                      "}";
        this.getQueryStoredProcedureProxy(appDomain, sContent, callback);
    },
    deleteProcessTask: function (appDomain, taskCode, callback) {
        var sContent = "{'SPName':'[usp_DeleteProcessTaskAndCriteriaSet]'," +
                      "'TaskCode':'" + taskCode + "'" +
                      "}";
        this.getNonQueryStoredProcedureProxy(appDomain, sContent, callback);
    },
    deleteSession: function (appDomain, spName,sessionId,callback) {
        var serviceUrl = this.TaskProcessStudioService + "DeleteSession/" + appDomain + "/" + spName + "/" + sessionId + "?r=" + Math.random() * 150;
        $.ajax({
            url: serviceUrl,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert(response.responseText); }
        });
    },
    saveProcessTaskContext: function (appDomain, taskCode, contextXml, callback) {
        var sContent = "{'SPName':'[usp_SaveProcessTaskContext]'," +
                      "'TaskCode':'" + taskCode + "'," +
                      "'ContextXml':'" + encodeURIComponent(contextXml) + "'" +
                      "}";
        this.getNonQueryStoredProcedureProxy(appDomain, sContent, callback);
    },
    saveCriteriaXml: function (appDomain, operator, criteriaCode, oldCriteriaCode, criteriaXml, callback) {
        var sContent = "{'SPName':'[usp_SaveCriteria]'," +
                      "'Operator':'" + operator + "'," +
                      "'CriteriaSetCode':'" + criteriaCode + "'," +
                      "'OldCriteriaSetCode':'" + oldCriteriaCode + "'," +
                      "'ECXml':'" + encodeURIComponent(criteriaXml) + "'" +
                      "}";
        this.getNonQueryStoredProcedureProxy(appDomain, sContent, callback);
    },
    saveTaskXml: function (appDomain, operator, criteriaCode, taskCode, oldTaskCode, taskXml, callback) {
        var sContent = "{'SPName':'[usp_SaveProcessTask]'," +
                      "'Operator':'" + operator + "'," +
                      "'CriteriaSetCode':'" + criteriaCode + "'," +
                      "'TaskCode':'" + taskCode + "'," +
                      "'OldTaskCode':'" + oldTaskCode + "'," +
                      "'TaskType':'Process'," +
                      "'TaskXml':'" + encodeURIComponent(taskXml) + "'" +
                      "}";
        this.getNonQueryStoredProcedureProxy(appDomain, sContent, callback);
    },
    saveTask: function (appDomain, operator, criteriaCode, taskCode, oldTaskCode, taskXml, contextXml, arrayXml, callback) {
        if (operator == "new" || taskCode != oldTaskCode) {
            webProxy.isNewDictionaryCode(appDomain, taskCode, "ProcessTaskType", function (response) {
                if (!response) {
                    alert("the taskCode exists in the database.");
                }
                else {
                    webProxy.saveTaskXml(appDomain, operator, criteriaCode, taskCode, oldTaskCode, taskXml, function (response) {
                        if (response) {
                            webProxy.saveProcessTaskContext(appDomain, taskCode, contextXml, function (response) {
                                if (response) {
                                    callback(response);
                                    //webProxy.saveProcessTaskArray(appDomain, taskCode, arrayXml, function (response) {
                                    //    callback(response);
                                    //});
                                } else {
                                    alert("save process task context error.");
                                }
                            });
                        } else {
                            alert("save taskXml error.");
                        }
                    });
                }
            });
        } else {
            webProxy.saveTaskXml(appDomain, operator, criteriaCode, taskCode, oldTaskCode, taskXml, function (response) {
                if (response) {
                    webProxy.saveProcessTaskContext(appDomain, taskCode, contextXml, function (response) {
                        if (response) {
                            callback(response);
                            //webProxy.saveProcessTaskArray(appDomain, taskCode, arrayXml, function (response) {
                            //    if (response) {
                            //        callback(response);
                            //    } else {
                            //        alert("save process task array error.");
                            //    }
                            //});
                        } else {
                            alert("save process task context error.");
                        }
                    });
                } else {
                    alert("save taskXml error.");
                }
            });
        }
    },
    saveCriteria: function (appDomain, operator, criteriaCode, oldCriteriaCode, criteriaXml, callback) {
        if (operator == "new" || criteriaCode != oldCriteriaCode) {
            webProxy.isNewDictionaryCode(appDomain, criteriaCode, "CriteriaSetType", function (response) {
                if (!response) {
                    alert("the taskCode exists in the database.");
                }
                else {
                    webProxy.saveCriteriaXml(appDomain, operator, criteriaCode, oldCriteriaCode, criteriaXml, function (response) {
                        callback(response);
                        //if (response) {
                        //    alert("saved successfuly.");
                        //}
                        //else {
                        //    alert("save CriteriaXml error.");
                        //}
                    });
                }
            });
        } else {
            webProxy.saveCriteriaXml(appDomain, operator, criteriaCode, oldCriteriaCode, criteriaXml, function (response) {
                callback(response);
            });
        }
    },
    loadXmlFile: function (filePath, callback) {
        $.ajax({
            url: filePath,
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载xml文件出错！");
            },
            success: function (response) {
                callback(response);
            }
        });
    },
    getSingleActionTemplates: function (callback) {
        $.ajax({
            url: "./ActionTemplates.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 ActionTemplates.xml 文件出错！");
            },
            success: function (singleActionXML) {
                callback(singleActionXML);
            },
            error: function (response) {
                alert("error is" + response);
            }
        });
    },
    loadScriptTemplates: function (filePath, callback) {
        this.loadXmlFile(filePath, callback);
    },
    createSessionByTaskCode: function (sContext, callback) {
        var sessionVariables_p = encodeURIComponent(sContext.sessionVariables);
        var serviceUrl = this.sessionServiceBase + "CreateSessionByTaskCode?applicationDomain=" + sContext.appDomain + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + sContext.taskCode;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert(response); }
        });
    }
}