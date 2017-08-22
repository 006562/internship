viewFormVariableAddInExcel = function () {
    var viewTemplate = "<div style='margin-top:3px;'>" +
                          "<div id='ribbon_GetVariable' class='ribbon' title='Get Variables'><div class='bigicons bigtotable'></div></div>" +
                          "<div id='ribbon_variableToExcel' class='ribbon' title='Export variables to excel'><div class='bigicons bigtoexcel'></div></div>" +
                          "<div id='ribbon_SaveVariable' class='ribbon' title='Save variables'><div class='bigicons bigdisk'></div></div>" +
                      "</div></br></br>" +
                      "<div id=\"divVariableTable\" style='marging:0;padding:0;'></div>" +
                       "<div id='divMsg' style='display:none'></div>";

    var regisUiEvents = function () {
        renderVariableTable();
        $("#ribbon_GetVariable").live("click", function () {
            getVariableFormExcel(showVariables);
        });
        $("#ribbon_variableToExcel").live("click", function () {
            exportVarriableFromGridToExcel(rebuiltVariableData);
        });
        $("#ribbon_SaveVariable").live("click", function () {
            var $containerVariable = $("#divVariableTable");
            var handsontableVariable = $containerVariable.data('handsontable');
            var dataVariable = handsontableVariable.getData();
            saveProcessTaskContext($("#txtAppDomain").val(), $("#txtTaskCode").val(), retVariablesFromAddin(dataVariable));
        });
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewFormVariable").empty();
        $("#viewFormVariable").append(content);
        postRender();
    };

    var postRender = function () { 
            regisUiEvents(); 
    };
};


