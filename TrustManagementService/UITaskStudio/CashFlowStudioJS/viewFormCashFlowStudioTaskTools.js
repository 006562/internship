viewFormCashFlowStudioTaskTools = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<div style='padding:5px;height:25px;line-height:25px;'>CashFlow Tools</div>" +
                           "<div id='actionTempleteTabs' style='border:none;padding:0;margin:0;'>" +
                              "<ul id='actionTempleteTabsUL'>" +
                                  "<li><a href='#viewActionTemplates'>Single</a></li>" +
                                  "<li><a href='#combinationActionTemplates'>Combination</a></li>" +
                               "</ul>" +
                                   "<div id='viewActionTemplates' style='height:341px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                                   "<div id='combinationActionTemplates' style='height:341px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                         "</div>";

    var toolGroupTemplate = "<ul>" +
                                "<li id='actionGroup'>" +
                                    "<div id='actionGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                    "<div id='actionGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi'><b>{1}</b></div>" +
                                    "<div class='ClearBoth'></div>" +
                                    "<ul style='margin-left:17px'>{0}</ul>" +
                                "</li>" +
                            "</ul>";

    var toolLiTemplate = "<li id='actionToolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap;'>{0}</td></tr></table></li>";

    var CombinationActionTemplate = "<ul>" +
                                      "<li id='combinationActionGroup' >" +
                                          "<div id='combinationActionGroupArror' class='icons triangle-1-se' style='margin-top:5px;float:left'></div>" +
                                          "<div id='combinationActionGroupHead' style='float:left;height:25px;line-height:25px;' class='toolLi'><b>{1}</b></div>" +
                                          "<div class='ClearBoth'></div>" +
                                          "<ul style='margin-left:17px'>{0}</ul>" +
                                      "</li>"
                                    "</ul>";

    var combinationActiontoolLiTemplate = "<li id='combinationActionToolLi' class='toolLi' actionData='{1}'><table><tr><td style='width:15px;'><div class='icons note'></div></td><td style='white-space:nowrap;'>{0}</td></tr></table></li>";


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

    var changCombinationActionStyle = function () {
        $("#combinationActionTemplates").find("#combinationActionGroup").each(function (key, value) {
            $(this).find("#combinationActionGroupHead").each(function (key, value) {
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

    var combinationfirstLoadStyle = function () {
        $("#combinationActionTemplates").find("#combinationActionGroup").eq(0).find("#combinationActionGroupHead").eq(0).attr("class", "toolLi activeLi");
    }

    var writeToolButtons = function () {
        $.ajax({
            url: "./ActionTemplates.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 ActionTemplates.xml 文件出错！");
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
                        connectToSortable: "div[name='divItemType']",//#tbDirectInput,#tbCalculated,#tbExport
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

    var writeCombinationActions = function () {
        $.ajax({
            url: "./CombinationActionTemplate.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 CombinationActionTemplate.xml 文件出错！");
            },
            success: function (CombActionXML) {
                $("#combinationActionTemplates").empty();
                var content = "";
                $(CombActionXML).find("Tools").each(function (key, value)  //get tools
                {
                    var newTaskActionIndex = 0;
                    var groupName = $(this).attr("Name");
                    var templatesShowcontent = "";
                    $(this).find("Tool").each(function (key, value) {
                        var templateTypeName = $(this).attr("Name");
                        viewGlobalObj.combinationActionXmls.push(this.xml);
                        templatesShowcontent += combinationActiontoolLiTemplate.format(templateTypeName, newTaskActionIndex++);
                    });
                    content += CombinationActionTemplate.format(templatesShowcontent, groupName);
                });
                $("#combinationActionTemplates").append(content);
                combinationfirstLoadStyle();
                $("#combinationActionTemplates").find("#combinationActionToolLi").each(function ()
                {
                    $(this).draggable({
                        cursor: "default",
                        connectToSortable: "div[name='divItemType']",//#tbDirectInput,#tbCalculated,#tbExport
                        helper: "clone",
                        zIndex: "100",
                        start: function (event, ui) {
                            viewGlobalObj.dragContext.dragType = "combaction";
                            viewGlobalObj.dragContext.dragData = $(this).attr("actionData");
                            callbackObj.onXmlUpdate(viewGlobalObj, []);
                        },
                        stop: function (event, ui) {
                            viewGlobalObj.dragContext.dragType = "";
                            callbackObj.onXmlUpdate(viewGlobalObj, []);
                        }
                    })
                });
                //})
            }
        });
    }

    var regisUiEvents = function () {
        $(function () {
            $("#actionTempleteTabs").tabs();
            writeToolButtons();
            writeCombinationActions();
            $("#actionGroupArror").live("click", function () {
                if ($(this).attr("class") == "icons triangle-1-e")
                    $(this).attr("class", "icons triangle-1-se");
                else
                    $(this).attr("class", "icons triangle-1-e");

                $(this).parent().find("ul").each(function (key, value) {
                    $(this).toggle();
                })
            });

            $("#combinationActionGroupArror").live("click", function () {
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

            $("#combinationActionGroupHead").live("mousedown", function () {
                changCombinationActionStyle();
                $(this).attr("class", "toolLi activeLi");
            });


            $("#actionToolLi").live("mousedown", function () {
                changMenuStyle();
                $(this).attr("class", "toolLi activeLi");
            });

            $("#combinationActionToolLi").live("mousedown", function () {
                changCombinationActionStyle();
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
        writeCombinationActions();
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


