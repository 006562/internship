viewFormCashFlowSimple = function (vContext) {
    vContext.name = "viewFormCashFlowSimple";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var taskXml = vContext.model;
    var callbackObj = {};

    var xmlDoc = $.parseXML(taskXml);

    var viewTemplate = "<div class='divCommandParams' style='width:700px'>" +
                            "<b>TaskCode:</b> <input id='simpletaskcode' type='text' value='' /> " +
                            "<b>AppDomain:</b> <input id='simpleappdomain' type='text' value='Task' /> " +
                            "<input type='button' value='Search' id='simplettSearch' />" +
                        "</div>" +
                        "<div style='width:700px'>" +
						    "<div class='actions'>$viewForm$</div>" +
                            "<div class='ClearBoth'></div>" +
						    "<div class='updateButton'><input type='button' id='simpleViewUpdate' value='Update' class='update' /></div>" +
						"</div>";

    var actionHeaderTemplate =
                            "<div><div class='actionHeader1'>" +
                                "<div class='actionHeaderElement'>SequenceNo</div>" +
                                "<div class='actionHeaderElement'>ActionDisplayName</div>" +
                                "<div class='actionHeaderElement'>ActionCode</div>" +
                                "<div style='display:none' class='actionHeaderElement'>FunctionName</div>" +
                            "</div></div>";

    var actionTemplate = "<div class='action'>" +
                            /*
                            "<div class='actionHeader'>" +
                                "<div class='actionHeaderElement'>SequenceNo</div>" +
                                "<div class='actionHeaderElement'>ActionDisplayName</div>" +
                                "<div class='actionHeaderElement'>ActionCode</div>" +
                                //"<div class='actionHeaderElement'>FunctionName</div>" +
                            "</div>" +
                            */
                            "<div class='ClearBoth'></div>" +
							
                            "<div class='actionElement'>" +
                                //"<img src='../img/add.png' alt='Add Parameter' class='addRemoveImgButton'/>" +
                                //"<img src='../img/remove.png' alt='Remove Action' id='removeAction' class='addRemoveImgButton'/> " +
                                //"<input type='text' value='$actionCode$' class='actionCode'>" +
                                "<input type='text' value='$sequenceNo$'>" +
                            "</div>" +
							"<div class='actionElement'><input type='text' value='$actionDisplayName$'></div>" +
							"<div class='actionElement'><input type='text' value='$actionCode$' class='actionCode'></div>" +
							"<div style='display:none' class='actionElement'><input type='text' value='$functionName$'></div>" +
                            "<div class='actionElement'><input type='button' value='Detail' style='width: 60px;  height: 20px;' id='simpleshowParameters_$actionCode$' data-actionCode='$actionCode$'/></div>" +
                            "<div class='actionElement'><input type='button' value='...' style='width: 40px;  height: 20px;' id='simpleshowEquation_$actionCode$' data-actionCode='$actionCode$'/></div>" +
							//"<div class='actionElement'><input type='text' value='$sequenceNo$'></div>" +
                            "<div class='ClearBoth'></div>" +
                            
                            "<div class='paramArea' style='display:none'>" +
                            "<div class='paramHeaderForCaskFlow'>" +
                                "<div class='paramHeaderElement padLeft24'>Name</div>" +
                                "<div style='display:none' class='paramHeaderElement'>SessionParameterName</div>" +
                                "<div class='paramHeaderElement'>Value</div>" +
                                "<div style='display:none' class='paramHeaderElement'>DataType</div>" +
                                "<div style='display:none' class='paramHeaderElement'>Usage</div>" +
                                "<div style='display:none' class='paramHeaderElement'>IsConfigurable</div>" +
                            "</div>" +
                            "<div class='ClearBoth'></div>" +
							"<div class='params'>$Params$</div>" +
                            "<div class='padLeft14'>" +
                                //"<div class='addParamForCaskFlow pointer'><img src='../img/add.png' alt='Add Parameter' /><span> Add Parameter</span></div>" +
                            "</div>" +
                            "<div class='separator'></div>" +
                            "</div>" +
                            
                        "</div>";
    var paramTemplate = "<div class='paramForCaskFlowSimple' $pIsDisplay$>" +
                            "<div class='paramElement'>" + 
                                //"<img src='../img/remove.png' alt='Remove Parameter' id='removeAction' /> " +
							    "<input type='text' value='$pname$'>" +
                            "</div>" +
							"<div style='display:none' class='paramElement'><input type='text' value='$pSessionParameterName$'></div>" +
							"<div class='paramElement'><input type='text' value='$pvalue$'></div>" +
							"<div style='display:none' class='paramElement'><input type='text' value='$pDataType$'></div>" +
							"<div style='display:none' class='paramElement'><input type='text' value='$pUsage$'></div>" +
                            "<div style='display:none' class='paramElement'><input class='configCheck' type='checkbox' $pIsConfigurable$ /></div>" +
                            "<div class='ClearBoth'></div>" +
						"</div>";

    function popupwindow(url, title, w, h) {
        var left = (screen.width / 2) - (w / 2);
        var top = (screen.height / 2) - (h / 2);
        var a = window.open(url, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    }

    var regisUiEvents = function () {
        $(function () {
            //search event
            $("#simplettSearch").click(function () {
                var taskCode = $("#" + name + " #simpletaskcode").val();
                var appDomain = $("#" + name + " #simpleappdomain").val();
                if (taskCode == "") taskCode = "CashFlowInput";
                if (appDomain == "") appDomain = "Task";
				currentTaskCode = taskCode;
				currentAppDomain = appDomain;

                var wProxy = new webProxy();
                wProxy.getTaskXmlByTaskCode(appDomain, taskCode, function (response) {
                    //alert(response);
                    $("#viewWCF #sessionFileWCF").empty().val(response);
                    $("#viewWCF #updateWCF").trigger("click");
                });
            });

            // update event
            $("#" + name + " #simpleViewUpdate").click(function () {
                taskXml = assembleTaskXml();

                var objContext = {};
                objContext.obj = taskXml;
                objContext.locker = name;
                callbackObj.onModelUpdate(objContext);
            });

            // add new action
            //$("#" + name + " #addNewAction").click(function () {
            //    var newActionContent = getActionContent("", "", "", "");
            //    var newParamContent = getParamContent("", "", "", "", "");
            //    newActionContent = newActionContent.replace("$Params$", newParamContent);
            //    $("#" + name + " .actions").append(newActionContent);

            //    $(".addParam").unbind('click');
            //    $(".addParam").click(function () {
            //        var newParamContent = getParamContent("", "", "", "", "");
            //        $(this).parent().siblings('.params').append(newParamContent);
            //    });

            //});

            // remove action/param
            //$("#" + name + " .action #removeAction").live("click", function () {
            //    $(this).parent().parent().remove();
            //});

            $('[id^=simpleshowParameters_]').each(function () {
                $(this).live("click", function () {
                    $(this).parent().parent().find(".paramArea").toggle(200);
                });
            });

            $('[id^=simpleshowEquation_]').each(function() {
                $(this).live("click", function () {
                    var query = window.location.search.substring(1);
                    var pair = query.split("=");
                    if (!pair[1] || pair[1] == '') { taskCode = 'CashFlowInput'; }
                    else {
                        taskCode = pair[1];
                    }

                    var taskCode = $("#" + name + " #simpletaskcode").val();				
                    if (taskCode == "") taskCode = 'CashFlowInput';

                    //var myWindow = window.open("CashFlowEquationView.html?cashflow=" + this.getAttribute('data-actionCode'), "MsgWindow", "width=1500, height=700");

                    popupwindow('CashFlowEquationView.html?cashflow=' + taskCode,
                                                'MsgWindow', 1500, 800);

                });
            });

            // add new param
            //$(".addParam").click(function () {
            //    var newParamContent = getParamContent("", "", "", "", "");
            //    $(this).parent().siblings('.params').append(newParamContent);
            //});

            // validation
            $("#" + name + " .actionCode").each(function (key, value) {
                var actionCodeValidationObj = new webProxy();
                var taskContext = {};
                //taskContext.appDomain = vContext.appDomain;
                taskContext.appDomain = 'Task';
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

            var sNo = $(this).find("input").eq(0).val();
            var adName = $(this).find("input").eq(1).val();
            var actionCode = $(this).find("input").eq(2).val();
            var fName = $(this).find("input").eq(3).val();
            var paramsXml = "";

            $(this).find(".paramForCaskFlowSimple").each(function (key, value) {
                var name = $(this).find("input").eq(0).val();
                var spName = $(this).find("input").eq(1).val();
                var value = $(this).find("input").eq(2).val();
                var dtType = $(this).find("input").eq(3).val();
                var usage = $(this).find("input").eq(4).val();
                var isConfigurable = "false"
                if ($(this).find(".configCheck").is(":checked")) isConfigurable = "true";

                var paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\" IsConfigurable=\"{5}\" />".format(name, spName, value, dtType, usage, isConfigurable);
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
        var aContent = actionTemplate.replace(/\$actionCode\$/g, aCode); //str.replace(/abc/g, '')
        aContent = aContent.replace("$actionDisplayName$", acDN);
        aContent = aContent.replace("$functionName$", fN);
        aContent = aContent.replace("$sequenceNo$", sN);

        return aContent;
    };

    var getParamContent = function (name, sName, value, dType, usage, isConfigurable) {
        var pContent = paramTemplate.replace("$pname$", name);
        pContent = pContent.replace("$pSessionParameterName$", sName);
        pContent = pContent.replace("$pvalue$", value);
        pContent = pContent.replace("$pDataType$", dType);
        pContent = pContent.replace("$pUsage$", usage);
        var pIsConfigurable = "";
        var pIsDisplay = "style = 'display:none'";
        if (isConfigurable == "true") {
            pIsDisplay = "";
            pIsConfigurable = "checked";
        }
        pContent = pContent.replace("$pIsConfigurable$", pIsConfigurable);
        pContent = pContent.replace("$pIsDisplay$", pIsDisplay);
        return pContent;
    }

    this.render = function () {
        $("#" + viewContext.viewSimpleFormDivId).empty();
        var content = "";
        content += actionHeaderTemplate;
        $(xmlDoc).find("Action").each(function (key, value) {
            var aContent = getActionContent($(this).attr("ActionCode"), $(this).attr("ActionDisplayName"), $(this).attr("FunctionName"), $(this).attr("SequenceNo"));

            var pContents = "";
            $(this).find("Parameter").each(function (key, value) {
                var pContent = getParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"), $(this).attr("IsConfigurable"));
                pContents += pContent;
            });

            aContent = aContent.replace("$Params$", pContents);
            content += aContent;
        });

        content = viewTemplate.replace("$viewForm$", content);

        $("#" + viewContext.viewSimpleFormDivId).append(content);

		if (currentTaskCode == '') currentTaskCode = 'CashFlowInput';
		if (currentAppDomain == '') currentAppDomain = 'Task';
		$("#simpletaskcode").val(currentTaskCode);
		$("#simpleappdomain").val(currentAppDomain);

        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewFormCashFlowSimple.prototype = new viewBase();

// document.getElementById("taskProcessIndicator").Content.SL_Agent.InitByTaskFile("Task", taskFile);
