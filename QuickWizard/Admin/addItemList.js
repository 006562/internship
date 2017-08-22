var iaid;
var db;
var sc;
$(function () {
     db= getQueryString("db");
     sc= getQueryString("sc");
    AdminOperate.dbName = db;
    AdminOperate.schema = sc;
    iaid=getQueryString("iaid");
    ItemCategory();
    if (iaid != null) {
        AdminOperate.GetItemByAid(iaid, function (data) {
            $.each(data, function (i, d) {
                var ItemId = $("#ItemId").val(d.ItemId);
                var ItemAliasValue = $("#ItemAliasValue").val(d.ItemAliasValue);
                var ItemAliasSetName = $("#ItemAliasSetName").val(d.ItemAliasSetName);
                var ItemCode = $("#ItemCode").val(d.ItemCode);
                var CategoryId = $("#SelList").val(d.CategoryId);
            });
        });
    }
    registerEvent();
})

function ItemCategory() {
    AdminOperate.GetAllItemCategory(function (data) {
        var html = '';
        $.each(data, function (i, d) {
            html += '<option value="' + d.CategoryId + '">' + d.CategoryAlias +'；'+ d.CategoryCode + '</option>';
        });
        $("#SelList").html(html);
    });
}

function registerEvent() {
    var IsExist = false;
    $("#ItemId").blur(function () {
        var ItemId = $("#ItemId").val();
        if (ItemId != '') {
            AdminOperate.IsExistItemId(ItemId, function (r) {
                if (r == "0") {
                    $("#tid").text("OK");
                    IsExist = true;
                } else {
                    $("#tid").text("已存在");
                    IsExist = false;
                }
            });
        } else {
            $("#tid").text("*必填");
        }
    });

    $("#ItemAliasValue").blur(function () {
        var ItemAliasValue = $("#ItemAliasValue").val();
        if (ItemAliasValue != '') {
            $("#iav").text("OK");
        } else {
            $("#iav").text("*必填");
        }
    });

    $("#ItemCode").blur(function () {
        var ItemCode = $("#ItemCode").val();
        if (ItemCode != '') {
            $("#ic").text("OK");
        } else {
            $("#ic").text("*必填");
        }
    });

    $("#btnSave").click(function () {
        var ItemId = $("#ItemId").val();
        var ItemAliasValue = $("#ItemAliasValue").val();
        var ItemAliasSetName = $("#ItemAliasSetName").val();
        var ItemCode = $("#ItemCode").val();
        var CategoryId = $("#SelList").val();
        var xml = '';
        if (iaid != null) {
            IsExist = true;
            xml = '<item><ItemAliasId>' + iaid + '</ItemAliasId><ItemId>' + ItemId + '</ItemId><ItemAliasValue>' + ItemAliasValue + '</ItemAliasValue>'
                         + '<ItemAliasSetName>' + ItemAliasSetName + '</ItemAliasSetName><ItemCode>' + ItemCode + '</ItemCode><CategoryId>' + CategoryId + '</CategoryId></item>';
        } else {
            xml = '<item><ItemAliasId></ItemAliasId><ItemId>' + ItemId + '</ItemId><ItemAliasValue>' + ItemAliasValue + '</ItemAliasValue>'
                  + '<ItemAliasSetName>' + ItemAliasSetName + '</ItemAliasSetName><ItemCode>' + ItemCode + '</ItemCode><CategoryId>' + CategoryId + '</CategoryId></item>';
        }
        xml = encodeURIComponent(xml);
        if (IsExist) {
            AdminOperate.UpdateItemAlias(xml, function (r) {
                if (!isNaN(r)) {
                    alertMsg('Save Successfull!');
                    HaveDoneAction = true;
                }
                else { alertMsg('Failed：' + r, 'icon-warning'); }
            });
        } else {
            alertMsg('Save Fail!', 'icon-warning');
        }
    });
}