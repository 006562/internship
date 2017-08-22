viewFormCashFlowStudioTaskMethods = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var toolGroupTemplate = "<ul>" +
                                "<li id='methodToolGroup'>" +
                                    "<div id='methodGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                    "<div id='methodGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi activeLi'><b>Methods</b></div>" +
                                    "<div class='ClearBoth'></div>" +
                                    "<ul style='margin-left:17px'>{0}</ul>" +
                                "</li>" +
                            "</ul>";
 

    var toolLiTemplate = "<li id='methodToolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap'>{0}</td></tr></table></li>";

 
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var writeTaskMethods = function () {
        var content = "";
        for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
            var mainXml = viewGlobalObj.ecMainXmls[i];
            var query = $(mainXml).find("Query");
            content += toolLiTemplate.format($(query).attr("name"), $(query).attr("name"));
        };
        content = toolGroupTemplate.format(content);
        $("#viewMethod").empty();
        $("#viewMethod").append(content);
        $("#viewMethod").find("#methodToolLi").each(function () {
            $(this).draggable({
                cursor: "default",
                helper: "clone",
                zIndex: "100",
                start: function (event, ui) {
                    viewGlobalObj.dragContext.dragType = "method";
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
        $("#viewMethod").find("#methodToolGroup").each(function (key, value) {
            $(this).find("#methodGroupHead").each(function (key, value) {
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
           
            $("#methodGroupArror").live("click", function () {
                if ($(this).attr("class") == "icons triangle-1-e")
                    $(this).attr("class", "icons triangle-1-se");
                else
                    $(this).attr("class", "icons triangle-1-e");

                $(this).parent().find("ul").each(function (key, value) {
                    $(this).toggle();
                })
            });

            $("#methodGroupHead").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#methodToolLi").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#methodToolLi").live("dblclick", function () {
                var isExists = false;
                var ecFunName = $(this).text();
                for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
                    var query = $(viewGlobalObj.ecMainXmls[i]).find("Query");
                    if ($(query).attr("name") == ecFunName) {
                        viewGlobalObj.ecMainIndex = i;
                        isExists = true;
                        break;
                    }
                };
                if (isExists) {
                    $("#studioTabs").tabs("select", 1);
                    callbackObj.onXmlUpdate(viewGlobalObj, ["ECMains", "ECWork"]);
                    $("#tbMains").find("#divMain").each(function () {
                        if ($(this).attr("actionData") == viewGlobalObj.ecMainIndex) {
                            $(this)[0].scrollIntoView();
                            return false;
                        }
                    });
                }
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
        writeTaskMethods();
    };

    this.render = function () {
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


