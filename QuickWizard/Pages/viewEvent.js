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
        BtnSave: "保存信息", 
        Default:"违约条件", 
        Event:"事件",
        Desc:"定性描述",
        Trigger:"触发事件",
        Test:"测试",
        Check:"检测",
        Assume:"假定值",
        Condition:"条件",
        Valve:"阀值"
    };
    var en_US = { 
        ProductInfo: "Special Plan", 
        BtnSave: "Save Data", 
        Default:"Conditions Of Default",
        Event: "event",
        Desc: "Qualitative description",
        Trigger: "trigger event",
        Test: "test",
        Check: "check",
        Assume: "assume",
        Condition: "condition",
        Valve:"valve"
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
                var arry = ele.ItemValue.split("|");
                $.each(arry, function (i, txt) {
                    var field = {};
                    field.Text = txt;
                    var f = ko.mapping.fromJS(field);
                    ele.ItemValueList.push(f);
                })
            } else {
                var field = {};
                field.Text = "";
                var f = ko.mapping.fromJS(field);
                ele.ItemValueList.push(f);
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

//创建event动态字段
function createEventCompulsory() {
    var itemCode = $('#noCompulsoryEvent').val();
    if (itemCode != null) {
        var items = viewModel.eventItems();
        //var itemT;
        $.each(items, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                item.IsDisplay(true);
                item.IsNew(true);
                item.IsChecked(false);
                //itemT = item;
            }

        }));
        //viewModel.eventItems().remove(itemT);
        //viewModel.eventItems().push(itemT);
    }
};

//创建tear动态字段
function createTearCompulsory() {
    var itemCode = $('#noCompulsoryTear').val();
    if (itemCode != null) {
        var items = viewModel.tearItems();
        //var itemT;
        $.each(items, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                item.IsDisplay(true);
                item.IsNew(true);
                //itemT = item;
            }
        }));
        //viewModel.tearItems().remove(itemT);
        //viewModel.tearItems().push(itemT);
    }
};

//删除event动态字段
function removeEventCompulsory(obj) {
    var itemCode = $(obj).attr('itemCode');
    var items = viewModel.eventItems();
    $.each(items, (function (i, item) {
        if (item.ItemCode() == itemCode) {
            var field = {};
            field.Text = "";
            var f = ko.mapping.fromJS(field);
            item.ItemValueList([f])
            item.IsDisplay(false);
            item.IsNew(false);

            if (item.IsChecked()) {
                item.IsChecked(false);
                $.each(viewModel.tearItems(), function (i, d) {
                    d.SelectList.remove(item.ItemId().toString());
                })
            }
        }
    }));
};

//删除tear动态字段
function removeTearCompulsory(obj) {
    var itemCode = $(obj).attr('itemCode');
    var items = viewModel.tearItems();
    $.each(items, (function (i, item) {
        if (item.ItemCode() == itemCode) {
            item.IsDisplay(false);
            item.IsNew(false);
        }
    }));
};

//添加一组控件
function addFormGroup(self) {
    var eventList = viewModel.eventItems();
    var clickId = $(self).attr('ItemId');
    console.log(clickId);
    console.log(eventList);
    $.each(eventList, function (i, ele) {
        if (ele.ItemId() == clickId) {
            var field = {};
            field.Text = "";
            var f= ko.mapping.fromJS(field);
            ele.ItemValueList.push(f);
        }
    })
}

//删除一组控件
function removeFormGroup(self) {
    var index = $(self).parent().index();
    console.log(index);
    var eventList = viewModel.eventItems();
    var clickId = $(self).attr('ItemId');
    console.log(clickId);
    console.log(eventList);
    $.each(eventList, function (i, ele) {
        if (ele.ItemId() == clickId) {
            ele.ItemValueList.splice(index,1);
        }
    })
}

//触发事件
function pushList(self) {
    var self = $(self);
    var tearItemId = self.closest("tr").attr("itemId");
    var tearitems = viewModel.tearItems();
    $.each(tearitems, function (i,item) {
        if (item.ItemId() == tearItemId) {
            if (self.prop("checked")) {
                item.SelectList.push(self.attr("itemId"));
            } else {
                item.SelectList.remove(self.attr("itemId"));
            }
        }
    })
    console.log(viewModel.tearItems()[0].SelectList());
}

//关闭检测时清空测试值
function clearTest(self) {
    var self = $(self);
    var tearItemId = self.closest("tr").attr("itemId");
    var tearitems = viewModel.tearItems();
    $.each(tearitems, function (i, item) {
        if (item.ItemId() == tearItemId) {
            console.log(self.prop("checked"));
            if (self.prop("checked")) {
                item.operat.assume("");
                item.operat.operator("");
                item.operat.valve("");
            } 
        }
    })
    console.log(viewModel.tearItems()[0].SelectList());
}

//点击测试
function operatTest(self) {
    var eventitems = viewModel.eventItems();
    var clickId = $(self).attr('itemId');

    var items = viewModel.tearItems();
    $.each(items, function (i, item) {
        if (item.ItemId() == clickId) {
            var assume = item.operat.assume(),
                operator = item.operat.operator(),
                valve = item.operat.valve();
            var operatorName = getOperatorByName(operator);

            $(".eventItem tr").css("background-color", "#fff");
            if (assume && operatorName!="NA" && valve) {
                if (eval(assume + operatorName + valve)) {
                    $(".eventItem tr").each(function (i, ele) {
                        if (item.SelectList.indexOf($(this).attr('itemId')) > -1) {
                            $(this).css("background-color", "#EDFBC8");
                            $(this)[0].scrollIntoView(false);
                            setTimeout(function () {
                                $(".eventItem tr").css("background-color", "#fff");
                            }, 6000)
                        }
                    })
                }
                $(self).closest("tr").find(".valbox").css("border-color", "#ccc");
            } else {
                $(self).closest("tr").find(".valbox").each(function (i, d) {
                    if (!$(this).val() | $(this).val() == "NA") {
                        $(this).css("border-color", "#f00");
                    } else {
                        $(this).css("border-color", "#ccc");
                    }
                })
            }
        }
    });
}

//验证
function validate() {
    var isPass = true;
    $.each(viewModel.eventItems(), function (i, ele) {
        if (ele.IsCompulsory()) {
            var valString = "";
            $.each(ele.ItemValueList(), function (i,d) {
                valString += d.Text();
            })

            if (!valString) {
                isPass = false;
                $(".eventItem tr").each(function (i, d) {
                    self = $(this);
                    if (ele.ItemId() == self.attr("itemId")) {
                        self.css("color", "#f00");
                        self[0].scrollIntoView(false);
                        self.find("textarea:first").css("border-color", "#f00");
                    }
                })
            } else {
                $(".eventItem tr").each(function (i, d) {
                    self = $(this);
                    if (ele.ItemId() == self.attr("itemId")) {
                        self.css("color", "#000");
                        self.find("textarea:first").css("border-color", "#ccc");
                    }
                })
            }       
        }
    })
    return isPass;
}

function saveItems() {
    
    if (validate()) {
        var pop = mac.wait("Data Saving");
        var myViewModel = ko.mapping.toJS(viewModel);
        console.log(myViewModel);
        var array = [];
        $.each(myViewModel.eventItems, function (i, d) {
            var values = "";
            var len = d.ItemValueList.length;
            for (var i = 0; i < len; i++) {
                if (i == len - 1) {
                    values += d.ItemValueList[i].Text;
                }
                else {
                    values += d.ItemValueList[i].Text + "|";
                }
            }
            var item = new DataOperate.DataItem();
            item.BusinessId = bid;
            item.ModelId = mid;
            item.PageId = pid;
            item.ItemId = d.ItemId;
            item.ItemValue = values;
            if (d.IsDisplay) {
                array.push(item);
            }
        });

        $.each(myViewModel.tearItems, function (i, d) {
            d.ItemValue = d.SelectList.join(",") + "|" + d.IsTested + "|" + d.operat.operator + "|" + d.operat.valve;

            var item = new DataOperate.DataItem();
            item.BusinessId = bid;
            item.ModelId = mid;
            item.PageId = pid;
            item.ItemId = d.ItemId;
            item.ItemValue = d.ItemValue;

            if (d.IsDisplay) {
                array.push(item);
            }
        })

        console.log(array);
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
    };
}


//折叠
$(".collapse").click(function () {
    $(this).hide().siblings(".collapse").show();
    $(".showList").toggle();
})