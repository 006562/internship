var bid;
var pid;
var mid;
var set;

var viewModel;
var myModel = {
    ServiceProviderRoles: [],
    Language: {},
}

function getLanguage(set) {
    var zh_CN = { Title: "相关参与方", BtnSave: "保存信息" };
    var en_US = { Title: "Related Parties", BtnSave: "Save Data" };
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
    $('#loading').fadeIn();
    myModel.Language = getLanguage(set);
    DataOperate.getPageData(mid, pid, bid, set, getTrustItem);

});

function getTrustItem(items) {
    databind(items);
    setDatePlugins();
    $('#loading').fadeOut();
}

function databind(items) {

    var serviceProviderFields = [];
    $.each(items, function (i, d) {
        d['IsDisplay'] = false;
        d['IsNew'] = false;

        if (d.IsCompulsory) {
            d.IsDisplay = true;
        }
        else {
            if (d.ItemValue != "" && d.ItemValue != null) {
                d.IsDisplay = true;
                d.IsNew = true;
            }
        }


        if (d.CategoryId == 4) {
            d['Fields'] = [];
            myModel.ServiceProviderRoles.push(d);
        }
        else {
            serviceProviderFields.push(d);
        }
    });

    $.each(myModel.ServiceProviderRoles, function (i, s) {
        $.each(serviceProviderFields, function (j, f) {
            //Group01不为空说明是有数据的,
            if (f.GroupId01 != "" && f.GroupId01 != null) {
                if (f.GroupId01 == s.ItemId) {
                    var n = ko.mapping.fromJS(f);//有子JSON数组时，必须转成KO格式，否则会替换掉
                    s.Fields.push(n);
                }
            }
            else {
                var n = ko.mapping.fromJS(f);//有子JSON数组时，必须转成KO格式，否则会替换掉
                s.Fields.push(n);
            }
        });

    });

    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);

}


function addDisplaySPR() {
    var itemId = $('#select_SPRole').val();
    if (itemId != null) {
        var roles = viewModel.ServiceProviderRoles();
        $.each(roles, (function (i, item) {
            if (item.ItemId() == itemId) {
                item.IsDisplay(true);
                item.IsNew(true);
            }

        }));

    }

    setDatePlugins();
}

function removeDisplaySPR(obj) {
    var itemId = $(obj).attr('itemId');
    var roles = viewModel.ServiceProviderRoles();
    $.each(roles, (function (i, item) {
        if (item.ItemId() == itemId) {
            item.ItemValue("");
            item.IsDisplay(false);
            item.IsNew(false);
        }
    }));
}


function addSPRField(obj) {
    var sprItemId = $(obj).attr('ItemId');
    var fieldItemId = $('#select_fields_' + sprItemId).val();
    var sPRs = viewModel.ServiceProviderRoles();
    $.each(sPRs, function (i, p) {
        if (p.ItemId() == sprItemId) {
            var t;
            $.each(p.Fields(), function (j, f) {
                if (f.ItemId() == fieldItemId) {
                    f.IsDisplay(true);
                    f.IsNew(true);

                    t = f;
                    p.Fields.remove(f);
                    p.Fields.push(t);
                    return;
                }
            });
            return;
        }
    });
    setDatePlugins();
}

function removeSPRField(obj) {
    var sprItemId = $(obj).attr('sprItemId');
    var fieldItemId = $(obj).attr('fieldItemId');
    var sPRs = viewModel.ServiceProviderRoles();
    $.each(sPRs, function (i, p) {
        if (p.ItemId() == sprItemId) {
            $.each(p.Fields(), function (j, f) {
                if (f.ItemId() == fieldItemId) {
                    f.ItemValue("");
                    f.IsDisplay(false);
                    f.IsNew(false);
                    return;
                }
            });
            return;
        }

    });
}

function setDatePlugins() {
    $("#TrustSPRoleDiv").find('.date-plugins').date_input();
}


function saveItem() {

    var pass = validation();
    if (pass) {
        var pop = mac.wait("Data Saving");
        var array = [];
        $.each(viewModel.ServiceProviderRoles(), function (i, role) {
            var item = new DataOperate.DataItem();
            item.BusinessId = bid;
            item.ModelId = mid;
            item.PageId = pid;
            item.ItemId = role.ItemId();
            item.ItemValue = role.ItemValue();
            array.push(item);
            $.each(role.Fields(), function (i, f) {
                var item = new DataOperate.DataItem();
                item.BusinessId = bid;
                item.ModelId = mid;
                item.PageId = pid;
                item.ItemId = f.ItemId();
                item.ItemValue = f.ItemValue();
                item.GroupId01 = role.ItemId();
                array.push(item);
            });
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

}

 

function validation() {
    var pass = true;
    var detail = $("#TrustSPRoleDiv").find("input");
    pass = validControls(detail);
    return pass;
}