
var bid;
var pid;
var mid;
var set;
var viewModel;
var myModel = {
    DatePlan: [],
    DateCal: [],
    Language: {}
}

$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
    DataOperate.getPageData(mid, pid, bid, set, getDateItem);
});

function getLanguage(set) {
    var zh_CN = {
        DatePlan: "专项计划日期",
        DateCalculate:"日期计算"
    };
    var en_US = {
        DatePlan: "Special Plan Date",
        DateCalculate: "Calculate Date"
    };
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

function getDateItem(items) {
    databind(items);
}

function databind(items) {
    console.log(items);
    $.each(items, function (i, d) {
        var gridrow = {};
        if (d.Bit01)//计算日
        {
            if (d.ItemValue != null && d.ItemValue != '') {
                var b = d.ItemValue.split('|');
                gridrow['DisplayName'] = d.ItemAliasValue;
                gridrow['ItemAliasValue'] = d.ItemAliasValue;
                gridrow['ItemValue'] = b[0];
                gridrow['ItemCode'] = d.ItemCode;
                gridrow['CompareTarget'] = b[1];
                gridrow['DateCount'] = b[2];
                myModel.DateCal.push(gridrow);
            }

        } else {//距离日
            if (d.IsCompulsory) {
                gridrow['DisplayName'] = d.ItemAliasValue;
                gridrow['ItemAliasValue'] = d.ItemAliasValue;
                gridrow['ItemValue'] = d.ItemValue;
                gridrow['ItemCode'] = d.ItemCode;
                myModel.DatePlan.push(gridrow);
            } 
        }

    })
    console.log(myModel);
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
}