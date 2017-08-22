viewFormCashFlowStudioEC = function () {
    var ECXML = "";
    var ecDivIndex = 0;
    var mainXML = null;
    var mainXMLs = null;
    var isEcButtonDrag = false;

    var sessionServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/SessionManagementService.svc/jsAccessEP/";

    var viewTemplate = "<div style='width:1465px'>" +
                            "<div style='height: 30px;background-color: #D6DBE9;line-height:30px;border:1px solid #293955;padding:5px;font-family: Arial; font-size: 12px'>" +
                                "<b>ECCode:</b> <input id='searchECCode' type='text' value='' />&nbsp;&nbsp;" +
                                "<b>AppDomain:</b> <input id='SearchECAppDomain' type='text' value='Task' />&nbsp;&nbsp;" +
                                "<input type='button' value='Load' id='btLoadEC' />&nbsp;&nbsp;" +
                                "<input type='button' value='Save' id='btSaveEC' />&nbsp;&nbsp;" +
                                "<input type='button' value='Apply' id='btApplyEC' />" +
                            "</div>" +
                            "<div style='height:800px;float:left;width:300px;border:5px solid #293955'>" +
                                "<div style='width:298px;height:25px;line-height:25px;background-color:#4D6082;border:1px solid #BDBDBD; color: #FFFFFF; font-family: Arial; font-size: 12px'>&nbsp;Toolbox</div>" +
                                "<div id='divECTools' style='height:771px;overflow: auto;border:1px solid #BDBDBD;text-align:center'></div>" +
                            "</div>" +
                            "<div style='height:800px;float:left;width:1145px;border:5px solid #293955'>" +
                                "<div id='eCTabs' style='height:593px;  overflow: auto;'>" +
                                    "<ul>" +
                                        "<li><a href='#viewECForm'>EC Form View</a></li>" +
                                        "<li><a href='#viewECXml'>EC XML View</a></li>" +
                                    "</ul>" +
                                    "<div id='viewECForm' style='min-height:537px;'></div>" +
                                    "<div id='viewECXml'>" +
                                        "<textarea id='txtECXml' style='width:1092px;height:530px'></textarea>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                         "</div>"

    var viewCaculateTemplate = "<div style='width:1027px;margin-bottom:10px' id='main'>" +
                                    "<div style='height:25px;background-color: #D6DBE9;line-height:25px;border:1px solid #293955;padding:5px;font-family: Arial; font-size: 12px'>" +
                                        "<div id='removeMain' class='divAddorDeleteIcon'><img src='../img/remove.png' alt='Remove Main' class='addRemoveImgButton'/></div> " +
                                        "<b>CashFlow Name:</b><input type='text' value='$CashFlowName$'>&nbsp;&nbsp;" +
                                        "<input type='button' value='Detail' style='width: 60px;  height: 20px;' id='showEcParameters_$CashFlowName$' data-actionCode='$CashFlowName$'/>" +
                                        "<input type='button' value='Verify' style='width: 60px;  height: 20px;' id='verifyEquation_$CashFlowName$' data-actionCode='$CashFlowName$'/>" +
                                    "</div>" +
                                    "<div class='ecParamArea' style='display:none'>" +
                                        "<div>" +
                                            "<div class='grayDivTableHead' style='width:14px'></div>" +
                                            "<div class='grayDivTableHead'>Name</div>" +
                                            "<div class='grayDivTableHead'>SessionParameterName</div>" +
                                            "<div class='grayDivTableHead'>Value</div>" +
                                            "<div class='grayDivTableHead'>DataType</div>" +
                                            "<div class='grayDivTableHead'>Usage</div>" +
                                            "<div class='grayDivTableHeadRight' style='width:35px'></div>" +
                                        "</div>" +
                                        "<div class='ClearBoth'></div>" +
							            "<div id='ecParams'>$Params$</div>" +
                                        "<div>" +
                                            "<div id='addEcParam' class='addParamForCaskFlow pointer' style='width:1017px'><img src='../img/add.png' alt='Add Parameter' /><span> Add Parameter</span></div>" +
                                        "</div>" +
                                        "<div style='width:1025px;border:#BDBDBD solid 1px;'>" +
                                            "<div style='height:18px;line-height:18px;font-family: Arial; font-size: 12px'>&nbsp;&nbsp;<b>CashFlow Equation</b></div>" +
                                            "<div class='ClearBoth'></div>" +
                                            "&nbsp;&nbsp;<textarea id='txtEquation_$CashFlowName$' cols='155' rows='12' style='background-color: lightyellow'>$CashFlowEquation$</textarea>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>";

    var ecParamTemplate = "<div id='ecparam'>" +
                                "<div>" +
                                    "<div id='removeEcParam' style='padding:5px;cursor:pointer; width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><div style='padding-top:5px;'><img src='../img/remove.png' alt='Remove Param' class='addRemoveImgButton'/></div></div>" +
                                    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pname$'></div>" +
                                    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pSessionParameterName$'></div>" +
							        "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pvalue$'></div>" +
							        "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pDataType$'></div>" +
							        "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='$pUsage$'></div>" +
                                    "<div style='padding:5px;width:35px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input type='button' value=' ... ' style='width: 30px;' id='showParamField' /></div>" +
                                    "<div class='ClearBoth'></div>" +
                                 "</div>" +
                                 "<div id='paramFild' style='display:none'>" +
                                    "<div style='padding:5px;width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'></div>" +
                                    "<div style='padding:5px;width:990px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'>" +
                                        "FieldName:<input type='text' value='$pFieldName$'>&nbsp;&nbsp;Position:<input type='text' value='$pPosition$' style='width:600px'>" +
                                    "</div>" +
                                    "<div class='ClearBoth'></div>" +
                                 "</div>" +
                            "</div>";

    var ecToolButtonTemplate = "<div id='divECTool' style='width:250px;cursor:pointer;margin:10px auto;height:25px;background-color: #D6DBE9;line-height:25px;border:1px solid #293955;padding:5px;font-family: Arial; font-size: 12px'>" +
                                "$CashFlowName$<input type='hidden' value='$mainXML$' />" +
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
 
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var getEcToolbuttonContent = function (name, mainXml) {
        var tContent = ecToolButtonTemplate.replace("$CashFlowName$", name);
        tContent = tContent.replace("$mainXML$", mainXml);
        return tContent;
    }

    var getEcContent = function (aName, aQuery) {
        //var aContent = viewCaculateTemplate.replace("$CashFlowName$", aName);
		var aContent = viewCaculateTemplate.replace(/\$CashFlowName\$/g, aName)
        aContent = aContent.replace("$CashFlowEquation$", aQuery);
        return aContent;
    };

    var getEcParamContent = function (name, sName, value, dType, usage, fieldName, position) {
        var pContent = ecParamTemplate.replace("$pname$", name);
        pContent = pContent.replace("$pSessionParameterName$", sName);
        pContent = pContent.replace("$pvalue$", value);
        pContent = pContent.replace("$pDataType$", dType);
        pContent = pContent.replace("$pUsage$", usage);
        pContent = pContent.replace("$pFieldName$", fieldName);
        pContent = pContent.replace("$pPosition$", position);
        return pContent;
    }

    var writeEcToolButtons = function () {
        $.ajax({
            url: "./EcToolButtonTemplate.xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 2000,
            error: function () {
                alert("加载 EcToolButtonTemplate.xml 文件出错！");
            },
            success: function (toolButtonXML) {
                $("#divECTools").empty();
                var content = "";
                var mainIndex = 0;
                mainXMLs = new Array();
                $(toolButtonXML).find("main").each(function (key, value) {
                    var query = $(this).find("Query");
                    var tContent = getEcToolbuttonContent($(query).attr("name"), mainIndex);
                    mainXMLs[mainIndex] = $(this);
                    content += tContent;
                    mainIndex += 1;
                });
                $("#divECTools").append(content);
                $("#divECTools").find("#divECTool").each(function () {
                    $(this).draggable({
                        cursor: "pointer",
                        connectToSortable: "#viewECForm",
                        helper: "clone",
                        zIndex: "100",
                        start: function (event, ui) {
                            isEcButtonDrag = true;
                            mainXML = mainXMLs[$(this).find("input").eq(0).val()];
                        },
                        stop: function (event, ui) {
                            isEcButtonDrag = false;
                        }
                    });
                })
            }
        });
    }

    var writeNewMain = function () {
        var pContents = "";
        $(mainXML).find("Parameters").find("Parameter").each(function (key, value) {
            var pFieldName = "";
            var pPosition = "";
            var field = $(this).find("Field");
            if (field != undefined) {
                if ($(field).attr("Name") != undefined) {
                    pFieldName = $(field).attr("Name");
                }
                var position = $(field).find("Position");
                if (position != "undefined") {
                    if ($(position).text() != undefined) {
                        pPosition = $(position).text();
                    }
                }
            }
            var pContent = getEcParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"), pFieldName, pPosition);
            pContents += pContent;
        });

        var query = $(mainXML).find("Query");
        var aContent = getEcContent($(query).attr("name"), $(query).text());
        aContent = aContent.replace("$Params$", pContents);

        var divClone = $("#viewECForm").find(".ui-draggable").eq(0);
        $(divClone).after(aContent);
        $(divClone).remove();
    }

    var writeEcs = function () {
        $("#viewECForm").empty();
        var content = "";
        var objXML = $.parseXML(ECXML);
        $(objXML).find("main").each(function (key, value) {
            var pContents = "";
            $(this).find("Parameters").find("Parameter").each(function (key, value) {
                var pFieldName = "";
                var pPosition = "";
                var field = $(this).find("Field");
                if (field != undefined) {
                    if ($(field).attr("Name") != undefined) {
                        pFieldName = $(field).attr("Name");
                    }                    
                    var position = $(field).find("Position");
                    if (position != "undefined") {
                        if ($(position).text() != undefined) {
                            pPosition = $(position).text();
                        }
                    }
                }
                var pContent = getEcParamContent($(this).attr("Name"), $(this).attr("SessionParameterName"), $(this).attr("Value"), $(this).attr("DataType"), $(this).attr("Usage"), pFieldName, pPosition);
                pContents += pContent;
            });

            var query = $(this).find("Query");
            var aContent = getEcContent($(query).attr("name"), $(query).text());
            aContent = aContent.replace("$Params$", pContents);
            content += aContent;
        });
        $("#viewECForm").append(content);
    }

    var loadECXml = function (response) {
        ECXML = response;
        $("#txtECXml").empty();
        $("#txtECXml").val(response);
        writeEcs();
    }

    var assembleECXml = function () {
        var xml = "";
        $("#viewECForm").find("#main").each(function (key, value) {
            var cashFlowName = $(this).find("input").eq(0).val();
            var queryText = $(this).find("textarea").eq(0).val();
            var paramsXml = "";
            $(this).find("#ecparam").each(function (key, value) {
                var name = $(this).find("input").eq(0).val();
                var spName = $(this).find("input").eq(1).val();
                var value = $(this).find("input").eq(2).val();
                var dtType = $(this).find("input").eq(3).val();
                var usage = $(this).find("input").eq(4).val();
                var fieldName = $(this).find("input").eq(6).val();
                var position = $(this).find("input").eq(7).val();
                var paramXml = "";
                if (fieldName == "") {
                    paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\" />".format(name, spName, value, dtType, usage);
                } else {
                    paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\"><Field Name=\"{5}\"><Position>{6}</Position></Field></Parameter>".format(name, spName, value, dtType, usage, fieldName, position);
                }
                paramsXml += paramXml;
            });
            paramsXml = "<Parameters>" + paramsXml + "</Parameters>";
            var queryXml = "<Query name=\"{0}\">{1}</Query><Presentation></Presentation>".format(cashFlowName, queryText);
            var aXml = "<main>{0}{1}</main>".format(paramsXml, queryXml);
            xml += aXml;
        });

        return "<Methods>{0}</Methods>".format(xml);
    };
	
	var assembleQueryXml = function (queryName) {
        var xml = "";
        $("#viewECForm").find("#main").each(function (key, value) {
			
            var cashFlowName = $(this).find("input").eq(0).val();
			if (cashFlowName == queryName)
			{
				var queryText = $(this).find("textarea").eq(0).val();
				var paramsXml = "";
				$(this).find("#ecparam").each(function (key, value) {
					var name = $(this).find("input").eq(0).val();
					var spName = $(this).find("input").eq(1).val();
					var value = $(this).find("input").eq(2).val();
					var dtType = $(this).find("input").eq(3).val();
					var usage = $(this).find("input").eq(4).val();
					var fieldName = $(this).find("input").eq(6).val();
					var position = $(this).find("input").eq(7).val();
					var paramXml = "";
					if (fieldName == "") {
						paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\" />".format(name, spName, value, dtType, usage);
					} else {
						paramXml = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\"><Field Name=\"{5}\"><Position>{6}</Position></Field></Parameter>".format(name, spName, value, dtType, usage, fieldName, position);
					}
					paramsXml += paramXml;
				});
				paramsXml = "<Parameters>" + paramsXml + "</Parameters>";
				var queryXml = "<Query name=\"{0}\">{1}</Query><Presentation></Presentation>".format(cashFlowName, queryText);
				var aXml = "<main>{0}{1}</main>".format(paramsXml, queryXml);
				xml += aXml;
			}
        });

        return "{0}".format(xml);
    };
	
   
    var getCriteriasByECSetCode = function (appDomain, code, callback) {
        var serviceUrl = sessionServiceBase + "GetCriteriasByECSetCode/" + appDomain + "/" + code + "?r=" + Math.random() * 150;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "xml",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                if ($.browser.msie) {
                    callback(response.xml);
                }
                else {
                    callback(response.documentElement.outerHTML);
                }
            },
            error: function (response) { alert("this ec code not exists."); }
        });
    };

    var updateECByECSetCodeAndECName = function (appDomain, code, ecXml) {
        var serviceUrl = sessionServiceBase + "UpdateCriteriaByECSetCodeAndECName/" + appDomain + "/" + code;

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: ecXml,
            success: function (response) {
                alert("Successfully saved");
            },
            error: function (response) { alert("error:" + response); }
        });
    };

    var regisDynamicUiEvents = function () {
        $("#viewECForm").sortable({
            cursor: "pointer",
            stop: function (event, ui) {
                if (isEcButtonDrag) {
                    writeNewMain();
                }
            }
        });

        $('[id^=showEcParameters_]').live("click", function () {

            $(this).parent().parent().find(".ecParamArea").toggle(200);
        });

        $("#removeMain").live("click", function () {
            $(this).parent().parent().remove();
        });

        $("#removeEcParam").live("click", function () {
            $(this).parent().parent().remove();
        });

        $("#showParamField").live("click", function () {
            $(this).parent().parent().parent().find("#paramFild").toggle(200);
        });

        $("#addEcParam").live("click", function () {
            var newParamContent = getEcParamContent("", "", "", "", "", "", "");
            $(this).parent().siblings('#ecParams').append(newParamContent);
        });
		
		
		$('[id^=verifyEquation_]').live("click", function () {
			var methodName = $(this).attr('data-actionCode');
			var sXml = assembleQueryXml(methodName);
			sXml = sXml.replace('$ECQueryName$', methodName);
			
			var verifyXmlValue = verifyXmlTemplate.replace("$SessionVariableValue$", sXml);
			verifyXmlValue = verifyXmlValue.replace('$ECQueryName$', methodName);
	
			var wProxy = new webProxy();
			var sContext = {
				appDomain: "Task",
				sessionVariables: verifyXmlValue,
				taskCode: "CashFlowECVerify"
			};
			
				
			wProxy.createSessionByTaskCode(sContext, function (response) {
				isSessionCreated = true;
				sessionID = response;
				taskCode = "CashFlowECVerify";
				
				if (IsSilverlightInitialized){
					PopupTaskProcessIndicator();
					InitParams();
				}
				else{
					PopupTaskProcessIndicator();
				}
				
			});

		});
		
    }
	

    var regisUiEvents = function () {
        $(function () {
            $("#eCTabs").tabs();

            $("#eCTabs li").bind("click", function () {
                ecDivIndex = $(this).index();
                if (ecDivIndex == 0) {
                    $('#divECTools').removeAttr("disabled");
                }
                else {
                    $('#divECTools').attr("disabled", "disabled");
                }
            });

            writeEcToolButtons();

            $("#btLoadEC").click(function () {
                var ecCode = $("#searchECCode").val();
                var appDomain = $("#SearchECAppDomain").val();
                if (ecCode == "" || appDomain == "") {
                    alert("EC Code or AppDomain is Empty!");
                    return;
                }
                getCriteriasByECSetCode(appDomain, ecCode, loadECXml);
            });

            regisDynamicUiEvents();

            $("#btApplyEC").click(function () {
                if (ecDivIndex == 0) {
                    loadECXml(assembleECXml());
                } else {
                    loadECXml($("#txtECXml").val());
                }
                alert("Applied successfully.");
            });

            $("#btSaveEC").click(function () {
                var ecSetCodeAndName = $("#searchECCode").val() + "/" + $("#searchECCode").val();
                var pAppDomain = $("#SearchECAppDomain").val();
                if (($("#searchECCode").val() == "") || pAppDomain == "") {
                    alert("EC Code or AppDomain is Empty!");
                    return;
                }
                updateECByECSetCodeAndECName(pAppDomain, ecSetCodeAndName, ECXML);
            });
			

        });
    };

    this.refresh = function (vContext) {
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewEC").empty();

        $("#viewEC").append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
