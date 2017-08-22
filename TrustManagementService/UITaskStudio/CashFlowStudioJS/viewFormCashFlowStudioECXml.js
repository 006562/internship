viewFormCashFlowStudioECXml = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<textarea id='txtECXml' style='width:1445px;height:600px'></textarea>" +
                       "<div style='padding-Top:20px;text-align:right'><input type='button' value='Apply...' id='btApplyECXml' /></div>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var showECXml = function () {
        var content = "";
        for (var i = 0; i < viewGlobalObj.ecMainXmls.length; i++) {
            content += (viewGlobalObj.ecMainXmls[i])[0].xml;
        };
        content = "<Methods>{0}</Methods>".format(content);
        $("#txtECXml").val(content);
    }

    var regisUiEvents = function () {
        $(function () {
            $("#btApplyECXml").live("click", function () {
                var ecXml = $.parseXML($("#txtECXml").val());
                viewGlobalObj.ecMainXmls = [];
                $(ecXml).find("main").each(function (key, value) {
                    viewGlobalObj.ecMainXmls.push($(this));
                });
                viewGlobalObj.ecMainIndex = 0;
                callbackObj.onXmlUpdate(viewGlobalObj, ["ECMains", "ECWork", "ECVariables", "TaskMethods"]);
            });
        });
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewECXml").empty();
        $("#viewECXml").append(content);
        postRender();
    };

    this.onXmlUpdate = function (callback) {
        callbackObj.onXmlUpdate = callback;
    };

    this.refreshGlobalObj = function (globalObj) {
        viewGlobalObj = globalObj;
    };

    this.refreshViews = function () {
        showECXml();
    };

    var postRender = function () {
        regisUiEvents();
    };

};


