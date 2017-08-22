viewFormSessionVariables = function (globalObj) {
    var viewGlobalObj = globalObj;
    var callbackObj = {};
    //var sessionServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/SessionManagementService.svc/jsAccessEP/";
    var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";

    var viewTemplate = "<div style='height:400px;marging:0;border:1px solid #808080;padding:0;overflow: auto;'>" +
                            "<div style='width:910px'>" +
                                "<div class='grayDivTableHead' id='addVariable' style='width:14px;cursor:pointer;'><div style='padding-top:8px;'><img src='../img/add.png' alt='Add Param' class='addRemoveImgButton'/></div></div>" +
                                "<div class='grayDivTableHead'>Name</div>" +
                                "<div class='grayDivTableHead'>Value</div>" +
                                "<div class='grayDivTableHead'>DataType</div>" +
                                "<div class='grayDivTableHead' style='width:90px'>IsConstant</div>" +
                                "<div class='grayDivTableHead' style='width:90px'>IsKey</div>" +
                                "<div class='grayDivTableHeadRight' style='width:90px'>KeyIndex</div>" +
                                "<div class='ClearBoth'></div>" +
                            "</div>" +
                            "<div id='variables'></div>" +
                       "</div>";

    var variableTemplate = "<div id='variable' style='width:910px;'>" +
                                "<div id='removeVariable' style='padding:5px;cursor:pointer; width:14px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><div style='padding-top:5px;'><img src='../img/remove.png' alt='Remove Param' class='addRemoveImgButton'/></div></div>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='{0}'></div>" +
                                "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='{1}'></div>" +
							    "<div style='padding:5px;width:180px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' value='{2}'></div>" +
                                "<div style='padding:5px;width:90px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' style='width:75px' value='{3}'></div>" +
                                "<div style='padding:5px;width:90px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;border-right:none;'><input type='text' style='width:75px' value='{4}'></div>" +
							    "<div style='padding:5px;width:90px;height:20px;background:#f8f8f8;float:left;border:#BDBDBD solid 1px;border-top:none;'><input type='text' style='width:75px' value='{5}'></div>" +
                                "<div class='ClearBoth'></div>" +
                           "</div>";

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var showVariables = function () {
        $("#variables").empty();
        var cStr = viewGlobalObj.variableJson;
        if (cStr != "" && cStr != undefined) {
            var content = "";
            var variableXml = $.parseXML(cStr);
            $(variableXml).find("SessionVariable").each(function (key, value) {
                var sname = ($($(this).find("Name"))).text() == null ? "" : ($($(this).find("Name"))).text();
                var svalue = ($($(this).find("Value"))).text() == null ? "" : ($($(this).find("Value"))).text();
                var dType = ($($(this).find("DataType"))).text() == null ? "nvarchar" : ($($(this).find("DataType"))).text();
                var isConstant = ($($(this).find("IsConstant"))).text() == null ? "0" : ($($(this).find("IsConstant"))).text();
                var isKey = ($($(this).find("IsKey"))).text() == null ? "0" : ($($(this).find("IsKey"))).text();
                var keyIndex = ($($(this).find("KeyIndex"))).text() == null ? "0" : ($($(this).find("KeyIndex"))).text()

                var sContent = variableTemplate.format(sname, svalue, dType, isConstant, isKey, keyIndex);
                content += sContent;
            });
            $("#variables").append(content);
        }

        $("#variables").find("input").each(function () {
            $(this).blur(function () {
                assembleVaviables();
            });
        });
    }

    var assembleVaviables = function () {
        var sXml = "";
        $("#variables").find("#variable").each(function () {
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
        if (sXml != "") {
            sXml = "<SessionVariables>{0}</SessionVariables>".format(sXml);
        }
        viewGlobalObj.variableJson = sXml;
        callbackObj.onXmlUpdate(viewGlobalObj, ["TaskMethods"]);
    }
    
    var regisUiEvents = function () {
        $(function () {
            $("#removeVariable").live("click", function () {
                $(this).parent().remove();
                assembleVaviables();
            });

            $("#addVariable").live("click", function () {
                var content = "";
                content = variableTemplate.format("", "", "nvarchar", "0", "0", "0");
                $("#variables").append(content);
                $("#variables").find("input").each(function () {
                    $(this).blur(function () {
                        assembleVaviables();
                    });
                });
            });
        });
    };

    this.onXmlUpdate = function (callback) {
        callbackObj.onXmlUpdate = callback;
    };

    this.refreshGlobalObj = function (globalObj) {
        viewGlobalObj = globalObj;
    };

    this.refreshViews = function () {
        showVariables();
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divVariablePannel").empty();
        $("#divVariablePannel").append(content);
        postRender();
    };


    var postRender = function () {
        regisUiEvents();
    };

};


