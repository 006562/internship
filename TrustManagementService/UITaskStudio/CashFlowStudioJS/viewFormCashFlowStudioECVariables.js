viewFormCashFlowStudioECVariables = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div id='viewVariables' style='padding:0;'>";

    var toolGroupTemplate = "<ul>" +
                                "<li id='toolGroup'>" +
                                    "<div id='groupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                    "<div id='groupHead' style='float:left;height:25px;line-height:25px;' class='toolLi activeLi'><b>User Parameters</b></div>" +
                                    "<div class='ClearBoth'></div>" +
                                    "<ul style='margin-left:17px'>{0}</ul>" +
                                "</li>" +
                            "</ul>";

    var toolLiTemplate = "<li id='toolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap'>{0}</td></tr></table></li>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var writeECVariables = function () {
        var content = "";
        var variables = [];
        for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
            var mainXml = viewGlobalObj.ecMainXmls[i];
            $(mainXml).find("Parameters").find("Parameter").each(function (key, value) {
                if ($.inArray($(this).attr("Name"), variables) < 0) {
                    content += toolLiTemplate.format($(this).attr("Name"), "<Template>{0}</Template>".format(this.xml));
                    variables.push($(this).attr("Name"));
                }
            });
        };
        content = toolGroupTemplate.format(content);
        $("#viewVariables").empty();
        $("#viewVariables").append(content);
        $("#viewVariables").find("#toolLi").each(function () {
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

    var changMenuStyle = function () {
        $("#viewVariables").find("#toolGroup").each(function (key, value) {
            $(this).find("#groupHead").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });

            $(this).find("li").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });
        });
    }

    var regisUiEvents = function () {
        $(function () {
            $("#groupArror").live("click", function () {
                if ($(this).attr("class") == "icons triangle-1-e")
                    $(this).attr("class", "icons triangle-1-se");
                else
                    $(this).attr("class", "icons triangle-1-e");

                $(this).parent().find("ul").each(function (key, value) {
                    $(this).toggle();
                })
            });

            $("#groupHead").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#toolLi").live("mousedown", function () {
                changMenuStyle();
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
        writeECVariables();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewTaskParameters").empty();
        $("#viewTaskParameters").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


