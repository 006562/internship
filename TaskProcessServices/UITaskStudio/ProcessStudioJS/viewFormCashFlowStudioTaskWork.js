viewFormCashFlowStudioTaskWork = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

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
                                    "<div class='grayDivTableHead'>Value</div>" +
                                    "<div class='grayDivTableHead'>DataType</div>" +
                                    "<div class='grayDivTableHead'>Usage</div>" +
                                    "<div class='grayDivTableHeadRight' style='width:100px'>IsConfigurable</div>" +
                              "</div>" +
                              "<div class='ClearBoth'></div>" +
                              "<div id='taskParams'>$Params$</div>" +
                            "</div>" +
                            "";

    var paramTemplate = "<div id='param' style='width:1092px;'>" +
                                "<div id='removeParam' style='padding:5px;cursor:pointer; width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><div style='padding-top:5px;'><img src='../img/remove.png' alt='Remove Param' class='addRemoveImgButton'/></div></div>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pname$'></div>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pSessionParameterName$' name='iptGroupSession'></div>" +
							    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pvalue$'></div>" +
							    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pDataType$'></div>" +
							    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pUsage$'></div>" +
                                "<div style='padding:5px;width:100px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input class='configCheck' type='checkbox' $pIsConfigurable$ /></div>" +
                                "<div class='ClearBoth'></div>" +
                        "</div>";

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

    var getParamContent = function (name, sName, value, dType, usage, isConfigurable) {
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

            $("#actionParamsArea").droppable({
                drop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "method") {
                        writeMethodName();
                    }
                }
            });
            $("input[name='iptGroupSession']").droppable({
                drop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "variable") {
                        $(this).val(viewGlobalObj.dragContext.dragData);
                        var objActionXml = $.parseXML(assembleActionXml()).getElementsByTagName("Action");
                        viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                        callbackObj.onXmlUpdate(viewGlobalObj, []);
                    }
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
                $("#divTaskWorkContent").find("#param").each(function (key, value) {
                    if ($(this).find("input").eq(0).val() == "CashFlowName") {
                        $(this).find("input").eq(2).val($("#txtActionCode").val());
                        return false;
                    }
                });
            });

            //$("#txtActionCode").onpropertychange= function () {
            //    alert("sdafsa");
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


