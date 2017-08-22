viewFormResultToExcel = function () {
    var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";

    var viewTemplate = "<div style='margin-top:3px;'>" +
                          "<div id='ribbon_Result' class='ribbon' title='Get results from database'><div class='bigicons bigcomment'></div></div>" +
                          "<div id='ribbon_resultToExcel' class='ribbon' title='Export result to excel'><div class='bigicons bigtoexcel'></div></div>" +
                      "</div></br></br>" +
                      "<div id=\"divResultTable\" style='marging:0;padding:0;'></div>";

    var getLastRunSessionIdByTaskCode = function (appDomain, code, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetLastRunSessionIdByTaskCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    };

    var regisUiEvents = function () {
        renderResultTable();
        $("#ribbon_Result").live("click", function () {
            if (sessionID == "") {
                if ($("#txtTaskCode").val() != "") {
                    getLastRunSessionIdByTaskCode($("#txtAppDomain").val(), $("#txtTaskCode").val(), function (response) {
                        sessionID = response;
                        getCaskFlowRunResultBySessionId($("#txtAppDomain").val(), sessionID, showResults);
                    })
                }
            } else {
                getCaskFlowRunResultBySessionId($("#txtAppDomain").val(), sessionID, showResults);
            }            
        });

        $("#ribbon_resultToExcel").live("click", function () {
            exportDataFromGridToExcel(rebuiltData);
        });
    };
    
    this.render = function () {
        var content = viewTemplate;
        $("#viewFormResult").empty();
        $("#viewFormResult").append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};


