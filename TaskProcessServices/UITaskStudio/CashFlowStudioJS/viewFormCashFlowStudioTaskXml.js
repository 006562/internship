viewFormCashFlowStudioTaskXml = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};

    var viewTemplate = "<textarea id='txtTaskXml' style='width:1445px;height:600px'></textarea>" +
                       "<div style='padding-Top:20px;text-align:right'><input type='button' value='Apply...' id='btApplyTaskXml' /></div>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var showTaskXml = function () {
        var content = "";
        for (var i = 0; i < viewGlobalObj.taskActionXmls.length; i++) {
            $(viewGlobalObj.taskActionXmls[i]).attr("SequenceNo", i + 1);
            content += (viewGlobalObj.taskActionXmls[i])[0].xml;
        };
        content = "<Task>{0}</Task>".format(content);
        $("#txtTaskXml").val(content);
    }

    var regisUiEvents = function () {
        $(function () {
            $("#btApplyTaskXml").live("click", function () {
                var taskXml = $.parseXML($("#txtTaskXml").val());
                viewGlobalObj.taskActionXmls = [];
                $(taskXml).find("Action").each(function (key, value) {
                    viewGlobalObj.taskActionXmls.push($(this));
                });
                viewGlobalObj.taskActionIndex = 0;
                callbackObj.onXmlUpdate(viewGlobalObj, ["ECTools", "TaskActions", "TaskWork", "TaskXml", "SimpleTaskWork"]);
            });
        });
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewTaskXml").empty();
        $("#viewTaskXml").append(content);
        postRender();
    };

    this.onXmlUpdate = function (callback) {
        callbackObj.onXmlUpdate = callback;
    };

    this.refreshGlobalObj = function (globalObj) {
        viewGlobalObj = globalObj;
    };

    this.refreshViews = function () {
        showTaskXml();
    };

    var postRender = function () {
        regisUiEvents();
    };

};


