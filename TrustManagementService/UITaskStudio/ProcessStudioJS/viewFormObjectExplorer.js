viewFormObjectExplorer = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    var sessionServiceBase = GlobalVariable.SessionManagementServiceUrl;
    var CashFlowStudioServiceBase = GlobalVariable.CashFlowStudioServiceUrl;

    var viewTemplate = "<div style='padding:0 5px;background:#FFF29D;height:27px'>" +
                            "<div style='float:left;height:27px;line-height:27px'><b>Object Explorer</b></div>" +
                            "<div id='ribbon_Close' class='ribbon' style='float:right'><div class='icons close'></div></div>" +
                       "</div>" +
                       "<div style='padding:5px;background:#FCFCFC;height:25px'>" +
                            "<div style='float:left;margin-right:10px'>AppDomain:&nbsp;&nbsp;<input id='txtAppDomain' type='text' value='Task' /></div>" +
                            "<div id='ribbon_Load' class='ribbon'><div class='bigicons bigsearch'></div></div>" +
                            "<div style='clear:both'></div>" +
                       "</div>" +
                       "<div id='objectTabs' style='border:none;padding:0;margin:0;'>" +
                            "<ul id='objectTabsUL'>" +
                                "<li><a href='#viewTaskObject'>Task objects</a></li>" +
                            "</ul>" +
                            "<div id='viewTaskObject' style='height:745px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                       "</div>";

    var taskLiTemplate = "<li id='taskLi' class='toolLi' actionData='{0}'><table><tr><td style='width:15px;'><div class='icons document'></div></td><td style='white-space:nowrap;'>{0}</td></tr></table></li>";
    //var ecLiTemplate = "<li id='ecLi' class='toolLi' actionData='{0}'><table><tr><td style='width:15px;'><div class='icons document'></div></td><td style='white-space:nowrap;'>{0}</td></tr></table></li>";


    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var changMenuStyle = function () {
        $("#viewTaskObject").find("#taskLi").each(function (key, value) {
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
                content += taskLiTemplate.format(response[i].CodeDictionaryCode);
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

    var getTaskCodeListByTaskType = function (appDomain, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetTaskCodeListByTaskType/" + appDomain + "/Process?r=" + Math.random() * 150;
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
   
    var regisUiEvents = function () {
        $(function () {
            $("#objectTabs").tabs();
            $('[id^=ribbon_]').each(function () {
                $(this).live("mouseover", function () {
                    $(this).attr("class", "ribbon activeRibbon");
                });
                $(this).live("mouseleave", function () {
                    $(this).attr("class", "ribbon");
                });
            });

            $("#taskLi").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#taskLi").live("dblclick", function () {
                $("#studioTabs").tabs("select", 0);
                var taskCode = $(this).attr("actionData");
                var appDomain = viewGlobalObj.appDomain;
                getTaskXmlByTaskCode(appDomain, taskCode, loadTaskXml);
            });

            $("#ribbon_Close").live("click", function () {
                $("#viewSolution").toggle();
            });

            $("#ribbon_Load").live("click", function () {
                getTaskCodeListByTaskType($("#txtAppDomain").val(), writeTaskObjects);
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
        //writeToolButtons();
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


