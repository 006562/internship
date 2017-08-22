viewXML = function (vContext) {
    vContext.name = "viewXml";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var taskXml = vContext.model;
    var callbackObj = {};

    var viewTemplate = "<div>" +
							"<p><textarea id='sessionFile' cols='200' rows='30'>$taskXml$</textarea></p>" +
							"<p><input type='button' value='Update' id='update' /> <input type='button' value='Run Task' class='runTask' /></p>"
    "</div>";

    var regisUiEvents = function () {
        $(function () {
            $("#" + name + " #update").click(function () {
                taskXml = $("#" + name + " #sessionFile").val();

                var objContext = {};
                objContext.obj = taskXml;
                objContext.locker = name;

                var xmlDoc = $.parseXML(taskXml)
                var taskContext = {};
                taskContext.appDomain = vContext.appDomain;
                var errorCount = 0;
                var totalCount = $(xmlDoc).find("Action").length;
                $(xmlDoc).find("Action").each(function (index) {
                    taskContext.actionCode = $(this).attr('ActionCode');
                    var actionCodeValidationObj = new webProxy();
                    var isNewActionCodeResult = actionCodeValidationObj.isNewActionCode(taskContext, function (response) {
                        if (response == true) {
                            errorCount++;
                        }
                        //check errorCount in last loop, only alert once 
                        if (index === totalCount - 1 && errorCount > 0) {
                            alert("One or more action code is new, please enter this in CodeDictionary first");
                        }
                    });
                });
                callbackObj.onModelUpdate(objContext);
            });

            $("#" + name + " .runTask").click(function () {
                taskXml = $("#" + name + " #sessionFile").val();
                document.getElementById("taskProcessIndicator").Content.SL_Agent.InitByTaskFile(viewContext.appDomain, taskXml,"TaskProcess");
                //callbackObj.onModelUpdate(objContext);
            });
        });
    };

    this.onModelUpdate = function (callback) {
        callbackObj.onModelUpdate = callback;
    };

    this.refresh = function (vContext) {
        viewContext = vContext;
        taskXml = vContext.model;
        this.render();
    };

    this.render = function () {

        $("#" + viewContext.viewXmlDivId).empty();
        var content = viewTemplate.replace("$taskXml$", taskXml);
        $("#" + viewContext.viewXmlDivId).append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewXML.prototype = new viewBase();
