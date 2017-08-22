var cid;
var HaveDoneAction = false;

$(function () {
    var db = getQueryString("db");
    var sc = getQueryString("sc");
    AdminOperate.dbName = db;
    AdminOperate.schema = sc;
    cid = getQueryString("cid");
    registerEvent();
    if (cid != null) {
        $("#cid").text("");
        AdminOperate.GetItemCategoryById(cid, function (data) {
            $.each(data, function (i,d) {
                $("#label").html("<label class='col-4 control-label' id='lcid'>" + d.CategoryId + "</label>");
                var CategoryAlias = $("#CategoryAlias").val(d.CategoryAlias);
                var CategoryCode = $("#CategoryCode").val(d.CategoryCode);
                var Description = $("#Description").val(d.Description);
            });

        });  
    }
})

function registerEvent() {

    var IsExist = false;

    $("#CategoryId").blur(function () {
        var CategoryId = $("#CategoryId").val();
        if (CategoryId != '') {
            AdminOperate.IsExistCategoryId(CategoryId, function (r) {
                if (r == "0") {
                    $("#cid").text("OK");
                    IsExist = true;
                } else {
                    $("#cid").text("已存在");
                    IsExist = false;
                }
            });
        } else {
            $("#cid").text("*必填");
            IsExist = false;
        }
    });

    $("#CategoryAlias").blur(function () {
        var CategoryAlias = $("#CategoryAlias").val();
        if (CategoryAlias != '') {
            $("#cas").text("OK");
        } else {
            $("#cas").text("*必填");
        }
    });

    $("#CategoryCode").blur(function () {
        var CategoryCode = $("#CategoryCode").val();
        if (CategoryCode != '') {
            $("#cce").text("OK");
        } else {
            $("#cce").text("*必填");
        }
    });

    $("#btnSave").click(function () {
        var CategoryId=  $("#CategoryId").val();
        var CategoryAlias= $("#CategoryAlias").val();
        var  CategoryCode= $("#CategoryCode").val();
        var Description= $("#Description").val();
        var xml = "";
        if (cid != null) {
            IsExist = true;
            var caid = $("#lcid").html().trim();
            xml = "<item><CategoryId>" + caid + "</CategoryId><CategoryAlias>" + CategoryAlias + "</CategoryAlias>"
              + "<CategoryCode>" + CategoryCode + "</CategoryCode><Description>" + Description + "</Description></item>";
        } else {
            xml = "<item><CategoryId>" + CategoryId + "</CategoryId><CategoryAlias>" + CategoryAlias + "</CategoryAlias>"
                + "<CategoryCode>" + CategoryCode + "</CategoryCode><Description>" + Description + "</Description></item>";
        }
        xml = encodeURIComponent(xml);
        if (IsExist) {
            AdminOperate.UpdateItemCategory(xml, function (r) {
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