viewCashFlowStudio = function () {
    var TaskXML = "";
    var ActionXML = null;
    var ActionXMLs = null;
    var strActionCodes = "";
    var divIndex = 0;
    var isButtonDrag = false;
    var sessionServiceBase = GlobalVariable.SessionManagementServiceUrl;

    var viewActionTemplate = "<div style='width:1092px;cursor:pointer;margin-bottom:10px' id='action'>" +
                                "<div style='height:25px;background-color: #D6DBE9;line-height:25px;border:1px solid #293955;padding:5px;font-family: Arial; font-size: 12px'>" +
                                    "<div id='removeAction' class='divAddorDeleteIcon'><img src='../img/remove.png' alt='Remove Action' class='addRemoveImgButton'/></div> " +
                                    "ActionDisplayName:<input type='text' value='$actionDisplayName$'>&nbsp;&nbsp;" +
						            "ActionCode:<input type='text' value='$actionCode$' class='actionCode'>&nbsp;&nbsp;" +
						            "functionName:<input type='text' value='$functionName$'>&nbsp;&nbsp;" +
                                    "<input type='button' value='Detail' style='width: 60px;  height: 20px;' id='showParameters_$actionCode$' data-actionCode='$actionCode$'/>" +
                                "</div>" +
                                "<div class='paramArea' style='display:none'>" +
                                    "<div>" +
                                        "<div class='grayDivTableHead' style='width:14px'></div>" +
                                        "<div class='grayDivTableHead'>Name</div>" +
                                        "<div class='grayDivTableHead'>SessionParameterName</div>" +
                                        "<div class='grayDivTableHead'>Value</div>" +
                                        "<div class='grayDivTableHead'>DataType</div>" +
                                        "<div class='grayDivTableHead'>Usage</div>" +
                                        "<div class='grayDivTableHeadRight' style='width:100px'>IsConfigurable</div>" +
                                    "</div>" +
                                    "<div class='ClearBoth'></div>" +
							        "<div id='params'>$Params$</div>" +
                                    "<div>" +
                                        "<div id='addParam' class='addParamForCaskFlow pointer' style='width:1082px'><img src='../img/add.png' alt='Add Parameter' /><span> Add Parameter</span></div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>";

    var paramTemplate = "<div id='param'>" +
                            "<div id='removeParam' style='padding:5px;cursor:pointer; width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><div style='padding-top:5px;'><img src='../img/remove.png' alt='Remove Param' class='addRemoveImgButton'/></div></div>" +
                            "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pname$'></div>" +
                            "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pSessionParameterName$'></div>" +
							"<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pvalue$'></div>" +
							"<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pDataType$'></div>" +
							"<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pUsage$'></div>" +
                            "<div style='padding:5px;width:100px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input class='configCheck' type='checkbox' $pIsConfigurable$ /></div>" +
                            "<div class='ClearBoth'></div>" +
                        "</div>";

    var toolButtonTemplate = "<div id='divTool' style='width:250px;cursor:pointer;margin:10px auto;height:25px;background-color: #D6DBE9;line-height:25px;border:1px solid #293955;padding:5px;font-family: Arial; font-size: 12px'>" +
                                "$actionDisplayName$<input type='hidden' value='$actionXML$' />" +
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

    var getToolbuttonContent = function (name, actionXml) {
        var tContent = toolButtonTemplate.replace("$actionDisplayName$", name);
        tContent = tContent.replace("$actionXML$", actionXml);
        return tContent;
    }

    var getActionContent = function (aCode, acDN, fN) {
        var aContent = viewActionTemplate.replace(/\$actionCode\$/g, aCode); //str.replace(/abc/g, '')
        aContent = aContent.replace("$actionDisplayName$", acDN);
        aContent = aContent.replace("$functionName$", fN);

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

    var writeToolButtons = function () {
        $.ajax({
            url: "./ToolButtonTemplate.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 ToolButtonTemplate.xml 文件出错！");
            },
            success: function (toolButtonXML) {
                $("#divTools").empty();
                var content = "";
                var actionIndex = 0;
                ActionXMLs = new Array();
                $(toolButtonXML).find("Action").each(function (key, value) {
                    var tContent = getToolbuttonContent($(this).attr("ActionDisplayName"), actionIndex);
                    ActionXMLs[actionIndex] = $(this);
                    content += tContent;
                    actionIndex += 1;
                });
                $("#divTools").append(content);
                $("#divTools").find("#divTool").each(function () {
                    $(this).draggable({
                        cursor: "pointer",
                        connectToSortable: "#viewForm",
                        helper: "clone",
                        zIndex: "100",
                        start: function (event, ui) {
                            isButtonDrag = true;
                            ActionXML = ActionXMLs[$(this).find("input").eq(0).val()];
                        },
                        stop: function (event, ui) {
                            isButtonDrag = false;
                        }
                    });
                })
            }
        });
    }

    var writeNewAction = function () {
        var content = "";
        var content = getActionContent($(ActionXML).attr("ActionCode"), $(ActionXML).attr("ActionDisplayName"), $(ActionXML).attr("FunctionName"));
        var pContents = "";
        $(ActionXML).find("Parameter").each(function (key, value) {
            var pContent = getParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"), $(this).attr("IsConfigurable"));
            pContents += pContent;
        });
        content = content.replace("$Params$", pContents);

        var divClone = $("#viewForm").find(".ui-draggable").eq(0);
        $(divClone).after(content);
        $(divClone).remove();
        //$("#viewForm").find("#divTool").eq(0).empty();
        //$("#viewForm").find("#divTool").eq(0).append(content);

    }

    var writeActions = function () {
        $("#viewForm").empty();
        var content = "";
        var objXML = $.parseXML(TaskXML);
        
        $(objXML).find("Action").each(function (key, value) {
            var aContent = getActionContent($(this).attr("ActionCode"), $(this).attr("ActionDisplayName"), $(this).attr("FunctionName"));

            var pContents = "";
            $(this).find("Parameter").each(function (key, value) {
                var pContent = getParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"), $(this).attr("IsConfigurable"));
                pContents += pContent;
            });

            aContent = aContent.replace("$Params$", pContents);
            content += aContent;
        });

        $("#viewForm").append(content);
    }

    var loadTaskXml = function (response) {
        TaskXML = response;
        $("#txtTaskXml").empty();
        $("#txtTaskXml").val(response);
        writeActions();
    }

    var regisDynamicUiEvents = function () {
        $('[id^=showParameters_]').live("click", function () {
            $(this).parent().parent().find(".paramArea").toggle(200);
        });

        $("#removeAction").live("click", function () {
            $(this).parent().parent().remove();
        });

        $("#removeParam").live("click", function () {
            $(this).parent().remove();
        });

        $("#addParam").live("click", function () {
            var newParamContent = getParamContent("", "", "", "", "", "");
            $(this).parent().siblings('#params').append(newParamContent);
        });
    }

    var getTaskXmlByTaskCode = function (appDomain, code, callback) {
        var serviceUrl = sessionServiceBase + "GetTaskXmlByTaskCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "xml",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                if ($.browser.msie) {
                    callback(response.xml);
                }
                else {
                    callback(response.documentElement.outerHTML);
                }
            },
            error: function (response) { alert(response.documentElement.outerHTML); }
        });
    };

    var isNewActionCode = function (taskContext, callback) {
        var serviceUrl = sessionServiceBase + "isNewActionCode?applicationDomain=" + taskContext.appDomain + "&actionCode=" + taskContext.actionCode;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    };

    var isNewTaskCode = function (taskContext, callback) {
        var serviceUrl = sessionServiceBase + "IsValidCode?applicationDomain=" + taskContext.appDomain + "&code=" + taskContext.taskCode + "&category=ProcessTaskType";

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    };

    var saveActionCodes = function (actionCodeIndex) {
        var arrNewActionCode = (strActionCodes.substr(0, strActionCodes.length - 1)).split(";");
        if (actionCodeIndex < arrNewActionCode.length) {
            var taskContext = {};
            taskContext.appDomain = $("#SearchAppDomain").val();
            taskContext.actionCode = arrNewActionCode[actionCodeIndex];
            var saveNewActionCodeResult = saveNewActionCode(taskContext, function (response) {
                if (!response) {
                    alert("actionCode " + taskContext.actionCode + " save failed.")
                } else {
                    saveActionCodes(actionCodeIndex + 1);
                }
            })
        } else {
            strActionCodes = "";
        }
    }

    var saveNewActionCode = function (taskContext, callback) {
        var serviceUrl = sessionServiceBase + "CreateCode?applicationDomain=" + taskContext.appDomain + "&code=" + taskContext.actionCode + "&category=ProcessActionType";
        
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    };

    var saveTaskXml = function (taskContext, callback) {
        var serviceUrl = sessionServiceBase + "SaveTaskXml?applicationDomain=" + taskContext.appDomain + "&taskCode=" + taskContext.taskCode + "&taskXml=" + encodeURIComponent(TaskXML);

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    };

    var assembleTaskXml = function () {
        var xml = "";
        var sNo = 1;
        $("#viewForm").find("#action").each(function (key, value) {
            var adName = $(this).find("input").eq(0).val();
            var actionCode = $(this).find("input").eq(1).val();
            var fName = $(this).find("input").eq(2).val();
            var paramsXml = "";

            $(this).find("#param").each(function (key, value) {
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

            var aXml = "<Action ActionCode=\"{0}\" ActionDisplayName=\"{1}\" FunctionName=\"{2}\" SequenceNo=\"{3}\">{4}</Action>".format(actionCode, adName, fName, sNo, paramsXml);
            xml += aXml;
            sNo += 1;

        });

        return "<Task>{0}</Task>".format(xml);
    };

    var regisUiEvents = function () {
        $(function () {
            $("#tabs").tabs();

            $("#tabs li").bind("click", function () {
                divIndex = $(this).index();
            });

            writeToolButtons();

            $("#btLoad").click(function () {
                var taskCode = $("#searchTaskCode").val();
                var appDomain = $("#SearchAppDomain").val();
                if (taskCode == "" || appDomain == "") {
                    alert("TaskCode or AppDomain is Empty!");
                    return;
                }
                getTaskXmlByTaskCode(appDomain, taskCode, loadTaskXml);
            });

            $("#btApply").click(function () {
                if (divIndex == 0) {
                    loadTaskXml(assembleTaskXml());
                } else {
                    loadTaskXml($("#txtTaskXml").val());
                }

                var taskContext = {};
                taskContext.appDomain = $("#SearchAppDomain").val();
                taskContext.taskCode = $("#searchTaskCode").val();
                strActionCodes = "";
                $("#viewForm .actionCode").each(function (key, value) {
                    taskContext.actionCode = $(this).val();
                    var aElement = $(this);
                    var isNewActionCodeResult = isNewActionCode(taskContext, function (response) {
                        if (response) {
                            strActionCodes += aElement.val() + ";";
                            aElement.attr('style', 'border-color: red;color: red');
                        }
                    });
                });

                var isNewTaskCodeResult = isNewTaskCode(taskContext, function (response) {
                    if (!response) {
                        $("#searchTaskCode").attr('style', 'border-color: red;color: red');
                    }
                    else {
                        $("#searchTaskCode").removeAttr("style");
                    }
                })

                alert("apply success!");
            });

            $("#btSave").click(function () {
                var taskContext = {};
                taskContext.appDomain = $("#SearchAppDomain").val();
                taskContext.taskCode = $("#searchTaskCode").val();
                if (strActionCodes != "") {
                    saveActionCodes(0);
                }

                var saveTaskXmlResult = saveTaskXml(taskContext, function (response) {
                    if (!response) {
                        alert("Failed to save task.");
                    } else {
                        //$("#searchTaskCode").removeAttr("style");
                        alert("Task saved successfully.");
                    }
                })
            });

            $("#viewForm").sortable({
                cursor: "pointer",
                stop: function (event, ui) {
                    if (isButtonDrag) {
                        writeNewAction();
                    }
                }
            });
            regisDynamicUiEvents();
        });
    };

    this.refresh = function (vContext) {
    };

    this.render = function () {
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
