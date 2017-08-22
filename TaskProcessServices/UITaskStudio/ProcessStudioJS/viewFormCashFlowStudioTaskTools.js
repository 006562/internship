viewFormCashFlowStudioTaskTools = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div style='padding:5px;height:25px;line-height:25px;border-bottom:#808080 solid 2px'>Action Templates</div>" +
                       "<div id='viewActionTemplates' style='height:350px;overflow: auto;border:1px solid #808080;'></div>" +
                       "<div style='height:10px;border-bottom:#808080 solid 1px'></div>" +
                       "";

    var toolGroupTemplate = "<ul>" +
                                "<li id='actionGroup'>" +
                                    "<div id='actionGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                    "<div id='actionGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi'><b>{1}</b></div>" +
                                    "<div class='ClearBoth'></div>" +
                                    "<ul style='margin-left:17px'>{0}</ul>" +
                                "</li>" +
                            "</ul>";

    var toolLiTemplate = "<li id='actionToolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap;'>{0}</td></tr></table></li>";


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
        $("#viewActionTemplates").find("#actionGroup").each(function (key, value) {
            $(this).find("#actionGroupHead").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });

            $(this).find("li").each(function (key, value) {
                $(this).attr("class", "toolLi");
            });
        });
    }

    var firstLoadStyle = function () {
        $("#viewActionTemplates").find("#actionGroup").eq(0).find("#actionGroupHead").eq(0).attr("class", "toolLi activeLi");
    }

    var writeToolButtons = function () {
        $.ajax({
            url: "./ProcessActionTemplates.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 ProcessActionTemplates.xml 文件出错！");
            },
            success: function (toolButtonXML) {
                $("#viewActionTemplates").empty();
                var content = "";
                $(toolButtonXML).find("Tools").each(function (key, value) {
                    var groupName = $(this).attr("Name");
                    var aContent = "";
                    $(this).find("Action").each(function (key, value) {
                        aContent += toolLiTemplate.format($(this).attr("ActionDisplayName"), this.xml);
                    });
                    content += toolGroupTemplate.format(aContent, groupName);
                });

                $("#viewActionTemplates").append(content);

                firstLoadStyle();

                $("#viewActionTemplates").find("#actionToolLi").each(function () {
                    $(this).draggable({
                        cursor: "default",
                        connectToSortable: "#tbActions",
                        helper: "clone",
                        zIndex: "100",
                        start: function (event, ui) {
                            viewGlobalObj.dragContext.dragType = "action";
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

    var regisUiEvents = function () {
        $(function () {
            writeToolButtons();
            $("#actionGroupArror").live("click", function () {
                if ($(this).attr("class") == "icons triangle-1-e")
                    $(this).attr("class", "icons triangle-1-se");
                else
                    $(this).attr("class", "icons triangle-1-e");

                $(this).parent().find("ul").each(function (key, value) {
                    $(this).toggle();
                })
            });

            $("#actionGroupHead").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#actionToolLi").live("mousedown", function () {
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
        writeToolButtons();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divTaskToolList").empty();
        $("#divTaskToolList").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


