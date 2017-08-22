viewFormCashFlowStudioSimpleTaskWork = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div style='padding:0 5px;background:#5B7199;height:27px;margin-top:5px;border:#5B7199 solid 1px;'>" +
                            "<div style='float:left;height:27px;line-height:27px;color:#FFF;'>Action Simple Content</div>" +
                            "<div id='ribbon_CloseSimpleContent' class='ribbon' title='Close' style='float:right;'><div class='icons close'></div></div>" +
                       "</div>" +
                       "<div id='divSimpleTaskWorkContent' style='padding:10px;height:712px;border:#BDBDBD solid 1px;border-top:none;overflow: auto;'></div>" +
                       "";

    var viewActionTemplate = "<div style='height:40px;line-height:40px'>ActionDisplayName:</div>" +
                          "<div>&nbsp;&nbsp;" +
                               "<input type='text' value='$actionDisplayName$' style='width:400px'>" +
                          "</div>" +
                          "<div style='height:40px;line-height:40px'>ActionCode:</div>" +
                          "<div>&nbsp;&nbsp;" +
                               "<input type='text' id='txtSimpleActionCode' value='$actionCode$' style='width:400px;'>" +
                          "</div>" +
                          "<div>&nbsp;&nbsp;" +
                               "<input type='text' value='$functionName$' style='width:400px;display:none'>" +
                          "</div>" +
                           "<div style='height:40px;line-height:40px'>Parameters:</div>" +
                           "<div id='simpleActionParamsArea'>" +
                              "<div style='width:430px;'>" +
                                    "<div class='grayDivTableHead'>Name</div>" +
                                    "<div class='grayDivTableHead' style='display:none'>SessionParameterName</div>" +
                                    "<div class='grayDivTableHeadRight'>Value</div>" +
                                    "<div class='grayDivTableHead' style='display:none'>DataType</div>" +
                                    "<div class='grayDivTableHead' style='display:none'>Usage</div>" +
                                    "<div class='grayDivTableHeadRight' style='display:none;width:100px'>IsConfigurable</div>" +
                              "</div>" +
                              "<div class='ClearBoth'></div>" +
                              "<div id='simpleTaskParams'>$Params$</div>" +
                            "</div>";

    var paramTemplate = "<div id='param' style='width:430px;' style='display:$display$'>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pname$'></div>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;display:none'><input type='text' value='$pSessionParameterName$'></div>" +
							    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input type='text' value='$pvalue$'></div>" +
							    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;display:none'><input type='text' value='$pDataType$' ></div>" +
							    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;display:none'><input type='text' value='$pUsage$' ></div>" +
                                "<div style='padding:5px;width:100px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;display:none'><input class='configCheck' type='checkbox' $pIsConfigurable$  /></div>" +
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
        var pIsDisplay = "none";
        if (isConfigurable == "true") {
            pIsConfigurable = "checked";
            pIsDisplay = "block";
        }
        pContent = pContent.replace("$pIsConfigurable$", pIsConfigurable);
        pContent = pContent.replace("$display$", pIsDisplay);
        return pContent;
    }

    var writeMethodName = function () {
        var fName = $("#divTaskWorkContent").find("input").eq(2).val();
        if (fName == "RunManagedMethodByPath") {
            $("#divSimpleTaskWorkContent").find("#param").each(function (key, value) {
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
            var vCode = "";
            var vName = "";
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
            $("#divSimpleTaskWorkContent").empty();
            $("#divSimpleTaskWorkContent").append(content);
            $("#simpleActionParamsArea").droppable({
                drop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "method") {
                        writeMethodName();
                    }
                }
            });
            $("#divSimpleTaskWorkContent").find("input").each(function () {
                $(this).blur(function () {
                    var objActionXml = $.parseXML(assembleSimpleActionXml()).getElementsByTagName("Action");
                    viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                    callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "ECTools", "TaskXml", "TaskWork", "SimpleTaskWork"]);
                });
            });
            $("#txtSimpleActionCode").live("change", function () {
                $("#divSimpleTaskWorkContent").find("#param").each(function (key, value) {
                    if ($(this).find("input").eq(0).val() == "CashFlowName") {
                        $(this).find("input").eq(2).val($("#txtSimpleActionCode").val());
                        return false;
                    }
                });
            });
        } else {
            $("#divSimpleTaskWorkContent").empty();
        }
    }

    var assembleSimpleActionXml = function () {
        var adName = $("#divSimpleTaskWorkContent").find("input").eq(0).val();
        var actionCode = $("#divSimpleTaskWorkContent").find("input").eq(1).val();
        var fName = $("#divSimpleTaskWorkContent").find("input").eq(2).val();
        var paramsXml = "";
        $("#divSimpleTaskWorkContent").find("#param").each(function (key, value) {
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
            $("#ribbon_CloseSimpleContent").live("click", function () {
                var lWidth = parseInt($("#divActionsList").parent().css("width"));
                var rWidth = parseInt($("#divContent").css("width"))
                $("#divContent").hide();
                $("#divS").hide();
                $("#divSimpleActionWork").hide();
                $("#divActionsList").parent().css("width", lWidth + rWidth + "px");
            });
        });
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divSimpleActionWork").empty();
        $("#divSimpleActionWork").append(content);
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


