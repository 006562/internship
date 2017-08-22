var trustId;
var hasbindBondFeeName = [];

var currentScenarioName = "";
var scenarioNames = [];
var subScenarioName1 = "";
var subScenarioName2 = "";

var DataFromDB = [];
var DataSpecialFromDB = [];
var DataOfBondFees = [];
var specialSuffix1 = '_加速清偿';
var specialSuffix2 = '_非加速清偿';

//偿付情景Tab模板
//var scenarioTemplate = "<div class='{1}'>{0}</div><div style='width:5px;float:left'></div>";
var scenarioTemplate = "<div class='{1}'>{0}</div>";
//定义债券费用元素模板；
var levelObjectTemplate = "<div class='objElement' title='{0}' bfname='{1}' bftype='{2}' bfclasstype='{3}' bfcode='{4}'>{0}</div>";
//可拖拽区域剩余模板元素；
var content = '';
$(function () {

    trustId = getUrlParam("tid");

    $("#bt_review").anyDialog({
        width: 900,	// 弹出框内容宽度
        height: 600, // 弹出框内容高度
        title: '偿付情景',	// 弹出框标题
        url: "../../../TrustManagement/PaySequenceDisplayer/PaySequenceDisplayer.html?tid=" + trustId,
        onClose: function () {
            //关闭的回调 list 的刷新方             
        }
    });

    var w = parent.document.documentElement.clientHeight;
    $("#divPanel").height(w - 175);
    $("#sortable_div").height(w - 175 - 10);
    $("#divPayment").height(w - 175 - 10);

    $(".gridTemplate").each(function (n, grid) {
        $(this).kendoGrid({
            dataSource: { data: [] },
            columns: [
                { field: "Id", title: "序号", width: "6%" },
                { field: "BondFees", title: "债券费用元素", width: "38%" },
                { field: "PayLimitation", title: "支付限额（元）", width: "12%" },
                { field: "PercentageOfSurplus", title: "剩余资金分配方式", width: "14%" },
                { field: "AllocationRuleOfSameLevel", title: "同级分配", width: "16%" },
                { field: "FillByPrincipal", title: "是否本金补足", width: "14%" }],
            rowTemplate: kendo.template($("#rowTemplate" + (n + 1)).html()),
            height: 400,
            pageable: false
        });
    });



    //获取所有债券及费用元素；
    var executeParam = {
        'SPName': "usp_GetTrustBondFees", 'SQLParams': [
            { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' }
        ]
    };
    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, getAllScenariosPaymentSequence);
});

function getAllScenariosPaymentSequence(bondFeeData) {
    //一次性获取所有元素
    DataOfBondFees = bondFeeData;
    var executeParam = {
        'SPName': "usp_GetTrustPaymentSequence", 'SQLParams': [
            { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' }
        ]
    };
    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, function (data) {

        //DataFromDB = $.grep(data, function (d, i) { return d.ScenarioName.indexOf(specialSuffix) == -1; });
        //DataSpecialFromDB = $.grep(data, function (d, i) { return d.ScenarioName.indexOf(specialSuffix) != -1; });
        DataFromDB = data;
        var context = "{'SPName':'usp_GetTrustPeriod','SQLParams':[" +
                   "{'Name':'TrustPeriodType','Value':'PaymentDate_CF','DBType':'string'}," +
                   "{'Name':'TrustId','Value':'" + trustId + "','DBType':'int'}]}&resultType=";
        var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?appDomain=TrustManagement&executeParams=" + context;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/xml;charset=utf-8",
            async: false,
            success: function (response) {
                if (typeof response == "string")
                    response = JSON.parse(response);

                //初始化日期下拉框
                $.each(response, function (n, res) {
                    var start = timeStamp2String(new Date(eval(res.StartDate.replace("/Date(", "").replace(")/", ""))));
                    var end = timeStamp2String(new Date(eval(res.EndDate.replace("/Date(", "").replace(")/", ""))));
                    $("#PeriodStart").append(("<option value='{0}'>{0}</option>").format(start));
                    $("#PeriodEnd").append(("<option value='{0}'>{0}</option>").format(end));
                });

                //初始化偿付情景
                writeScenarioList();

                //注册偿付情景公有事件
                $("#checkPeriod").click(periodcheckchange);
                $("#bt_Save").click(saveScenarioSequence);
                
                //注册tab点击事件
                registerTabEvent();

                $("#sScenarioList").children().first().click();
                $("#tabs li a").first().click();

                var number = new FormatNumber();
                $('.PayLimitation').on('keyup', function (e) {
                    var value = $(this).val();
                    $(this).val(number.convertNumberN(1, value));
                });

                $('.PayLimitation').each(function () {
                    var $this = $(this);
                    if ($this.val() != '') {
                        $this.val(number.convertNumberN(1, $this.val()));
                    }
                });
                $("#panelbar").kendoPanelBar({
                    animation: {
                        expand: {
                            duration: 500,
                            effects: "expandVertical"
                        }
                    }


                });
            },
            error: function (response) { alert("error:" + response); }
        });


    });


}
var SortAbleClone = (function () {
    var parent, prev, next;
    function init(_parent, _prev, _next) {
        parent = _parent;
        prev = _prev;
        next = _next;
    }
    function clone(item) {
        if (prev.length > 0) {
            prev.after(item);
        } else if (next.length > 0) {
            next.before(item);
        } else if (parent.length > 0) {
            parent.append(item);
        }
    }
    return {
        Init: init,
        Clone: clone
    }
})();
var registerTabEvent = function () {

    $("#tabs li").click(function () {
        $("#tabs li").each(function () {
            $(this).attr("class", "tabsLi");
        })
        $(this).addClass("divTabActive");
    });

    $("#sScenarioList .divTabLi").each(function () {
        $(this).click(function () {
            $("#sScenarioList").find("div").each(function () {
                $(this).attr("class", "divTabLi");
            })
            $(this).addClass("divTabActive");
            currentScenarioName = $(this).find("span").first().text();
            $("#PeriodStart").get(0).selectedIndex = 0;
            $("#PeriodEnd").get(0).selectedIndex = 0;
            if (currentScenarioName != "") {

                var specialData = $.grep(DataFromDB, function (d, i) { return d.PaymentPhaseName == currentScenarioName; });
                switch (specialData.length) {
                    case 0:
                        subScenarioName1 = currentScenarioName + specialSuffix1;
                        subScenarioName2 = currentScenarioName + specialSuffix2;
                        break;
                    case 1:
                        if (specialData[0].ScenarioType == "1") {
                            subScenarioName1 = specialData[0].ScenarioName;
                            subScenarioName2 = currentScenarioName + specialSuffix2;
                        }
                        if (specialData[0].ScenarioType == "0") {
                            subScenarioName1 = currentScenarioName + specialSuffix1;
                            subScenarioName2 = specialData[0].ScenarioName;
                        }
                        break;
                    case 2:
                        $.each(specialData, function (n, dataObj) {
                            if (dataObj.ScenarioType == "1") {
                                subScenarioName1 = dataObj.ScenarioName;
                            }
                            if (dataObj.ScenarioType == "0") {
                                subScenarioName2 = dataObj.ScenarioName;
                            }
                        });
                        break;
                }

                if (specialData.length > 0) {

                    var obj = JSON.parse(specialData[0].PaymentSequence);
                    if (obj.StartDate != "" && obj.EndDate != "") {
                        $("#checkPeriod").prop("checked", "checked");
                        $("#PeriodStart").val(obj.StartDate);
                        $("#PeriodEnd").val(obj.EndDate);
                    }
                    else {
                        $("#checkPeriod").removeAttr("checked");
                    }
                    periodcheckchange();

                    if (obj.AllowInterestToPrincipal) {
                        $("#checkInterest").prop("checked", "checked");
                    }
                    else {
                        $("#checkInterest").removeAttr("checked");
                    }

                    $("#principalP").val(obj.PrincipalPrecision);
                    $("#interestP").val(obj.InterestPrecision);

                    //根据第一个偿付情景，生成1，2，4区域
                    for (var i = 1; i <= 4; i++) {
                        var source = generateSourceObj(obj.Levels, i);
                        var dataSource = new kendo.data.DataSource({
                            data: source
                        });
                        var grid = $("#grid" + i).data("kendoGrid");
                        grid.setDataSource(dataSource);
                    }

                    //根据第二个偿付情景，生成2或3
                    for (var index = 1; index < specialData.length; index++) {
                        var objNext = JSON.parse(specialData[index].PaymentSequence);

                        for (var j = 2; j <= 3; j++) {
                            //如果当前区域没有条目，不替换该区域
                            var levels = $.grep(objNext.Levels, function (n) {
                                return n.AreaId == j;
                            });
                            if (levels.length > 0) {
                                var source = generateSourceObj(objNext.Levels, j);

                                if (source.length > 0) {
                                    var dataSource = new kendo.data.DataSource({
                                        data: source
                                    });
                                    var grid = $("#grid" + j).data("kendoGrid");
                                    grid.setDataSource(dataSource);
                                }
                            }
                        }
                    }

                    $("#sortable_div").empty();
                    content = "";
                    $.each(DataOfBondFees, function (n, levelObj) {
                        content += levelObjectTemplate.format(levelObj.TrustFeeDisplayName, levelObj.Name, levelObj.Type, levelObj.ClassType, levelObj.Code);
                    });
                    $("#sortable_div").append(content);

                    //$("#sortable_div, .sortable_td").sortable({
                    //    connectWith: "#sortable_div,.sortable_td",
                    //    items: '.objElement',
                    //    scroll: true
                    //});

                    $(".sortable_td").sortable({
                        connectWith: "#sortable_div,.sortable_td",
                        receive: function (event, ui) {
                            SortAbleClone.Clone(ui.item.clone());
                            SortAbleClone.Init(null, null, null);
                        }
                    });

                    $("#sortable_div").sortable({
                        connectWith: "#sortable_div, .sortable_td",
                        receive: function (event, ui) {
                            ui.item.remove();
                        },
                        start: function (event, ui) {
                            console.log(1);
                            SortAbleClone.Init(ui.item.parent(), ui.item.prev(), ui.item.next().next());
                        }
                    });

                    //$("ul, li").disableSelection();

                    $(".objElement").each(function () {
                        if ($(this).attr("bftype") == "Fee") {
                            $(this).addClass("feeElement");
                        }
                        else {
                            $(this).addClass("bondElement");
                        }
                    });

                    //增加功能，如果存在费用信息，剔除select中的按本金支付
                    $(".sortable_td .feeElement").mouseout(function () {
                        $(this).trigger("Target");
                    })

                    $("tr").bind("Target", function () {
                        $(this)[0].children[4].innerHTML = '<select><option value="ABasedOnAVG">平均分配</option><option selected="selected" value="ABasedOnDue">按应付金额</option></select>';
                    });

                    $(".sortable_td .feeElement").mouseup(function () {
                        $(this).trigger("Source");
                    })

                    $("tr").bind("Source", function () {
                        var self = $(this)
                        var node = $(this)[0].children[1].children;
                        var isContainsFee = false;
                        //不使用异步队列会导致第一时间移走的div存在于当前tr内
                        setTimeout(function () {
                            for (var i = 0; i < node.length; i++) {
                                if (node[i].getAttribute('bftype') == 'Fee') {
                                    isContainsFee = true;
                                }
                            }
                            if (!isContainsFee) {
                                self[0].children[4].innerHTML = '<select><option value="ABasedOnCPB">按剩余本金</option><option value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue" selected="selected">按应付金额</option></select>';
                            }
                        }, 10)
                    });
                }
            }

        });
        if ($(this).find("span").first().attr('id') == 'AddNewScenario') {
            $(this).unbind('click');
        }
    });
};

var generateSourceObj = function (hasLevels, areaId) {
    var LevelsList = [];
    if (DataOfBondFees.length > 0) {
        var count = DataOfBondFees.length;
        var levels = $.grep(hasLevels, function (n) {
            return n.AreaId == areaId;
        });

        for (var i = 1; i <= count; i++) {
            var obj;

            var level = $.grep(levels, function (n) {
                return n.Id == i;
            });
            var allocationselect = '<select><option value="ABasedOnCPB">按剩余本金</option><option value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue" selected="selected">按应付金额</option></select>';
            if (level.length > 0) {
                var content = "";
                if (level[0].BondFees.length > 0) {
                    $.each(level[0].BondFees, function (n, bondfeeObj) {
                        content += levelObjectTemplate.format(bondfeeObj.DisplayName, bondfeeObj.Name, bondfeeObj.Type, bondfeeObj.ClassType, bondfeeObj.Code);
                    });
                }
                var fillbyhtml = "";
                if (level[0].FillByPrincipal) {
                    fillbyhtml = "<input type='checkbox' checked='checked' />";
                }
                else {
                    fillbyhtml = "<input type='checkbox' />";
                }

                if (level[0].AllocationRuleOfSameLevel == "ABasedOnCPB") {
                    allocationselect = '<select><option selected="selected" value="ABasedOnCPB">按剩余本金</option><option value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue">按应付金额</option></select>';
                }
                else if (level[0].AllocationRuleOfSameLevel == "ABasedOnAVG") {
                    var isContainsFee = false
                    for (var j = 0; j < level[0].BondFees.length; j++) {
                        if (level[0].BondFees[j].Type == 'Fee')
                        { isContainsFee = true; }
                    }
                    if (isContainsFee) {
                        allocationselect = '<select><option  selected="selected" value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue">按应付金额</option></select>';
                    }
                    else {
                        allocationselect = '<select><option value="ABasedOnCPB">按剩余本金</option><option  selected="selected" value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue">按应付金额</option></select>';
                    }

                }
                else if (level[0].AllocationRuleOfSameLevel == "ABasedOnDue") {
                    var isContainsFee = false;
                    for (var j = 0; j < level[0].BondFees.length; j++) {
                        if (level[0].BondFees[j].Type == 'Fee')
                        { isContainsFee = true; }
                    }
                    if (isContainsFee) {
                        allocationselect = '<select><option value="ABasedOnAVG">平均分配</option><option  selected="selected" value="ABasedOnDue">按应付金额</option></select>';
                    }
                    else {
                        allocationselect = '<select><option value="ABasedOnCPB">按剩余本金</option><option value="ABasedOnAVG">平均分配</option><option  selected="selected" value="ABasedOnDue">按应付金额</option></select>';
                    }
                }

                obj = generateLevelObj(level[0].Id, content, level[0].PayLimitation, level[0].PercentageOfSurplus, allocationselect, fillbyhtml);
            }
            else {
                obj = generateLevelObj(i, "", "", "", allocationselect, "<input type='checkbox' />");
            }
            LevelsList.push(obj);
        }
    }
    return LevelsList;
}

var generateLevelObj = function (id, bondfees, paylimitation, percent, allocationrule, fillbyprincipal) {
    var obj = new Object();
    obj.Id = id;
    obj.BondFees = bondfees;
    obj.PayLimitation = paylimitation;
    obj.PercentageOfSurplus = percent;
    obj.AllocationRuleOfSameLevel = allocationrule;
    obj.FillByPrincipal = fillbyprincipal;
    return obj;

}


var writeScenarioList = function () {
    $("#sScenarioList").empty();
    var contentScenarioList = "";
    $.each(DataFromDB, function (index, dataObj) {
        var vScenarioName = dataObj.PaymentPhaseName;
        if ($.inArray(vScenarioName, scenarioNames) > -1)
        { return true; }
        scenarioNames.push(vScenarioName);
        var scenarioText = "<span style='width:100%;'>" + vScenarioName + "</span><span class='removeScenario' style='float:right'> X </span>";
        contentScenarioList += scenarioTemplate.format(scenarioText, "divTabLi");
    });
    $("#sScenarioList").append(contentScenarioList);
    $(".removeScenario").click(removeScenario);
    addNewScenarioToList();
}

//新建偿付情景并注册点击事件
var addNewScenarioToList = function () {

    var addText = "<span id='AddNewScenario' style='width:100%;'> + </span>";
    $("#sScenarioList").append(scenarioTemplate.format(addText, "divTabLi"));

    $("#AddNewScenario").click(function () {
        $("#AddNewScenario").html("<input id='toSelect' style='width:90px;margin-top:4px;'></input>");
        $("#AddNewScenario").unbind("click");
        $("#toSelect").change(function () {
            var itemText = $(this).val();
            if (itemText != "") {
                if ($.inArray(itemText, scenarioNames) > -1) {
                    alert("该偿付情景已经存在！");
                    $("#toSelect").val("");
                    return;
                }
                $("#AddNewScenario").html(itemText);
                $("#AddNewScenario").parent().append("<span class='removeScenario' style='float:right;'> X </span>")

                $(".removeScenario").click(removeScenario);

                $("#AddNewScenario").parent().click(function () {
                    $("#sScenarioList").find("div").each(function () {
                        $(this).attr("class", "divTabLi");
                    });
                    $("#AddNewScenario").parent().addClass("divTabActive");
                    currentScenarioName = $("#AddNewScenario").text();
                    subScenarioName1 = currentScenarioName + "_加速清偿";
                    subScenarioName2 = currentScenarioName + "_非加速清偿";

                    $("#PeriodStart").get(0).selectedIndex = 0;
                    $("#PeriodEnd").get(0).selectedIndex = 0;
                    $("#checkPeriod").removeAttr("checked");
                    periodcheckchange();
                    $(".periodfields").hide();
                    $("#checkInterest").removeAttr("checked");
                    $("#principalP").val("");
                    $("#interestP").val("");

                    $(".gridTemplate").each(function (n, grid) {
                        var source = generateSourceObj([]);
                        var dataSource = new kendo.data.DataSource({
                            data: source
                        });
                        var grid = $(this).data("kendoGrid");
                        grid.setDataSource(dataSource);
                    });
                    $("#sortable_div").empty();

                    content = "";
                    $.each(DataOfBondFees, function (n, levelObj) {
                        content += levelObjectTemplate.format(levelObj.TrustFeeDisplayName, levelObj.Name, levelObj.Type, levelObj.ClassType, levelObj.Code);
                    });

                    $("#sortable_div").append(content);

                    $("#sortable_div, .sortable_td").sortable({
                        connectWith: "#sortable_div,.sortable_td",
                        items: '.objElement',
                        scroll: true
                    });

                    $(".objElement").each(function () {
                        if ($(this).attr("bftype") == "Fee") {
                            $(this).addClass("feeElement");
                        }
                        else {
                            $(this).addClass("bondElement");
                        }
                    });

                });
                $("#AddNewScenario").parent().click();
            }
            else {
                $("#AddNewScenario").html(addText);
            }
        });
    });
};

var removeScenario = function () {

    if (confirm('确定删除偿付情景吗？')) {

        var selectScenarioName = $(this).parent().find("span").eq(0).text();
        if ($.inArray(selectScenarioName, scenarioNames) > -1) {
            var executeParam = {
                SPName: 'usp_RemoveTrustPaymentSequenceHN', SQLParams: [
                    { Name: 'TrustId', value: trustId, DBType: 'string' },
                    { Name: 'PaymentPhaseName', value: selectScenarioName, DBType: 'string' },
                ]
            };

            ExecuteRemoteData(executeParam, function () {

                scenarioNames.remove(selectScenarioName);
                //alert("删除偿付情景成功！");          
            });
        }
        $(this).parent().remove();

        //若删除的为新建偿付情景，添加+Tab
        if ($("#AddNewScenario").length == 0) {
            addNewScenarioToList();
        }
        currentScenarioName = "";
        $("#sScenarioList").children().first().click();
    }
};

var periodcheckchange = function () {
    if ($("#checkPeriod").prop("checked")) {
        $(".periodfields").show();
    }
    else {
        $(".periodfields").hide();
    }

};

var saveScenarioSequence = function () {
    if (currentScenarioName == "") {
        alert("请添加新的偿付情景");
        return false;
    }
    var scenarioObj1 = new Object();
    var scenarioObj2 = new Object();

    scenarioObj1.TrustId = trustId;
    scenarioObj2.TrustId = trustId;

    scenarioObj1.ScenarioName = subScenarioName1;
    scenarioObj2.ScenarioName = subScenarioName2;


    if ($("#checkPeriod").prop("checked")) {
        scenarioObj1.StartDate = $("#PeriodStart").val();
        scenarioObj1.EndDate = $("#PeriodEnd").val();

        scenarioObj2.StartDate = $("#PeriodStart").val();
        scenarioObj2.EndDate = $("#PeriodEnd").val();
    }
    else {
        scenarioObj1.StartDate = "";
        scenarioObj1.EndDate = "";

        scenarioObj2.StartDate = "";
        scenarioObj2.EndDate = "";
    }

    scenarioObj1.PrincipalPrecision = $("#principalP").val();
    scenarioObj1.InterestPrecision = $("#interestP").val();
    scenarioObj1.AllowInterestToPrincipal = $("#checkInterest").prop("checked") ? true : false;

    scenarioObj2.PrincipalPrecision = $("#principalP").val();
    scenarioObj2.InterestPrecision = $("#interestP").val();
    scenarioObj2.AllowInterestToPrincipal = $("#checkInterest").prop("checked") ? true : false;

    var levels1 = [];
    var levels2 = [];
    for (var j = 1; j <= 4; j++) {
        var jgrid = "#grid" + j + " tbody tr";
        $(jgrid).each(function () {
            var level = new Object();
            level.AreaId = j;
            var isAddtoArray = true;
            $(this).find("td").each(function (i, ele) {

                level.AreaId = j;
                if (i == 0) {
                    level.Id = $(ele).find("span").first().text();
                }
                else if (i == 1) {
                    var bondfeeArray = [];
                    if ($(ele).find("div").length > 0) {
                        $(ele).find("div").each(function () {
                            var bondfee = new Object();
                            bondfee.Name = $(this).attr("bfname");
                            bondfee.Type = $(this).attr("bftype");
                            bondfee.ClassType = $(this).attr("bfclasstype");
                            bondfee.Code = $(this).attr("bfcode");
                            bondfee.DisplayName = $(this).text();
                            bondfeeArray.push(bondfee);
                        });
                        level.BondFees = bondfeeArray;
                    }
                    else {
                        isAddtoArray = false;
                        return false;
                    }
                }
                else if (i == 2) {
                    level.PayLimitation = $(ele).find("input").first().val().replace(/,/g, "");
                }
                else if (i == 3) {
                    level.PercentageOfSurplus = $(ele).find("input").first().val();
                }
                else if (i == 4) {
                    level.AllocationRuleOfSameLevel = $(ele).find("select").first().val();
                }
                else if (i == 5) {
                    level.FillByPrincipal = $(ele).find("input").first().prop("checked") ? true : false;
                }
            });
            if (isAddtoArray) {
                if (j == 2) { levels1.push(level); }
                else if (j == 3) { levels2.push(level); }
                else {
                    levels1.push(level);
                    levels2.push(level);
                }

            }
        });

    }

    scenarioObj1.Levels = levels1;
    scenarioObj2.Levels = levels2;


    var scenariotoJsonStr1 = JSON.stringify(scenarioObj1);
    var executeParam1 = {
        SPName: 'usp_SaveTrustPaymentSequenceHN', SQLParams: [
            { Name: 'TrustId', value: trustId, DBType: 'string' },
            { Name: 'ScenarioName', value: scenarioObj1.ScenarioName, DBType: 'string' },
            { Name: 'StartDate', value: scenarioObj1.StartDate, DBType: 'string' },
            { Name: 'EndDate', value: scenarioObj1.EndDate, DBType: 'string' },
            { Name: 'PrincipalPrecision', value: scenarioObj1.PrincipalPrecision, DBType: 'string' },
            { Name: 'InterestPrecision', value: scenarioObj1.InterestPrecision, DBType: 'string' },
            { Name: 'PaymentSequence', value: scenariotoJsonStr1, DBType: 'string' },
            { Name: 'ScenarioType', value: 1, DBType: 'int' },
            { Name: 'PaymentPhaseName', value: currentScenarioName, DBType: 'string' }
        ]
    };

    var scenariotoJsonStr2 = JSON.stringify(scenarioObj2);
    var executeParam2 = {
        SPName: 'usp_SaveTrustPaymentSequenceHN', SQLParams: [
            { Name: 'TrustId', value: trustId, DBType: 'string' },
            { Name: 'ScenarioName', value: scenarioObj2.ScenarioName, DBType: 'string' },
            { Name: 'StartDate', value: scenarioObj2.StartDate, DBType: 'string' },
            { Name: 'EndDate', value: scenarioObj2.EndDate, DBType: 'string' },
            { Name: 'PrincipalPrecision', value: scenarioObj2.PrincipalPrecision, DBType: 'string' },
            { Name: 'InterestPrecision', value: scenarioObj2.InterestPrecision, DBType: 'string' },
            { Name: 'PaymentSequence', value: scenariotoJsonStr2, DBType: 'string' },
            { Name: 'ScenarioType', value: 0, DBType: 'int' },
            { Name: 'PaymentPhaseName', value: currentScenarioName, DBType: 'string' }
        ]
    };

    ExecuteRemoteData(executeParam1, function () {
        ExecuteRemoteData(executeParam2, function (postbackdata) {
            //新建偿付情景保存成功之后允许创建新的
            if ($("#AddNewScenario").text() != " + ") {
                $("#AddNewScenario").parent().unbind("click");
                $("#AddNewScenario").removeAttr("id");
                scenarioNames.push(currentScenarioName);
                registerTabEvent();
                addNewScenarioToList();
            }

            //保存成功后刷新数据，方便前台显示
            var executeParam = {
                'SPName': "usp_GetTrustPaymentSequence", 'SQLParams': [
                    { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' }
                ]
            };
            var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
            ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, function (data) {
                DataFromDB = data;

                alert("支付顺序保存成功！");
            });
        });
    });
};

var ExecuteRemoteData = function (executeParam, callback) {
    //var executeParams = encodeURIComponent(JSON.stringify(executeParam));
    var executeParams = JSON.stringify(executeParam);

    var params = '';
    params += '<root appDomain="TrustManagement" postType="">';// appDomain="TrustManagement"
    params += executeParams;
    params += '</root>';

    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonPostExecute";

    $.ajax({
        type: "POST",
        url: serviceUrl,
        dataType: "json",
        contentType: "application/xml;charset=utf-8",
        data: params,
        processData: false,
        success: function (response) {
            callback(response);
        },
        error: function (response) { alert("error is :" + response); }
    });
}

var getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

var timeStamp2String = function (time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    return year + "-" + month + "-" + date;
}

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
};


