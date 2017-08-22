viewFormObjectExplorer = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    var keyCode = -1;
    var checkedTaskLength = 0;
    var copyTaskObj = [];
    var copyTaskIndex = 0;
    var newTaskIndex = 0;
    var isPaste = false;
    var sessionServiceBase = GlobalVariable.SessionManagementServiceUrl;
    var CashFlowStudioServiceBase = GlobalVariable.CashFlowStudioServiceUrl;
    var scriptTemplates = {};
    var strTaskScript = "";
    var scriptEcCode = "";
    var scriptTaskCode = "";

    var viewTemplate = "<div style='padding:0 5px;background:#FFF29D;height:27px'>" +
                            "<div style='float:left;height:27px;line-height:27px'><b>Object Explorer</b></div>" +
                            "<div id='ribbon_Close' class='ribbon' style='float:right'><div class='icons close'></div></div>" +
                       "</div>" +
                       "<div id='divScript' style='padding:5px;display:none;'>" +
                            "<textarea id='txtTaskScript' style='width:610px;height:365px'></textarea>" +
                       "</div>" +
                       "<div style='padding:5px;background:#FCFCFC;height:25px'>" +
                            "<div style='float:left;margin-right:10px'>AppDomain:&nbsp;&nbsp;<input id='txtAppDomain' type='text' value='Task' /></div>" +
                            "<div id='ribbon_Load' class='ribbon'><div class='bigicons bigsearch'></div></div>" +
                            "<div style='clear:both'></div>" +
                       "</div>" +
                       "<div id='objectTabs' style='border:none;padding:0;margin:0;'>" +
                            "<ul id='objectTabsUL'>" +
                                "<li><a href='#viewTaskObject'>Task objects</a></li>" +
                                //"<li><a href='#viewECObject'>Caculation objects</a></li>" +
                            "</ul>" +
                            "<div id='viewTaskObject' style='height:745px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                            //"<div id='viewECObject' style='height:745px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                             "<ul id='taskMenuUl' class='task-ul-menu'>" +
                               "<li  id='taskMenuNew'><a href='#'><span class='menu-span icons icon-new'></span><span>New TaskCode</span></a><li>" +
                               "<li  id='taskMenuCopy' class='ui-state-disabled'><a href='#'><span class='menu-span icons icon-copy'></span><span>Copy</span></a><li>" +
                               "<li  id='taskMenuPaste' class='ui-state-disabled'><a href='#'><span class='menu-span icons icon-paste'></span><span>Paste</span></a></li>" +
                               "<li  id='taskMenuDel' class='ui-state-disabled'><a href='#'><span class='menu-span icons icon-trash'></span><span>Delete</span></a></li>" +
                               "<li  id='taskMenuScript' class='ui-state-disabled'><a href='#'><span class='menu-span icons icon-script'></span><span>Script</span></a></li>" +
                             "</ul>" +
                       "</div>";

    var taskLiTemplate = "<li id='taskLi' class='toolLi' actionData='{0}' taskCode='{1}' ecCode ='{2}' ischeckout='{3}'><table><tr><td style='width:15px;'><div class='icons document'></div></td><td style='white-space:nowrap;'>{1}</td></tr></table><div style='display:none'><input type='checkbox' value='{0}'/></div></li>";
    var ecLiTemplate = "<li id='ecLi' class='toolLi' actionData='{0}'><table><tr><td style='width:15px;'><div class='icons document'></div></td><td style='white-space:nowrap;'>{0}</td></tr></table></li>";


    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var changMenuStyle = function (taskCodeIndex) {
        if (keyCode != 17) {
            $("#viewTaskObject").find("#taskLi").each(function (key, value) {
                if ($(this).attr("actionData") == taskCodeIndex) {
                    $(this).find("input[type='checkbox']").attr("checked", true);
                    $(this).attr("class", "toolLi activeLi");
                    checkedTaskLength = 1;
                } else {
                    $(this).find("input[type='checkbox']").attr("checked", false);
                    $(this).attr("class", "toolLi");
                }
            });
        } else {
            $("#viewTaskObject").find("#taskLi").each(function (key, value) {
                if ($(this).find("input[type='checkbox']").attr("checked")) {
                    $(this).attr("class", "toolLi activeLi");
                    ++checkedTaskLength;
                } else {
                    $(this).attr("class", "toolLi");
                }
            });
             
        }
    }

    var changECMenuStyle = function () {
        $("#viewECObject").find("#ecLi").each(function (key, value) {
            $(this).attr("class", "toolLi");
        });
    }

    var firstLoadStyle = function () {
        $("#viewActionTemplates").find("#actionGroup").eq(0).find("#actionGroupHead").eq(0).attr("class", "toolLi activeLi");
    }

    var writeTaskObjects = function (response) {
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
                content += taskLiTemplate.format(i, response[i].CodeDictionaryCode, response[i].CriteriaSetCode, response[i].IsCheckOut);
            };
            content = "<ul style='margin-left:5px;margin-top:5px'>{0}</ul>".format(content);
            $("#viewTaskObject").empty();
            $("#viewTaskObject").append(content);
        }
    }

    var getTasksByAppDomain = function (appDomain, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetTaskCodeListByAppDomain/" + appDomain + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                viewGlobalObj.appDomain = appDomain;
                callbackObj.onXmlUpdate(viewGlobalObj, []);
                callback(response);
            },
            error: function (response) { alert("load task objects error."); }
        });
    };

    //new add
    var getTaskCodeListByTaskType = function (appDomain, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetTaskCodeListByTaskType/" + appDomain + "/CashFlow?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                viewGlobalObj.appDomain = appDomain;
                callbackObj.onXmlUpdate(viewGlobalObj, []);
                callback(response);
            },
            error: function (response) { alert("load task objects error."); }
        });
    }


    var writeCriteriaSetObjects = function (response) {
        if (response.length > 0) {
            var content = "";
            response.sort(
                function (a, b) {
                    if (a.CriteriaSetTypeCode < b.CriteriaSetTypeCode) return -1;
                    if (a.CriteriaSetTypeCode > b.CriteriaSetTypeCode) return 1;
                    return 0;
                }
            );
            for (var i = 0; i < response.length; i++) {
                content += ecLiTemplate.format(response[i].CriteriaSetTypeCode);
            };
            content = "<ul style='margin-left:5px;margin-top:5px'>{0}</ul>".format(content);
            $("#viewECObject").empty();
            $("#viewECObject").append(content);
        }
    }

    var getCriteriaSetListByAppDomain = function (appDomain, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetECListByAppDomain/" + appDomain + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("load CriteriaSet objects error."); }
        });
    }

    var loadTaskXml = function (response) {
        var taskXml = $.parseXML(response);
        viewGlobalObj.taskActionXmls = [];
        $(taskXml).find("Action").each(function (key, value) {
            viewGlobalObj.taskActionXmls.push($(this));
        });
        viewGlobalObj.taskActionIndex = 0;
        // callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools", "TaskActions", "TaskWork", "SimpleTaskWork", "TaskXml"]);

       getTaskSessionContextByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, loadTaskSessionContext); 
   
    }

    var loadTaskSessionContext = function (response) {
        viewGlobalObj.variableJson = response;
        viewGlobalObj.isFirstLoad = true;
        callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools", "TaskActions", "TaskWork", "SimpleTaskWork", "TaskXml", "TaskVariables"]);
    }

    var getTaskXmlByTaskCode = function (appDomain, code, callback) {
        var serviceUrl = sessionServiceBase + "GetTaskXmlByTaskCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "xml",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                viewGlobalObj.taskCode = code;
                if ($.browser.msie) {
                    callback(response.xml);
                }
                else {
                    callback(response.documentElement.outerHTML);
                }
                if (!isPaste) {
                    $("#searchTaskCode").val(code);
                } else {
                    getCriteriasByECSetCode(viewGlobalObj.appDomain, copyTaskObj[0].ecCode, loadECXml);
                }
            },
            error: function (response) { alert(response.documentElement.outerHTML); }
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
                if (!isPaste) {
                    $("#searchECCode").val(code);
                    viewGlobalObj.ecCode = code;
                } else {
                    setTaskGlobalObj(copyTaskObj[0].taskCode + "_Copy" + copyTaskIndex, copyTaskObj[0].ecCode + "_Copy" + copyTaskIndex);
                    changMenuStyle();
                    checkedTaskLength = 0;
                    ++copyTaskIndex;
                    viewGlobalObj.aIsPaste = true; 
                    isPaste = false;
                }
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

    var getProcessTaskArrayByTaskCode = function (appDomain, taskCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetProcessTaskArrayByTaskCode/" + appDomain + "/" + taskCode + "?r=" + Math.random() * 150;;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("load ProcessTaskArray objects error.");
            }
        });
    };

    var deleteProcessTaskAndCriteriaSet = function (appDomain, code,callback) {
        var serviceUrl = CashFlowStudioServiceBase + "DeleteProcessTaskAndCriteriaSet/" + appDomain + "/" + code + "?r=" + Math.random() * 150;
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
    }

    var showObjextExplorerMenu = function (ev) {
        $("#menuUl").hide();
        $("#taskMenuUl").show();
        var parentTop = $("#taskLi").offsetParent().position().top;//获取相对(父元素)位置
        var parentLeft = $("#taskLi").offsetParent().offsetParent().position().left;
        var pointX = (globalObj.mousePosition(ev).x - parentLeft + 10) + "px";
        var pointY = (globalObj.mousePosition(ev).y - parentTop) + "px";
        $("#taskMenuUl").css("top", pointY);
        $("#taskMenuUl").css("left", pointX);
        $("#taskMenuUl").menu();
    }
 
    var clareAllViewGlobalObj = function () {
        $("#searchTaskCode").val("");
        $("#searchECCode").val("");
        viewGlobalObj.ECXML = "";
        viewGlobalObj.workMainXML = "";
        viewGlobalObj.ecMainXmls = [];
        viewGlobalObj.ecMainIndex = -1;
        viewGlobalObj.TaskXML = "";
        viewGlobalObj.workActionXML = "";
        viewGlobalObj.taskActionXmls = [];
        viewGlobalObj.taskActionIndex = -1;
        viewGlobalObj.appDomain = "Task";
        viewGlobalObj.variableJson = "";
        viewGlobalObj.isFirstLoad = true;
        viewGlobalObj.dragContext = {};
        viewGlobalObj.sessionId = "";
        viewGlobalObj.isViewEdit = false;
        viewGlobalObj.isNewTask = false;
        viewGlobalObj.isNewEC = false;
        viewGlobalObj.aIsPaste = false;
        viewGlobalObj.oldTaskCode = "";
        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "TaskMethods", "TaskVariables", "TaskWork", "SimpleTaskWork", "TaskXml", "ECMains", "ECWork", "ECTools", "ECVariables", "ECXml", "SessionVariable"]);
    }

    var leaveReminder = function () {
        if (viewGlobalObj.isViewEdit) {
            if (confirm("是否离开当前编辑页面！")) { 
                viewGlobalObj.isViewEdit = false;
                viewGlobalObj.aIsPaste = false;
                viewGlobalObj.oldTaskCode = "";
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    var setTaskGlobalObj = function (taskCode, ecCode) {
        viewGlobalObj.taskCode = taskCode;
        viewGlobalObj.ecCode = ecCode;
        viewGlobalObj.isCheckOut = 0;
        viewGlobalObj.isViewEdit = true;
        viewGlobalObj.isNewTask = true;
        viewGlobalObj.isNewEC = true;
        $("#searchTaskCode").val(taskCode);
        $("#searchECCode").val(ecCode);
        $("#ribbon_SaveTask").show();
        $("#ribbon_SaveEC").show();
        callbackObj.onXmlUpdate(viewGlobalObj, []);
    }

    var newTaskCode = function () {
        if (leaveReminder()) {
            var newTaskCode = "NewTaskCode" + newTaskIndex;
            var newECCode = "NewCriteriaCode" + newTaskIndex;
            clareAllViewGlobalObj();
            setTaskGlobalObj(newTaskCode, newECCode);
            changMenuStyle();
            ++newTaskIndex;
        }
    }
    
    var copyTaskCode = function () {
        var taskObj = $("#viewTaskObject").find("input[type='checkbox']:checked").parent().parent();
        var taskCode = taskObj.attr("taskCode");
        var ecCode = taskObj.attr("ecCode");
        viewGlobalObj.oldTaskCode = taskCode;
        copyTaskObj[0] = { "taskCode": taskCode, "ecCode": ecCode }; 
    }

    var pasteTaskCode = function () {
        isPaste = true;
        if (leaveReminder()) {
            getTaskXmlByTaskCode(viewGlobalObj.appDomain, copyTaskObj[0].taskCode, loadTaskXml);
        }
    }
 
    var delTaskCode = function () {
        if (leaveReminder()) {
            if (confirm("确定删除选择项吗？")) { 
                var isCheckOut = false, isDel = false;
                $("#viewTaskObject").find("#taskLi").each(function () {
                    if ($(this).find("input[type='checkbox']").attr("checked")) {
                        if ($(this).attr("isCheckOut") == 1) {
                            isCheckOut = true;
                        } else {
                            if (isDel) {
                                deleteProcessTaskAndCriteriaSet(viewGlobalObj.appDomain, $(this).attr("taskCode"), function (response) {
                                    if (response) {
                                        isDel = true;
                                        getTaskCodeListByTaskType(viewGlobalObj.appDomain, writeTaskObjects);
                                    }
                                });
                            } else {
                                deleteProcessTaskAndCriteriaSet(viewGlobalObj.appDomain, $(this).attr("taskCode"), function (response) {
                                    if (response) {
                                        isDel = true;
                                        clareAllViewGlobalObj();
                                        getTaskCodeListByTaskType(viewGlobalObj.appDomain, writeTaskObjects);
                                    }
                                });
                            }
                        }
                    }
                });

                if (isCheckOut) {
                    alert("不能删除模板项!");
                }
            }
        }
    }

    var loadScriptTemplates = function () {
        $.ajax({
            url: "./TaskScriptTemplate.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 TaskScriptTemplate.xml 文件出错！");
            },
            success: function (scriptTempleXML) {
                scriptTemplates.variableScript = $($(scriptTempleXML).find("VariableScript")).text();
                scriptTemplates.ecScript = $($(scriptTempleXML).find("EcScript")).text();
                scriptTemplates.taskScript = $($(scriptTempleXML).find("TaskScript")).text();
                scriptTemplates.actionSctipt = $($(scriptTempleXML).find("ActionSctipt")).text();
                scriptTemplates.processTaskArrayScript = $($(scriptTempleXML).find("ProcessTaskArrayScript")).text();
                scriptTemplates.processTaskContextScript = $($(scriptTempleXML).find("ProcessTaskContextScript")).text();
            }
        });
    }

    var popScriptWidow = function () {
        $("#txtTaskScript").val(strTaskScript);
        //$("#txtTaskScript").append(strTaskScript);
        $("#divScript").dialog({
            modal: true,
            dialogClass: "TaskProcessDialogClass",
            closeText: "",
            height: 420,
            width: 630,
            close: function (event, ui) { }, // refresh report repository while close the task process screen.
            title: "Scrip for task"
        });
        
    }

    var scriptForEC = function (response) {
        strTaskScript += scriptTemplates.ecScript.format(scriptEcCode, response);
        getTaskXmlByTaskCode(viewGlobalObj.appDomain, scriptTaskCode, scriptForTask);
    }

    var scriptForTask = function (response) {
        var taskXml = $.parseXML(response);
        var strActionCodes = "";
        $(taskXml).find("Action").each(function (key, value) {
            strTaskScript += scriptTemplates.actionSctipt.format($(this).attr("ActionCode"));
        });
        strTaskScript += scriptTemplates.taskScript.format(scriptTaskCode, response);
        getTaskSessionContextByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, scriptForSessionContext);
    }

    var scriptForSessionContext = function (response) {
        if (response != "" && response != undefined) {
            var variableXml = $.parseXML(response);
            $(variableXml).find("SessionVariable").each(function (i) {
                strTaskScript += scriptTemplates.processTaskContextScript.format($(this).find("Name").text(), $(this).find("Value").text(), $(this).find("DataType").text(), $(this).find("IsConstant").text(), $(this).find("IsKey").text(), $(this).find("KeyIndex").text());
            });
        }
        getProcessTaskArrayByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, scriptForSesseionContextArray);
    }

    var scriptForSesseionContextArray = function (response) {
        if (response != "" && response != undefined) {
            for (var i = 0; i < response.length; i++) {
                var itemName = response[i].ItemName;
                var ItemValueObj = response[i].ItemValue;
                for (var j = 0; j < ItemValueObj.length; j++) {
                    strTaskScript += scriptTemplates.processTaskArrayScript.format(itemName, ItemValueObj[j], j);
                }
            }
        }
        popScriptWidow();
    }

    var scriptForOneTast = function () {
        if (scriptEcCode != "") {
            getCriteriasByECSetCode(viewGlobalObj.appDomain, scriptEcCode, scriptForEC);
        } else {
            getTaskXmlByTaskCode(viewGlobalObj.appDomain, scriptTaskCode, scriptForTask);
        }
    }

    var scriptTask = function () {
        strTaskScript = scriptTemplates.variableScript;
        $("#viewTaskObject").find("#taskLi").each(function () {
            if ($(this).find("input[type='checkbox']").attr("checked")) {
                scriptTaskCode = $(this).attr("taskCode");
                scriptEcCode = $(this).attr("ecCode");
                scriptForOneTast();
            }
        });
    }

    var cellWriteTaskObjects = function (response) {
        writeTaskObjects(response);
        var taskObj = $("#viewTaskObject>ul>li[taskCode='" + viewGlobalObj.taskCode + "']");
        var taskCode = viewGlobalObj.taskCode;
        var taskCodeIndex = taskObj.attr("actionData");
        var ecCode = taskObj.attr("ecCode");
        var isCheckOut = taskObj.attr("isCheckOut");
        changMenuStyle(taskCodeIndex);
        LoadCashFlows(taskCode, ecCode, isCheckOut);
        //$("#viewSolution").toggle();
    }

    var getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    var InitCashFlows = function () {
        var appDomain = getUrlParam("appDomain");
        var taskCode = getUrlParam("taskCode");
        var sessionId = getUrlParam("sessionId");
        appDomain = appDomain == null ? "" : appDomain;
        taskCode = taskCode == null ? "" : taskCode;
        sessionId = sessionId == null ? "" : sessionId;
        if (appDomain != "" && taskCode != "") {
            viewGlobalObj.appDomain = appDomain;
            viewGlobalObj.taskCode = taskCode;
            viewGlobalObj.sessionId = sessionId;
            $("#txtAppDomain").val(appDomain);
            getTaskCodeListByTaskType($("#txtAppDomain").val(), cellWriteTaskObjects);
        }
    }

    var LoadCashFlows = function (taskCode, ecCode, isCheckOut) {
        if (isCheckOut == 0) { //taskcode  不是模板
            $("#ribbon_SaveTask").show();
            $("#ribbon_SaveEC").show();
        } else if (isCheckOut == 1) { //taskcode 是模板
            $("#ribbon_SaveTask").hide();
            $("#ribbon_SaveEC").hide();
        }
        //viewGlobalObj.taskOperate = viewGlobalObj.operate.e_edit;
        getTaskXmlByTaskCode(viewGlobalObj.appDomain, taskCode, loadTaskXml);
        getCriteriasByECSetCode(viewGlobalObj.appDomain, ecCode, loadECXml);
    }

    var regisUiEvents = function () {
        $(function () {
            $("#objectTabs").tabs();
            loadScriptTemplates();
            $('[id^=ribbon_]').each(function () {
                $(this).live("mouseover", function () {
                    $(this).attr("class", "ribbon activeRibbon");
                });
                $(this).live("mouseleave", function () {
                    $(this).attr("class", "ribbon");
                });
            });

            $("#studioTabsUL li").bind("click", function () {
                if ($(this).index() == 1) {
                    callbackObj.onXmlUpdate(viewGlobalObj, ["ECMains"]);
                }
            });

            //按下时，隐藏task的菜单
            $(document).bind("mousedown", function (e) {
               $("#taskMenuUl").hide();
            });

            $("#taskMenuUl").bind("mousedown", function (e) {
                return false;
            });

           

            $("#viewTaskObject").bind('contextmenu', function () {
                return false;
            }).keydown(function (e) {
                keyCode = e.keyCode;
                if (event.ctrlKey && keyCode == 67 && checkedTaskLength == 1) {
                    copyTaskCode();
                }
                if (event.ctrlKey && keyCode == 86 && checkedTaskLength == 1) {
                    pasteTaskCode();
                }
                if (keyCode == 46 && checkedTaskLength >= 1) {
                    delTaskCode();
                }
            }).keyup(function (e) {
                keyCode = -1;
            })

  
            $("#taskMenuUl li").live("click", function () {
                if ($(this).context.id == "taskMenuNew") {
                    newTaskCode();
                }

                if ($(this).context.id == "taskMenuCopy") {
                    if (checkedTaskLength == 1)
                        copyTaskCode();
                }
                if ($(this).context.id == "taskMenuPaste") {
                    if (checkedTaskLength == 1)
                        pasteTaskCode();
                }
                  
                if ($(this).context.id == "taskMenuDel") {
                    if (checkedTaskLength >= 1)
                        delTaskCode();
                }
                if ($(this).context.id == "taskMenuScript") {
                    if (checkedTaskLength == 1)
                        scriptTask();
                }
                $("#taskMenuUl").hide();
            });
 
            //在Object Explorer面板右击按下时，显示菜单。
            $("#objectTabs").bind('mousedown', function (e) {
                if (e.which == 3) {//右击
                    if (checkedTaskLength == 0) {
                        $("#taskMenuCopy").attr("class", "ui-menu-item ui-state-disabled");
                        $("#taskMenuPaste").attr("class", "ui-menu-item ui-state-disabled");
                        $("#taskMenuDel").attr("class", "ui-menu-item ui-state-disabled");
                        $("#taskMenuScript").attr("class", "ui-menu-item ui-state-disabled");
                    }else if (checkedTaskLength == 1) {
                        $("#taskMenuCopy").attr("class", "ui-menu-item");
                        $("#taskMenuScript").attr("class", "ui-menu-item");
                        $("#taskMenuDel").attr("class", "ui-menu-item")
                        if (copyTaskObj.length > 0) {
                            $("#taskMenuPaste").attr("class", "ui-menu-item");
                        } else {
                            $("#taskMenuPaste").attr("class", "ui-menu-item ui-state-disabled");
                        }
                    } else if (checkedTaskLength > 1) {
                        $("#taskMenuDel").attr("class", "ui-menu-item")
                        $("#taskMenuCopy").attr("class", "ui-menu-item ui-state-disabled");
                        $("#taskMenuPaste").attr("class", "ui-menu-item ui-state-disabled");
                        $("#taskMenuScript").attr("class", "ui-menu-item ui-state-disabled");
                    }

                    showObjextExplorerMenu();
                    return false;
                }
            })

            //单击选中taskCode
            $("#taskLi").live("mousedown", function (e) {
                var taskCodeIndex = $(this).attr("actionData");
                if (e.which == 1) {//左击 
                    if (keyCode == 17) {//多选(ctrl)
                        if ($(this).find("input[type='checkbox']").attr("checked")) {
                            $(this).find("input[type='checkbox']").attr("checked", false);
                        } else {
                            $(this).find("input[type='checkbox']").attr("checked", true);
                        }
                        taskCodeIndex = -1;
                    }
                    changMenuStyle(taskCodeIndex);
                }
               
            });

            //双击taskCode
            $("#taskLi").live("dblclick", function () {
                //$("#studioTabs").tabs("select", 0);
                //if(copyTaskObj.length > 0){
                //    copyTaskObj[0].isNewTask = false;
                //}
              
                var taskCode =  $(this).attr("taskCode");
                var ecCode =$(this).attr("ecCode");
                var isCheckOut = $(this).attr("isCheckOut");
 
                if (isCheckOut == 0) { //taskcode  不是模板
                    $("#ribbon_SaveTask").show();
                    $("#ribbon_SaveEC").show();
                } else if (isCheckOut == 1) { //taskcode 是模板
                    $("#ribbon_SaveTask").hide();
                    $("#ribbon_SaveEC").hide();
                }

                if (leaveReminder()) {
                    clareAllViewGlobalObj();
                    getTaskXmlByTaskCode(viewGlobalObj.appDomain, taskCode, loadTaskXml);
                    getCriteriasByECSetCode(viewGlobalObj.appDomain, ecCode, loadECXml);
               
                }
 
            });

            $("#ribbon_Close").live("click", function () {
                $("#viewSolution").toggle();
            });

            $("#ribbon_Load").live("click", function () {
                checkedTaskLength = 0; 
                copyTaskObj = [];
                getTaskCodeListByTaskType($("#txtAppDomain").val(), writeTaskObjects);

            });

            InitCashFlows();
        });
    };

    this.onXmlUpdate = function (callback) {
        callbackObj.onXmlUpdate = callback;
    };

    this.refreshGlobalObj = function (globalObj) {
        viewGlobalObj = globalObj;
    };

    this.refreshViews = function () {
        //writeToolButtons();
        getTaskCodeListByTaskType($("#txtAppDomain").val(), writeTaskObjects);
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewSolution").empty();
        $("#viewSolution").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


