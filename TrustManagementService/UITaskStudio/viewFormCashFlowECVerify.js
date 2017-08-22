viewFormCashFlowECVerify = function (vContext) {
    vContext.name = "viewECVerify";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var taskXml = vContext.model;
    var callbackObj = {};

    var xmlDoc = $.parseXML(taskXml);

    var viewTemplate = "<div>" +
						    "<div class='actions'>$viewForm$</div>" +
						    "<div class='updateButton'><input type='button' value='Update' class='update' id='updateECVerifyForm' /></div>" +
						"</div>";

    var ECHeaderTemplate =
                            "<div><div class='actionHeader1'>" +
                                "<div class='actionHeaderElement'>CashFlow Name</div>" +
                            "</div></div>";

    var paramTemplate = "<div class='newParam'>" +
                            "<div class='newParamElement padLeft24'>" +
							    "<input type='text' value='$pname$' readonly>" +
                            "</div>" +
							"<div class='newParamElement'><input type='text' class='paramValue' value='$pvalue$'></div>" +
                            "<div class='ClearBoth'></div>" +
						"</div>";
						
    var ECTemplate = "<div class='action'>" +
                            "<div class='ClearBoth'></div>" +
							 "<div class='actionElement'>" +
                                "<input type='text' value='$CashFlowName$' readonly>" +
                            "</div>" +
                            "<div class='actionElement'><input type='button' value='...' style='width: 40px;  height: 20px;' id='showVerifyEquation_$CashFlowName$' data-actionCode='$CashFlowName$'/></div>" +
                            "<div class='actionElement'><input type='button' value='verify' style='width: 40px;  height: 20px;' id='verifyEquation_$CashFlowName$' data-actionCode='$CashFlowName$'/></div>" +
						    "<div class='ClearBoth'></div>" +
                            "<div class='equationArea' style='display:none'>" +
								"<div class='ClearBoth'></div>" +
								"<div class='paramHeader'>" +
									"<div class='paramHeaderElement padLeft24'>Name</div>" +
									"<div class='paramHeaderElement'>Value</div>" +
								"</div>" +
								"<div class='ClearBoth'></div>" +						
								"<div id='params_$CashFlowName$'>$Params$</div>" +
                                "<div class='ClearBoth'></div>" +
                                "<div class='actionHeaderElement'>CashFlow Equation</div>" +
							    "<div class='ClearBoth'></div>" +
                                "<p><textarea id='sessionFile_$CashFlowName$' cols='150' rows='12' style='background-color: lightyellow'>$CashFlowEquation$</textarea></p>" +
                                "<div class='ClearBoth'></div>" +
                            "</div>" +
                            "<div class='ClearBoth'></div>" +
                        "</div>";

    var verifyXmlTemplate = "<SessionVariables><SessionVariable><Name>ECQueryName</Name><Value>$ECQueryName$</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                                "<SessionVariable>" +
                                    "<Name>ECXmlScript</Name>" +
                                    "<Value><![CDATA[<Methods>$SessionVariableValue$</Methods>]]></Value>" +
                                    "<DataType>nvarchar(max)</DataType>" +
                                    "<IsConstant>1</IsConstant>" +
                                    "<IsKey>0</IsKey>" +
                                    "<KeyIndex>2</KeyIndex>" +
                                "</SessionVariable>" +
                                "<SessionVariable><Name>StartPeriod</Name><Value>0</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                                "<SessionVariable><Name>EndPeriod</Name><Value>1</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                            "</SessionVariables>";

    var regisUiEvents = function () {
        $(function () {
            // update event
            $("#" + name + " #updateECVerifyForm").click(function () {
                taskXml = assembleTaskXml();

                var objContext = {};
                objContext.obj = taskXml;
                objContext.locker = name;
                callbackObj.onModelUpdate(objContext);
            });

            $('[id^=removeAction_]').each(function () {
                $(this).live("click", function () {
                    $(this).parent().parent().remove();
                });
            });

            $('[id^=showVerifyEquation_]').each(function () {
                $(this).live("click", function () {
                    $(this).parent().parent().find(".equationArea").toggle(200);
                });
            });

            $('[id^=verifyEquation_]').each(function () {
                $(this).live("click", function () {
                    //var queryName = this.id.replace("verifyEquation_", "");
                    var methodName = $(this).attr('data-actionCode');
                    // prepare session variable (ECXMLScript)
                    var sXml = assembleQueryXml(methodName);
                    sXml = sXml.replace('$ECQueryName$', methodName);
                    //alert(sXml);
                    // call WCF
                    var wProxy = new webProxy();
                    var sContext = {
                        appDomain: "Task",
                        sessionVariables: sXml,
                        taskCode: "CashFlowECVerify"
                    };

                    wProxy.createSessionByTaskCode(sContext, function (response) {
                        isSessionCreated = true;
						//PopupSLProgressIndicator(response, 'Task', 'CashFlowECVerify');
                        document.getElementById("taskProcessIndicator").Content.SL_Agent.InitParams(response, 'Task', 'CashFlowECVerify');
                    });

                });
            });
        });
    };

    var assembleTaskXml = function () {
        xmlDoc = $.parseXML(taskXml);

        var xml = "";
        $("#" + name + " .actions").find(".action").each(function (key, value) {

            var ecCode = $(this).find("input").eq(0).val();
            var ecQuery = $(this).find("textarea").eq(0).val();

            $(xmlDoc).find("Query").each(function (key, value) {
                var name = $(this).attr("name");
                if (name == ecCode)
                {
                    $(this).text(ecQuery);
                }
            });

        });
        return xmlDoc.xml;
    };

    var assembleQueryXml = function (queryName) {
        var arrValues = new Array();
        var valueNo = 0;
        $("#" + name + " #params_" + queryName).find(".paramValue").each(function () {
            arrValues[valueNo] = $(this).val();
            valueNo += 1;
        });
        var mainList = $(xmlDoc).find("main");
        var queryObj = mainList.children('Query[name="' + queryName + '"]');
        var mainObj = queryObj[0].parentNode;
        $(mainObj).find("Query").each(function () {
            $(this).text($("#" + name + " #sessionFile_" + queryName).val());
        });
        valueNo = 0;
        $(mainObj).find("Parameter").each(function () {
            $(this).attr("Value", arrValues[valueNo]);
            valueNo += 1;
        });
        var verifyXmlValue = verifyXmlTemplate.replace("$SessionVariableValue$", mainObj.xml);
        return verifyXmlValue;
    }

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

	var getParamContent = function (name, sName, value, dType, usage) {
        var pContent = paramTemplate.replace("$pname$", name);
        pContent = pContent.replace("$pSessionParameterName$", sName);
        pContent = pContent.replace("$pvalue$", value);
        pContent = pContent.replace("$pDataType$", dType);
        pContent = pContent.replace("$pUsage$", usage);

        return pContent;
    }
	
    var getECContent = function (ecCode, ecName, query) {
        var aContent = ECTemplate.replace(/\$CashFlowName\$/g, ecCode); //str.replace(/abc/g, '')
        aContent = aContent.replace("$CashFlowEquation$", query);

        return aContent;
    };
		
		
    this.render = function () {
        $("#" + viewContext.viewECVerifyDivId).empty();
        var content = "";
        content += ECHeaderTemplate;
		$(xmlDoc).find("main").each(function (key, value) {
			var pContents = "";
			$(this).find("Parameters").find("Parameter").each(function (key, value) {
                var pContent = getParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"));
                pContents += pContent;
            });
			
			var query = $(this).find("Query");
			var aContent = getECContent($(query).attr("name"), $(query).attr("name"), $(query).text());
			aContent = aContent.replace("$Params$", pContents);
			
			// $(xmlDoc).find("Query").each(function (key, value) {
				// var aContent = getECContent($(this).attr("name"), $(this).attr("name"), $(this).text());
				// content += aContent;
			// });
			content += aContent;
		});
        content = viewTemplate.replace("$viewForm$", content);
        $("#" + viewContext.viewECVerifyDivId).append(content);

        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewFormCashFlowECVerify.prototype = new viewBase();

// document.getElementById("taskProcessIndicator").Content.SL_Agent.InitByTaskFile("Task", taskFile);
