viewFormCashFlowStudioSimpleTaskActions = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div style='padding:5px;height:25px;line-height:25px;border-bottom:#808080 solid 2px'>" +
                           "<span style='float:left;'>Task Organizer</span>" +
                       "</div>" +
                       "<div id='tbSimpleActions' style='height:728px;overflow: auto;border:1px solid #808080;'></div>" +
                       "";

    var viewActionTemplate = "<div id='divSimpleAction'  actionData='{1}'  style='cursor:default;'>" +
                                "<div style='padding:5px;width:20px;height:20px;line-height:20px;float:left;border:#CCCCCC solid 1px;border-top:none;border-right:none;text-align:center'>{2}</div>" +
                                "<div style='padding:5px;min-width:230px;height:20px;line-height:20px;float:left;border:#CCCCCC solid 1px;border-top:none;white-space: nowrap'>{0}</div>" +
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
        content = viewActionTemplate.format($(viewGlobalObj.dragContext.dragData).attr("ActionDisplayName"), viewGlobalObj.taskActionXmls.length - 1, viewGlobalObj.taskActionXmls.length);
        var divClone = $("#tbSimpleActions").find("li").eq(0);
        $(divClone).after(content);
        $(divClone).remove();

        //$("#tbActions").append(content);
    }

    var writeTaskActions = function () {
        var content = "";

        for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
            content += viewActionTemplate.format($(viewGlobalObj.taskActionXmls[i]).attr("ActionDisplayName"), i, i + 1);
        };
        $("#tbSimpleActions").empty();
        $("#tbSimpleActions").append(content);
        setCheckedAction();
    }

    var setCheckedAction = function () {
        var maxWidth = 0;
        $("#tbSimpleActions").find("#divSimpleAction").each(function () {
            if (parseInt($(this).find("div").eq(1).css("width")) > maxWidth) {
                maxWidth = parseInt($(this).find("div").eq(1).css("width"));
            }
            if ($(this).attr("actionData") == viewGlobalObj.taskActionIndex) {
                $(this).find("div").each(function () {
                    $(this).css("background", "#B7DBFF");
                });
            } else {
                $(this).find("div").each(function () {
                    $(this).css("background", "");
                });
            }
        });
        $("#tbSimpleActions").find("#divSimpleAction").each(function () {
            $(this).find("div").eq(1).css("width", maxWidth + "px");
            $(this).css("width", (maxWidth + 50) + "px");
        });
    }

    var afterOrdered = function () {
        var newTaskActionXmls = [];
        var newTaskActionIndex = 0;
        $("#tbSimpleActions").find("#divSimpleAction").each(function () {
            newTaskActionXmls.push(viewGlobalObj.taskActionXmls[$(this).attr("actionData")]);
            if ($(this).attr("actionData") == viewGlobalObj.taskActionIndex) {
                newTaskActionIndex = newTaskActionXmls.length - 1;
            }
        })
        viewGlobalObj.taskActionXmls = newTaskActionXmls;
        viewGlobalObj.taskActionIndex = newTaskActionIndex;
        callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools","TaskActions","TaskWork","SimpleTaskActions", "TaskXml"]);
    }

    var regisUiEvents = function () {

        $(function () {
            $("#tbSimpleActions").sortable({
                cursor: "pointer",
                stop: function (event, ui) {
                    if (viewGlobalObj.dragContext.dragType == "action") {
                        writeNewAction();
                    }
                    afterOrdered();
                }
            });

            $("#divSimpleAction").live("mousedown", function () {
                viewGlobalObj.taskActionIndex = $(this).attr("actionData");
                callbackObj.onXmlUpdate(viewGlobalObj, ["SimpleTaskWork", "TaskActions", "TaskWork"]);
                setCheckedAction();
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
        $("#divSimpleActionsList").empty();
        $("#divSimpleActionsList").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


