document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var bid;
var pid;
var mid;
var set;
var viewModel;
var rowTemp = {};

var myModel = {
    DataItems: [],
    Language: {},
    SetName:"",
}


$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
    myModel.SetName = set;
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, getTrustItem);
});

function getLanguage(set) {
    var zh_CN = {
        ProductInfo: "专项计划现金流",
        BtnSave: "保存信息",
        CollecDate: "收款日期",
        CollectionPeriod: "收集期间",
        Principal: "本金",
        Interest: "利息",
        Total: "合计",
        DateCommenced: "开始日期",
        EndDate: "结束日期"
    };
    var en_US = {
        ProductInfo: "Product Information",
        BtnSave: "Save Data",
        CollecDate: "Date of Collection",
        CollectionPeriod: "Collection Period",
        Principal: "Principal(RMB)",
        Interest: "Interest(RMB)",
        Total: "Total(RMB)",
        DateCommenced: "Date Commenced ",
        EndDate: "End Date"
    };
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

function getTrustItem(items) {

    databind(items);
    setDatePlugins();
    $('#loading').fadeOut();
}


function databind(items) {
    var go = true;
    var rowId = 0;
    while (go) {
      
        var row = $.grep(items, function (trustItem) {
            return trustItem.GroupId01 == rowId;
        })
       
        if (row.length == 0) {
            if (rowId == 0) 
            {
                //如果row.length=0 and rowId==0时，说明没有真实数据，那么items可以作为Add时的模板
                $.each(items, function (i, d) {
                    rowTemp[d.ItemCode] ="";
                });
            }
            //如果row.length=0说明没有数据或者数据已经读取完毕，循环结束
            go = false;
        }
        else {
            //排序
            row = row.sort(function (a, b) {
                return parseInt(a.SequenceNo) - parseInt(b.SequenceNo)
            });
            var gridrow = {};
            $.each(row, function (i, d) {
                if (rowId == 0) //第一条数据作为Add时的模板
                {
                    rowTemp[d.ItemCode] = "";
                }
                gridrow[d.ItemCode] = d.ItemValue;
            });

            
            myModel.DataItems.push(gridrow);
        }
        rowId++;
    }
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
}

function setDatePlugins() {
    $("#TrustWaterFall").find('.date-plugins').date_input();
}

 

function saveItems() {
    var pass = validation();
    if (pass) {
        var pop = mac.wait("Data Saving");
        var array = [];
        var dataItems= ko.mapping.toJS(viewModel.DataItems);
        $.each(dataItems, function (i, row) {
            for (var key in row) {
                var item = new DataOperate.DataItem();
                item.BusinessId = bid;
                item.ModelId = mid;
                item.PageId = pid;
                item.ItemId = getItemIdByCode(key);
                item.ItemValue = row[key];
                item.GroupId01 = i;
                if (item.ItemId != 0) {
                    array.push(item);
                }
            }
        });
        DataOperate.savePageData(array, function (data) {
            if (pop != null) {
                pop.close();
                pop = mac.complete("Saved Successfully!");
            }

        });
    }

}

function getItemIdByCode(itemCode) {
    var itemId = 0;
    $.each(details, function (i, item) {
        if (item.ItemCode == itemCode) {
            itemId = item.ItemId;
            return itemId;
        }

    });
    return itemId;
}



//添加新分层
function addItem() {
    //转换成knockout需要的
    var newrow = ko.mapping.fromJS(rowTemp);
    //这样item里包含模板的所有字段,写入Grid
    viewModel.DataItems.push(newrow);
    setDatePlugins();
};

//delete分层
function removeRow(obj) {
    var index = parseInt($(obj).attr('index'));
    var oNew = viewModel.DataItems()[index];
    viewModel.DataItems.remove(oNew);
    setDatePlugins();
};
function validation() {
    var pass = true;
    var detail = $("#TrustWaterFall").find("input");
    pass = validControls(detail);
    return pass;

}
