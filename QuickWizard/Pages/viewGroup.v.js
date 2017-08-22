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
    myModel.Language = getLanguage(set);
    DataOperate.getPageData(mid, pid, bid, set, getTrustItem);

});

function getTrustItem(items) {
    databind(items);
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
        s.IsDisplay = false;
        if (s.IsCompulsory) {
            s.IsDisplay = true;
        } else {
            if (s.ItemValue) {
                s.IsDisplay = true;
            }
        }

        $.each(serviceProviderFields, function (j, f) {
            if (f.GroupId01 != "" && f.GroupId01 != null) {
                if (f.GroupId01 == s.ItemId) {
                    s.Fields.push(f);
                }
            }
            
        });
        $.each(s.Fields, function (i, d) {
            d.IsDisplay = false;
            if (d.IsCompulsory) {
                d.IsDisplay = true;
            } else {
                if (d.ItemValue) {
                    d.IsDisplay = true;
                }
            }

        })
    });

    console.log(myModel);
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);

}