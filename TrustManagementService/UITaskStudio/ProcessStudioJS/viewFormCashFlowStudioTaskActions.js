﻿viewFormCashFlowStudioTaskActions = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    var keyCode = -1;
    var sessionServiceBase = GlobalVariable.SessionManagementServiceUrl;
    var CashFlowStudioServiceBase = GlobalVariable.CashFlowStudioServiceUrl;

    var viewTemplate = "<div style='margin:5px;margin-right:0;padding:10px;padding-top:3px;height:747px;border:#808080 solid 1px;overflow: auto;'>" +
                           "<ul id='menuUl' class='ul-menu' >" +
                                "<li  id='menuCopy'><a href='#'><span class='menu-span icons icon-copy'></span><span>Copy</span></a><li>" +
                                "<li  id='menuPaste'><a href='#'><span class='menu-span icons icon-paste'></span><span>Paste</span></a></li>" +
                                "<li  id='menuDel'><a href='#'><span class='menu-span icons icon-trash'></span><span>Delete</span></a></li>" +
                            "</ul>" +
                           "<div style='min-width:655px;height:28px;line-height:28px; border-bottom:solid 1px #BDBDBD;'>" +
                                "<div id='ribbon_showContent' class='ribbon' title='Show/Hide Content'><div class='bigicons bigtransferthick-e-w'></div></div>" +
                                "<div id='ribbon_showSimpleContent' class='ribbon' title='Show/Hide Simple Content'><div class='bigicons bigtransfer-e-w'></div></div>" +
                                "<div id='ribbon_ApplyTask' class='ribbon' title='Apply'><div class='bigicons bigcheck'></div></div>" +
                                "<div id='ribbon_SaveTask' class='ribbon' title='Save'><div class='bigicons bigdisk'></div></div>" +
                                "<div id='ribbon_RefreshTask' class='ribbon' title='Refresh'><div class='bigicons bigrefresh'></div></div>" +
                                "<div id='ribbon_PopVariablePannel' class='ribbon' title='Session Variables'><div class='bigicons biggear'></div></div>" +
                                "<div id='ribbon_RunTask' class='ribbon' title='Run Task'><div class='bigicons bigplay'></div></div>" +
                                "<div style='float:right'><input id='searchTaskCode' type='text' style='text-align:right;width:400px;border:none;font-weight: bold' /></div>" +
                            "</div>" +
                            "<div style='height:10px'></div>" +
                            "<div id='tbActionsHead' style='min-width:655px'>" +
                                "<div class='grayTableHead' style='width:20px'></div>" +
                                "<div class='grayTableHead' style='min-width:300px;'>ActionCode</div>" +
                                "<div class='grayTableHeadRight' style='min-width:300px'>ActionDisplayName</div>" +
                                "<div class='ClearBoth'></div>" +
                            "</div>" +
                            "<div id='tbActions' style='min-height:600px'>" +
                            "</div>" +
                       "</div>" +
                       "";

    var viewActionTemplate = "<div id='divAction'  actionData='{1}'  style='cursor:default;margin:0'>" +
                                "<div class='grayTableCell' style='width:20px;text-align:center'>{2}</div>" +
                                "<div class='grayTableCell' style='min-width:300px;white-space:nowrap'>{3}</div>" +
                                "<div class='grayTableCellRight' style='min-width:300px;white-space:nowrap'>{0}</div>" +
                                "<div style='display:none'><input type='checkbox'/></div>" +
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

    var writeNewAction = function () {
        viewGlobalObj.taskActionXmls.push($.parseXML(viewGlobalObj.dragContext.dragData).getElementsByTagName("Action"));
        content = viewActionTemplate.format($(viewGlobalObj.dragContext.dragData).attr("ActionDisplayName"), viewGlobalObj.taskActionXmls.length - 1, viewGlobalObj.taskActionXmls.length, $(viewGlobalObj.dragContext.dragData).attr("ActionCode"));
        var divClone = $("#tbActions").find("li").eq(0);
        $(divClone).after(content);
        $(divClone).remove();

        //$("#tbActions").append(content);
    }

    var writeTaskActions = function () {
        var content = "";
        
        for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
            content += viewActionTemplate.format($(viewGlobalObj.taskActionXmls[i]).attr("ActionDisplayName"), i, i + 1, $(viewGlobalObj.taskActionXmls[i]).attr("ActionCode"));
        };
        $("#tbActions").empty();
        $("#tbActions").append(content);
        if (content != "") {
            setDivActionWidth();
            setCheckedAction();
        }
    }

    var setDivActionWidth = function () {
        var maxCodeWidth = 300;
        var maxNameWidth = 300;
        $("#tbActions").find("#divAction").each(function () {
            if (parseInt($(this).find("div").eq(1).css("width")) > maxCodeWidth) {
                maxCodeWidth = parseInt($(this).find("div").eq(1).css("width"));
            }
            if (parseInt($(this).find("div").eq(2).css("width")) > maxNameWidth) {
                maxNameWidth = parseInt($(this).find("div").eq(2).css("width"));
            }
        });
        $("#tbActions").find("#divAction").each(function () {
            $(this).find("div").eq(1).css("width", maxCodeWidth + "px");
            $(this).find("div").eq(2).css("width", maxNameWidth + "px");
            $(this).css("width", (maxCodeWidth + 55 + maxNameWidth) + "px");
        });
       
        $("#tbActionsHead").find("div").eq(1).css("width", maxCodeWidth + "px");
        $("#tbActionsHead").find("div").eq(2).css("width", maxNameWidth + "px");
        $("#tbActionsHead").css("width", (maxCodeWidth + 55 + maxNameWidth) + "px");
    }

    var setCheckedAction = function () {
        if (keyCode != 17) {
            $("#tbActions").find("#divAction").each(function () {
                if ($(this).attr("actionData") == viewGlobalObj.taskActionIndex) {
                    $(this).find("input[type='checkbox']").attr("checked", true);
                    $(this).find("div").each(function () {
                        $(this).css("background", "#B7DBFF");
                    });
                } else {
                    $(this).find("input[type='checkbox']").attr("checked", false);
                    $(this).find("div").each(function () {
                        $(this).css("background", "");
                    });
                }
            });
        } else {
            $("#tbActions").find("#divAction").each(function () {
                if ($(this).find("input[type='checkbox']").attr("checked")) {
                    $(this).find("div").each(function () {
                        $(this).css("background", "#B7DBFF");
                    });
                } else {
                    $(this).find("div").each(function () {
                        $(this).css("background", "");
                    });
                }
            });
        }
    }

    var showMenu = function (ev) {
        $("#menuUl").show();
        var parentTop = $("#tbActions").offsetParent().position().top;//获取相对(父元素)位置
        var parentLeft = $("#tbActions").offsetParent().offsetParent().position().left;
        var pointX = (globalObj.mousePosition(ev).x - parentLeft + 10) + "px";
        var pointY = (globalObj.mousePosition(ev).y - parentTop) + "px";
        $("#menuUl").css("top", pointY);
        $("#menuUl").css("left", pointX);
        $("#menuUl").menu();
    }

    var CopyAction = function () {
        viewGlobalObj.copyActions = [];
        $("#tbActions").find("input[type='checkbox']").each(function (i) {
            if ($(this).attr("checked")) {
                viewGlobalObj.copyActions.push(viewGlobalObj.taskActionXmls[$(this).parent().parent().attr("actionData")]);
            }
        })
        callbackObj.onXmlUpdate(viewGlobalObj, []);
    }

    var PasteAction = function () {
        for (var i = 0; i < viewGlobalObj.copyActions.length; i++) {
            viewGlobalObj.taskActionXmls.insert(parseInt(viewGlobalObj.taskActionIndex) + i, viewGlobalObj.copyActions[i]);
        }
        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions"]);
    }

    var DelAction = function () {
        if (confirm("确定删除选择项吗？")) {
            var newTaskActionXmls = [];
            var newTaskActionIndex = 0;

            $("#tbActions").find("#divAction").each(function () {
                if (!$(this).find("input[type='checkbox']").attr("checked")) {
                    newTaskActionXmls.push(viewGlobalObj.taskActionXmls[$(this).attr("actionData")]);
                }
            });
            if (newTaskActionXmls.length == 0) {
                newTaskActionIndex = -1;
            }
            viewGlobalObj.taskActionXmls = newTaskActionXmls;
            viewGlobalObj.taskActionIndex = newTaskActionIndex;
            callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "TaskWork", "ECTools", "TaskXml"]);
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

    var afterOrdered = function () {
        var newTaskActionXmls = [];
        var newTaskActionIndex = 0;
        $("#tbActions").find("#divAction").each(function () {
            newTaskActionXmls.push(viewGlobalObj.taskActionXmls[$(this).attr("actionData")]);
            if ($(this).attr("actionData") == viewGlobalObj.taskActionIndex) {
                newTaskActionIndex = newTaskActionXmls.length - 1;
            }
        })
        viewGlobalObj.taskActionXmls = newTaskActionXmls;
        viewGlobalObj.taskActionIndex = newTaskActionIndex;
        callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools", "TaskActions", "TaskXml", "TaskWork", "SimpleTaskWork"]);
    }

    var saveTaskToDataBase = function (actionIndex) {
        if (actionIndex < viewGlobalObj.taskActionXmls.length) {
            var actionCode = $(viewGlobalObj.taskActionXmls[actionIndex]).attr("ActionCode");
            var vContext = {};
            vContext.appDomain = viewGlobalObj.appDomain;
            vContext.actionCode = actionCode;
            var isNewActionCodeResult = isNewActionCode(vContext, function (response) {
                if (response) {
                    var saveNewActionCodeResult = saveNewActionCode(vContext, function (response) {
                        if (!response) {
                            alert("actionCode " + vContext.actionCode + " save failed.")
                        } else {
                            saveTaskToDataBase(actionIndex + 1);
                        }
                    })
                } else {
                    saveTaskToDataBase(actionIndex + 1);
                }
            })
        } else {
            var taskContext = {};
            taskContext.appDomain = viewGlobalObj.appDomain;
            taskContext.taskCode = $("#searchTaskCode").val();
            var content = "";

            for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
                $(viewGlobalObj.taskActionXmls[i]).attr("SequenceNo", i + 1);
                content += (viewGlobalObj.taskActionXmls[i])[0].xml;
            };

            content = "<Task>{0}</Task>".format(content);
            taskContext.taskXml = content;
            var saveTaskXmlResult = saveTaskXml(taskContext, function (response) {
                if (!response) {
                    alert("Failed to save Task.");
                } else {
                    saveTaskSessionContext(taskContext.appDomain, taskContext.taskCode, viewGlobalObj.variableJson, function (response) {
                        if (!response) {
                            alert("Failed to save Task.");
                        } else {
                            alert("Saved successfully.");
                        }
                    })
                }
            })

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

    var checkActionCodeAndTaskCode = function () {
        var taskContext = {};
        taskContext.appDomain = viewGlobalObj.appDomain;
        taskContext.taskCode = $("#searchTaskCode").val();
        $("#tbActions").find("#divAction").each(function () {
            taskContext.actionCode = $(this).find("div").eq(1).html();
            var aElement = $(this).find("div").eq(1);
            var isNewActionCodeResult = isNewActionCode(taskContext, function (response) {
                if (response) {
                    aElement.css('color', 'red');
                }
            });
        })

        var isNewTaskCodeResult = isNewTaskCode(taskContext, function (response) {
            if (!response) {
                $("#searchTaskCode").css('color', 'red');
            }
            else {
                $("#searchTaskCode").css('color', 'black');
            }
        })
    }

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

    var saveTaskXml = function (taskContext, callback) {
        //var serviceUrl = sessionServiceBase + "SaveTaskXmlByPost/" + taskContext.appDomain + "/" + taskContext.taskCode;
        var serviceUrl = sessionServiceBase + "SaveTaskXmlByPostEx/" + taskContext.appDomain + "/" + taskContext.taskCode + "/Process";

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: taskContext.taskXml,
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    };

    var loadTaskXml = function (response) {
        var taskXml = $.parseXML(response);
        viewGlobalObj.taskActionXmls = [];
        $(taskXml).find("Action").each(function (key, value) {
            viewGlobalObj.taskActionXmls.push($(this));
        });
        viewGlobalObj.taskActionIndex = 0;
        getTaskSessionContextByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, loadTaskSessionContext);
    }

    var loadTaskSessionContext = function (response) {
        viewGlobalObj.variableJson = response;
        viewGlobalObj.isFirstLoad = true;
        callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools", "TaskActions", "TaskWork", "SimpleTaskWork", "TaskXml", "SessionVariable", "TaskMethods"]);
    }

    var getTaskXmlByTaskCode = function (appDomain, code, callback) {
        var serviceUrl = sessionServiceBase + "GetTaskXmlByTaskCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "xml",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                $("#searchTaskCode").val(code);
                viewGlobalObj.taskCode = code;
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

    var getTaskSessionContextByTaskCode = function (appDomain, code, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetTaskSessionContextByTaskCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert(response.documentElement.outerHTML); }
        });
    };

    var saveTaskSessionContext = function (appDomain, code, sessionContext, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "SaveSessionContextByPost/" + appDomain + "/" + code;

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext == "" ? "<SessionVariables>empty</SessionVariables>" : sessionContext,
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    }
  
    var regisUiEvents = function () {

        $(function () {
            $("#tbActions").sortable({
                cursor: "pointer",
                stop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "action") {
                        writeNewAction();
                    }
                    afterOrdered();
                }
            });

            $("#divActionsList").keydown(function (e) {
                keyCode = e.keyCode;
                if (event.ctrlKey && keyCode == 67) {
                    CopyAction();
                }
                if (event.ctrlKey && keyCode == 86) {
                    PasteAction();
                }
                if (keyCode == 46) {
                    DelAction();
                }
            }).keyup(function (e) {
                keyCode = -1;
            })

            $(document).bind("mousedown", function (e) {
                $("#menuUl").hide();
            });

            $(document).keydown(function (e) {
                keyCode = e.keyCode;
            }).keyup(function (e) {
                keyCode = -1;
            })

            $("#menuUl").bind('mousedown', function () {
                return false;
            })

            $("#tbActions").bind('contextmenu', function () {
                return false;
            })

            $("#menuUl li").live("click", function () {
                if ($(this).context.id == "menuCopy") CopyAction();
                if ($(this).context.id == "menuPaste") PasteAction();
                if ($(this).context.id == "menuDel") DelAction();
                $("#menuUl").hide();
            })

            $("#ribbon_showContent").live("click", function () {
                var lWidth = parseInt($("#divActionsList").parent().css("width"));
                var rWidth = parseInt($("#divContent").css("width"));
                if ($("#divContent").is(":hidden")) {
                    $("#divContent").show();
                    $("#divS").show();
                    $("#divActionWorkArea").show();
                    $("#divActionsList").parent().css("width", lWidth - rWidth + "px");
                } else {
                    if ($("#divActionWorkArea").is(":hidden")) {
                        $("#divActionWorkArea").show();
                        $("#divSimpleActionWork").hide();
                    } else {
                        $("#divContent").hide();
                        $("#divS").hide();
                        $("#divActionWorkArea").hide();
                        $("#divActionsList").parent().css("width", lWidth + rWidth + "px");
                    }
                }
            })

            $("#ribbon_showSimpleContent").live("click", function () {
                var lWidth = parseInt($("#divActionsList").parent().css("width"));
                var rWidth = parseInt($("#divContent").css("width"));
                if ($("#divContent").is(":hidden")) {
                    $("#divContent").show();
                    $("#divS").show();
                    $("#divSimpleActionWork").show();
                    $("#divActionsList").parent().css("width", lWidth - rWidth + "px");
                } else {
                    if ($("#divSimpleActionWork").is(":hidden")) {
                        $("#divSimpleActionWork").show();
                        $("#divActionWorkArea").hide();
                    } else {
                        $("#divContent").hide();
                        $("#divS").hide();
                        $("#divSimpleActionWork").hide();
                        $("#divActionsList").parent().css("width", lWidth + rWidth + "px");
                    }
                }
            })

            $("#divAction").live("mousedown", function (e) {
                if (e.which == 1) {
                    if (keyCode != 17) {
                        viewGlobalObj.taskActionIndex = $(this).attr("actionData");
                        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskWork", "SimpleTaskWork"]);
                    } else {
                        if ($(this).find("input[type='checkbox']").attr("checked")) {
                            $(this).find("input[type='checkbox']").attr("checked", false);
                        } else {
                            $(this).find("input[type='checkbox']").attr("checked", true);
                        }
                    }
                    setCheckedAction();
                } else {
                    if (keyCode != 17) {
                        if (!$(this).find("input[type='checkbox']").attr("checked")) {
                            viewGlobalObj.taskActionIndex = $(this).attr("actionData");
                            callbackObj.onXmlUpdate(viewGlobalObj, ["TaskWork", "SimpleTaskWork"]);
                            setCheckedAction();
                        }
                    }
                    showMenu(e);
                    return false;
                }
            });

            $("#ribbon_ApplyTask").live("click", function () {
                var objActionXml = null;
                if (!$("#divSimpleActionWork").is(":hidden")) {
                    objActionXml = $.parseXML(assembleSimpleActionXml()).getElementsByTagName("Action");
                } else {
                    objActionXml = $.parseXML(assembleActionXml()).getElementsByTagName("Action");
                }
                viewGlobalObj.taskActionXmls[viewGlobalObj.taskActionIndex] = objActionXml;
                callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "ECTools", "TaskXml", "TaskWork", "SimpleTaskWork"]);
                checkActionCodeAndTaskCode();
            }); 

            $("#ribbon_SaveTask").click(function () {
                var taskCode = $("#searchTaskCode").val();
                if (taskCode == "" ) {
                    alert("TaskCode is Empty!");
                    return;
                }
                saveTaskToDataBase(0);
            }); 

            $("#ribbon_RefreshTask").click(function () {
                var taskCode = viewGlobalObj.taskCode;
                var appDomain = viewGlobalObj.appDomain;
                getTaskXmlByTaskCode(appDomain, taskCode, loadTaskXml);
            });

            $("#ribbon_PopVariablePannel").click(function () {
                $("#divVariablePannel").dialog({
                    modal: true,
                    dialogClass: "TaskProcessDialogClass",
                    closeText: "",
                    height: 460,
                    width: 980,
                    close: function (event, ui) { }, // refresh report repository while close the task process screen.
                    title: "Session Variables"
                });
            }); 

            $("#ribbon_RunTask").click(function () {
                var wProxy = new webProxy();
                var sContext = {
                    appDomain: viewGlobalObj.appDomain,
                    sessionVariables: viewGlobalObj.variableJson == "" ? "<SessionVariables><SessionVariable><Name>a</Name><Value></Value><DataType>a</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable></SessionVariables>" : viewGlobalObj.variableJson,
                    taskCode: viewGlobalObj.taskCode
                };

                //wProxy.createSessionByTaskCode(sContext, function (response) {
                //    isSessionCreated = true;
                //    PopupTaskProcessIndicator();
                //    document.getElementById("TaskProcessCtl").Content.SL_Agent.InitParams(response, viewGlobalObj.appDomain, viewGlobalObj.taskCode, "TaskProcess");
                //});

                wProxy.createSessionByTaskCode(sContext, function (response) {
                    isSessionCreated = true;
                    sessionID = response;
                    taskCode = viewGlobalObj.taskCode;
                    IndicatorAppDomain = viewGlobalObj.appDomain;

                    if (IsSilverlightInitialized) {
                        PopupTaskProcessIndicator();
                        InitParams();
                        //document.getElementById("TaskProcessCtl").Content.SL_Agent.InitParams(sessionID, IndicatorAppDomain, taskCode, "TaskProcess");
                    }
                    else {
                        PopupTaskProcessIndicator();
                    }

                });
            });
        });
    };

    this.onXmlUpdate = function (callback) {
        callbackObj.onXmlUpdate = callback;
    };

    this.refreshGlobalObj = function (globalObj) {
        viewGlobalObj = globalObj;
    };

    this.refreshViews = function () {
        writeTaskActions();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divActionsList").empty();
        $("#divActionsList").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};

