var viewFormAddInExcel = function () {
    var rangeObj = new viewFormRangeAddInExcel();
    var variableObj = new viewFormVariableAddInExcel();
    var resultObj = new viewFormResultToExcel();

    var LoadALLTextList = function () {
        getTaskCodeListByTaskType($("#txtAppDomain").val(), taskObjects);
        $("#txtTaskCode").autocomplete({
            minLength: 0,
            source: taskCodeList,
            focus: function( event, ui ) {
                $("#txtTaskCode").val(ui.item.label);
                $("#txtCalulation").val(ui.item.value);
                return false;
            },
            select: function( event, ui ) {
                $("#txtTaskCode").val(ui.item.label);
                $("#txtCalulation").val(ui.item.value);
                return false;
            }
        })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
              .append("<a>" + item.label + "</a>")
              .appendTo(ul);
        };
    }

    var regisUiEvents = function () {
        $("#addinTabs").tabs();
        rangeObj.render();
        variableObj.render();
        resultObj.render();
        riboonTool();
        LoadALLTextList();

        //$("#ribbon_GetVariable").live("click", function () {
        //    $("#addinTabs").tabs("select", 0);
        //    getVariableFormExcel(showVariables);
        //});

        //$("#ribbon_GetRange").live("click", function () {
        //    $("#addinTabs").tabs("select", 1);
        //    getRangeFormExcel(showArrays);
        //});

        $("#ribbon_Load").live("click", function () {
            getTaskSessionContextByTaskCode($("#txtAppDomain").val(), $("#txtTaskCode").val(), showVariableByXml);
            getProcessTaskArrayByTaskCode($("#txtAppDomain").val(), $("#txtTaskCode").val(), showArrays);
        });

        //$("#ribbon_Save").live("click", function () {
        //    var $containerVariable = $("#divVariableTable");
        //    var handsontableVariable = $containerVariable.data('handsontable');
        //    var dataVariable = handsontableVariable.getData();
        //    saveTaskSessionVariable($("#txtAppDomain").val(), $("#txtTaskCode").val(), retVariables(dataVariable));

        //    var $containerArray = $("#divArrayTable");
        //    var handsontableArray = $containerArray.data('handsontable');
        //    var dataArray = handsontableArray.getData();
        //    saveProcessTaskArray($("#txtAppDomain").val(), $("#txtTaskCode").val(), retArrays(dataArray));
        //});

        $("#ribbon_Run").bind("click", function () {
            var url = location.protocol + "//" + location.host + "/TaskProcessServices/UITaskStudio/CashFlowAddInExcelRunTask.html?r=" + Math.random() * 150;
            var obj = new Object();
            obj.appDomain = $("#txtAppDomain").val();
            obj.taskCode = $("#txtTaskCode").val();
            obj.criteriaSetCode = $("#txtCalulation").val();
            obj.variableObj = $("#divVariableTable").data('handsontable').getData();
            obj.arrayObj = $("#divArrayTable").data('handsontable').getData();

            if (obj.taskCode != "" && obj.variableObj.length > 0) {
                sessionID = window.showModalDialog(url, obj, "dialogWidth:610px;dialogHeight:460px;resizable:no;scroll:no;");
            }
        });

        //$("#ribbon_Result").live("click", function () {
        //    $("#addinTabs").tabs("select", 2);
        //    getCaskFlowRunResultBySessionId(appDomain, sessionID, showResults);
        //});

        //$("#ribbon_OutExcel").live("click", function () {
        //    exportDataFromGridToExcel(rebuiltData);
        //});

        $("#ribbon_OpenStudio").live("click", function () {
            appDomain = $("#txtAppDomain").val();
            taskCode = $("#txtTaskCode").val();
            var url = location.protocol + "//" + location.host + "/TaskProcessServices/UITaskStudio/CashFlowStudio.html?appDomain=" + appDomain + "&taskCode=" + taskCode + "&sessionId=" + sessionID + "&r=" + Math.random() * 150;
            window.open(url);
        });

        $("input[name='grouptxt']").each(function () {
            var default_value = this.value;
            $(this).focus(function () {
                if (this.value == default_value)
                    this.value = '';
            });
            $(this).blur(function () {
                if (this.value == '')
                    this.value = default_value;
            });
        });

    };

    this.InItAddIn = function () {
        regisUiEvents();
    };
  
};