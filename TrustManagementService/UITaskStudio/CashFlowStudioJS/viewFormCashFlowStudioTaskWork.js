viewFormCashFlowStudioTaskWork = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    var CashFlowStudioServiceBase = GlobalVariable.CashFlowStudioServiceUrl;
 
    var viewTemplate = "<div style='padding:0 5px;background:#5B7199;height:27px;margin-top:5px;border:#5B7199 solid 1px;'>" +
                            "<div style='float:left;height:27px;line-height:27px;color:#FFF;'>Action Content</div>" +
                            "<div id='ribbon_CloseContent' class='ribbon' title='Close' style='float:right;'><div class='icons close'></div></div>" +
                       "</div>" +
                       "<div id='divTaskWorkContent' style='padding:10px;height:712px;border:#BDBDBD solid 1px;border-top:none;overflow:auto;'></div>" +
                       "";

    var viewActionTemplate = "<div style='height:40px;line-height:40px'>ActionDisplayName:</div>" +
                          "<div>&nbsp;&nbsp;" +
                               "<input type='text' value='$actionDisplayName$' style='width:400px'>" +
                          "</div>" +
                          "<div style='height:40px;line-height:40px'>ActionCode:</div>" +
                          "<div>&nbsp;&nbsp;" +
                               "<input type='text' id='txtActionCode' value='$actionCode$' style='width:400px'>" +
                          "</div>" +
                           "<div style='height:40px;line-height:40px'>FunctionName:</div>" +
                          "<div>&nbsp;&nbsp;" +
                               "<input type='text' value='$functionName$' style='width:400px'>" +
                          "</div>" +
                           "<div style='height:40px;line-height:40px'>Parameters:</div>" +
                           "<div id='actionParamsArea'>" +
                              "<div style='width:1092px;'>" +
                                    "<div class='grayDivTableHead' id='addParam' style='width:14px;cursor:pointer;'><div style='padding-top:8px;'><img src='../img/add.png' alt='Add Param' class='addRemoveImgButton'/></div></div>" +
                                    "<div class='grayDivTableHead'>Name</div>" +
                                    "<div class='grayDivTableHead'>SessionParameterName</div>" +
                                    "<div class='grayDivTableHead' style='width:340px'>Value</div>" +
                                    "<div class='grayDivTableHead' style='width:100px'>DataType</div>" +
                                    "<div class='grayDivTableHead' style='width:100px'>Usage</div>" +
                                    "<div class='grayDivTableHeadRight' style='width:100px'>IsConfigurable</div>" +
                              "</div>" +
                              "<div class='ClearBoth'></div>" +
                              "<div id='taskParams'>$Params$</div>" +
                            "</div>" +
                            "";

    var paramTemplate = "<div id='param' style='width:1092px;'>" +
                                "<div id='removeParam' style='padding:5px;cursor:pointer; width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><div style='padding-top:5px;'><img src='../img/remove.png' alt='Remove Param' class='addRemoveImgButton'/></div></div>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pname$'></div>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input name='iptGroupSession' type='text' value='$pSessionParameterName$'></div>" +
							    "<div style='padding:5px;width:340px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input style='width:330px' type='text' value='$pvalue$'></div>" +
							    "<div style='padding:5px;width:100px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input style='width:90px' type='text' value='$pDataType$'></div>" +
							    "<div style='padding:5px;width:100px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input style='width:90px' type='text' value='$pUsage$'></div>" +
                                "<div style='padding:5px;width:100px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input class='configCheck' type='checkbox' $pIsConfigurable$ /></div>" +
                                "<div class='ClearBoth'></div>" +
                        "</div>";

    var viewMainXmlTemplate = "<main>" +
                                "<Parameters>" +
                                "</Parameters>" +
                                "<Query name='{0}'> " +
                                "</Query>" +
                                "<Presentation>" +
                                "</Presentation>" +
                                "</main>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };
    var getActionContent = function (aCode, acDN, fN, index) {
        var aContent = viewActionTemplate.replace(/\$actionCode\$/g, aCode); //str.replace(/abc/g, '')
        aContent = aContent.replace("$actionDisplayName$", acDN);
        aContent = aContent.replace("$functionName$", fN);
        aContent = aContent.replace("$index$", index);

        return aContent;
    };

    var getParamContent = function (name,sName,value, dType, usage, isConfigurable) {
        var pContent = paramTemplate.replace("$pname$", name);        
        pContent = pContent.replace("$pSessionParameterName$", sName);
        pContent = pContent.replace("$pvalue$", value);
        pContent = pContent.replace("$pDataType$", dType);
        pContent = pContent.replace("$pUsage$", usage);
       
        var pIsConfigurable = "";
        if (isConfigurable == "true") pIsConfigurable = "checked";
        pContent = pContent.replace("$pIsConfigurable$", pIsConfigurable);
        return pContent;
    }

    var writeMethodName = function () {
        var fName = $("#divTaskWorkContent").find("input").eq(2).val();
        if (fName == "RunManagedMethodByPath") {
            $("#divTaskWorkContent").find("#param").each(function (key, value) {
                if ($(this).find("input").eq(0).val() == "MethodName") {
                    $(this).find("input").eq(2).val(viewGlobalObj.dragContext.dragData);
                    $(this).find("input").eq(2).focus();
                    return false;
                }
            });
        }
    }

    var getActionCodeListByAppDomain = function (appDomain, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetActionCodeListByAppDomain/" + appDomain + "?r=" + Math.random() * 150;;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("load TaskCodeList objects error."); }
        });
    }

    var autoCompleteActionCode = function (response) {
        var taskCodeList = new Array();
        if (response.length > 0) {
            var content = "";
            response.sort(
                function (a, b) {
                    if (a.CodeDictionaryCode < b.CodeDictionaryCode) return -1;
                    if (a.CodeDictionaryCode > b.CodeDictionaryCode) return 1;
                    return 0;
                }
            );
            for (var i = 0; i < response.length; i++) {
                taskCodeList[i] = { label: response[i].CodeDictionaryCode, value: response[i].CodeDictionaryCode };
            };
        }
        $("#txtActionCode").autocomplete({
            source: taskCodeList,
            matchContains: false
        })
    }
     
    var showWorkAction = function () {
        if (viewGlobalObj.taskActionXmls.length > 0) {
            var content = "";
            var tempAction = viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex];
            var vCode="";
            var vName="";
            var vFName = "";
            vCode = $(tempAction).attr("ActionCode");
            vName = $(tempAction).attr("ActionDisplayName");
            vFName = $(tempAction).attr("FunctionName");
            content = getActionContent(vCode, vName, vFName, 2);
            var pContents = "";

            
            $(tempAction).find("Parameter").each(function (key, value) {
                var pContent = getParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"), $(this).attr("IsConfigurable"));
                pContents += pContent;
            });
            content = content.replace("$Params$", pContents);
            $("#divTaskWorkContent").empty();
            $("#divTaskWorkContent").append(content);

            getActionCodeListByAppDomain(viewGlobalObj.appDomain, autoCompleteActionCode);

            $("#actionParamsArea").droppable({
                drop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "method") {
                        writeMethodName();
                    }
                }
            });

            $("input[name='iptGroupSession']").droppable({
                drop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "taskVariable") {
                        $(this).val(viewGlobalObj.dragContext.dragData);
                        var objActionXml = $.parseXML(assembleActionXml()).getElementsByTagName("Action");
                        viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                        callbackObj.onXmlUpdate(viewGlobalObj, []);
                    }
                }
            });

            $("#divTaskWorkContent").find("#param").each(function (key, value) {
                if ($(this).find("input").eq(0).val() == "MethodName") {
                    $($(this).find("input").eq(2)[0]).live("dblclick", function () {
                        var isExists = false;
                        var ecFunName = $(this).val();
                        for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
                            var query = $(viewGlobalObj.ecMainXmls[i]).find("Query");
                            if ($(query).attr("name") == ecFunName) {
                                viewGlobalObj.ecMainIndex = i;
                                isExists = true;
                                break;
                            }
                        };
                        if (isExists) {
                            $("#studioTabs").tabs("select", 1);
                            callbackObj.onXmlUpdate(viewGlobalObj, ["ECMains", "ECWork"]);
                            $("#tbMains").find("#divMain").each(function () {
                                if ($(this).attr("actionData") == viewGlobalObj.ecMainIndex) {
                                    $(this)[0].scrollIntoView();
                                    return false;
                                }
                            });
                        }
                    });
                }
            });

            $("#divTaskWorkContent").find("input").each(function () {
                $(this).blur(function () {
                    var objActionXml = $.parseXML(assembleActionXml()).getElementsByTagName("Action");
                    viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                    callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "ECTools", "TaskXml", "TaskWork", "SimpleTaskWork"]);
                });
            });

            $("#txtActionCode").live("change", function () {
                var inputType = "";
                var actionType = "";
                $("#divTaskWorkContent").find("#param").each(function (key, value) {
                    if ($(this).find("input").eq(0).val() == "InputType") {
                        inputType = $(this).find("input").eq(2).val();
                    }
                    if ($(this).find("input").eq(0).val() == "ActionType") {
                        actionType = $(this).find("input").eq(2).val();
                    }
                });
                $("#divTaskWorkContent").find("#param").each(function (key, value) {
                    if ($(this).find("input").eq(0).val() == "CashFlowName") {
                        $(this).find("input").eq(2).val($("#txtActionCode").val());
                    }
                    if (inputType == "Calculated" && actionType == "CashFlow") {
                        if ($(this).find("input").eq(0).val() == "MethodName") {
                            var oldECName = $(this).find("input").eq(2).val();
                            var newECName = "EC_" + $("#txtActionCode").val();
                            $(this).find("input").eq(2).val(newECName);
                            var isNewEC = true;
                            for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
                                var query = $(viewGlobalObj.ecMainXmls[i]).find("Query");
                                if ($(query).attr("name") == newECName) {
                                    isNewEC = false;
                                    break;
                                }
                                if ($(query).attr("name") == oldECName) {
                                    $(query).attr("name", newECName);
                                    isNewEC = false;
                                    viewGlobalObj.ecMainIndex = i;
                                    callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECWork", "ECXml"]);
                                    break;
                                }
                            };
                            if (isNewEC) {
                                var addECXml = $.parseXML(viewMainXmlTemplate.format(newECName)).getElementsByTagName("main");
                                viewGlobalObj.ecMainXmls.push(addECXml);
                                viewGlobalObj.ecMainIndex = viewGlobalObj.ecMainXmls.length - 1;
                                callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECWork", "ECXml"]);
                            }
                        }
                    }
                });
            });

            //$("#txtActionCode").onpropertychange= function () {
                //$("#divTaskWorkContent").find("#param").each(function (key, value) {
                //    if ($(this).find("input").eq(0).val() == "CashFlowName") {
                //        $(this).find("input").eq(2).val($("#divTaskWorkContent").find("input").eq(1).val());
                //        return false;
                //    }
                //});
            //};
        } else {
            $("#divTaskWorkContent").empty();
        }
    }

    var assembleActionXml = function () {
        var adName = $("#divTaskWorkContent").find("input").eq(0).val();
        var actionCode = $("#divTaskWorkContent").find("input").eq(1).val();
        var fName = $("#divTaskWorkContent").find("input").eq(2).val();
        var paramsXml = "";
        $("#divTaskWorkContent").find("#param").each(function (key, value) {
            var name = $(this).find("input").eq(0).val();
            var spName = $(this).find("input").eq(1).val();
            var value = $(this).find("input").eq(2).val();
            var dtType = $(this).find("input").eq(3).val();
            var usage = $(this).find("input").eq(4).val();
            var isConfigurable = "false"
            if ($(this).find(".configCheck").is(":checked")) isConfigurable = "true";

            var paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\" IsConfigurable=\"{5}\" />".format(name, spName, value, dtType, usage, isConfigurable);
            paramsXml += paramXml;
        });
        var aXml = "<Action ActionCode=\"{0}\" ActionDisplayName=\"{1}\" FunctionName=\"{2}\" SequenceNo=\"{3}\">{4}</Action>".format(actionCode, adName, fName, viewGlobalObj.taskActionIndex + 1, paramsXml);

        return aXml;
    };

    var regisUiEvents = function () {
        $(function () {
           

            $("#removeParam").live("click", function () {
                $(this).parent().remove();
                var objActionXml = $.parseXML(assembleActionXml()).getElementsByTagName("Action");
                viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                callbackObj.onXmlUpdate(viewGlobalObj, []);
            });

            $("#addParam").live("click", function () {
                var content = "";
                content = getParamContent("", "", "", "", "", false);
                $("#taskParams").append(content);
                $("#divTaskWorkContent").find("input").each(function () {
                    $(this).blur(function () {
                        var objActionXml = $.parseXML(assembleActionXml()).getElementsByTagName("Action");
                        viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "ECTools", "TaskXml", "TaskWork", "SimpleTaskWork"]);
                    });
                });
                var objActionXml = $.parseXML(assembleActionXml()).getElementsByTagName("Action");
                viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                callbackObj.onXmlUpdate(viewGlobalObj, []);
            });

            $("#ribbon_CloseContent").live("click", function () {
                var lWidth = parseInt($("#divActionsList").parent().css("width"));
                var rWidth = parseInt($("#divContent").css("width"))
                $("#divContent").hide();
                $("#divS").hide();
                $("#divActionWorkArea").hide();
                $("#divActionsList").parent().css("width", lWidth + rWidth + "px");
            });
        });
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divActionWorkArea").empty();
        $("#divActionWorkArea").append(content);
        postRender();
    };

    this.onXmlUpdate = function (callback) {
        callbackObj.onXmlUpdate = callback;
    };

    this.refreshGlobalObj = function (globalObj) {
        viewGlobalObj = globalObj;
    };

    this.refreshViews = function () {
        showWorkAction();
    };

    var postRender = function () {
        regisUiEvents();
    };

};


