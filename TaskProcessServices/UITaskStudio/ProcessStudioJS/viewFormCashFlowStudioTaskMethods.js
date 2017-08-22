viewFormCashFlowStudioTaskMethods = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div style='padding:5px;height:25px;line-height:25px;'>Task Variables</div>" +
                       "<div id='taskMethodTabs' style='border:none;padding:0;margin:0;'>" +
                            "<ul id='taskMethodTabsUL'>" +
                                "<li><a href='#viewVariables'>Variable</a></li>" +
                            "</ul>" +
                            "<div id='viewVariables' style=' height:307px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>";
                       "</div>";

    var toolVariableGroupTemplate = "<ul>" +
                                        "<li id='variableToolGroup'>" +
                                            "<div id='variableGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                            "<div id='variableGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi activeLi'><b>Variables</b></div>" +
                                            "<div class='ClearBoth'></div>" +
                                            "<ul style='margin-left:17px'>{0}</ul>" +
                                        "</li>" +
                                    "</ul>";

    var toolVariableLiTemplate = "<li id='variableToolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap'>{0}</td></tr></table></li>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var writeTaskVariables = function () {
        var content = "";
        var cStr = viewGlobalObj.variableJson;
        $("#viewVariables").empty();
        if (cStr != "" && cStr != undefined) {
            var variableXml = $.parseXML(cStr);
            $(variableXml).find("SessionVariable").each(function (key, value) {
                content += toolVariableLiTemplate.format(($($(this).find("Name"))).text(), ($($(this).find("Name"))).text());
            });
            content = toolVariableGroupTemplate.format(content);
            $("#viewVariables").append(content);
            $("#viewVariables").find("#variableToolLi").each(function () {
                $(this).draggable({
                    cursor: "default",
                    helper: "clone",
                    zIndex: "100",
                    start: function (event, ui) {
                        viewGlobalObj.dragContext.dragType = "variable";
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
    }
    
    var changVariableStyle = function () {
        $("#viewVariables").find("#variableToolGroup").each(function (key, value) {
            $(this).find("#variableGroupHead").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });

            $(this).find("li").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });
        });
    }

    var regisUiEvents = function () {

        $(function () {
            $("#taskMethodTabs").tabs();
            
            $("#variableGroupArror").live("click", function () {
                if ($(this).attr("class") == "icons triangle-1-e")
                    $(this).attr("class", "icons triangle-1-se");
                else
                    $(this).attr("class", "icons triangle-1-e");

                $(this).parent().find("ul").each(function (key, value) {
                    $(this).toggle();
                })
            });

            $("#variableGroupHead").live("mousedown", function () {
                changVariableStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#variableToolLi").live("mousedown", function () {
                changVariableStyle();
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
        writeTaskVariables();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divTaskMethodList").empty();
        $("#divTaskMethodList").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


