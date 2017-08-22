var bid;
var mid;
var pid;
var set;

var viewModel;
var myModel = {
    GridView: [],//ko.observableArray(),
    Detail: [],// ko.observableArray(),
    SelectCompulsory: [],//ko.observableArray(),
    Language: {},
}

function getLanguage(set) {
    var zh_CN = { Title01: "分层信息", Title02: "添加分层", Title03: "更新分层", Header: "操作", BtnSave: "保存信息", BtnAdd: "添加", BtnEdit: "编辑", BtnUpdate: "更新", BtnDelete: "删除", BtnClear: "清空" };
    var en_US = { Title01: "Layer Information", Title02: "Add Layer", Title03: "Update Layer", Header: "Operate", BtnSave: "Save Data", BtnAdd: "Add", BtnEdit: "Edit", BtnUpdate: "Update", BtnDelete: "Delete", BtnClear: "Clear" };
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

var gridColumns = [];
var getItemId = {};

$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, getTrustBond);
});

function getTrustBond(items) {
    databind(items);
    registerEvent();
    $('#loading').fadeOut();
}


function databind(items) {
    var go = true;
    var rowId = 0;
    var details = null;
    while (go) {
        var row = $.grep(items, function (trustItem) {
            return trustItem.GroupId01 == rowId;
        })

        if (row.length == 0) {
            //当tbid=0时，row.length == 0，说明返回的只有模板
            if (details == null) {
                details = items;
            }
            go = false;
        }
        else {
            //将第一组数据作为Detial模板
            if (details == null) {
                details = row;
            }


            //排序
            row = row.sort(function (a, b) {
                return parseInt(a.SequenceNo) - parseInt(b.SequenceNo)
            });

            var gridItem = {};
            $.each(row, function (i, d) {
                gridItem[d.ItemCode] = d.ItemValue;
                if (d.DataType == "Select") {
                    var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                    gridItem[d.ItemCode + "_Text"] = item.ItemAliasValue;
                }
                else if (d.DataType == "Decimal") {
                    gridItem[d.ItemCode + "_Text"] = getMoneyText(d.ItemValue, d.ItemAliasSetName);
                }
            });
            myModel.GridView.push(gridItem);
        }
        rowId++;

    }

    $.each(details, function (i, d) {
        d['IsDisplay'] = false;
        d['IsNew'] = false;
        d.ItemValue = "";
        if (d.IsCompulsory) {
            d.IsDisplay = true;
        }
        else {
            d.IsDisplay = false;
            myModel.SelectCompulsory.push(d);
        }

        if (d.Bit01) {
            gridColumns.push(d);
        }
        getItemId[d.ItemCode] = d.ItemId;
        myModel.Detail.push(d);
    });
    console.log(myModel);
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
};


function registerEvent() {
    // $.getScript("./showModalDialog.js");

    $("#tb_Add").click(function () {
        if (istbAdd) { trustBond_Add(); }
        else { trustBond_Update(); }
    });
    $("#tb_Clear").click(function () {
        clear();
    });

    setDatePlugins();
};

function setDatePlugins() {
    $("#TrustBondDiv").find('.date-plugins').date_input();
}


ko.bindingHandlers.renderGridHeader = {
    init: function (element, valueAccessor) {
        var header = valueAccessor();
        var html = '';
        $.each(gridColumns, function (i, item) {
            html += '<th>' + item.ItemAliasValue + '</th>';
        });

        html += '<th>' + header + '</th>';
        $(html).appendTo($(element));
    }
}

ko.bindingHandlers.renderGridColumn = {
    init: function (element, valueAccessor) {
        var language = valueAccessor();
        var html = '';
        $.each(gridColumns, function (i, item) {
            var code = item.ItemCode;
            if (item.DataType == "Select" || item.DataType == "Decimal") {
                code = code + "_Text";
            }

            html += '<td  data-bind="text: ' + code + '"></td>';
        });
        html += '<td class="btn-group-sm">';
        html += '<input type="button" id="tb_edit" class="btn btn-primary btn-sm" data-bind="attr: { dataIndex: $index }" onclick="trustBond_Detail(this)" value="' + language.BtnEdit() + '"/> &nbsp;';
        html += '<input type="button" id="tb_delete" class="btn btn-danger btn-sm" data-bind="attr: { dataIndex: $index }" onclick="trustBond_Delete(this)" value="' + language.BtnDelete() + '"//>';
        html += '</td>';
        $(html).appendTo($(element));
    }
}







//创建一个动态字段
function createCompulsory() {
    var itemCode = $('#tb_CompulsoryDDL').val();
    if (itemCode != null) {
        var detail = viewModel.Detail();
        var itemT;
        $.each(detail, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                item.IsDisplay(true);
                item.IsNew(true);
                itemT = item;
            }

        }));
        viewModel.Detail.remove(itemT);
        viewModel.Detail.push(itemT);
    }
};

//删除动态字段
function removeCompulsory(obj) {
    var itemCode = $(obj).attr('itemCode');
    var detail = viewModel.Detail();
    $.each(detail, (function (i, item) {
        if (item.ItemCode() == itemCode) {
            item.ItemValue("");
            item.IsDisplay(false);
            item.IsNew(false);
        }
    }));
};

var editIndex = 0;//编辑时设置index
var istbAdd = true;
//添加新分层
function trustBond_Add() {
    var pass = validation();
    if (pass) {
        var detail = viewModel.Detail();
        var newItem = {};
        $.each(detail, function (i, item) {
            if (item.DataType() == "Select") {
                var text = $("#dropDown_" + item.ItemCode()).find("option:selected").text();
                newItem[item.ItemCode() + '_Text'] = text;
            }
            else if (item.DataType() == "Decimal") {
                newItem[item.ItemCode() + '_Text'] = getMoneyText(item.ItemValue(), item.ItemAliasSetName());
            }

            newItem[item.ItemCode()] = item.ItemValue();

        });

        //转换成knockout需要的
        newItem = ko.mapping.fromJS(newItem);
        //这样item里包含模板的所有字段,写入Grid
        viewModel.GridView.push(newItem);
        //初始化Detail为最初状态
        initDetail();
        //清空已有显示内容
        clear();
        istbAdd = true;//状态为添加
    }
};

//点击编辑获取详情页
function trustBond_Detail(obj) {
    istbAdd = false;
    initDetail(); //初始化Detail为最初状态
    clear();//清空已有显示内容

    editIndex = $(obj).attr('dataIndex');
    var item = viewModel.GridView()[editIndex];
    for (var key in item) {
        //key就是ItemCode
        var detail = viewModel.Detail();
        $.each(detail, function (i, d) {
            if (d.ItemCode() == key) {
                var itemValue = item[key]();
                if (itemValue != "") {
                    d.ItemValue(itemValue);
                    if (d.IsCompulsory() == false) {
                        d.IsDisplay(true);
                        d.IsNew(true);
                    }
                }
            }
        })

    }

    setDatePlugins();

    $("#tb_Add").val(viewModel.Language.BtnUpdate());
    $("#tb_name").html(viewModel.Language.Title03());
};

//更新新分层
function trustBond_Update() {
    var pass = true;// validation();
    if (pass) {
        var item = viewModel.GridView()[editIndex];//里面包含所有属性
        var detail = viewModel.Detail();
        $.each(detail, function (i, d) {
            var code = d.ItemCode();
            item[code](d.ItemValue());
            if (d.DataType() == "Select") {
                var text_s = $("#dropDown_" + d.ItemCode()).find("option:selected").text();
                item[d.ItemCode() + '_Text'](text_s);
            }
            else if (d.DataType() == "Decimal") {
                var text_d = getMoneyText(d.ItemValue(), d.ItemAliasSetName());
                item[d.ItemCode() + '_Text'](text_d);
            }
        })


        $("#tb_Add").val(viewModel.Language.BtnAdd());
        $("#tb_name").html(viewModel.Language.Title02());
        initDetail(); //初始化Detail模板
        clear();//清空
        istbAdd = true;//状态变为添加
    }
};

//删除一个分层
function trustBond_Delete(obj) {
    var index = $(obj).attr('dataIndex');
    var oNew = viewModel.GridView()[index];
    viewModel.GridView.remove(oNew);
    //状态为添加
    istbAdd = true;
    initDetail(); //初始化Detail模板
    clear();//清空
    $("#tb_Add").val(viewModel.Language.BtnAdd());
    $("#tb_name").html(viewModel.Language.Title02());
};

function clear() {
    var detail = viewModel.Detail();
    $.each(detail, function (i, item) {
        var dataType = item.DataType().toLocaleLowerCase();
        if (dataType == "bool") {
            item.ItemValue("0");
        }
        else {
            if (dataType != "select") {
                item.ItemValue("");
            }
        }
    });



}

//删除所有动态字段从Detail模板,初始化状态
function initDetail(obj) {
    var detail = viewModel.Detail();

    $.each(detail, function (i, item) {
       if (item.DataType() == "Date") {
            item.ItemValue("");
        }

        if (item.IsNew()) {
            item.IsNew(false);
            item.IsDisplay(false);
        }
    });


    setDatePlugins();
    $("#tb_Add").val(viewModel.Language.BtnAdd());
    $("#tb_name").html(viewModel.Language.Title02());
}


function validation() {
    var pass = true;
    var detail = $("#TrustItem_Detail").find("input");
    pass = validControls(detail);
    return pass;
}

function saveItems() {

    var pop = mac.wait("Data Saving");
    var array = [];
    var dataGrid = ko.mapping.toJS(viewModel.GridView);
    if (dataGrid.length == 0) {
        alert("数据表格没有行数据，请先添加行数据");
        return;
    }

    $.each(dataGrid, function (i, d) {
        for (key in d) {
            var index = key.indexOf("_Text");
            if (index < 0) {
                var value = d[key];
                var id = getItemId[key];
                var item = new DataOperate.DataItem();
                item.BusinessId = bid;
                item.ModelId = mid;
                item.PageId = pid;
                item.ItemId = id;
                item.ItemValue = value;
                item.GroupId01 = i;
                array.push(item);
            }

        }
    })
    DataOperate.savePageData(array, function (result) {
        if (pop != null) {
            pop.close();
            if (result > -1) {
                pop = mac.complete("Saved Successfully!");
            }
            else {
                alert("Save Failed")
            }
        }
    });
}
