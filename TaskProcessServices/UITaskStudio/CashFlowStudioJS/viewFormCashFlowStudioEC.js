viewFormCashFlowStudioEC = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var sessionServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/SessionManagementService.svc/jsAccessEP/";

    var viewTemplate = "<div>" +
                             "<div id='eCTabs' style='height:800px;border:none'>" +
                                 "<ul id='ecTabsUL'>" +
                                     "<li><a href='#viewECForm'><span class='ui-icon ui-icon-video' style='float:left'></span>Caculation Form View</a></li>" +
                                     "<li><a href='#viewECXml'><span class='ui-icon ui-icon-script' style='float:left'></span>Caculation XML View</a></li>" +
                                 "</ul>" +
                                 "<div id='viewECForm' style='padding:0'>" +
                                     "<div style='float:left;width:300px;'>" +
                                         "<div id='divMainsList'></div>" +
                                         //"<div id='divTools'></div>" +
                                     "</div>" +
                                     "<div style='float:left;width:840px;'>" +
                                         "<div id='divWorkArea'></div>" +
                                     "</div>" +
                                     "<div style='float:right;width:355px;'>" +
                                         "<div id='divTools'></div>" +
                                         //"<div id='divVariablesList'></div>" +
                                     "</div>" +
                                 "</div>" +
                                 "<div id='viewECXml'>" +
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

    
    var regisUiEvents = function () {
        $(function () {
            $("#eCTabs").tabs();
            $("#ecTabsUL li").bind("click", function () {
                if ($(this).index() == 0) {
                    callbackObj.onXmlUpdate(viewGlobalObj, ["ECMains"]);
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
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewEC").empty();
        $("#viewEC").append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
