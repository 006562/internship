document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var bid;
var mid;
var pid;
var set;

var viewModel;
var myModel = {
    eventItems: [],
    tearItems: [],
    Language: {}
};

function getLanguage(set) {
    var zh_CN = {
        ProductInfo: "专项计划",
        Default: "违约条件",
        Trigger: "触发事件",
        Test: "测试",
        Check: "检测",
        Assume: "假定值",
        Condition: "条件",
        Valve: "阀值"
    };
    var en_US = {
        ProductInfo: "Special Plan",
        Default: "Conditions Of Default",
        Trigger: "trigger event",
        Test: "test",
        Check: "check",
        Assume: "assume",
        Condition: "condition",
        Valve: "valve"
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
    set = getQueryString("set");

    myModel.Language = getLanguage(set);
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, getEventItems);
});

function getEventItems(items) {
    databind(items);
    $('#loading').fadeOut();
}

function databind(items) {
    $.each(items, function (i, ele) {
        if (ele.CategoryId == 10 && ele.ItemValue) {
            ele.ItemValueList = [];
            ele.ItemValueList = ele.ItemValue.split("|");
            myModel.eventItems.push(ele);
        } else {
            ele.operat = { assume: '', operator: '', valve: '' };
            ele.ItemValueList = [];
            ele.SelectList = [];
            if (ele.ItemValue) {
                ele.ItemValueList = ele.ItemValue.split("|");
                console.log(ele.ItemValueList);
                $.each(ele.ItemValueList, function (i, e) {
                    switch (i) {
                        case 0: if (e) { ele.SelectList = e.split(",") }; break;
                        case 1: ele.IsTested = function () {
                            if (e == "false") {
                                return false;
                            } else {
                                return true;
                            }
                        }();
                            break;
                        case 2: ele.operat.operator = e; break;
                        case 3: ele.operat.valve = e;
                    }
                })
                myModel.tearItems.push(ele);
            }
        }
    })

    $.each(items, function (i, ele) {
        ele.IsDisplay = false;

        if (ele.IsCompulsory) {
            ele.IsDisplay = true;
        } else {
            if (ele.ItemValue != "" && ele.ItemValue != null) {
                ele.IsDisplay = true;
            }
        }
    });
    console.log(myModel.eventItems);
    console.log(myModel.tearItems)
    var dealNode = document.getElementById('TrustEventDiv');
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel, dealNode);
}