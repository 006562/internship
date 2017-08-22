viewFormCashFlowStudioECMains = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div style='padding:5px;height:25px;line-height:25px;border-bottom:#808080 solid 2px'>" +
                           "<span style='float:left;'>Formula Organizer</span>" +
                           "<span style='float:right;'>" +
                               "<img id='ec_add' src='../img/add.png' style='margin:0 auto; vertical-align:middle'/>&nbsp;&nbsp;" +
                               "<img id='ec_remove' src='../img/remove.png' style='margin:0 auto; vertical-align:middle'/>" +
                           "</span>" +
                       "</div>" +
                       "<div id='tbMains' style='height:727px;overflow: auto;border:1px solid #808080;'></div>" +
                       //"<div style='height:10px;border-bottom:#808080 solid 1px'></div>" +
                       "";

    var viewMainTemplate = "<div id='divMain' actionData='{1}' style='cursor:default'>" +
                                "<div style='padding:5px;width:20px;height:20px;line-height:20px;float:left;border:#CCCCCC solid 1px;border-top:none;border-right:none;text-align:center'>{2}</div>" +
                                "<div style='padding:5px;min-width:230px;height:20px;line-height:20px;float:left;border:#CCCCCC solid 1px;border-top:none;white-space: nowrap'>{0}</div>" +
                                "<div class='ClearBoth'></div>" +
                           "</div>";

    var viewMainXmlTemplate = "<main>" +
                                "<Parameters>" +
                                "</Parameters>" +
                                "<Query name='EC_NewName'> " +
                                "</Query>" +
                                "<Presentation>" +
                                "</Presentation>" +
                                "</main>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var writeCriteriaMains = function () {
        var content = "";
        for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
            var query = $(viewGlobalObj.ecMainXmls[i]).find("Query");
            content += viewMainTemplate.format($(query).attr("name"), i, i + 1);
        };
        $("#tbMains").empty();
        $("#tbMains").append(content);
        setCheckedMain();
    }

    var setCheckedMain = function () {
        var maxWidth = 0;
        //var obj = null;
        $("#tbMains").find("#divMain").each(function () {
            if (parseInt($(this).find("div").eq(1).css("width")) > maxWidth) {
                maxWidth = parseInt($(this).find("div").eq(1).css("width"));
            }
            if ($(this).attr("actionData") == viewGlobalObj.ecMainIndex) {
                //obj = $(this);
                $(this).find("div").each(function () {
                    $(this).css("background", "#B7DBFF");
                });
            } else {
                $(this).find("div").each(function () {
                    $(this).css("background", "");
                });
            }
        });
        $("#tbMains").find("#divMain").each(function () {
            $(this).find("div").eq(1).css("width", maxWidth + "px");
            $(this).css("width", (maxWidth + 50) + "px");
        });
        //if (obj != null) {
        //    obj[0].scrollIntoView();
        //}
    }

    var afterOrdered = function () {
        var newEcMainXmls = [];
        var newEcMainIndex = 0;
        $("#tbMains").find("#divMain").each(function () {
            newEcMainXmls.push(viewGlobalObj.ecMainXmls[$(this).attr("actionData")]);
            if ($(this).attr("actionData") == viewGlobalObj.ecMainIndex) {
                newEcMainIndex = newEcMainXmls.length - 1;
            }
        })
        viewGlobalObj.ecMainXmls = newEcMainXmls;
        viewGlobalObj.ecMainIndex = newEcMainIndex;
        callbackObj.onXmlUpdate(viewGlobalObj, ["ECMains", "ECXml"]);
    }

    var regisUiEvents = function () {

        $(function () {
            $("#tbMains").sortable({
                cursor: "pointer",
                stop: function (event, ui) {
                    afterOrdered();
                }
            });

            $("#divMain").live("mousedown", function () {                
                viewGlobalObj.ecMainIndex = $(this).attr("actionData");
                callbackObj.onXmlUpdate(viewGlobalObj, ["ECWork"]);
                setCheckedMain();
            });

            $('#ec_add').live("click", function () {
                var addECXml = $.parseXML(viewMainXmlTemplate).getElementsByTagName("main");
                viewGlobalObj.ecMainXmls.push(addECXml);
                viewGlobalObj.ecMainIndex = viewGlobalObj.ecMainXmls.length - 1;
                callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECMains", "ECWork", "ECXml"]);
            });

            $("#ec_remove").live("click", function () {
                if (viewGlobalObj.ecMainIndex > -1) {
                    if (confirm("确定删除当前项吗？")) {
                        viewGlobalObj.ecMainXmls.splice(viewGlobalObj.ecMainIndex, 1);
                        viewGlobalObj.ecMainIndex = viewGlobalObj.ecMainIndex > 0 ? viewGlobalObj.ecMainIndex - 1 : 0;
                        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods", "ECMains", "ECWork", "ECVariables", "ECXml"]);
                    }
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
        writeCriteriaMains();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divMainsList").empty();
        $("#divMainsList").append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };

};


