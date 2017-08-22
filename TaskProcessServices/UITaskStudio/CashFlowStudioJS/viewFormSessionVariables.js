viewFormSessionVariables = function (viewGlobalObj) {
    var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";

    var viewTemplate = "<div id=\"divRibon\" style='height:30px;border:1px solid #808080;border-bottom:none'>" +
                        "<div id='ribbon_SaveVariables' class='ribbon' title='Save'><div class='bigicons bigdisk'></div></div>" +
                        "<div id='ribbon_RefreshVariables' class='ribbon' title='Refresh'><div class='bigicons bigrefresh'></div></div>" +
                       "</div>" +
                       "<div id=\"divVariableTable\" style='height:100%;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>";

    var regisUiEvents = function () {
        $(function () {
            riboonTool();

            $("#ribbon_SaveVariables").live("click", function () {
                var $container = $("#divVariableTable");
                var handsontable = $container.data('handsontable');
                var data = handsontable.getData();
                saveProcessTaskContext(viewGlobalObj.appDomain, viewGlobalObj.taskCode, retVariables(data));
                window.returnValue = true;
            });

            $("#ribbon_RefreshVariables").live("click", function () {
                getTaskSessionContextByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, showVariablesXML);
            });
        });
    };


    this.render = function () {
        var content = viewTemplate;
        $("#divVariablePannel").empty();
        $("#divVariablePannel").append(content);
        postRender();
    };


    var postRender = function () {
        if (viewGlobalObj != undefined && viewGlobalObj.taskCode != "") {
            getTaskSessionContextByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, showVariablesXML);
            regisUiEvents();
        } else {
            showVariablesXML();
        }
    };

};


