//交易管理回调
DataOperate.GetAccountSet(AccountSetJson);
var item;
function AccountSetJson(json) {
    console.log(json)
    $("#grid").kendoGrid({
        dataSource: {
            data: json,
            pageSize: 10
        },
        height: 550,
        selectable: "row",
        sortable: true,
        reorderable: true,
        resizable: true,
        pageable: true,
        columns: [
            {
                field: "AccountSetNo",
                title: "账套号",
                attributes: {
                    "class": "table-AccountSetNo",
                    "id": "table-AccountSetNo"

                },
                width: 80
            },
            {
                field: "AccountSetName",
                title: "账套名称",
                width: 80
            },
            {
                field: "Remark",
                title: "备注",
                width: 80
            },
        ]
    });

    //查看数据
    var grid = $("#grid").data("kendoGrid");
    var dataRows = grid.items();
    var data;
    var delectData;
    var BussinessNoData;
    for (i = 0; i < dataRows.length; i++) {
        dataRows[i].onclick = function () {
            data = $(this).find(".table-AccountSetNo")[0].innerHTML;
            //delectData = $(this).find(".table-TransferDate")[0].innerHTML + "," + $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-BussinessNo")[0].innerHTML + "," + $(this).find(".table-AccountNo")[0].innerHTML;
        }
    }

    //新建数据
    $("#Add").click(function () {
        $("#AddDetailsDiv").fadeIn();
        $("#AddDetails").dialog();
    });

    //删除数据
    $("#Delete").click(function () {
        if ((typeof data) === "string") {

            DataOperate.DeleteAccountSet(data, DeleteAccountSetCB);
        }
        else {
            alert("请选择删除的条目");
        }

    });
    function DeleteAccountSetCB(json) {
        $(".k-state-selected").fadeOut();
        alert("删除成功！");
    }
    //编辑数据
    var eidtItem1 = $("#eidtItem")
    $("#Edit").click(function () {
        if ((typeof data) === "string") {
            $("#EditDetailsDiv").fadeIn();
            $("#EditDetails").dialog();
            DataOperate.GetAccountSetForUpdate(data, GetAccountSetForUpdateCB);
        } else {
            alert("请选择所要编辑的数据")
        }
    });
    function GetAccountSetForUpdateCB(json) {
        vm.data1 = json;
        $("#AccountSetNo").val(json[0].AccountSetNo);
        $("#AccountSetName").val(json[0].AccountSetName);
        $("#Remark").val(json[0].Remark);
    }

    //检索查询
    $("#BookNoBtn").click(function () {
        var BookNo = $("#BookNo").val();
        if (!(BookNo == "")) {
            DataOperate.QueryAccountSet(BookNo,QueryAccountSetCB);
        } else {
            alert("检索数据不能为空")
        }
    });
    function QueryAccountSetCB(json) {
        console.log(json)
    }


};








