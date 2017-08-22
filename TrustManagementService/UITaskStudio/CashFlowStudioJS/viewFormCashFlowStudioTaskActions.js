/// <reference path="viewFormCashFlowStudioECWork.js" />
viewFormCashFlowStudioTaskActions = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    var keyCode = -1;
    var upGroupName;
    var copyGroupName;
    var ItemLen;
    var sessionServiceBase = GlobalVariable.SessionManagementServiceUrl;
    var CashFlowStudioServiceBase = GlobalVariable.CashFlowStudioServiceUrl;

    var viewTemplate = "<div style='margin:5px;margin-right:0;padding:10px;padding-top:3px;padding-bottom:0px;height:757px;border:#808080 solid 1px;overflow: no;'>" +
                          "<ul id='menuUl' class='ul-menu' >" +
                               "<li  id='menuCopy'><a href='#'><span class='menu-span icons icon-copy'></span><span>Copy</span></a><li>" +
                               "<li  id='menuPaste' class='ui-state-disabled'><a href='#'><span class='menu-span icons icon-paste'></span><span>Paste</span></a></li>" +
                               "<li  id='menuDel'><a href='#'><span class='menu-span icons icon-trash'></span><span>Delete</span></a></li>" +
                           "</ul>" +
                          "<div style='min-width:655px;height:28px;line-height:28px; border-bottom:solid 1px #BDBDBD;'>" +
                               "<div id='ribbon_showContent' class='ribbon' title='Show/Hide Content'><div class='bigicons bigtransferthick-e-w'></div></div>" +
                               "<div id='ribbon_showSimpleContent' class='ribbon' title='Show/Hide Simple Content'><div class='bigicons bigtransfer-e-w'></div></div>" +
                               "<div id='ribbon_ApplyTask' class='ribbon' title='Apply'><div class='bigicons bigcheck'></div></div>" +
                               "<div id='ribbon_SaveTask' class='ribbon' title='Save'><div class='bigicons bigdisk'></div></div>" +
                               "<div id='ribbon_RefreshTask' class='ribbon' title='Refresh'><div class='bigicons bigrefresh'></div></div>" +
                               "<div id='ribbon_PopTaskInput' class='ribbon' title='Task Input'><div class='bigicons biggear'></div></div>" +
                               "<div id='ribbon_RunTask' class='ribbon' title='Run Task'><div class='bigicons bigplay'></div></div>" +
                               "<div id='ribbon_PopResultPannel' class='ribbon' title='CashFlow Run Result'><div class='bigicons bigcomment'></div></div>" +
                               "<div style='float:right'><input id='searchTaskCode' type='text' style='text-align:right;width:300px;border:none;font-weight: bold' /></div>" +
                           "</div>" +
                           "<div style='width:100%;height:728px;overflow: auto;'>" +
                           "<div style='height:10px'></div>" +
                           "<div id='tbActions' class='panel-actions'>" +
                               "<div class='panel-actions-Group'>" +
                                "<div class='panel-actions-Group-header' name='panelHeader' id='DirectInputHeader'><div class='panel-icon panel-open'></div><div>DirectInput</div></div>" +
                                "<div id='tbActionsHead' style='min-width:655px'>" +
                                "<div class='grayTableHead' style='width:20px'></div>" +
                                "<div class='grayTableHead' style='min-width:300px;'>ActionCode</div>" +
                                "<div class='grayTableHeadRight' style='min-width:300px'>ActionDisplayName</div>" +
                                "<div class='ClearBoth'></div>" +
                                "</div>" +
                                "<div class='panel-actions-Group-content' name='divItemType' id='tbDirectInput'>" +
                                "</div>" +
                               "</div>" +
                               "<div  class='panel-actions-Group'>" +
                                "<div class='panel-actions-Group-header' name='panelHeader' id='CalculatedHeader'><div class='panel-icon panel-open'></div><div>Calculated</div></div>" +
                                "<div id='tbActionsHead' style='min-width:655px'>" +
                                "<div class='grayTableHead' style='width:20px'></div>" +
                                "<div class='grayTableHead' style='min-width:300px;'>ActionCode</div>" +
                                "<div class='grayTableHeadRight' style='min-width:300px'>ActionDisplayName</div>" +
                                "<div class='ClearBoth'></div>" +
                                "</div>" +
                                "<div class='panel-actions-Group-content' name='divItemType' id='tbCalculated'>" +
                                "</div>" +
                               "</div>" +
                               "<div  class='panel-actions-Group'>" +
                                "<div class='panel-actions-Group-header' name='panelHeader' id='ExportHeader'><div class='panel-icon panel-open'></div><div>Export</div></div>" +
                                "<div id='tbActionsHead' style='min-width:655px'>" +
                                "<div class='grayTableHead' style='width:20px'></div>" +
                                "<div class='grayTableHead' style='min-width:300px;'>ActionCode</div>" +
                                "<div class='grayTableHeadRight' style='min-width:300px'>ActionDisplayName</div>" +
                                "<div class='ClearBoth'></div>" +
                                "</div>" +
                                "<div  class='panel-actions-Group-content' name='divItemType' id='tbExport'>" +
                                "</div>" +
                               "</div>" +
                            "</div>" +
                        "</div>" +
                      "</div>" +
                      "";

    var viewActionTemplate = "<div id='divAction'  actionData='{1}' style='cursor:default;margin:0;'>" +
                                "<div class='grayTableCell' style='width:20px;text-align:center'>{2}</div>" +
                                "<div class='grayTableCell' style='width:300px;white-space:nowrap'>{3}</div>" +
                                "<div class='grayTableCell' style='width:300px;white-space:nowrap'>{0}</div>" +
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
    
 

    var writeNewAction = function (GroupId) {
        viewGlobalObj.taskActionXmls.push($.parseXML(viewGlobalObj.dragContext.dragData).getElementsByTagName("Action"));
        content = viewActionTemplate.format($(viewGlobalObj.dragContext.dragData).attr("ActionDisplayName"), viewGlobalObj.taskActionXmls.length - 1, viewGlobalObj.taskActionXmls.length, $(viewGlobalObj.dragContext.dragData).attr("ActionCode"));
 
        var divClone = $(GroupId).find("li").eq(0);
     
        if (GetGroupId(viewGlobalObj.dragContext.dragData).GroupId == GroupId) {
            $(divClone).after(content);
            $(divClone).remove();
        } else {
            $(divClone).remove();
        }
    }

    var writeNewCombAction = function (GroupId, strCombAction) {
        var content = "";
        var tempt = $.parseXML(strCombAction);//$.parseXML(viewGlobalObj.dragContext.dragData);//.getElementsByTagName("Action");//viewGlobalObj.dragContext.dragData.replace(/[\'\"\\\b\f\n\r\t]/g, '');
        var divClone = $(GroupId).find("li").eq(0);
        if (GroupId == "#tbCalculated") {
            $(tempt).find('Action').each(function () {
                var temp = $(this);
                viewGlobalObj.taskActionXmls.push($(this));
                content += viewActionTemplate.format($(this).attr("ActionDisplayName"), viewGlobalObj.taskActionXmls.length - 1, viewGlobalObj.taskActionXmls.length, $(this).attr("ActionCode"));
            });
            $(divClone).after(content);
            $(divClone).remove();
            writeCombinationMethods(strCombAction);
        } else {
            $(divClone).remove();
        }
    }

    var writeCombinationMethods = function (strCombAction) {
        var toolName = "";
        var content = $.parseXML(strCombAction);
        $(content).find("main").each(function (key, value) {
            viewGlobalObj.ecMainXmls.push($(this));
        });
        viewGlobalObj.ecMainIndex = 0;

        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECMains", "ECWork", "ECVariables", "ECXml"]);
    }

    var writeTaskActions = function () {
        $("div[name='divItemType']").empty();
        for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
            $(GetGroupId(viewGlobalObj.taskActionXmls[i].context.xml).GroupId).append(viewActionTemplate.format($(viewGlobalObj.taskActionXmls[i]).attr("ActionDisplayName"), i, i + 1, $(viewGlobalObj.taskActionXmls[i]).attr("ActionCode")));
        };

        if (viewGlobalObj.taskActionXmls.length > 0) {
            setDivActionWidth();
            setCheckedAction();
        }
    }

    var GetGroupId = function (obj) {
        var actionParams = $.parseXML(obj);
        var GroupId = "";
        $(actionParams).find("Parameter").each(function (key, value) {
            if ($(this).attr("Name") == "InputType") {
                if ($(this).attr("Value") == "DirectInput") {
                    GroupId = "#tbDirectInput";
                } else if ($(this).attr("Value") == "Calculated") {
                    GroupId = "#tbCalculated";
                } else if ($(this).attr("Value") == "Export") {
                    GroupId = "#tbExport";
                }
            }
        });
        return { GroupId: GroupId }
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
                        $(this).css("background", "#daedee");
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
                        $(this).css("background", "#daedee");
                    });
                } else {
                    $(this).find("div").each(function () {
                        $(this).css("background", "");
                    });
                }
            });
        }
    }

    var cancelCheckedAction = function (currentGroupName, upGroupName) {
        if (upGroupName == "") return;
        if (upGroupName != currentGroupName) {//cancel select upItemObj
            $("#" + upGroupName).find("#divAction").each(function () {
                $(this).find("input[type='checkbox']").attr("checked", false);
                $(this).find("div").each(function () {
                    $(this).css("background", "");
                });
            });
        }
   
    }

    var showPaste = function (currentGroupName) {
        if (copyGroupName == "") return;
        if (copyGroupName == currentGroupName)  //被复制的组名与当前选中的是否是一组
        {
            $("#menuPaste").attr("class", "ui-menu-item");
            $("#menuPaste").attr("flag", "1");
        } else {
            $("#menuPaste").attr("class", "ui-menu-item ui-state-disabled");
            $("#menuPaste").attr("flag", "0");
        }
    }

    var showMenu = function (ev) {
        $("#taskMenuUl").hide();
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
                //ItemLen = $(this).parent().parent().attr("actionData");
                copyGroupName = $(this).parent().parent().parent().attr("Id");
            }
        })
 
        $("#menuPaste").attr("class", "ui-menu-item"); 
        $("#menuPaste").attr("flag", "1"); 
        callbackObj.onXmlUpdate(viewGlobalObj, []);
    }

    var PasteAction = function () {
        if ($("#menuPaste").attr("flag") == "0") return;  // no data return

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
                    var saveResult = saveTaskSessionContext(taskContext.appDomain, taskContext.taskCode, viewGlobalObj.variableJson, function (response) {
                        if (!response) {
                            alert("Failed to save Task.");
                        } else {
                            $("#tbActions").find("#divAction").each(function () {
                                var aElement = $(this).find("div").eq(1);
                                aElement.css('color', 'black');
                            })
                            $("#searchTaskCode").css('color', 'black');

                            alert("Saved successfully.");
                        }
                    })
                }
            })
        }
    }

    var saveTaskToDataBaseNew = function (actionIndex) {
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
                            saveTaskToDataBaseNew(actionIndex + 1);
                        }
                    })
                } else {
                    saveTaskToDataBaseNew(actionIndex + 1);
                }
            })
        } else {

            var taskContext = {};
            taskContext.appDomain = viewGlobalObj.appDomain;
            taskContext.taskCode = $("#searchTaskCode").val();
            taskContext.ecCode = $("#searchECCode").val();
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
                    var saveResult = saveTaskSessionContext(taskContext.appDomain, taskContext.taskCode, viewGlobalObj.variableJson, function (response) {
                        if (!response) {
                            alert("Failed to save Task.");
                        } else {
                            $("#tbActions").find("#divAction").each(function () {
                                var aElement = $(this).find("div").eq(1);
                                aElement.css('color', 'black');
                            })
                            $("#searchTaskCode").css('color', 'black');

                            //更新ProcessTask的CriteriaSetId。
                            updateProcessTaskCriteriaSetId(taskContext.appDomain, taskContext.taskCode, taskContext.ecCode, function (response) {
                                if (!response) {
                                    alert("Failed to Update ProcessTask and CriteriaSetId.");
                                } else {
                                    if (viewGlobalObj.aIsPaste) {
                                        copyTaskProcessArrayToNewTask(taskContext.appDomain, taskContext.taskCode, viewGlobalObj.oldTaskCode, function (response) {
                                            if (!response) {
                                                alert("Failed to copy TaskProcessArray To New Task.");
                                            }
                                            else {
                                                alert("Saved successfully.");
                                                viewGlobalObj.aIsPaste = false;
                                            }
                                        })
                                    } else {
                                        alert("Saved successfully.");
                                    }
                                    viewGlobalObj.isNewTask = false;
                                    viewGlobalObj.taskCode = taskContext.taskCode;
                                    callbackObj.onXmlUpdate(viewGlobalObj, []);
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    var saveTaskToDataBaseModify = function (actionIndex) {
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
                            saveTaskToDataBaseModify(actionIndex + 1);
                        }
                    })
                } else {
                    saveTaskToDataBaseModify(actionIndex + 1);
                }
            })
        } else {
            var taskContext = {};
            taskContext.appDomain = viewGlobalObj.appDomain;
            taskContext.taskCode = $("#searchTaskCode").val();
            taskContext.ecCode = $("#searchECCode").val();
            taskContext.categoryCode = "ProcessTaskType";
            var content = "";

            for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
                $(viewGlobalObj.taskActionXmls[i]).attr("SequenceNo", i + 1);
                content += (viewGlobalObj.taskActionXmls[i])[0].xml;
            };
            content = "<Task>{0}</Task>".format(content);
            taskContext.taskXml = content;
            //alert(taskContext.appDomain + "," + viewGlobalObj.taskCode + "," + taskContext.taskCode + "," + taskContext.categoryCode);
            updateCodeDictionary(taskContext.appDomain, viewGlobalObj.taskCode, taskContext.taskCode, taskContext.categoryCode, function (response) {
                //alert(response);
                if (!response) {
                    alert("Failed to save taskCode");
                } else {
                    var saveTaskXmlResult = saveTaskXml(taskContext, function (response) {
                        if (!response) {
                            alert("Failed to save Task.");
                        } else {
                            var saveResult = saveTaskSessionContext(taskContext.appDomain, taskContext.taskCode, viewGlobalObj.variableJson, function (response) {
                                if (!response) {
                                    alert("Failed to save Task.");
                                } else {
                                    $("#tbActions").find("#divAction").each(function () {
                                        var aElement = $(this).find("div").eq(1);
                                        aElement.css('color', 'black');
                                    })
                                    $("#searchTaskCode").css('color', 'black');

                                    alert("Saved successfully.");
                                    viewGlobalObj.taskCode = taskContext.taskCode;
                                    callbackObj.onXmlUpdate(viewGlobalObj, []);
                                }
                            })
                        }
                    });
                }
            });
        }
    }

    var saveTask = function () {
        var taskContext = {};
        taskContext.appDomain = viewGlobalObj.appDomain;
        taskContext.taskCode = $("#searchTaskCode").val();
        taskContext.ecCode = $("#searchECCode").val();
        taskContext.categoryCode = "CriteriaSetType";

        if (viewGlobalObj.isNewTask) {
            var isTaskCodeExist = isNewTaskCode(taskContext, function (response) {
                if (response) {
                    alert("This TaskCode Exist!");
                } else {
                    //ECCode 是否存在
                    var isNewDictionaryCodeResult = isNewDictionaryCode(taskContext.appDomain, taskContext.ecCode, taskContext.categoryCode, function (response) {
                        if (response) {
                            alert("Please save the caculation first !");
                        } else {
                            //保存task
                            saveTaskToDataBaseNew(0);
                        }
                    });
                }
            });
        } else {
            if (viewGlobalObj.taskCode != taskContext.taskCode) { //修改了taskCode
                var isTaskCodeExist = isNewTaskCode(taskContext, function (response) {
                    if (response) {
                        alert("This TaskCode Exist!");
                    } else {
                        saveTaskToDataBaseModify(0);
                    }
                });
            } else {
                saveTaskToDataBase(0);
            }
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
        var serviceUrl = sessionServiceBase + "SaveTaskXmlByPostEx/" + taskContext.appDomain + "/" + taskContext.taskCode + "/CashFlow";

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
        callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools", "TaskActions", "TaskWork", "SimpleTaskWork", "TaskXml"]);
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

    var loadTaskSessionContext = function (response) {
        viewGlobalObj.variableJson = response;
        viewGlobalObj.isFirstLoad = true;
        callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools", "TaskVariables"]);
    }

    var saveTaskSessionContext = function (appDomain, code, sessionContext, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "SaveProcessTaskContext/" + appDomain + "/" + code;

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext == "" ? "<SessionVariables></SessionVariables>" : sessionContext,
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    }

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

    var getLastRunSessionIdByTaskCode = function (appDomain, code, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetLastRunSessionIdByTaskCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;
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
    };

    var copyTaskProcessArrayToNewTask = function (appDomain, newTaskCode, oldTaskCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "CopyTaskProcessArrayToNewTask/" + appDomain + "/" + newTaskCode + "/" + oldTaskCode+ "?r=" +Math.random() * 150;

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

    var copyTaskProcessArrayToSessionContextArray = function (appDomain, sessionId, taskCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "CopyTaskProcessArrayToSessionContextArray/" + appDomain + "/" + sessionId + "/" + taskCode + "?r=" + Math.random() * 150;

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

    var getRunTaskSessionVariables = function (response) {
        var strReturn = "";
        var vVariableTemplate = "<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>{3}</IsConstant><IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>";
        var vECSetTemplate = "<SessionVariable><Name>CashFlowECSet</Name><Value>{0}</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var vTaskCodeTemplate = "<SessionVariable><Name>TaskCode</Name><Value>{0}</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var vStartPeriodTemplate = "<SessionVariable><Name>StartPeriod</Name><Value>0</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var vEndPeriodTemplate = "<SessionVariable><Name>EndPeriod</Name><Value>11</Value><DataType>nvarchar</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        var startPeriodStr = "";
        var endPeriodStr = "";
        var variableXml = $.parseXML(response);
        $(variableXml).find("SessionVariable").each(function (key, value) {
            var sname = ($($(this).find("Name"))).text() == null ? "" : ($($(this).find("Name"))).text();
            var svalue = ($($(this).find("Value"))).text() == null ? "" : ($($(this).find("Value"))).text();
            var sDataType = ($($(this).find("DataType"))).text() == null ? "" : ($($(this).find("DataType"))).text();
            var sIsConstant = ($($(this).find("IsConstant"))).text() == null ? "" : ($($(this).find("IsConstant"))).text();
            var sIsKey = ($($(this).find("IsKey"))).text() == null ? "" : ($($(this).find("IsKey"))).text();
            var sKeyIndex = ($($(this).find("KeyIndex"))).text() == null ? "" : ($($(this).find("KeyIndex"))).text();
            if (sname == "StartPeriod") {
                startPeriodStr = vVariableTemplate.format(sname, svalue, sDataType, sIsConstant, sIsKey, sKeyIndex);
            }
            if (sname == "EndPeriod") {
                endPeriodStr = vVariableTemplate.format(sname, svalue, sDataType, sIsConstant, sIsKey, sKeyIndex);
            }
        })
        if (startPeriodStr == "") {
            startPeriodStr = vStartPeriodTemplate;
        }
        if (endPeriodStr == "") {
            endPeriodStr = vEndPeriodTemplate;
        }
        strReturn = "<SessionVariables>{0}</SessionVariables>".format(vECSetTemplate.format(viewGlobalObj.ecCode) + vTaskCodeTemplate.format(viewGlobalObj.taskCode) + startPeriodStr + endPeriodStr);
        return strReturn;
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
        var serviceUrl = CashFlowStudioServiceBase + "UpdateCodeDictionary/" + appDomain + "/" + oldCode + "/" + newCode + "/" + categoryCode + "?r=" + Math.random() * 150;

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

    var updateProcessTaskCriteriaSetId = function (appDomain, taskCode, criteriaSetCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "UpdateProcessTaskCriteriaSetId/" + appDomain + "/" + taskCode + "/" + criteriaSetCode + "?r=" + Math.random() * 150;
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

    var isHaveReplaceAcitionName = false;
    var viewEditActionName = function () {
        var ActionviewTemplate = "<div style='height:330px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'>" +
                         "<div style='width:400px'>" +
                             "<div class='grayDivTableHead'>ItemName</div>" +
                             "<div class='grayDivTableHead'>ItemValue</div>" +
                             "<div class='ClearBoth'></div>" +
                         "</div>" +
                         "<div id='actionNames'>{0}</div>" +
                    "</div>";
        var ActionTemplate = "<div id='actionName' style='width:400px;'>" +
                                    "<span style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'>{1}:&nbsp;&nbsp</span>" +
                                    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input type='text' value='{0}'></div>" +
                               "</div>";
        var acontent = "";
        var temp = [];
        var str = viewGlobalObj.combinationActionXmls[parseInt(viewGlobalObj.dragContext.dragData)];
        var repstr = /\#(.+?)\#/g;
        var arraystr = str.match(repstr);
        if (arraystr != null) {
            isHaveReplaceAcitionName = true;
            for (var i = 0; i < arraystr.length; i++) {
                var next = arraystr[i].slice(2, -2);
                if ($.inArray(next, temp) == -1)
                {
                    temp.push(next);
                    acontent += ActionTemplate.format("", next);
                }
            }
            $("#actionNames").empty();
            $("#actionNames").append(acontent);
            var content = "";
            content += ActionviewTemplate.format(acontent);
            $("#divActionNameEdit").empty();
            $("#divActionNameEdit").append(content);
        } else isHaveReplaceAcitionName = false;

    }

    var regisUiEvents = function () {

        $(function () {
            $("div[name='panelHeader']").live("click", function () {
                var headerObj = $(this);
                if ($(this).nextAll().is(":hidden")) {
                    $(headerObj).children("div:first").attr("class", "panel-icon panel-open");
                    $(this).nextAll().show();
                } else {
                    $(headerObj).children("div:first").attr("class", "panel-icon panel-close");
                    $(this).nextAll().hide();
                }
            });

            $("div[name='divItemType']").sortable({
                cursor: "pointer",
                stop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "action") {
                        var GruopId = "#" + $(this).attr("Id");
                        writeNewAction(GruopId);
                    }
                    if (viewGlobalObj.dragContext.dragType == "combaction") {
                        var GruopId = "#" + $(this).attr("Id");
                        if (GruopId == "#tbCalculated") {
                            viewEditActionName();
                            if (isHaveReplaceAcitionName) {
                                $("#divActionNameEdit").dialog({
                                    modal: true,
                                    dialogClass: "TaskProcessDialogClass",
                                    closeText: "",
                                    height: 450,
                                    width: 460,
                                    buttons: {
                                        "ok": function () {
                                            var str = viewGlobalObj.combinationActionXmls[parseInt(viewGlobalObj.dragContext.dragData)];
                                            $("#divActionNameEdit").find("#actionName").each(function () {
                                                var srcReplace = "#{" + ($(this).find("span").eq(0).text()).replace(":  ", "") + "}#";
                                                var rep = new RegExp("" + srcReplace + "", "g")
                                                str = str.replace(rep, $(this).find("input").eq(0).val());
                                            });
                                            //viewGlobalObj.combinationActionXmls[parseInt(viewGlobalObj.dragContext.dragData)] = str;
                                            writeNewCombAction(GruopId, str);
                                            //viewGlobalObj.combinationActionXmls[parseInt(viewGlobalObj.dragContext.dragData)] = viewGlobalObj.combinationActionCopy[parseInt(viewGlobalObj.dragContext.dragData)];
                                            callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "TaskWork", "TaskXml"]);//update view 
                                            $(this).dialog("close");
                                        },
                                        "cancel": function () {
                                            $(this).dialog("close");
                                        }
                                    },
                                    close: function (event, ui) {
                                    }, // refresh report repository while close the task process screen.
                                    title: "Dialog Of Edittiong ActionName"
                                });
                            }
                            else {
                                writeNewCombAction(GruopId, viewGlobalObj.combinationActionXmls[parseInt(viewGlobalObj.dragContext.dragData)]);
                            }
                        }
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
                var currentGroupName = $(this).parent().attr("Id");
                showPaste(currentGroupName);
                cancelCheckedAction(currentGroupName, upGroupName);
                //e.whick 1:左击  3:右击  keyCode 17:多选(ctrl)
                if (e.which == 1) {
                    if (keyCode != 17) {
                        viewGlobalObj.taskActionIndex = $(this).attr("actionData");
                        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskWork", "SimpleTaskWork"]);
                    } else {
                       
                        if ($(this).find("input[type='checkbox']").attr("checked")) {
                            $(this).find("input[type='checkbox']").attr("checked", false);
                        } else{
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
                upGroupName = currentGroupName;
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
                saveTask();
            });

            $("#ribbon_RefreshTask").click(function () {
                var taskCode = viewGlobalObj.taskCode;
                var appDomain = viewGlobalObj.appDomain;
                $("#searchTaskCode").val(taskCode);
                getTaskXmlByTaskCode(appDomain, taskCode, loadTaskXml);
            });

            $("#ribbon_PopTaskInput").click(function () {
                var url = location.protocol + "//" + location.host + "/TrustManagementService/UITaskStudio/CashFlowInputView.html?r=" + Math.random() * 150;
                var obj = new Object();
                obj.appDomain = viewGlobalObj.appDomain;
                obj.taskCode = viewGlobalObj.taskCode;
                //obj.taskOperate = viewGlobalObj.taskOperate;
                //obj.operate = viewGlobalObj.operate;
                var isRefreshVariable = window.showModalDialog(url, obj, "dialogWidth:" + window.screen.availWidth + "px;dialogHeight:" + window.screen.availHeight + "px;resizable:no;scroll:no;");
                if (isRefreshVariable) {
                    getTaskSessionContextByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, loadTaskSessionContext);
                }
            }); 
          
            //$("#ribbon_PopRangePannel").click(function () {
            //    var url = location.protocol + "//" + location.host + "/TaskProcessServices/UITaskStudio/TaskProcessArray.html?r=" + Math.random() * 150;
            //    var obj = new Object();
            //    obj.appDomain = viewGlobalObj.appDomain;
            //    obj.taskCode = viewGlobalObj.aIsPaste == true ? viewGlobalObj.oldTaskCode : viewGlobalObj.taskCode;
            //    obj.isPaste = viewGlobalObj.aIsPaste;
            //    window.showModalDialog(url, obj, "dialogWidth:980px;dialogHeight:460px;resizable:no;scroll:no;");
            //});

            $("#ribbon_PopResultPannel").click(function () {
                var url = location.protocol + "//" + location.host + "/TrustManagementService/UITaskStudio/CashFlowRunResult.html?r=" + Math.random() * 150;
                var obj = new Object();
                obj.appDomain = viewGlobalObj.appDomain;
                obj.sessionId = viewGlobalObj.sessionId;
                obj.taskCode = viewGlobalObj.taskCode;
                if (obj.sessionId == "") {
                    if (obj.taskCode != "") {
                        getLastRunSessionIdByTaskCode(obj.appDomain, obj.taskCode, function (response) {
                            obj.sessionId = response;
                            window.showModalDialog(url, obj, "dialogWidth:" + window.screen.availWidth + "px;dialogHeight:" + window.screen.availHeight + "px;resizable:no;scroll:no;");
                        })
                    }
                } else {
                    window.showModalDialog(url, obj, "dialogWidth:" + window.screen.availWidth + "px;dialogHeight:" + window.screen.availHeight + "px;resizable:no;scroll:no;");
                }
            });

            $("#ribbon_RunTask").click(function () {
                getTaskSessionContextByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, function (response) {
                    var wProxy = new webProxy();
                    var sContext = {
                        appDomain: viewGlobalObj.appDomain,
                        sessionVariables: getRunTaskSessionVariables(response),
                        taskCode: viewGlobalObj.taskCode
                    };

                    wProxy.createSessionByTaskCode(sContext, function (response) {
                        isSessionCreated = true;
                        sessionID = response;
                        taskCode = viewGlobalObj.taskCode;
                        IndicatorAppDomain = viewGlobalObj.appDomain;

                        if (IsSilverlightInitialized) {
                            PopupTaskProcessIndicator();
                            InitParams();
                        }
                        else {
                            PopupTaskProcessIndicator();
                        }
                        viewGlobalObj.sessionId = sessionID;
                        callbackObj.onXmlUpdate(viewGlobalObj, []);
                    });
                })
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


