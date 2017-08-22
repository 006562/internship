viewECWCF = function (vContext) {
    vContext.name = "viewECWCF";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var ecXml = vContext.model;
    var callbackObj = {};

    var viewTemplate = "<div>" +
							"<p><textarea id='sessionFileECWCF' readonly cols='200' rows='35' style='background-color: lightyellow'>$ECXml$</textarea></p>" +
							"<p><input type='button' value='Update' id='updateECWCF' /> <input type='button' value='Save' id='saveEC' class='runTask' /></p>"
    "</div>";

    var regisUiEvents = function () {
        $(function () {
            $("#" + name + " #updateECWCF").click(function () {
                ecXml = $("#" + name + " #sessionFileECWCF").val();
                var objContext = {};
                objContext.obj = ecXml;
                objContext.locker = name;

                var xmlDoc = $.parseXML(ecXml)
                var taskContext = {};
                taskContext.appDomain = "task";
                var errorCount = 0;
                var totalCount = $(xmlDoc).find("main").length;
                $(xmlDoc).find("Query").each(function (index) {
                    taskContext.actionCode = $(this).attr('name');
                });
                callbackObj.onModelUpdate(objContext);
            });

            $("#" + name + " #saveEC").click(function () {
                taskXml = $("#" + name + " #sessionFileECWCF").val();
                var wProxy = new webProxy();
                var ecSetCodeAndName = ecCode + "/" + ecCode;
                //wProxy.updateECByECSetCodeAndECName("CashFlowScriptEquations/CashFlowScriptEquations", taskXml);
                //wProxy.updateECByECSetCodeAndECName('Task', ecSetCodeAndName, taskXml);
                wProxy.updateECByECSetCodeAndECName(viewContext.appDomain, ecSetCodeAndName, taskXml);
            });
        });
    };

    this.onModelUpdate = function (callback) {
        callbackObj.onModelUpdate = callback;
    };

    this.refresh = function (vContext) {
        viewContext = vContext;
        ecXml = vContext.model;
        this.render();
    };

    this.render = function () {
        $("#" + viewContext.viewECWCFDivId).empty();
        var content = viewTemplate.replace("$ECXml$", ecXml);
        $("#" + viewContext.viewECWCFDivId).append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewECWCF.prototype = new viewBase();
