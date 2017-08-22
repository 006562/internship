viewFormCashFlowStudioECWork = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    var sessionServiceBase = GlobalVariable.SessionManagementServiceUrl;
    var CashFlowStudioServiceBase = GlobalVariable.CashFlowStudioServiceUrl;

    var viewTemplate = "<div style='margin:5px;padding:10px;padding-top:3px;height:747px;border:#808080 solid 1px;overflow: auto;'>" +
                            "<div style='height:28px; border-bottom:solid 1px #BDBDBD;'>" +
                                "<div id='ribbon_VerifyEC' class='ribbon' title='Verify'><div class='bigicons bigcalculator'></div></div>" +
                                "<div id='ribbon_ApplyEC' class='ribbon' title='Apply'><div class='bigicons bigcheck'></div></div>" +
                                "<div id='ribbon_SaveEC' class='ribbon' title='Save'><div class='bigicons bigdisk'></div></div>" +
                                "<div id='ribbon_RefreshEC' class='ribbon' title='Refresh'><div class='bigicons bigrefresh'></div></div>" +
                                "<div style='float:right'><input id='searchECCode' type='text' style='text-align:right;width:400px;border:none;font-weight: bold' /></div>" +
                            "</div>" +
                            "<div id='divWorkContent'></div>" +
                       "</div>";

    var viewMainTemplate = "<div style='height:40px;line-height:40px'>Name:</div>" +
                           "<div>&nbsp;&nbsp;" +
                                "<input type='text' value='{0}' style='width:400px'>" +
                           "</div>" +
                           "<div style='height:40px;line-height:40px'>Parameters:</div>" +
                           "<div id='mainParamsTitle' style='margin-left:8px'>" +
                                "<div class='grayDivTableHead' style='width:14px'></div>" +
                                "<div class='grayDivTableHead'>Name</div>" +
                                "<div class='grayDivTableHead'>SessionParameterName</div>" +
                                "<div class='grayDivTableHead'>Value</div>" +
                                "<div class='grayDivTableHead' style='width:100px;'>DataType</div>" +
                                "<div class='grayDivTableHeadRight' style='width:35px'></div>" +
                           "</div>" +
                           "<div class='ClearBoth'></div>" +
						   "<div id='mainParams' style='margin-left:8px'>$Params$</div>" +
                           "<div style='height:40px;line-height:40px'>Equation:</div>" +
                           "&nbsp;&nbsp;<textarea id='txtEquation' style='height:250px;width:750px;background-color: #E6E7E8'>{1}</textarea>" +
                           "";

    var ecParamTemplate = "<div id='ecparam'>" +
                                "<div>" +
                                    "<div id='removeEcParam' style='padding:5px;cursor:pointer; width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><div style='padding-top:5px;'><img src='../img/remove.png' alt='Remove Param' class='addRemoveImgButton'/></div></div>" +
                                    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='{0}'></div>" +
                                    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input name='iptGroupSession' type='text' value='{1}'></div>" +
							        "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='{2}'></div>" +
                                    "<div style='padding:5px;width:100px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'>{3}</div>" +
                                    "<div style='padding:5px;width:35px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input type='button' value=' ... ' style='width: 30px;' id='showParamField' /></div>" +
                                    "<div class='ClearBoth'></div>" +
                                 "</div>" +
                                 "<div id='paramFild' style='display:none'>" +
                                    "<div style='padding:5px;width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'></div>" +
                                    "<div style='padding:5px;width:719px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'>" +
                                        "FieldName:<input type='text' value='{4}'>&nbsp;&nbsp;Position:<input type='text' value='{5}' style='width:380px'>" +
                                    "</div>" +
                                    "<div class='ClearBoth'></div>" +
                                 "</div>" +
                            "</div>";

    var verifyXmlTemplate = "<SessionVariables><SessionVariable><Name>ECQueryName</Name><Value>$ECQueryName$</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                                "<SessionVariable>" +
                                    "<Name>ECXmlScript</Name>" +
                                    "<Value><![CDATA[<Methods>$SessionVariableValue$</Methods>]]></Value>" +
                                    "<DataType>nvarchar(max)</DataType>" +
                                    "<IsConstant>1</IsConstant>" +
                                    "<IsKey>0</IsKey>" +
                                    "<KeyIndex>2</KeyIndex>" +
                                "</SessionVariable>" +
                                "<SessionVariable><Name>StartPeriod</Name><Value>0</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                                "<SessionVariable><Name>EndPeriod</Name><Value>1</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                            "</SessionVariables>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    function InsertString(obj, str) {
        if (document.selection) { //IE
            $(obj).focus();
            document.selection.createRange().text = str;
        }
        else if (obj.selectionStart || obj.selectionStart == '0') { //火狐
            var start = obj.selectionStart;
            var end = obj.selectionEnd;
            obj.value = obj.value.substring(0, start) + str + obj.value.substring(end, obj.value.length);
        }
        else {
            $(obj).value += str;
        };
    }

    var writeParam = function () {
        var paramXml = viewGlobalObj.dragContext.dragData;
        
        var pFieldName = "";
        var pPosition = "";
        var paramXmlObj = $.parseXML(paramXml).getElementsByTagName("Template");
        paramXmlObj = $(paramXmlObj).find("Parameter");
        var field = $(paramXmlObj).find("Field");
        if (field != undefined) {
            if ($(field).attr("Name") != undefined) {
                pFieldName = $(field).attr("Name");
            }
            var position = $(field).find("Position");
            if (position != "undefined") {
                if ($(position).text() != undefined) {
                    pPosition = $(position).text();
                }
            }
        }
        
        var pContent = ecParamTemplate.format($(paramXmlObj).attr("Name"), $(paramXmlObj).attr("SessionParameterName"), $(paramXmlObj).attr("Value"), $(paramXmlObj).attr("DataType"), pFieldName, pPosition);
        $("#mainParams").append(pContent);
        setDraggable();
        //setDrop();
    }

    var writeMain = function () {
        var mainXml = viewGlobalObj.ecMainXmls[viewGlobalObj.ecMainIndex];
        var pContents = "";
        $(mainXml).find("Parameters").find("Parameter").each(function (key, value) {
            var pFieldName = "";
            var pPosition = "";
            var field = $(this).find("Field");
            if (field != undefined) {
                if ($(field).attr("Name") != undefined) {
                    pFieldName = $(field).attr("Name");
                }
                var position = $(field).find("Position");
                if (position != "undefined") {
                    if ($(position).text() != undefined) {
                        pPosition = $(position).text();
                    }
                }
            }
            var pContent = ecParamTemplate.format($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), pFieldName, pPosition);
            pContents += pContent;
        });

        var query = $(mainXml).find("Query");
        var aContent = viewMainTemplate.format($(query).attr("name"), $(query).text());
        aContent = aContent.replace("$Params$", pContents);

        $("#divWorkContent").empty();
        $("#divWorkContent").append(aContent);
        
        $("#mainParams").droppable({
            drop: function (event, ui) {
                if (viewGlobalObj.dragContext.dragType == "variable" || viewGlobalObj.dragContext.dragType == "metadata" || viewGlobalObj.dragContext.dragType == "taskVariable") {
                    writeParam();
                }
            }
        });
 
        $("#mainParamsTitle").droppable({
            drop: function (event, ui) {
                if (viewGlobalObj.dragContext.dragType == "variable" || viewGlobalObj.dragContext.dragType == "metadata" || viewGlobalObj.dragContext.dragType == "taskVariable") {
                    writeParam();
                }
            }
        });

        $("#txtEquation").droppable({
            drop: function (event, ui) {
                if (viewGlobalObj.dragContext.dragType == "mainParameter" || viewGlobalObj.dragContext.dragType == "function") {
                    InsertString($(this), viewGlobalObj.dragContext.dragData);
                }
            }
        });
        setDraggable(); 
        //setDrop();
        $("#divWorkContent").find("input").each(function () {
            $(this).blur(function () {
                viewGlobalObj.ecMainXmls[viewGlobalObj.ecMainIndex] = $.parseXML(assembleQueryXml()).getElementsByTagName("main");
                callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECMains", "ECVariables", "ECXml"]);
            });
        });

        $("#divWorkContent").find("textarea").each(function () {
            $(this).blur(function () {
                viewGlobalObj.ecMainXmls[viewGlobalObj.ecMainIndex] = $.parseXML(assembleQueryXml()).getElementsByTagName("main");
                callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECMains", "ECVariables", "ECXml"]);
            });
        });
    }

    var setDraggable = function () {
        $("#divWorkContent").find("#ecparam").each(function (key, value) {
            $(this).draggable({
                cursor: "default",
                helper: function (event) {
                    return $("<div class='ui-widget-header'>" + $(this).find("input").eq(0).val() + "</div>");
                },
                zIndex: "100",
                cursorAt:{left:0,top:0},
                start: function (event, ui) {
                    viewGlobalObj.dragContext.dragType = "mainParameter";
                    viewGlobalObj.dragContext.dragData = $(this).find("input").eq(0).val();
                    callbackObj.onXmlUpdate(viewGlobalObj, []);
                },
                stop: function (event, ui) {
                    viewGlobalObj.dragContext.dragType = "";
                    callbackObj.onXmlUpdate(viewGlobalObj, []);
                }
            });
        });
    }

    var setDrop = function () {
        $("input[name='iptGroupSession']").droppable({
            drop: function (event, ui) {
                if (viewGlobalObj.dragContext.dragType == "taskVariable") {
                    $(this).val(viewGlobalObj.dragContext.dragData);
                }
            }
        });
    }

    var assembleQueryXml = function (queryName) {
        var xml = "";
        var cashFlowName = $("#divWorkContent").find("input").eq(0).val();
        var queryText = $("#divWorkContent").find("textarea").eq(0).val();
        var queryText = queryText.replace("&&", "&amp;&amp;").replace("<", "&lt;").replace(">", "&gt;");
        var paramsXml = "";
        $("#divWorkContent").find("#ecparam").each(function (key, value) {
            var name = $(this).find("input").eq(0).val();
            var spName = $(this).find("input").eq(1).val();
            var value = $(this).find("input").eq(2).val();
            var dtType = "double";
            var usage = "CashFlow";
            var fieldName = $(this).find("input").eq(4).val();
            var position = $(this).find("input").eq(5).val();
            var paramXml = "";
            if (fieldName == "") {
                paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\" />".format(name, spName, value, dtType, usage);
            } else {
                paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\"><Field Name=\"{5}\"><Position>{6}</Position></Field></Parameter>".format(name, spName, value, dtType, usage, fieldName, position);
            }
            paramsXml += paramXml;
        });
        paramsXml = "<Parameters>" + paramsXml + "</Parameters>";
        var queryXml = "<Query name=\"{0}\">{1}</Query><Presentation></Presentation>".format(cashFlowName, queryText);
        xml = "<main>{0}{1}</main>".format(paramsXml, queryXml);
        return xml;
    };

    var updateECByECSetCodeAndECName = function (appDomain, code, ecXml) {
        var serviceUrl = sessionServiceBase + "UpdateCriteriaByECSetCodeAndECName/" + appDomain + "/" + code;
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: ecXml,
            success: function (response) {
                alert("Saved successfully.");
            },
            error: function (response) {
                //alert(XMLHttpRequest.status);
                //alert(XMLHttpRequest.readyState);
                alert("error:" + response);
            }
        });
    };

    var loadECXml = function (response) {
        var ecXml = $.parseXML(response);
        viewGlobalObj.ecMainXmls = [];
        $(ecXml).find("main").each(function (key, value) {
            viewGlobalObj.ecMainXmls.push($(this));
        });
        viewGlobalObj.ecMainIndex = 0;
        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECMains", "ECWork", "ECVariables", "ECXml"]);
    }

    var getCriteriasByECSetCode = function (appDomain, code, callback) {
        var serviceUrl = sessionServiceBase + "GetCriteriasByECSetCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "xml",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                $("#searchECCode").val(code);
                viewGlobalObj.ecCode = code;
                if ($.browser.msie) {
                    callback(response.xml);
                }
                else {
                    callback(response.documentElement.outerHTML);
                }
            },
            error: function (response) { alert("this ec code not exists."); }
        });
    };

    var createCriteria = function (appDomain, criteriaSetCode, eCXml, callback) {

        var serviceUrl = CashFlowStudioServiceBase + "CreateCriteria/" + appDomain + "/" + criteriaSetCode + "?r=" + Math.random() * 150;

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: eCXml == "" ? "<Methods>empty</Methods>" : eCXml,
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    }

    var isNewDictionaryCode = function (appDomain, dictionaryCode, categoryCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "IsNewDictionaryCode/" + appDomain + "/" + dictionaryCode + "/" + categoryCode + "?r=" + Math.random() * 150;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    }

    var updateCodeDictionary = function (appDomain, oldCode, newCode, categoryCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "UpdateCodeDictionary/" + appDomain + "/" + oldCode + "/"+newCode+"/" + categoryCode + "?r=" + Math.random() * 150;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("error is:"+response);             
            }
        });
    }

    var updateCriteriaNameByECSetCode = function (appDomain, oldCode, newCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "UpdateCriteriaNameByECSetCode/" + appDomain + "/" + oldCode + "/" + newCode + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("error is:" + response);
            }
        });
    }
 
    var saveECToDataBase = function () {
        if (($("#searchECCode").val() == "")) {
            alert("EC Code is Empty!");
            return;
        }
        var ecContext = {};
        ecContext.appDomain = viewGlobalObj.appDomain;
        ecContext.ecSetCodeAndName = $("#searchECCode").val() + "/" + $("#searchECCode").val();
        ecContext.ecCode = $("#searchECCode").val();
        ecContext.categoryCode = "CriteriaSetType";

        if (viewGlobalObj.isNewEC) {
            isNewDictionaryCode(ecContext.appDomain, ecContext.ecCode, ecContext.categoryCode, function (response) {
                if (!response) {
                    alert("this ecCode exists!");
                } else {
                    var eCXml = "";
                    for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
                        eCXml += (viewGlobalObj.ecMainXmls[i])[0].xml;
                    };
                    eCXml = "<Methods>{0}</Methods>".format(eCXml);

                    createCriteria(ecContext.appDomain, ecContext.ecCode, eCXml, function (response) {
                        if (!response) {
                            alert("Failed to save Criteria");
                        } else {
                            alert("Saved successfully.");
                            viewGlobalObj.isNewEC = false;
                            viewGlobalObj.ecCode = ecContext.ecCode;
                            callbackObj.onXmlUpdate(viewGlobalObj, []);
                        }
                    });

                }
            })
        } else {
            var eCXml = "";
            for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
                eCXml += (viewGlobalObj.ecMainXmls[i])[0].xml;
            };
            eCXml = "<Methods>{0}</Methods>".format(eCXml);

            if (viewGlobalObj.ecCode != ecContext.ecCode) {
                isNewDictionaryCode(ecContext.appDomain, ecContext.ecCode, ecContext.categoryCode, function (response) {
                    if (!response) {
                        alert("This ECCode exists!");
                    } else {
                        updateCodeDictionary(ecContext.appDomain, viewGlobalObj.ecCode, ecContext.ecCode, ecContext.categoryCode, function (response) {
                            if (!response) {
                                alert("Failed to save ECCode.");
                            } else {
                                //updateCriteriaNameByECSetCode(ecContext.appDomain, viewGlobalObj.ecCode, ecContext.ecCode, function (response) {
                                //    if (response) {
                                //        updateECByECSetCodeAndECName(ecContext.appDomain, ecContext.ecSetCodeAndName, eCXml);
                                //        viewGlobalObj.ecCode = ecContext.ecCode;
                                //        callbackObj.onXmlUpdate(viewGlobalObj, []);
                                //    }
                                //});
                                        updateECByECSetCodeAndECName(ecContext.appDomain, ecContext.ecSetCodeAndName, eCXml);
                                        viewGlobalObj.ecCode = ecContext.ecCode;
                                        callbackObj.onXmlUpdate(viewGlobalObj, []);
                            }
                        });
                    }
                })
            } else {
                updateECByECSetCodeAndECName(ecContext.appDomain, ecContext.ecSetCodeAndName, eCXml);
            }
        }
    }

    var regisUiEvents = function () {
        $(function () {
            $("#removeEcParam").live("click", function () {
                $(this).parent().parent().remove();
            });

            $("#showParamField").live("click", function () {
                $(this).parent().parent().parent().find("#paramFild").toggle(200);
            });

            $("#ribbon_SaveEC").click(function () {
                //var ecSetCodeAndName = $("#searchECCode").val() + "/" + $("#searchECCode").val();
                //var pAppDomain = viewGlobalObj.appDomain;
                //if (($("#searchECCode").val() == "")) {
                //    alert("EC Code is Empty!");
                //    return;
                //}
                //var content = "";
                //for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
                //    content += (viewGlobalObj.ecMainXmls[i])[0].xml;
                //};
                //content = "<Methods>{0}</Methods>".format(content);
                //updateECByECSetCodeAndECName(pAppDomain, ecSetCodeAndName, content);

                saveECToDataBase();
            });

            $("#ribbon_RefreshEC").click(function () {
                var ecCode = viewGlobalObj.ecCode;
                var appDomain = viewGlobalObj.appDomain;
                getCriteriasByECSetCode(appDomain, ecCode, loadECXml);
            });

            $("#ribbon_ApplyEC").live("click", function () {
                if (viewGlobalObj.ecMainXmls.length == 0) {
                    return;
                }
                viewGlobalObj.ecMainXmls[viewGlobalObj.ecMainIndex] = $.parseXML(assembleQueryXml()).getElementsByTagName("main");
                callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECMains", "ECVariables", "ECXml"]);
            });

            $("#ribbon_VerifyEC").live("click", function () {
                if (viewGlobalObj.ecMainXmls.length == 0) {
                    return;
                }
                var methodName = $("#divWorkContent").find("input").eq(0).val();
                var sXml = assembleQueryXml();

                var verifyXmlValue = verifyXmlTemplate.replace("$SessionVariableValue$", sXml);
                verifyXmlValue = verifyXmlValue.replace('$ECQueryName$', methodName);

                var wProxy = new webProxy();
                var sContext = {
                    appDomain: "Task",
                    sessionVariables: verifyXmlValue,
                    taskCode: "CashFlowECVerify"
                };


                wProxy.createSessionByTaskCode(sContext, function (response) {
                    isSessionCreated = true;
                    sessionID = response;
                    taskCode = "CashFlowECVerify";

                    if (IsSilverlightInitialized) {
                        PopupTaskProcessIndicator();
                        InitParams();
                    }
                    else {
                        PopupTaskProcessIndicator();
                    }

                });

            });

        });
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divWorkArea").empty();
        $("#divWorkArea").append(content);
        postRender();
    };

    this.onXmlUpdate = function (callback) {
        callbackObj.onXmlUpdate = callback;
    };

    this.refreshGlobalObj = function (globalObj) {
        viewGlobalObj = globalObj;
    };

    this.refreshViews = function () {
        writeMain();
    };

    var postRender = function () {
        regisUiEvents();
    };

};


