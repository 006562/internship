DataOperate.GetTurnPay(GetTurnPayCB);
function GetTurnPayCB(json) {
    console.log(json);
    for (i = 0; i < json.length; i++) {
        var JsonTransferDate = json[i].TransferDate;
    }
    $("#grid").kendoGrid({
        dataSource: {
            data: json,
            pageSize: 10
        },
        height: 550,
        sortable: true,
        reorderable: true,
        resizable: true,
        pageable: true,
        selectable: "row",
        page: 15,
        columns: [
            {
                field: "AccountNo",
                title: "资产编号",
                attributes: {
                    "class": "table-BussinessNo"
                },
                width: 80
            },
            {
                field: "DivisionName",
                title: "经办机构（分行）",
                width: 80
            },
            {
                field: "MaturityDate",
                title: "截止日期",
                width: 80
            },
            {
                field: "RecycleCrossDate",
                title: "开始日期",
                width: 80
            },
            {
                field: "ShouldPaySum",
                title: "应转付金额（元）",
                width: 80
            },
            {
                field: "TrustCode",
                title: "产品编号",
                width: 80
            },
            {
                field: "",
                title: "交易状态",
                attributes: {
                    "class": "table-zt"
                },
                width: 80
            }
        ]
    });
    //查看
    var grid = $("#grid").data("kendoGrid");
    var dataRows = grid.items();
    var data;
    var delectData;
    for (i = 0; i < dataRows.length; i++) {
        dataRows[i].onclick = function () {
            data = $(this).find(".table-BussinessNo")[0].innerHTML;
        }
    }
    $("#ViewDetails").click(function () {
        if ((typeof data) == "string") {
            $("#dialogDetails").dialog();
            $("#StandDiv").fadeIn();
            DataOperate.ViewTurnPayProperty(data, ViewTurnPayPropertyCB);
        } else {
            alert("请选择想要查看的条目");
        };
    });
    function ViewTurnPayPropertyCB(json) {
        function getDateTime(dateS) {
            var year = dateS.getFullYear();
            var month = dateS.getMonth() + 1;
            var day = dateS.getDate();
            var hh = dateS.getHours();
            var mm = dateS.getMinutes();
            var ss = dateS.getSeconds();
            return year + "-" + month + "-" + day;
        }
        function ConvertJSONDateToJSDate(jsondate) {
            var dateS = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
            return dateS;
        }
        $("#AccountNo").val(json[0].AccountNo);
        $("#DivisionName").val(json[0].DivisionName);
        $("#MaturityDate").val(getDateTime(ConvertJSONDateToJSDate(json[0].MaturityDate)));
        $("#RecycleCrossDate").val(getDateTime(ConvertJSONDateToJSDate(json[0].RecycleCrossDate)));
        $("#ShouldPaySum").val(json[0].ShouldPaySum);
        $("#StartDate").val(getDateTime(ConvertJSONDateToJSDate(json[0].MaturityDate)));
        $("#TrustCode").val(json[0].TrustCode);
        $("#TrustName").val(json[0].TrustName);
    }

    //删除
    $("#Delete").click(function () {
        if ((typeof data) === "string") {
            if (confirm("是否确定删除数据！")) {
            DataOperate.DeleteTurnPayProperty(JSON.parse(data), DeleteTurnPayPropertyCB);
             }
        }
    });
    function DeleteTurnPayPropertyCB(json) {
        $(".k-state-selected").fadeOut();
    }
    //编辑
    EditData = {};
    var eidtItem1 = $("#eidtItem")
    $("#Edit").click(function () {
        if ((typeof data) === "string") {
            $("#DeleteDetailsDiv").fadeIn();
            $("#DeleteDetails").dialog();
            DataOperate.viewtransationManagerData(data, viewtransationManagerDataCB);
        } else {
            alert("请选择所要编辑的数据")
        }
    });
    //交易管理回收转付确认
    $("#Add").click(function () {
        if ((typeof data) == "string") {
            if (confirm("是否确定删除数据！")) {
            DataOperate.SaveTurnPayProperty(data, SaveTurnPayPropertyCB);
                 }
        };
    });
    function SaveTurnPayPropertyCB(json) {
        $(".k-state-selected").find(".table-zt").text("已转付");
    };
    //检索
    $("#PoolDBNameBtn").click(function () {
        var PoolDBNameDate = $("#PoolDBNameDate").val();
        var PoolDBNameDate1 = $("#PoolDBNameDate1").val();
        var tabelPoolData = $(".table-PoolDBName");
        if (!(PoolDBNameDate == "") && !(PoolDBNameDate1 == "")) {
            DataOperate.QueryTurnPayProperty(PoolDBNameDate1, PoolDBNameDate, QueryTurnPayPropertyCB);
        } else {
            alert("检索的内容有误");
        }
    })
    function QueryTurnPayPropertyCB(jsondata) {
        console.log(jsondata)
        $("#AddDetailsDiv").fadeIn();
        $("#AddDetails").dialog();
        for (i = 0; i < jsondata.length; i++) {
            var date = new Date(parseInt(jsondata[i].MaturityDate.slice(6)));
            var Month = date.getMonth();
            var D = date.getDate();

            if (parseInt(Month) + 1 < 10)
                Month = "0" + String(parseInt(Month) + 1);
            else
                Month = String(parseInt(Month) + 1);
            if (parseInt(D) < 10)
                D = "0" + D;
            jsondata[i].MaturityDate = date.getFullYear() + '-' + Month + '-' + D;
        }
        for (i = 0; i < jsondata.length; i++) {
            var date = new Date(parseInt(jsondata[i].RecycleCrossDate.slice(6)));
            var Month = date.getMonth();
            var D = date.getDate();

            if (parseInt(Month) + 1 < 10)
                Month = "0" + String(parseInt(Month) + 1);
            else
                Month = String(parseInt(Month) + 1);
            if (parseInt(D) < 10)
                D = "0" + D;
            jsondata[i].RecycleCrossDate = date.getFullYear() + '-' + Month + '-' + D;
        }
        $("#queryGrid").kendoGrid({
            dataSource: jsondata,
            height: 550,
            selectable: "row",
            sortable: true,
            reorderable: true,
            resizable: true,
            pageable: true,
            columns: [
                {
                    field: "AccountNo",
                    title: "资产编号",
                    attributes: {
                        "class": "table-AccountNo",
                        "id": "table-AccountNo"
                    },
                    width: 80
                },
                {
                    field: "DevisionName",
                    title: "交易主体",
                    attributes: {
                        "class": "table-DevisionName",
                        "id": "table-DevisionName"
                    },
                    width: 80
                },

                {
                    field: "MaturityDate",
                    title: "截止日",
                    attributes: {
                        "class": "table-MaturityDate",
                        "id": "table-MaturityDate"
                    },
                    width: 80
                },
                {
                    field: "RecycleCrossDate",
                    title: "上划日",
                    attributes: {
                        "class": "table-RecycleCrossDate",
                        "id": "table-RecycleCrossDate"
                    },
                    width: 80
                },
                {
                    field: "ShouldPaySum",
                    title: "应付金额",
                    attributes: {
                        "class": "table-RecycleCrossDate",
                        "id": "table-RecycleCrossDate"
                    },
                    width: 80
                },
                {
                    field: "TrustCode",
                    title: "资产编号",
                    attributes: {
                        "class": "tabel-TrustCode",
                        "id": "table-TrustCode"
                    },
                    width: 80
                },
                {
                    field: "TrustName",
                    title: "资产名称",
                    attributes: {
                        "class": "tabel-TrustName",
                        "id": "table-TrustName"
                    },
                    width: 80
                },
            ]
        })
    }

};









