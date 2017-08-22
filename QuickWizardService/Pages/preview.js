document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var bid;
var mid;
var pid;
var set;

var viewModel;
var myModel = {
    Urls:[],
    Language: {}
};

function getLanguage(set) {
    var zh_CN = {
        Prev: "上一步",
        BtnSave: "完成",
        Print:"打印"
    };
    var en_US = {
        Prev: "prev",
        BtnSave: "complete",
        Print: "print"
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
    bid = getQueryString("bid");
    set = getQueryString("set");

    myModel.Language = getLanguage(set);
    $('#loading').fadeIn();
    DataOperate.getPagesByModelId(mid, getPages);
});

function getPages(data) {
    console.log(data);
    $.each(data, function (i,e) {
        pid = e.PageId;
        var serviceUrl = e.PageCode + ".v.html?mid=" + mid + "&pid=" + pid + "&bid=" + bid + "&set=" +set;
        myModel.Urls.push(serviceUrl);
    })
    console.log(myModel.Urls);
    databind(myModel.Urls);
    $('#loading').fadeOut();
}

function databind(items) {
    var dealNode = document.getElementById('TrustPreviewDiv');
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel, dealNode);
}
