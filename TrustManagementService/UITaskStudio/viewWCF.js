viewWCF = function (vContext) {
    vContext.name = "viewWCF";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var taskXml = vContext.model;
    var callbackObj = {};

    var viewTemplate = "<div>" +
                        "<p><textarea id='sessionFileWCF' readonly cols='200' rows='30' style='background-color: lightyellow'>$taskXml$</textarea></p>" +
                        "<p><input type='button' value='Update' id='updateWCF' /> <input type='button' value='Save' id='save' class='runTask' /></p>"
    "</div>";

    var regisUiEvents = function () {
        $(function () {
            $("#" + name + " #updateWCF").click(function () {
                taskXml = $("#" + name + " #sessionFileWCF").val();

                var objContext = {};
                objContext.obj = taskXml;
                objContext.locker = name;

                var xmlDoc = $.parseXML(taskXml)
                var taskContext = {};
                taskContext.appDomain = viewContext.appDomain;
                //taskContext.appDomain = "task";
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

            $("#" + name + " #save").click(function () {
                taskXml = $("#" + name + " #sessionFileWCF").val();

                var taskCode = '';
                var query = window.location.search.substring(1);
                var pair = query.split("=");
                if (!pair[1] || pair[1] == '') { taskCode = currentTaskCode; }
                else {
                    taskCode = pair[1];
                }
				if (taskCode == '') taskCode = 'CashFlowInput';

                var wProxy = new webProxy();
                //wProxy.updateTaskXmlByTaskCode('Task', taskCode, taskXml);
                wProxy.updateTaskXmlByTaskCode(viewContext.appDomain, taskCode, taskXml);
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
        $("#" + viewContext.viewWCFDivId).empty();
        var content = viewTemplate.replace("$taskXml$", taskXml);
        $("#" + viewContext.viewWCFDivId).append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewWCF.prototype = new viewBase();
