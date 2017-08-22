document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var bid;
var pid;
var mid;
var set;
var Daysdata;
var viewModel;
var detail = null;
var myModel = {
    DateSetList: {
        NoHaveDataList: [],//专项计划日期下拉项
        HaveDataList: [],//专项计划日期显示项
    },
    JSRList: {
        NoHaveDataList: [],//日期计算下拉项
        HaveDataList: [],//日期计算显示项
    },
    CompareTargetArry: [],//专项计划日期已选下拉项
    rangeDate: [],
    CurrentJSR: [],
    //JSRData: [],
    Language: {},
    logkeyup: function (data, event) {
        //检查格式
        var number = new FormatNumber();
        number.checkNumberFunc({}, event, data.rangeDate);
        RangeDate = data.rangeDate();
        //关联计算日
        var itemCode = $('#DateTypeSelect').val();
        if (itemCode != null) {
            var items = viewModel.CompareTargetArry();
            var itemT;
            $.each(items, (function (i, item) {
                if (item.ItemCode() == itemCode) {
                    itemT = item;
                    return false;
                }
            }));
            var JSRitemCode = $('#seJSRList').val();
            if (JSRitemCode != null) {
                
                var JSDay = getWorkDate(itemT.ItemValue(), RangeDate);
                for (var i = 0; i < viewModel.JSRList.NoHaveDataList().length; i++)
                {
                    if (viewModel.JSRList.NoHaveDataList()[i].ItemAliasValue() == JSRitemCode) {
                        viewModel.CurrentJSR()[0].ItemValue(JSDay);
                        viewModel.CurrentJSR()[0].ItemAliasValue(JSRitemCode);
                        break;
                    }
                }
            }
        } 
    },
    formatp: function (p) {
        var number = new FormatNumber();

        if (parseFloat(p) == p) {
            var ret = number.convertNumberN(1, p);
            return ret;
        }
        else
            return p;
    },
    getDateValue: function (s) {
        var JSRitemCode = $('#seJSRList').val();
        if (JSRitemCode != null) {
            var items = viewModel.JSRList.NoHaveDataList();
            $.each(items, (function (i, item) {
                if (item.ItemAliasValue() == JSRitemCode) {
                    return item.ItemValue();
                }
            }));
        }
    }
}

//获取日期数据
function getDaysdata(data)
{
    Daysdata = data
    return Daysdata;
}

//转换日期格式
function changeDateFormat(val) {
    if (val != null) {
        var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
        //月份为0-11，所以+1，月份小于10时补个0
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate;
    }

    return "";
}

//查找指定日期几天后的工作日
function getWorkDate(theDate, day) {
    var workDate;
    $.each(Daysdata, (function (i, Days) {
        var a = changeDateFormat(Days.Date);
        if (changeDateFormat(Days.Date) == theDate) {
            workDate = changeDateFormat(Daysdata[i + day].Date);
            return false;
        }
    }));
    if (workDate == null || workDate == "")
    {
        var days = 1;
        var date;
        function addDate(theDate, days) {
            var d = new Date(theDate);
            d.setDate(d.getDate() + days);
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            var dy = d.getDate();
            if (parseInt(m) < 10)
                m = '0' + m;
            if (parseInt(dy) < 10)
                dy = '0' + dy;
            return y + '-' + m + '-' + dy;
        };
        date = addDate(theDate, days);
        workDate = getWorkDate(date, day);
    }
    return workDate;
}

//加载网页
$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, getTrustItem);
    DataOperate.getWorkingDays(getDaysdata);
});

function getLanguage(set) {
    var zh_CN = {
    };
    var en_US = {
    };
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

function setDatePlugins() {
    $("#TrustExtensionDiv").find('.date-plugins').date_input();
}

function getTrustItem(items) {

    databind(items);
    setDatePlugins();
    $('#loading').fadeOut();
}

function databind(items) {
    details = items;
    $.each(items, function (i, d) {
        if (i == 0)
        {
            var s = {};
            s.ItemAliasValue = '';
            s.ItemValue = '';
            myModel.CurrentJSR.push(s);
        }
        var gridrow = {};
        if(d.Bit01)//计算日
        {
            if (d.ItemValue != null && d.ItemValue != '') {
                var b = d.ItemValue.split('|');
                d.DisplayName = d.ItemAliasValue;
                d.ItemValue = b[0];
                d.CompareTarget = b[1];
                d.DateCount = b[2];
                myModel.JSRList.HaveDataList.push(d);
            } else {
                d.DisplayName = d.ItemAliasValue;
                d.ItemValue = null;
                d.CompareTarget = null;
                d.DateCount = null;
                myModel.JSRList.NoHaveDataList.push(d);
            }
        } else {//距离日
            if (d.ItemValue != null && d.ItemValue != "" || d.IsCompulsory) {
                if (d.IsCompulsory) {
                    d.IsNew = false;
                } else {
                    d.IsNew = true;
                }
                d.DisplayName = d.ItemAliasValue;
                myModel.DateSetList.HaveDataList.push(d);
                myModel.CompareTargetArry.push(d);
            } else {
                d.DisplayName = d.ItemAliasValue;
                d.IsNew = true;
                myModel.DateSetList.NoHaveDataList.push(d);
            }
        }

    })
    var rangeD = {};
    rangeD['rangeDate'] = 0;
    myModel.rangeDate.push(rangeD);
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
}

//添加距离日
function addShowColumn()
{
    var itemCode = $('#tb_NoHaveDataListDDL').val();
    if (itemCode != null) {
        var items = viewModel.DateSetList.NoHaveDataList();
        var itemT;
        $.each(items, (function (i, item) {
            if (item.ItemAliasValue() == itemCode) {
                itemT = item;
                return false;
            }
        }));
        itemT.IsNew = true;
        viewModel.DateSetList.NoHaveDataList.remove(itemT);
        viewModel.DateSetList.HaveDataList.push(itemT);
        viewModel.CompareTargetArry.push(itemT);
    }
    setDatePlugins();
}

//删除距离日
function removeShowColumn(obj)
{
    var index = parseInt($(obj).attr('dataIndex'));
    var oNew = viewModel.DateSetList.HaveDataList()[index];
    viewModel.DateSetList.HaveDataList.remove(oNew);
    viewModel.CompareTargetArry.remove(oNew);
    viewModel.DateSetList.NoHaveDataList.push(oNew);
    setDatePlugins();
}

//改变计算日Value值
function changJSRItem()
{
    var itemCode = $('#seJSRList').val();
    if (itemCode != null) {
        var items = viewModel.JSRList.NoHaveDataList();
        $.each(items, (function (i, item) {
            if (item.ItemAliasValue() == itemCode) {
                viewModel.CurrentJSR()[0].ItemValue("");
                viewModel.CurrentJSR()[0].ItemAliasValue(itemCode);
                viewModel.rangeDate()[0].rangeDate("");
                return false;
            }
        }));
    }
}

function changDateType() {
    var itemCode = $('#DateTypeSelect').val();
    if (itemCode != null) {
        var items = viewModel.DateSetList.HaveDataList();
        $.each(items, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                viewModel.CurrentJSR()[0].ItemValue(item.ItemValue());
                viewModel.CurrentJSR()[0].ItemAliasValue(itemCode);
                viewModel.rangeDate()[0].rangeDate("");
                return false;
            }
        }));
    }
}

//添加计算日
function addJSR()
{
    var CurrentJSRValue = viewModel.CurrentJSR()[0].ItemValue();
    var CurrentJSRDisplayName = $('#seJSRList').val();
    var items = viewModel.JSRList.NoHaveDataList();
    var itemT = $.grep(items, function (item) {
        return (item.ItemAliasValue() == CurrentJSRDisplayName) ? item : null;
    })[0];
    var itemCode = $('#DateTypeSelect').val();
    var displayName;
    if (itemCode != null) {
        var items = viewModel.CompareTargetArry();
        $.each(items, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                displayName = item.DisplayName();
                return false;
            }
        }));
    }
    if (CurrentJSRValue == null || CurrentJSRValue == "") {//判断计算日是否有值
        alert("请填写" + displayName);
        return;
    }
    itemT.ItemValue(CurrentJSRValue);
    itemT.CompareTarget(displayName);
    itemT.DateCount(viewModel.rangeDate()[0].rangeDate());
    viewModel.JSRList.NoHaveDataList.remove(itemT);
    viewModel.JSRList.HaveDataList.push(itemT);
    viewModel.CurrentJSR()[0].ItemValue("");
}

//删除计算日
function delJSR(obj)
{
    var index = parseInt($(obj).attr('dataIndex'));
    var oNew = viewModel.JSRList.HaveDataList()[index];
    viewModel.JSRList.HaveDataList.remove(oNew);
    viewModel.JSRList.NoHaveDataList.push(oNew);
    setDatePlugins();
}

function saveItems()
{
    var pass = validation();
    if (pass) {
        var pop = mac.wait("Data Saving");
        var array = [];
        // var dataItems= ko.mapping.toJS(viewModel.DataItems);
        $.each(viewModel.DateSetList.HaveDataList(), function (i, row) {
            if (row.ItemValue() != null && row.ItemValue() != '') {
                var item = new DataOperate.DataItem();
                item.BusinessId = bid;
                item.ModelId = mid;
                item.PageId = pid;
                item.ItemId = getItemIdByCode(row.ItemCode());
                item.ItemValue = row.ItemValue();
                item.GroupId01 = i;
                array.push(item);
                return false;
            }
        });
        $.each(viewModel.JSRList.HaveDataList(), function (i, row) {
            var item2 = new DataOperate.DataItem();
            item2.BusinessId = bid;
            item2.ModelId = mid;
            item2.PageId = pid;
            item2.ItemId = getItemIdByCode(row.ItemCode());
            item2.ItemValue = row.ItemValue() + '|' + row.CompareTarget() + '|' + row.DateCount();
            item2.GroupId01 = i;
            array.push(item2);
            return false;
        });
        DataOperate.savePageData(array, function (data) {
            if (pop != null) {
                pop.close();
                pop = mac.complete("Saved Successfully!");
            }

        });
    }
}


function validation() {
    var pass = true;
    var detail = $("#TrustExtensionInput").find("input");
    pass = validControls(detail);
    return pass;
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
