document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var tid;
var bid;
var pid;
var mid;
var set;
var viewModel;
var myModel = {
    DataItems: [],
    Language: {},
}

function getLanguage(set) {
    var zh_CN = { ProductInfo: "产品信息", BtnSave: "保存信息" };
    var en_US = { ProductInfo: "Product Information", BtnSave: "Save Data" };
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

$(function () {
    tid = getQueryString("tid");
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, function (items) {
        console.log(items);
        databind(items);
        setDatePlugins();
        $('#loading').fadeOut();
    });
});

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

    var pop = mac.wait("Data Saving");
    DataOperate.savePageDataTrustConfig(function () {
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
            runGenerateDB();
        });
    });
}
function validation() {
    var pass = true;
    var detail = $("#TrustItemDiv").find("input");
    pass = validControls(detail);
    return pass;
}

function runGenerateDB() {
    var assetType;
    var selValue = $('#dropDown_25005').val();
    switch (selValue) {
        case '25006':
            assetType = 'BaiTiao';
            break;
        case '25006':
            assetType = 'Loarn Factory';
            break;
        default:
            break;
    }

    var serviceUrl = "https://poolcutwcf/TaskProcessServices/SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
    indicatorAppDomain_p = "Task";
    var sessionVariables_p = '<SessionVariables>' +
								'<SessionVariable>' +
									'<Name>CreateDate</Name>' +
									'<Value>' + (new Date()).dateFormat('yyyy-MM-dd_HH:mm:ss') + '</Value>' +
									'<DataType>String</DataType>' +
									'<IsConstant>0</IsConstant>' +
									'<IsKey>0</IsKey>' +
									'<KeyIndex>0</KeyIndex>' +
								'</SessionVariable>' +
                                '<SessionVariable>' +
									'<Name>AssetType</Name>' +
									'<Value>' + assetType + '</Value>' +
									'<DataType>String</DataType>' +
									'<IsConstant>0</IsConstant>' +
									'<IsKey>0</IsKey>' +
									'<KeyIndex>0</KeyIndex>' +
								'</SessionVariable>' +
							'</SessionVariables>';
    sessionVariables_p = encodeURIComponent(sessionVariables_p);
    var taskCode = "GenerateDALDatabasesByType";
    serviceUrl = serviceUrl + "?applicationDomain=" + indicatorAppDomain_p + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + taskCode;
    jQuery.support.cors = true;
    
    $.ajax({
		    type: "GET",
		    url: serviceUrl,
		    dataType: "jsonp",
		    crossDomain: "true",
		    contentType: "application/json;charset=utf-8",
		    success: function (response) { CreateSessionCompleted(response); },
		    error: function (response) { alert("error is :" + response); }
		}
	)
}

function CreateSessionCompleted(response) {
    sessionID = response;


    //$.cookie('sessionid',response,{expires: 7});

    //alert("sessionID: " + sessionID );
    //alert("task Code: " + taskCode );
    PopupTaskProcessIndicator();
    if (IsSilverlightInitialized) {
        InitParams();
    }
    //alert(sessionID);
}
