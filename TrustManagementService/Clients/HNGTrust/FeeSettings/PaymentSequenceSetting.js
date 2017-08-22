var trustId;
var hasbindBondFeeName = [];

var currentScenarioName = "";
var scenarioNames = [];

var DataFromDB = [];
var DataSpecialFromDB = [];
var DataOfBondFees = [];
var specialSuffix = '_加速清偿';

//偿付情景Tab模板
//var scenarioTemplate = "<div class='{1}'>{0}</div><div style='width:5px;float:left'></div>";
var scenarioTemplate = "<div class='{1}'>{0}</div>";
//定义债券费用元素模板；
var levelObjectTemplate = "<div class='objElement' title='{0}' bfname='{1}' bftype='{2}' bfclasstype='{3}' bfcode='{4}'>{0}</div>";
//可拖拽区域剩余模板元素；
var content = '';
$(function () {

    trustId = getUrlParam("tid");

    $("#tabs").tabs();

    $("#grid").kendoGrid({
        dataSource: { data: [] },
        columns: [
            { field: "Id", title: "序号", width: "6%" },
            { field: "BondFees", title: "债券费用元素", width: "44%" },
            { field: "PayLimitation", title: "支付限额（元）", width: "12%" },
            { field: "PercentageOfSurplus", title: "剩余资金分配方式", width: "14%" },
            { field: "AllocationRuleOfSameLevel", title: "同级分配", width: "12%" },
            { field: "FillByPrincipal", title: "是否本金补足", width: "12%" }],
        rowTemplate: kendo.template($("#rowTemplate").html()),
        height:400,
        pageable: false
    });

    $("#grids").kendoGrid({
        dataSource: { data: [] },
        columns: [
            { field: "Id", title: "序号", width: "6%" },
            { field: "BondFees", title: "债券费用元素", width: "44%" },
            { field: "PayLimitation", title: "支付限额（元）", width: "12%" },
            { field: "PercentageOfSurplus", title: "剩余资金分配方式", width: "14%" },
            { field: "AllocationRuleOfSameLevel", title: "同级分配", width: "12%" },
            { field: "FillByPrincipal", title: "是否本金补足", width: "12%" }],
        rowTemplate: kendo.template($("#rowTemplate_s").html()),
        height: 400,
        pageable: false
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

        DataFromDB = $.grep(data, function (d, i) { return d.ScenarioName.indexOf(specialSuffix) == -1; });
        DataSpecialFromDB = $.grep(data, function (d, i) { return d.ScenarioName.indexOf(specialSuffix) != -1; });

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
                $("#bt_review").click(reviewScenario);
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

            },
            error: function (response) { alert("error:" + response); }
        });


    });


}
var registerTabEvent = function ()
{
    
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
                $.each(DataFromDB, function (index, dataObj) {
                    if (dataObj.ScenarioName == currentScenarioName) {

                        var obj = JSON.parse(dataObj.PaymentSequence);

                        if (obj.StartDate != "" && obj.EndDate != "") {
                            $("#checkPeriod").attr("checked", "checked");
                            $("#PeriodStart").val(obj.StartDate);
                            $("#PeriodEnd").val(obj.EndDate);
                        }
                        else {
                            $("#checkPeriod").removeAttr("checked");
                        }
                        periodcheckchange();

                        if (obj.AllowInterestToPrincipal) {
                            $("#checkInterest").attr("checked", "checked");
                        }
                        else {
                            $("#checkInterest").removeAttr("checked");
                        }

                        $("#principalP").val(obj.PrincipalPrecision);
                        $("#interestP").val(obj.InterestPrecision);

                        var source = generateSourceObj(obj.Levels);
                        var dataSource = new kendo.data.DataSource({
                            data: source
                        });
                        var grid = $("#grid").data("kendoGrid");
                        grid.setDataSource(dataSource);
                        
                        $("#sortable_div").empty();
                        content = "";
                        $.each(DataOfBondFees, function (n, levelObj) {
                            if ($.inArray(levelObj.Name, hasbindBondFeeName) == -1) {
                                content += levelObjectTemplate.format(levelObj.TrustFeeDisplayName, levelObj.Name, levelObj.Type, levelObj.ClassType, levelObj.Code);
                            }
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
                            var self=$(this)
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
                            },10)                         
                        });
                        //return false;
                    }
                    
                });

                $.each(DataSpecialFromDB, function (index, dataObj) {
                    if (dataObj.ScenarioName == currentScenarioName + specialSuffix) {
                        var obj = JSON.parse(dataObj.PaymentSequence);
                        var source = generateSourceObj(obj.Levels);
                        var dataSource = new kendo.data.DataSource({
                            data: source
                        });
                        var grids = $("#grids").data("kendoGrid");
                        grids.setDataSource(dataSource);

                        $("#sortable_div_s").empty();
                        content = "";
                        $.each(DataOfBondFees, function (n, levelObj) {
                            if ($.inArray(levelObj.Name, hasbindBondFeeName) == -1) {
                                content += levelObjectTemplate.format(levelObj.TrustFeeDisplayName, levelObj.Name, levelObj.Type, levelObj.ClassType, levelObj.Code);
                            }
                        });
                        $("#sortable_div_s").append(content);

                        $("#sortable_div_s, .sortable_td_s").sortable({
                            connectWith: "#sortable_div_s,.sortable_td_s",
                            items: '.objElement',
                            scroll: true
                        });

                        $("#divs .objElement").each(function () {
                            if ($(this).attr("bftype") == "Fee") {
                                $(this).addClass("feeElement");
                            }
                            else {
                                $(this).addClass("bondElement");
                            }
                        });

                        //增加功能，如果存在费用信息，剔除select中的按本金支付
                        $(".sortable_td_s .feeElement").mouseout(function () {
                            $(this).trigger("Target");
                        })

                        $("#grids tr").bind("Target", function () {
                            $(this)[0].children[4].innerHTML = '<select><option value="ABasedOnAVG">平均分配</option><option selected="selected" value="ABasedOnDue">按应付金额</option></select>';
                        });

                        $(".sortable_td_s .feeElement").mouseup(function () {
                            $(this).trigger("Source");
                        })

                        $("#grids tr").bind("Source", function () {
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
                });
            }

        });
        if ($(this).find("span").first().attr('id') == 'AddNewScenario') {
            $(this).unbind('click');
        }
    });
};

var generateSourceObj = function (hasLevels)
{
    var LevelsList = [];
    if (DataOfBondFees.length > 0)
    {
        var count = DataOfBondFees.length;
        hasbindBondFeeName = [];
        for (var i = 1; i <= count; i++)
        {
            var obj;
            var level = $.grep(hasLevels, function (n)
            {
                return n.Id == i;
            });
            var allocationselect = '<select><option value="ABasedOnCPB">按剩余本金</option><option value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue" selected="selected">按应付金额</option></select>';
            if (level.length > 0) {
                var content = "";
                if (level[0].BondFees.length > 0)
                {                    
                    $.each(level[0].BondFees, function (n, bondfeeObj) {
                        content += levelObjectTemplate.format(bondfeeObj.DisplayName, bondfeeObj.Name, bondfeeObj.Type, bondfeeObj.ClassType, bondfeeObj.Code);
                        hasbindBondFeeName.push(bondfeeObj.Name);
                    });
                }
                var fillbyhtml = "";
                if (level[0].FillByPrincipal) {
                    fillbyhtml = "<input type='checkbox' checked='checked' />";
                }
                else {
                    fillbyhtml = "<input type='checkbox' />";
                }

                if (level[0].AllocationRuleOfSameLevel == "ABasedOnCPB")
                {
                    allocationselect = '<select><option selected="selected" value="ABasedOnCPB">按剩余本金</option><option value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue">按应付金额</option></select>';
                }
                else if (level[0].AllocationRuleOfSameLevel == "ABasedOnAVG")
                {
                    var isContainsFee = false
                    for (var j = 0; j < level[0].BondFees.length; j++) {
                        if (level[0].BondFees[j].Type == 'Fee')
                        {isContainsFee = true;}
                    }
                    if (isContainsFee) {
                        allocationselect = '<select><option  selected="selected" value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue">按应付金额</option></select>';
                    }
                    else {
                        allocationselect = '<select><option value="ABasedOnCPB">按剩余本金</option><option  selected="selected" value="ABasedOnAVG">平均分配</option><option value="ABasedOnDue">按应付金额</option></select>';
                    }
                    
                }
                else if (level[0].AllocationRuleOfSameLevel == "ABasedOnDue")
                {
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

var generateLevelObj=function(id,bondfees,paylimitation,percent,allocationrule,fillbyprincipal)
{
    var obj = new Object();
    obj.Id=id;
    obj.BondFees=bondfees;
    obj.PayLimitation=paylimitation;
    obj.PercentageOfSurplus=percent;
    obj.AllocationRuleOfSameLevel=allocationrule;
    obj.FillByPrincipal=fillbyprincipal;
    return obj;
   
}


var writeScenarioList = function () {
    $("#sScenarioList").empty();
    var contentScenarioList = "";
    $.each(DataFromDB, function (index, dataObj) {
        var vScenarioName = dataObj.ScenarioName;
        scenarioNames.push(vScenarioName);
        var scenarioText = "<span style='width:100%;'>" + vScenarioName + "</span><span class='removeScenario' style='float:right'> X </span>";
        contentScenarioList += scenarioTemplate.format( scenarioText, "divTabLi");      
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
                if ($.inArray(itemText, scenarioNames) > -1)
                {
                    alert("该偿付情景已经存在！");
                    $("#toSelect").val("");
                    return;
                }
                $("#AddNewScenario").html(itemText);
                $("#AddNewScenario").parent().append("<span class='removeScenario' style='float:right;'> X </span>")

                $(".removeScenario").click(removeScenario);

                $("#AddNewScenario").parent().click(function ()
                {                   
                    $("#sScenarioList").find("div").each(function () {
                        $(this).attr("class", "divTabLi");
                    });
                    $("#AddNewScenario").parent().addClass("divTabActive");
                    currentScenarioName = $("#AddNewScenario").text();
                 
                    $("#PeriodStart").get(0).selectedIndex = 0;
                    $("#PeriodEnd").get(0).selectedIndex = 0;
                    $("#checkPeriod").removeAttr("checked");
                    periodcheckchange();
                    $(".periodfields").hide();
                    $("#checkInterest").removeAttr("checked");
                    $("#principalP").val("");
                    $("#interestP").val("");
                           
                    var source = generateSourceObj([]);
                    var dataSource = new kendo.data.DataSource({
                        data: source
                    });

                    var sources = generateSourceObj([]);
                    var dataSources = new kendo.data.DataSource({
                        data: sources
                    });

                    var grid = $("#grid").data("kendoGrid");
                    grid.setDataSource(dataSource);
                   
                    var grids = $("#grids").data("kendoGrid");
                    grids.setDataSource(dataSources);

                    $("#sortable_div").empty();
                    $("#sortable_div_s").empty();

                    content = "";
                    $.each(DataOfBondFees, function (n, levelObj) {
                        if ($.inArray(levelObj.Name, hasbindBondFeeName) == -1) {
                            content += levelObjectTemplate.format(levelObj.TrustFeeDisplayName, levelObj.Name, levelObj.Type, levelObj.ClassType, levelObj.Code);
                        }
                    });

                    $("#sortable_div").append(content);
                    $("#sortable_div_s").append(content);

                    $("#sortable_div, .sortable_td").sortable({
                        connectWith: "#sortable_div,.sortable_td",
                        items: '.objElement',
                        scroll: true
                    });

                    $("#sortable_div_s, .sortable_td_s").sortable({
                        connectWith: "#sortable_div_s,.sortable_td_s",
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
                SPName: 'usp_RemoveTrustPaymentSequence', SQLParams: [
                    { Name: 'TrustId', value: trustId, DBType: 'string' },
                    { Name: 'ScenarioName', value: selectScenarioName, DBType: 'string' },
                ]
            };

            var executeParams = {
                SPName: 'usp_RemoveTrustPaymentSequence', SQLParams: [
                    { Name: 'TrustId', value: trustId, DBType: 'string' },
                    { Name: 'ScenarioName', value: selectScenarioName+specialSuffix, DBType: 'string' },
                ]
            };

            ExecuteRemoteData(executeParam, function () {
                ExecuteRemoteData(executeParams, function (postbackdata) {
                    scenarioNames.remove(selectScenarioName);
                    //alert("删除偿付情景成功！");          
                });
            });
        }
        $(this).parent().remove();

        //若删除的为新建偿付情景，添加+Tab
        if ($("#AddNewScenario").length == 0)
        {
            addNewScenarioToList();
        }
        currentScenarioName = "";
        $("#sScenarioList").children().first().click();
    }
};

var periodcheckchange = function () {
    if ($("#checkPeriod").attr("checked") == "checked") {
        $(".periodfields").show();
    }
    else {
        $(".periodfields").hide();
    }

};

var saveScenarioSequence = function ()
{
    if (currentScenarioName == "")
    {
        alert("请添加新的偿付情景");
        return false;
    }
    var scenarioObj = new Object();
    var scenarioObjs = new Object();

    scenarioObj.TrustId = trustId;
    scenarioObjs.TrustId = trustId;

    scenarioObj.ScenarioName = currentScenarioName;
    scenarioObjs.ScenarioName = currentScenarioName+specialSuffix;


    if ($("#checkPeriod").attr("checked") == "checked") {
        scenarioObj.StartDate = $("#PeriodStart").val();
        scenarioObj.EndDate = $("#PeriodEnd").val();

        scenarioObjs.StartDate = $("#PeriodStart").val();
        scenarioObjs.EndDate = $("#PeriodEnd").val();
    }
    else {
        scenarioObj.StartDate = "";
        scenarioObj.EndDate = "";

        scenarioObjs.StartDate = "";
        scenarioObjs.EndDate = "";
    }
    
    scenarioObj.PrincipalPrecision = $("#principalP").val();
    scenarioObj.InterestPrecision = $("#interestP").val();
    scenarioObj.AllowInterestToPrincipal = $("#checkInterest").attr("checked") == "checked" ? true : false;

    scenarioObjs.PrincipalPrecision = $("#principalP").val();
    scenarioObjs.InterestPrecision = $("#interestP").val();
    scenarioObjs.AllowInterestToPrincipal = $("#checkInterest").attr("checked") == "checked" ? true : false;

    var levels = [];
    $("#grid tbody tr").each(function () {
        var level = new Object();
        var isAddtoArray = true;
        $(this).find("td").each(function (i, ele) {
            
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
            else if (i == 2)
            {
                level.PayLimitation = $(ele).find("input").first().val().replace(/,/g, "");
            }
            else if (i == 3)
            {
                level.PercentageOfSurplus=$(ele).find("input").first().val();           
            }
            else if (i == 4)
            {
                level.AllocationRuleOfSameLevel = $(ele).find("select").first().val();
            }
            else if (i == 5)
            {
                level.FillByPrincipal = $(ele).find("input").first().attr("checked") ? true : false;
            }           
        });
        if (isAddtoArray) {
            levels.push(level);
        }
    });

    scenarioObj.Levels = levels;

    var levelss = [];
    $("#grids tbody tr").each(function () {
        var level = new Object();
        var isAddtoArray = true;
        $(this).find("td").each(function (i, ele) {

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
                level.FillByPrincipal = $(ele).find("input").first().attr("checked") ? true : false;
            }
        });
        if (isAddtoArray) {
            levelss.push(level);
        }
    });

    scenarioObjs.Levels = levelss;

    var scenariotoJsonStr = JSON.stringify(scenarioObj);
    var executeParam = {
        SPName: 'usp_SaveTrustPaymentSequence', SQLParams: [
            { Name: 'TrustId', value: trustId, DBType: 'string' },
            { Name: 'ScenarioName', value: currentScenarioName, DBType: 'string' },
            { Name: 'StartDate', value: scenarioObj.StartDate, DBType: 'string' },
            { Name: 'EndDate', value: scenarioObj.EndDate, DBType: 'string' },
            { Name: 'PrincipalPrecision', value: scenarioObj.PrincipalPrecision, DBType: 'string' },
            { Name: 'InterestPrecision', value: scenarioObj.InterestPrecision, DBType: 'string' },           
            { Name: 'PaymentSequence', value: scenariotoJsonStr, DBType: 'string' },
        ]
    };

    var scenariotoJsonStrs = JSON.stringify(scenarioObjs);
    var executeParams = {
        SPName: 'usp_SaveTrustPaymentSequence', SQLParams: [
            { Name: 'TrustId', value: trustId, DBType: 'string' },
            { Name: 'ScenarioName', value: scenarioObjs.ScenarioName, DBType: 'string' },
            { Name: 'StartDate', value: scenarioObjs.StartDate, DBType: 'string' },
            { Name: 'EndDate', value: scenarioObjs.EndDate, DBType: 'string' },
            { Name: 'PrincipalPrecision', value: scenarioObjs.PrincipalPrecision, DBType: 'string' },
            { Name: 'InterestPrecision', value: scenarioObjs.InterestPrecision, DBType: 'string' },
            { Name: 'PaymentSequence', value: scenariotoJsonStrs, DBType: 'string' },
        ]
    };

    ExecuteRemoteData(executeParam, function () {
        ExecuteRemoteData(executeParams, function (postbackdata) {
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
                DataFromDB = $.grep(data, function (d, i) { return d.ScenarioName.indexOf(specialSuffix) == -1; });
                DataSpecialFromDB = $.grep(data, function (d, i) { return d.ScenarioName.indexOf(specialSuffix) != -1; });

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

var reviewScenario = function () {
    var url = "../../../TrustManagement/PaySequenceDisplayer/PaySequenceDisplayer.html?tid="+trustId
    $("#bt_review").anyDialog({
        width: 900,	// 弹出框内容宽度
        height: 600, // 弹出框内容高度
        title: '偿付情景',	// 弹出框标题
        url: url,
        onClose: function () {
            //关闭的回调 list 的刷新方             
        }
    });
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


