viewSession = function (vContext) {
    vContext.name = "viewSession";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var taskXml = vContext.model;
    var callbackObj = {};
    var isSessionCreated = false;

    var viewTemplate = "<div>" +
							"<div class='divCommandParams'><b>Command Params:</b> <input type='text' id='commandline' class='inputCommandParams' /> " +
							"<input type='button' value='Transform' id='ttSession' /></div>" +
                            "<div>" +
                                "<div id='sessionXmlArea'>" +
                                    "<div class='divTopRow'>" +
                                        "TaskCode: <input id='taskcode' type='text' value='RBALoanCTM' /> " +
                                        "AppDomain: <input id='appdomain' type='text' value='Task' />" +
                                    "</div>" +
                                    "<div class='sessionArea'>" +
                                        "<div class='sessionHeader'>" +
                                            "<div class='sessionHeaderElement padLeft24'>Name</div>" +
                                            "<div class='sessionHeaderElement'>Value</div>" +
                                            "<div class='sessionHeaderElement'>DataType</div>" +
                                            "<div class='sessionHeaderElement'>IsConstant</div>" +
                                            "<div class='sessionHeaderElement'>IsKey</div>" +
                                            "<div class='sessionHeaderElement'>KeyIndex</div>" +
                                            "<div class='ClearBoth'></div>" +
                                        "</div>" +
                                        "<div class='sVariables'></div>" +
                                        "<div>" +
                                            "<div class='addNewSession pointer'><img src='../img/add.png' alt='Add new session variable'/> Add New Session Variable</div>" +
                                        "</div>" +
                                        "<div class='separator'></div>" +
                                    "</div>" +
                                    "<input id='cSession' type='button' value='Create Session' />" +
                                "</div>" +
                            "</div>" +
                        "</div>";

    var sessionTemplate = "<div class='variable'>" +
                            "<div class='sessionElement'>" +
                                "<img src='../img/remove.png' alt='Remove Session Variable' id='rSV' /> " +
							    "<input type='text' value='{0}' />" +
                            "</div>" +
							"<div class='sessionElement'><input type='text' value='{1}' /></div>" +
							"<div class='sessionElement'><input type='text' value='{2}' /></div>" +
							"<div class='sessionElement'><input type='text' value='{3}' /></div>" +
                            "<div class='sessionElement'><input type='text' value='{4}' /></div>" +
							"<div class='sessionElement'><input type='text' value='{5}' /></div>" +
                            "<div class='ClearBoth'></div>" +
						"</div>";

    var regisUiEvents = function () {
        $(function () {

            $("#" + name + " #sessionXmlArea").hide();

            $("#" + name + " .addNewSession").click(function () {
                $("#" + name + " .sVariables").append(sessionTemplate.format("", "", "", "", "", ""));
            });

            $("#" + name + " .variable #rSV").live("click", function () {
                $(this).parent().parent().remove();
            });

            $("#" + name + " #ttSession").click(function () {
                var cStr = $("#" + name + " #commandline").val();

                cStr = $.trim(cStr);
                var taskCode = cStr.substr(0, cStr.indexOf(" ")).replace(/"/g, "");
                $("#taskcode").val(taskCode);

                var sInx = cStr.indexOf(" ");
                cStr = cStr.substr(sInx + 1, cStr.length - sInx);
                var appDomain = cStr.substr(0, cStr.indexOf(" ")).replace(/"/g, "");
                $("#appdomain").val(appDomain);

                sInx = cStr.indexOf(" ");
                cStr = cStr.substr(sInx + 1, cStr.length - sInx);

                var jarray = $.parseJSON("[" + cStr.replace(/"/g, "").replace(/'/g, "\"") + "]");

                $("#" + name + " .sVariables").empty();
                var content = "";
                for (var i = 0; i < jarray.length; i++) {
                    var sname = jarray[i].Name == null ? "Unknown" : jarray[i].Name;
                    var svalue = jarray[i].Value == null ? "" : jarray[i].Value;
                    var dType = jarray[i].DataType == null ? "nvarchar" : jarray[i].DataType;
                    var isConstant = jarray[i].IsConstant == null ? "0" : jarray[i].IsConstant;
                    var isKey = jarray[i].IsKey == null ? "0" : jarray[i].IsKey;
                    var keyIndex = jarray[i].KeyIndex == null ? i : jarray[i].KeyIndex;

                    var sContent = sessionTemplate.format(sname, svalue, dType, isConstant, isKey, keyIndex);
                    content += sContent;
                }

                $("#" + name + " .sVariables").append(content);
                $("#" + name + " #sessionXmlArea").show();
            });

            $("#" + name + " #cSession").click(function () {
                //var sXml = "<SessionVariables>{0}</SessionVariables>";
                var sXml = "";
                $("#" + name + " .variable").each(function () {
                    var sname = $(this).find("input").eq(0).val();
                    var svalue = $(this).find("input").eq(1).val();
                    var dType = $(this).find("input").eq(2).val();
                    var isConstant = $(this).find("input").eq(3).val();
                    var isKey = $(this).find("input").eq(4).val();
                    var keyIndex = $(this).find("input").eq(5).val();

                    var content = "<SessionVariable><Name>{0}</Name><Value>{1}</Value>" +
                                    "<DataType>{2}</DataType><IsConstant>{3}</IsConstant>" +
	                                "<IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>";

                    sXml += content.format(sname, svalue, dType, isConstant, isKey, keyIndex);
                });

                sXml = "<SessionVariables>{0}</SessionVariables>".format(sXml);

                var wProxy = new webProxy();
                var sContext = {
                    appDomain: $("#appdomain").val(),
                    sessionVariables: sXml,
                    taskCode: $("#taskcode").val()
                };

                wProxy.createSessionByTaskCode(sContext, function (response) {
                    isSessionCreated = true;
                    document.getElementById("taskProcessIndicator").Content.SL_Agent.InitParams(response, $("#appdomain").val(), $("#taskcode").val(),"TaskProcess");
                });
            });
        });
    };




    this.refresh = function (vContext) {

    };

    this.render = function () {
        var content = viewTemplate;
        $("#" + viewContext.viewSessionDivId).empty();

        $("#" + viewContext.viewSessionDivId).append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};
viewSession.prototype = new viewBase();
