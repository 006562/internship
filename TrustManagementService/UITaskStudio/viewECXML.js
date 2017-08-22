viewECXML = function (vContext) {
    vContext.name = "viewECXml";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var ecXml = vContext.model;
    var callbackObj = {};

    var viewTemplate = "<div>" +
							"<p><textarea id='sessionFile' cols='200' rows='35'>$ECXml$</textarea></p>" +
							"<p><input type='button' value='Update' id='update' /></p>"
    "</div>";

    var regisUiEvents = function () {
        $(function () {
            $("#" + name + " #update").click(function () {
                ecXml = $("#" + name + " #sessionFile").val();
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
        $("#" + viewContext.viewXmlDivId).empty();
        var content = viewTemplate.replace("$ECXml$", ecXml);
        $("#" + viewContext.viewXmlDivId).append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewECXML.prototype = new viewBase();
