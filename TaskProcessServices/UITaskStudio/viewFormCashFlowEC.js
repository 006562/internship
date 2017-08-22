viewFormCashFlowEC = function (vContext) {
    vContext.name = "viewECForm";
    this.init(vContext);
    var name = this.name;
    var viewContext = vContext;
    var taskXml = vContext.model;
    var callbackObj = {};

    var xmlDoc = $.parseXML(taskXml);

    var viewTemplate = "<div>" +
						    "<div class='actions'>$viewForm$</div>" +
						    "<div class='updateButton'><input type='button' value='Update' class='update' id='updateECForm' /></div>" +
						"</div>";

    var ECHeaderTemplate =
                            "<div><div class='actionHeader1'>" +
                                "<div class='actionHeaderElement'>CashFlow Name</div>" +
                            "</div></div>";

    var ECTemplate = "<div class='action'>" +
                            "<div class='ClearBoth'></div>" +
							 "<div class='actionElement'>" +
                                "<img src='../img/add.png' alt='Add Parameter' id='addAction_$CashFlowName$' class='addRemoveImgButton'/>" +
                                "<img src='../img/remove.png' alt='Remove Action' id='removeAction_$CashFlowName$' class='addRemoveImgButton'/> " +
                                "<input type='text' value='$CashFlowName$'>" +
                            "</div>" +
                            "<div class='actionElement'><input type='button' value='...' style='width: 40px;  height: 20px;' id='showEquation_$CashFlowName$' data-actionCode='$CashFlowName$'/></div>" +
						    "<div class='ClearBoth'></div>" +
                            "<div class='equationArea' style='display:none'>" +
                                "<div class='ClearBoth'></div>" +
                                "<div class='actionHeaderElement'>CashFlow Equation</div>" +
							    "<div class='ClearBoth'></div>" +
                                "<p><textarea id='sessionFile_$CashFlowName$' cols='150' rows='12' style='background-color: lightyellow'>$CashFlowEquation$</textarea></p>" +
                                "<div class='ClearBoth'></div>" +
                            "</div>" +
                            "<div class='ClearBoth'></div>" +
                        "</div>";

    var regisUiEvents = function () {
        $(function () {
            // update event
            $("#" + name + " #updateECForm").click(function () {
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

            $('[id^=showEquation_]').each(function () {
                $(this).live("click", function () {
                    $(this).parent().parent().find(".equationArea").toggle(200);
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

    var getECContent = function (ecCode, ecName, query) {
        var aContent = ECTemplate.replace(/\$CashFlowName\$/g, ecCode); //str.replace(/abc/g, '')
        aContent = aContent.replace("$CashFlowEquation$", query);

        return aContent;
    };

    this.render = function () {
        $("#" + viewContext.viewFormDivId).empty();
        var content = "";
        content += ECHeaderTemplate;
        $(xmlDoc).find("Query").each(function (key, value) {
            var aContent = getECContent($(this).attr("name"), $(this).attr("name"), $(this).text());
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
viewFormCashFlowEC.prototype = new viewBase();

// document.getElementById("taskProcessIndicator").Content.SL_Agent.InitByTaskFile("Task", taskFile);
