document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

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
    var zh_CN = { ProductInfo: "产品信息" };
    var en_US = { ProductInfo: "Product Information" };
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
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
    DataOperate.getPageData(mid, pid, bid, set, function (items) {
        databind(items);
    });
});

  
function databind(items) {
    $.each(items, function (i,d) {
        var itemT = new Object();
        itemT['Text'] = d.ItemAliasValue;
        itemT['Value'] = d.ItemValue;
        if (d.ItemValue != "" && d.ItemValue != null) {
            if (d.DataType == "Select") {
                var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                itemT['Value'] = item.ItemAliasValue;
            }
            else if (d.DataType == "Decimal") {
                itemT['Value'] = getMoneyText(d.ItemValue, d.ItemAliasSetName);
            }
            myModel.DataItems.push(itemT);
        }
    });
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
}

 