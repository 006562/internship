viewForm = function (vContext) {
    vContext.name = "viewForm";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var taskXml = vContext.model;
    var callbackObj = {};

    var xmlDoc = $.parseXML(taskXml);

    var viewTemplate = "<div>" +
						    "<div class='actions'>$viewForm$</div>" +
						    "<div id='addNewAction' class='pointer'><img src='../img/add.png' alt='Add Action' /><span> Add Action</span></div>" +
						    "<div class='updateButton'><input type='button' value='Update' class='update' /></div>" +
						"</div>";
    var actionTemplate = "<div class='action'>" +
                            "<div class='actionHeader'>" +
                                "<div class='actionHeaderElement'>ActionCode</div>" +
                                "<div class='actionHeaderElement'>ActionDisplayName</div>" +
                                "<div class='actionHeaderElement'>FunctionName</div>" +
                                "<div class='actionHeaderElement'>SequenceNo</div>" +
                            "</div>" +
                            "<div class='ClearBoth'></div>" +
							"<div class='actionElement'>" + 
                                "<img src='../img/remove.png' alt='Remove Action' id='removeAction' /> " +
                                "<input type='text' value='$actionCode$' class='actionCode'>" +
                            "</div>" +
							"<div class='actionElement'><input type='text' value='$actionDisplayName$'></div>" +
							"<div class='actionElement'><input type='text' value='$functionName$'></div>" +
							"<div class='actionElement'><input type='text' value='$sequenceNo$'></div>" +
                            "<div class='ClearBoth'></div>" +
                            "<div class='paramHeader'>" +
                                "<div class='paramHeaderElement padLeft24'>Name</div>" + 
                                "<div class='paramHeaderElement'>SessionParameterName</div>" +
                                "<div class='paramHeaderElement'>Value</div>" +
                                "<div class='paramHeaderElement'>DataType</div>" +
                                "<div class='paramHeaderElement'>Usage</div>" +
                            "</div>" +
                            "<div class='ClearBoth'></div>" +
							"<div class='params'>$Params$</div>" +
                            "<div class='padLeft14'>" +
                                "<div class='addParam pointer'><img src='../img/add.png' alt='Add Parameter' /><span> Add Parameter</span></div>" + 
                            "</div>" +
                            "<div class='separator'></div>" +
                        "</div>";
    var paramTemplate = "<div class='param'>" +
                            "<div class='paramElement'>" + 
                                "<img src='../img/remove.png' alt='Remove Parameter' id='removeAction' /> " +
							    "<input type='text' value='$pname$'>" +
                            "</div>" +
							"<div class='paramElement'><input type='text' value='$pSessionParameterName$'></div>" +
							"<div class='paramElement'><input type='text' value='$pvalue$'></div>" +
							"<div class='paramElement'><input type='text' value='$pDataType$'></div>" +
							"<div class='paramElement'><input type='text' value='$pUsage$'></div>" +
                            "<div class='ClearBoth'></div>" +
						"</div>";

    var regisUiEvents = function () {
        $(function () {
            // update event
            $("#" + name + " .update").click(function () {
                taskXml = assembleTaskXml();

                var objContext = {};
                objContext.obj = taskXml;
                objContext.locker = name;
                callbackObj.onModelUpdate(objContext);
            });

            // add new action
            $("#" + name + " #addNewAction").click(function () {
                var newActionContent = getActionContent("", "", "", "");
                var newParamContent = getParamContent("", "", "", "", "");
                newActionContent = newActionContent.replace("$Params$", newParamContent);
                $("#" + name + " .actions").append(newActionContent);

                $(".addParam").unbind('click');
                $(".addParam").click(function () {
                    var newParamContent = getParamContent("", "", "", "", "");
                    $(this).parent().siblings('.params').append(newParamContent);
                });

            });

            // remove action/param
            $("#" + name + " .action #removeAction").live("click", function () {
                $(this).parent().parent().remove();
            });

            // add new param
            $(".addParam").click(function () {
                var newParamContent = getParamContent("", "", "", "", "");
                $(this).parent().siblings('.params').append(newParamContent);
            });

            // validation
            $("#" + name + " .actionCode").each(function (key, value) {
                var actionCodeValidationObj = new webProxy();
                var taskContext = {};
                taskContext.appDomain = vContext.appDomain;
                taskContext.actionCode = $(this).val();
                var aElement = $(this);
                var isNewActionCodeResult = actionCodeValidationObj.isNewActionCode(taskContext, function (response) {
                    if (response) {
                        aElement.attr('style', 'border-color: red');
                    }
                });
            });
        });
    };

    var assembleTaskXml = function () {
        var xml = "";
        $("#" + name + " .actions").find(".action").each(function (key, value) {

            var actionCode = $(this).find("input").eq(0).val();
            var adName = $(this).find("input").eq(1).val();
            var fName = $(this).find("input").eq(2).val();
            var sNo = $(this).find("input").eq(3).val();
            var paramsXml = "";

            $(this).find(".param").each(function (key, value) {
                var name = $(this).find("input").eq(0).val();
                var spName = $(this).find("input").eq(1).val();
                var value = $(this).find("input").eq(2).val();
                var dtType = $(this).find("input").eq(3).val();
                var usage = $(this).find("input").eq(4).val();

                var paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\" />".format(name, spName, value, dtType, usage);
                paramsXml += paramXml;
            });

            var aXml = "<Action ActionCode=\"{0}\" ActionDisplayName=\"{1}\" FunctionName=\"{2}\" SequenceNo=\"{3}\">{4}</Action>".format(actionCode, adName, fName, sNo, paramsXml);
            xml += aXml;

        });

        return "<Task>{0}</Task>".format(xml);
    };

    this.refresh = function (vContext) {
        viewContext = vContext;
        taskXml = vContext.model;
        xmlDoc = $.parseXML(taskXml);

        this.render();
    };

    this.onModelUpdate = function (callback) {
        callbackObj.onModelUpdate = callback;
    };

    var onLoad = function () {
    };

    var getActionContent = function (aCode, acDN, fN, sN) {
        var aContent = actionTemplate.replace("$actionCode$", aCode);
        aContent = aContent.replace("$actionDisplayName$", acDN);
        aContent = aContent.replace("$functionName$", fN);
        aContent = aContent.replace("$sequenceNo$", sN);

        return aContent;
    };

    var getParamContent = function (name, sName, value, dType, usage) {
        var pContent = paramTemplate.replace("$pname$", name);
        pContent = pContent.replace("$pSessionParameterName$", sName);
        pContent = pContent.replace("$pvalue$", value);
        pContent = pContent.replace("$pDataType$", dType);
        pContent = pContent.replace("$pUsage$", usage);

        return pContent;
    }

    this.render = function () {
        $("#" + viewContext.viewFormDivId).empty();
        var content = "";
        $(xmlDoc).find("Action").each(function (key, value) {
            var aContent = getActionContent($(this).attr("ActionCode"), $(this).attr("ActionDisplayName"), $(this).attr("FunctionName"), $(this).attr("SequenceNo"));

            var pContents = "";
            $(this).find("Parameter").each(function (key, value) {
                var pContent = getParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"));
                pContents += pContent;
            });

            aContent = aContent.replace("$Params$", pContents);
            content += aContent;
        });

        content = viewTemplate.replace("$viewForm$", content);

        $("#" + viewContext.viewFormDivId).append(content);

        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewForm.prototype = new viewBase();

// document.getElementById("taskProcessIndicator").Content.SL_Agent.InitByTaskFile("Task", taskFile);
