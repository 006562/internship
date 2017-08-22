viewFormCashFlowStudioTask = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    var sessionServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/SessionManagementService.svc/jsAccessEP/";
    var $sliderMoving = false;

    var viewTemplate = "<div>" +
                            "<div id='divVariablePannel' style='display:none;margin:0'></div>" +
                            "<div id='divActionNameEdit' style='display:none;margin:0'></div>" +
                            "<div id='taskTabs' style='height:800px;border:none'>" +
                                "<ul id='taskTabsUL'>" +
                                    "<li><a href='#viewTaskForm'><span class='ui-icon ui-icon-video' style='float:left'></span>Task Form View</a></li>" +
                                    "<li><a href='#viewTaskXml'><span class='ui-icon ui-icon-script' style='float:left'></span>Task XML View</a></li>" +
                                "</ul>" +
                                "<div id='viewTaskForm' style='padding:0'>" +
                                    "<div style='float:left;width:300px;'>" +
                                        "<div id='divTaskToolList'></div>" +
                                        "<div id='divTaskMethodList'>" +
                                        "<div style='padding:5px;height:25px;line-height:25px;'>Task Tools</div>" +
                                        "<div id='taskMethodTabs' style='border:none;padding:0;margin:0;'>" +
                                            "<ul id='taskMethodTabsUL'>" +
                                                "<li><a href='#viewMethod'>Method</a></li>" +
                                                "<li><a href='#viewTaskVariables'>Variable</a></li>" +
                                                "<li><a href='#viewTaskRanges'>Ranges</a></li>" +
                                            "</ul>" +
                                            "<div id='viewMethod' style='height:307px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                                            "<div id='viewTaskVariables' style=' height:307px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                                            "<div id='viewTaskRanges' style='height:307px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>" +
                                        "</div>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div style='float:left;width:1190px;'>" +
                                        "<div id='divActionsList'></div>" +
                                    "</div>" +
                                    "<div id='divS' class='gf_s'></div>" +
                                    "<div id='divSG' class='gf_s_g'></div>" +
                                    "<div id='divContent' style='float:left;width:500px;display:none;'>" +
                                         "<div id='divSimpleActionWork' style='display:none;'></div>" +
                                         "<div id='divActionWorkArea' style='display:none;'></div>" +
                                    "</div>" +
                                "</div>" +
                                "<div id='viewTaskXml'>" +
                                "</div>" +
                            "</div>" +
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
 
    //分隔条幽灵左右拖动(mousemove)
    var sliderGhostMoving = function (e) {
        var parentLeft = $("#studioTabs").position().left;
        $("#divSG").css({ left: globalObj.mousePosition(e).x - parentLeft, display: "block" });

    };

    //完成分隔条左右拖动(mouseup)
    var sliderHorizontalMove = function (e) {
        var yLeft = globalObj.getElCoordinate($("#divS")[0]).left;
        var cLeft = globalObj.getElCoordinate($("#divSG")[0]).left;
        var lWidth = parseInt($("#divActionsList").parent().css("width")) + (cLeft - yLeft);
        var rWidth = parseInt($("#divContent").css("width")) - (cLeft - yLeft);
        $("#divContent").css("width", rWidth + "px");
        $("#divActionsList").parent().css("width", lWidth + "px");
        $("#divSG").css("display", "none");
    };

    var regisUiEvents = function () {
        $(function () {
            $("#taskTabs").tabs();
            $("#taskTabsUL li").bind("click", function () {
                if ($(this).index() == 0) {
                    callbackObj.onXmlUpdate(viewGlobalObj, ["TaskActions"]);
                }
            });

            $("#divS").live("mousedown", function (e) {
                $sliderMoving = true;
                $("viewTaskForm").css("cursor", "e-resize");
            });

            $("#viewTaskForm").live("mousemove", function (e) {
                if ($sliderMoving) {
                    sliderGhostMoving(e); return false;
                }
            });

            $("#viewTaskForm").live("mouseup", function (e) {
                if ($sliderMoving) {
                    $sliderMoving = false;
                    sliderHorizontalMove(e);
                    $("#viewTaskForm").css("cursor", "default");
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
        //writeMain();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewTask").empty();
        $("#viewTask").append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
