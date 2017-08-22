document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var bid;
var mid;
var pid;
var set;

var viewModel;
var myModel = {
    DataItems: [],
    Language: {},
}

function getLanguage(set) {
    var zh_CN = { Title01: "分层信息"};
    var en_US = { Title01: "Layer Information" };
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
    var go = true;
    var rowId = 0;
    while (go) {
        var row = $.grep(items, function (item) {
            return item.GroupId01 == rowId;
        })

        $.each(row, function (i, d) {
            var itemT=new Object();
            itemT['Text'] = d.ItemAliasValue;
            itemT['Value'] = d.ItemValue;
            itemT['IsDisplay'] = true;
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
        var l = row.length;
        if (l> 0) {
            if (l % 2 == 0) {
                //如果这组是偶数的话，添加两个空，实现和下组数据的区隔
                var itemT1 = new Object();
                itemT1['Value'] = "";
                itemT1['Text'] = "";
                itemT1['IsDisplay'] = false;
                var itemT2 = new Object();
                itemT2['Value'] = "";
                itemT2['Text'] = "";
                itemT2['IsDisplay'] = false;
                myModel.DataItems.push(itemT1);
                myModel.DataItems.push(itemT2);
            }
            else {
                //如果这组是奇数的话，添加三个空，实现和下组数据的区隔
                var itemT1 = new Object();
                itemT1['Value'] = "";
                itemT1['Text'] = "";
                itemT1['IsDisplay'] = false;
                var itemT2 = new Object();
                itemT2['Value'] = "";
                itemT2['Text'] = "";
                itemT2['IsDisplay'] = false;
                var itemT3 = new Object();
                itemT3['Value'] = "";
                itemT3['Text'] = "";
                itemT3['IsDisplay'] = false;
                myModel.DataItems.push(itemT1);
                myModel.DataItems.push(itemT2);
                myModel.DataItems.push(itemT3);
            }
        }
        else {
            go = false;
        }
        rowId++;
    }
    console.log(myModel);
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
};
