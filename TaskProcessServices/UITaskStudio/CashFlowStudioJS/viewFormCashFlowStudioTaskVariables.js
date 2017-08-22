viewFormCashFlowStudioTaskVariables = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var toolVariableGroupTemplate = "<ul>" +
                                        "<li id='variableToolGroup'>" +
                                            "<div id='variableGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                            "<div id='variableGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi activeLi'><b>Variables</b></div>" +
                                            "<div class='ClearBoth'></div>" +
                                            "<ul style='margin-left:17px'>{0}</ul>" +
                                        "</li>" +
                                    "</ul>";
 
    var toolVariableLiTemplate = "<li id='variableToolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap'>{0}</td></tr></table></li>";
    var paramDataTemplate1 = "<Template><Parameter Name=\"{0}\" SessionParameterName=\"{0}\" Value=\"\" DataType=\"double\" Usage=\"CashFlow\"/></Template>";

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
        var contentCashFlow = "";
        var cStr = viewGlobalObj.variableJson; 
        $("[id=viewTaskVariables]").empty();
        $("[id=viewCashFlowVariables]").empty();
        if (cStr != "" && cStr != undefined) {
            var variableXml = $.parseXML(cStr);
            $(variableXml).find("SessionVariable").each(function (key, value) {
                contentCashFlow += toolVariableLiTemplate.format(($($(this).find("Name"))).text(), paramDataTemplate1.format(($($(this).find("Name"))).text()));
                content += toolVariableLiTemplate.format(($($(this).find("Name"))).text(), ($($(this).find("Name"))).text());
            });
            content = toolVariableGroupTemplate.format(content);
            contentCashFlow = toolVariableGroupTemplate.format(contentCashFlow);

            var divList = $.find("[id=viewTaskVariables]");
            $.each(divList, function () {
                if ($(this.parentElement).attr("id") == "taskMethodTabs") {
                    $(this).append(content);
                }
                else {
                    $(this).append(contentCashFlow);
                }
            })
            
            $("[id=viewTaskVariables]").find("#variableToolLi").each(function () {
                $(this).draggable({
                    cursor: "default",
                    helper: "clone",
                    zIndex: "100",
                    start: function (event, ui) {
                        viewGlobalObj.dragContext.dragType = "taskVariable";
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
        $("[id=viewTaskVariables]").find("#variableToolGroup").each(function (key, value) {
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
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


