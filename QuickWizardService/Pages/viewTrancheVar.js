document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var sessionID, taskCode;
var clientName = 'TaskProcess';
var IndicatorAppDomain = 'Task';
var bid;
var tid;
var pid;
var mid;
var set;
var viewModel;
var myModel = {
    DataItems: [],
    Language: {},
}
var ServiceHostURL = "https://poolcutwcf/TaskProcessServices/";

function getLanguage(set) {
    var zh_CN = {
        ProductInfo: "参数设置",
        BtnSave: "保存信息",
        BtnRun: "运行任务",
        BtnViewResults: "查看结果",
        OfferAmount: "发行金额"
    };
    var en_US = {
        ProductInfo: "Product Information", BtnSave: "Save Data",
        BtnRun: "Run Task", BtnViewResults: "View Results",
        OfferAmount: "Offer Amount"
    };
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    tid = getQueryString("tid");
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, function (items) {
        console.log(items);
        databind(items);
        setDatePlugins();
        $('#loading').fadeOut();
    });
    DataOperate.getTrustOfferAmount(tid, showOfferAmount);

});

var showOfferAmount = function (response) {
    var jsonObject = response;
    var jsonArray = eval(response);

    $('#OfferAmount').val(jsonArray[0].IssueAmount);

}


function databind(items) {
    $.each(items, function (i, d) {
        d['IsDisplay'] = false;
        d['IsNew'] = false;

        if (d.IsCompulsory) {
            d.IsDisplay = true;
        }
        else {
            if (d.ItemValue != "" && d.ItemValue != null) {
                d.IsDisplay = true;
                d.IsNew = true;
            }

        }
        myModel.DataItems.push(d);
    });
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
}

function setDatePlugins() {
    $("#TrustItemDiv").find('.date-plugins').date_input();
}

//创建一个动态字段
function createCompulsory() {
    var itemCode = $('#tb_CompulsoryDDL').val();
    if (itemCode != null) {
        var items = viewModel.DataItems();
        var itemT;
        $.each(items, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                item.IsDisplay(true);
                item.IsNew(true);
                itemT = item;
            }

        }));
        viewModel.DataItems.remove(itemT);
        viewModel.DataItems.push(itemT);
    }
    setDatePlugins();
};

//删除动态字段
function removeCompulsory(obj) {
    var itemCode = $(obj).attr('itemCode');
    var items = viewModel.DataItems();
    $.each(items, (function (i, item) {
        if (item.ItemCode() == itemCode) {
            item.ItemValue("");
            item.IsDisplay(false);
            item.IsNew(false);
        }
    }));
};

function saveItem() {
    if (!validation()) return;
    DataOperate.savePageDataTrustConfig(function () {
        var pop = mac.wait("Data Saving");
        var array = [];
        $.each(viewModel.DataItems(), function (i, d) {
            if (d.IsDisplay()) {
                var item = new DataOperate.DataItem();
                item.BusinessId = bid;
                item.ModelId = mid;
                item.PageId = pid;
                item.ItemId = d.ItemId();
                item.ItemValue = d.ItemValue();
                array.push(item);
            }
        });
        DataOperate.savePageData(array, function (result) {
            if (pop != null) {
                pop.close();
                pop = mac.complete("Saved Successfully!");
            }
        });
    });
}


function validation() {
    var pass = true;
    var detail = $("#TrustItemDiv").find("input");
    pass = validControls(detail);
    return pass;
}

function CalculateVAR_Run() {
    var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
    indicatorAppDomain_p = "Task";
    var OfferAmount = $('#OfferAmount').val();
    var sessionVariables_p = '<SessionVariables>' +

								'<SessionVariable>' +
									'<Name>OfferAmount</Name>' +
									'<Value>' + OfferAmount + '</Value>' +
									'<DataType>String</DataType>' +
									'<IsConstant>0</IsConstant>' +
									'<IsKey>0</IsKey>' +
									'<KeyIndex>0</KeyIndex>' +
								'</SessionVariable>' +
								'<SessionVariable>' +
									'<Name>BusinessId</Name>' +
									'<Value>' + bid + '</Value>' +
									'<DataType>String</DataType>' +
									'<IsConstant>0</IsConstant>' +
									'<IsKey>0</IsKey>' +
									'<KeyIndex>0</KeyIndex>' +
								'</SessionVariable>' +

							'</SessionVariables>';
    sessionVariables_p = encodeURIComponent(sessionVariables_p);
    var taskCode = "CalculateValueAtRisk";
    serviceUrl = serviceUrl + "?applicationDomain=" + indicatorAppDomain_p + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + taskCode;
    jQuery.support.cors = true;
    //alert(sessionVariables_p);
    $.ajax(
		{
		    type: "GET",
		    url: serviceUrl,
		    dataType: "jsonp",
		    crossDomain: "true",
		    contentType: "application/json;charset=utf-8",
		    success: CreateSessionCompleted,
		    error: function (response) { alert("error is :" + response); }
		}
	)

}

function runItems() {
    CalculateVAR_Run();
}

function lookItems() {

    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1000");
    //window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1000")	
}

function CreateSessionCompleted(response) {
    sessionID = response;
    //alert("sessionID: " + sessionID );
    //alert("task Code: " + taskCode );
    PopupTaskProcessIndicator();
    if (IsSilverlightInitialized) {
        InitParams();
    }
    //alert(sessionID);
}




function InitParams() {
}
var IsSilverlightInitialized = false;
function InitParams() {
    if (!IsSilverlightInitialized) {
        IsSilverlightInitialized = true;
    }
    document.getElementById("TaskProcessCtl").Content.SL_Agent.InitParams(sessionID, IndicatorAppDomain, taskCode, clientName);
    //alert(sessionId);
}

function PopupTaskProcessIndicator() {
    $("#taskIndicatorArea").dialog({
        modal: true,
        dialogClass: "TaskProcessDialogClass",
        closeText: "",
        //closeOnEscape:false,
        height: 485,
        width: 470,
        close: function (event, ui) { }, // refresh report repository while close the task process screen.
        //open: function (event, ui) { $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide(); },
        title: "任务处理"
    });
}

