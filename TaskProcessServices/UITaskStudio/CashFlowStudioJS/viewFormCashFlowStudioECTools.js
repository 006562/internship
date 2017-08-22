viewFormCashFlowStudioECTools = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div style='padding:5px;height:25px;line-height:25px;background-color:#fff'>Caculation Tools</div>" +
                       "<div id='ecToolTabs' style='border:none;padding:0;margin:0;'>" +
                            "<ul id='ecToolTabsUL'>" +
                                "<li><a href='#viewMetaData'>MetaData</a></li>" +
                                "<li><a href='#viewTaskVariables'>Variable</a></li>" +
                                "<li><a href='#viewTaskParameters'>Existing Parameters</a></li>" +
                                "<li><a href='#viewFunction'>Function</a></li>" +
                            "</ul>" +
                            "<div id='viewMetaData' style='height:707px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                            "<div id='viewFunction' style='height:707px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                            "<div id='viewTaskVariables' style='height:707px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                            "<div id='viewTaskParameters' style='height:707px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                       "</div>";

    var toolGroupTemplate = "<ul>" +
                                "<li id='metadataToolGroup'>" +
                                    "<div id='metadataGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                    "<div id='metadataGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi activeLi'><b>Metadata</b></div>" +
                                    "<div class='ClearBoth'></div>" +
                                    "<ul style='margin-left:17px'>{0}</ul>" +
                                "</li>" +
                            "</ul>";

    var toolLiTemplate = "<li id='metadataToolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap'>{0}</td></tr></table></li>";

    var functionGroupTemplate = "<ul>" +
                                    "<li id='functionGroup'>" +
                                        "<div id='functionGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                        "<div id='functionGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi activeLi'><b>{1}</b></div>" +
                                        "<div class='ClearBoth'></div>" +
                                        "<ul style='margin-left:17px'>{0}</ul>" +
                                    "</li>" +
                                "</ul>";
    var functionGroupTemplateDisplay = "<ul>" +
                                    "<li id='functionGroup'>" +
                                        "<div id='functionGroupArror' class='icons triangle-1-e' style='margin-top:5px;float:left'></div>" +
                                        "<div id='functionGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi'><b>{1}</b></div>" +
                                        "<div class='ClearBoth'></div>" +
                                        "<ul style='margin-left:17px;display:none'>{0}</ul>" +
                                    "</li>" +
                                "</ul>";

    var functionLiTemplate = "<li id='functionLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap'>{0}</td></tr></table></li>";

    var paramDataTemplate1 = "<Template><Parameter Name=\"NewParameterName\" SessionParameterName=\"NewParameterName\" Value=\"\" DataType=\"double\" Usage=\"CashFlow\"/></Template>";
    var paramDataTemplate2 = "<Template><Parameter Name=\"{0}\" SessionParameterName=\"\" Value=\"\" DataType=\"double\" Usage=\"CashFlow\"><Field Name=\"{0}\"><Position>CurrentPosition</Position></Field></Parameter></Template>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var writeTaskMetadatas = function () {
        var content = "";
        content += toolLiTemplate.format("NewSessionParameter", paramDataTemplate1);
        for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
            var actionXml = viewGlobalObj.taskActionXmls[i];
            var vCode = "";
            vCode = $(actionXml).attr("ActionCode");
            $(actionXml).find("Parameter").each(function (key, value) {
                if ($(this).attr("Name") == "ActionType" && $(this).attr("Value") == "CashFlow") {
                    content += toolLiTemplate.format(vCode, paramDataTemplate2.format(vCode));
                    return false;
                }
            });
        };
        content = toolGroupTemplate.format(content);
        $("#viewMetaData").empty();
        $("#viewMetaData").append(content);
        $("#viewMetaData").find("#metadataToolLi").each(function () {
            $(this).draggable({
                cursor: "default",
                helper: "clone",
                zIndex: "100",
                start: function (event, ui) {
                    viewGlobalObj.dragContext.dragType = "metadata";
                    viewGlobalObj.dragContext.dragData = $(this).attr("actionData");
                    callbackObj.onXmlUpdate(viewGlobalObj, []);
                },
                stop: function (event, ui) {
                    viewGlobalObj.dragContext.dragType = "";
                    callbackObj.onXmlUpdate(viewGlobalObj, []);
                }
            });
        })
    }

    var writeFunctions = function () {
        $.ajax({
            url: "./FunctionTemplates.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 FunctionTemplates.xml 文件出错！");
            },
            success: function (functionXML) {
                $("#viewFunction").empty();
                var groupcontent = "";
                var isFirstGroup = true;
                $(functionXML).find("Functiongruop").each(function (key, value) {
                    var groupName = $(this).attr("Name");
                    var content = "";
                    $(this).find("Function").each(function (key, value) {
                        content += functionLiTemplate.format($(this).attr("name"), $(this).find("Expression").text());
                    });
                    if (isFirstGroup) {
                        groupcontent += functionGroupTemplate.format(content, groupName);
                        isFirstGroup = false;
                    } else {
                        groupcontent += functionGroupTemplateDisplay.format(content, groupName);
                    }
                });
                $("#viewFunction").append(groupcontent);

                $("#viewFunction").find("#functionLi").each(function () {
                    $(this).draggable({
                        cursor: "default",
                        helper: "clone",
                        zIndex: "100",
                        cursorAt: { left: 0, top: 0 },
                        start: function (event, ui) {
                            viewGlobalObj.dragContext.dragType = "function";
                            viewGlobalObj.dragContext.dragData = $(this).attr("actionData");
                            callbackObj.onXmlUpdate(viewGlobalObj, []);
                        },
                        stop: function (event, ui) {
                            viewGlobalObj.dragContext.dragType = "";
                            callbackObj.onXmlUpdate(viewGlobalObj, []);
                        }
                    });
                })
            }
        });
    }

    var changMenuStyle = function () {
        $("#viewMetaData").find("#metadataToolGroup").each(function (key, value) {
            $(this).find("#metadataGroupHead").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });

            $(this).find("li").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });
        });
    }

    var changFunctionMenuStyle = function () {
        $("#viewFunction").find("#functionGroup").each(function (key, value) {
            $(this).find("#functionGroupHead").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });

            $(this).find("li").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });
        });
    }

    var regisUiEvents = function () {

        $(function () {
            $("#ecToolTabs").tabs();
            writeFunctions();
            $("#metadataGroupArror").live("click", function () {
                if ($(this).attr("class") == "icons triangle-1-e")
                    $(this).attr("class", "icons triangle-1-se");
                else
                    $(this).attr("class", "icons triangle-1-e");

                $(this).parent().find("ul").each(function (key, value) {
                    $(this).toggle();
                })
            });

            $("#metadataGroupHead").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#metadataToolLi").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#metadataToolLi").live("dblclick", function () {
                var isExists = false;
                var ecFunName = $(this).text();
                for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
                    if ($(viewGlobalObj.taskActionXmls[i]).attr("ActionCode") == ecFunName) {
                        viewGlobalObj.taskActionIndex = i;
                        isExists = true;
                        break;
                    }
                };
                if (isExists) {
                    $("#studioTabs").tabs("select", 0);
                    callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions", "TaskWork", "SimpleTaskWork"]);
                    $("#tbActions").find("#divAction").each(function () {
                        if ($(this).attr("actionData") == viewGlobalObj.taskActionIndex) {
                            $(this)[0].scrollIntoView();
                            return false;
                        }
                    });
                }
            });

            $("#functionGroupArror").live("click", function () {
                if ($(this).attr("class") == "icons triangle-1-e")
                    $(this).attr("class", "icons triangle-1-se");
                else
                    $(this).attr("class", "icons triangle-1-e");

                $(this).parent().find("ul").each(function (key, value) {
                    $(this).toggle();
                })
            });

            $("#functionGroupHead").live("mousedown", function () {
                changFunctionMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#functionLi").live("mousedown", function () {
                changFunctionMenuStyle();
                $(this).attr("class", "toolLi activeLi");
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
        writeTaskMetadatas();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divTools").empty();
        $("#divTools").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


