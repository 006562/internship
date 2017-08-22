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
        Title:"专项事件及增信",
        Valve: "阀值"
    };
    var en_US = {
        Title: "Special Plan",
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
    console.log(items);
    databind(items);
    $('#loading').fadeOut();
}


function databind(items) {

    $.each(items, function (i, ele) {
        if (ele.CategoryId == 7) {
            ele.IsChecked = false;
            ele.ItemValueList = [];
            if (ele.ItemValue) {

                ele.ItemValueList = ele.ItemValue.split("|");
            }
            myModel.eventItems.push(ele);
        } else {
            ele.IsTested = false;
            ele.operat = { assume: '', operator: '', valve: '' };
            ele.ItemValueList = [];
            ele.SelectList = [];
            if (ele.ItemValue) {
                ele.ItemValueList = ele.ItemValue.split("|");
                console.log(ele.ItemValueList);
                ele.ItemValueNameList = [];

                $.each(myModel.eventItems, function (i,d) {
                    if (ele.ItemValueList[0].indexOf(d.ItemId.toString()) > -1) {
                        ele.ItemValueNameList.push(d.ItemAliasValue);
                    }
                })

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
            }
            $.each(myModel.eventItems, function (i, d) {
                if (ele.SelectList.indexOf(d.ItemId) > -1) {
                    d.IsChecked = true;
                }
            })

            myModel.tearItems.push(ele);
        }
    })

    $.each(items, function (i, ele) {
        ele.IsDisplay = false;
        ele.IsNew = false;

        if (ele.IsCompulsory) {
            ele.IsDisplay = true;
        } else {
            if (ele.ItemValue != "" && ele.ItemValue != null) {
                ele.IsDisplay = true;
                ele.IsNew = true;

            } else {
                $.each(myModel.tearItems, function (i, d) {
                    d.SelectList.remove(ele.ItemId.toString());
                })
            }
        }
    });
    console.log(myModel.eventItems);
    console.log(myModel.tearItems)
    var dealNode = document.getElementById('TrustEventDiv');
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel, dealNode);
}