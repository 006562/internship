DataOperate.GetTransferAssetsforRecycleCross(GetTransferAssetsforRecycleCrossCB);
function GetTransferAssetsforRecycleCrossCB(json) {
    console.log(json);
    //时间日期转换
    for (i = 0; i < json.length; i++) {
        var JsonMaturityDate = json[i].MaturityDate;
        var JsonRecycleDate = json[i].RecycleDate;
        //yyyy-MM-dd HH:mm:SS
        function getDateTime(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hh = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();
            //return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
            return year + "-" + month + "-" + day;
        };
        //调用的是这个方法
        function ConvertJSONDateToJSDate(jsondate) {
            var date = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
            return date;
        }
        var JsonMaturityDateTime = getDateTime(ConvertJSONDateToJSDate(JsonMaturityDate));
        var JsonRecycleDateTime = getDateTime(ConvertJSONDateToJSDate(JsonRecycleDate));
    };
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
                format: "{0:MM/dd/yyyy}",
                title: "开始日期",
                width: 80
            },
            {
                field: "RecycleDate",
                title: "截止日",
                format: "{0:MM/dd/yyyy}",
                width: 80
            },
            {
                field: "ShouldPaySum",
                title: "借据本金余额（元）",
                width: 80
            },

            {
                field: "TrustName",
                title: "产品名称",
                width: 80
            },
            {
                field: "TrustCode",
                title: "产品编号",
                width: 80
            },
        ]
    });

    //查看数据
    var grid = $("#grid").data("kendoGrid");
    var dataRows = grid.items();
    var data;
    var AccountNo;
    var delectData;
    for (i = 0; i < dataRows.length; i++) {
        dataRows[i].onclick = function () {
            data = $(this).find(".table-BussinessNo")[0].innerHTML;
           // delectData = $(this).find(".table-TransferDate")[0].innerHTML + "," + $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-BussinessNo")[0].innerHTML + "," + $(this).find(".table-AccountNo")[0].innerHTML;
        }
    }
    $("#ViewDetails").click(function () {
        if ((typeof data) == "string") {
            $("#StandDiv").fadeIn();
            $("#dialogDetails").dialog();
            DataOperate.ViewRecycleCrossProperty(data, ViewRecycleCrossPropertyCB);
        } else {
            alert("请选择想要查看的条目");
        };
    });
    function ViewRecycleCrossPropertyCB(json) {
        console.log(json)
        function getDateTime(dateS) {
            var year = dateS.getFullYear();
            var month = dateS.getMonth() + 1;
            var day = dateS.getDate();
            var hh = dateS.getHours();
            var mm = dateS.getMinutes();
            var ss = dateS.getSeconds();
            return year + "-" + month + "-" + day;
        }
        //调用的是这个方法
        function ConvertJSONDateToJSDate(jsondate) {
            var dateS = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
            return dateS;
        }
        var MaturityDate = json[0].MaturityDate;
        var StartDate = json[0].StartDate;
        $("#AccountNo").val(json[0].AccountNo);
        $("#DivisionName").val(json[0].DivisionName);
        $("#MaturityDate").val(getDateTime(ConvertJSONDateToJSDate(MaturityDate)));
        $("#PoolDBName").val(json[0].PoolDBName);
        $("#RecycleDate").val(getDateTime(ConvertJSONDateToJSDate(json[0].RecycleDate)));
        $("#ShouldPayDate").val(getDateTime(ConvertJSONDateToJSDate(json[0].ShouldPayDate)));
        $("#StartDate").val(getDateTime(ConvertJSONDateToJSDate(StartDate)));
        $("#TrustCode").val(json[0].TrustCode);
        $("#TrustName").val(json[0].TrustName);
    }
    //交易管理（回收确认）检索查询
    $("#Add").click(function () {
        if ((typeof data) == "string") {
            if (confirm("是否确定回收数据！")) {
            DataOperate.SaveRecycleCrossProperty(data, SaveRecycleCrossPropertyCB);
        }
        };
    });
    function SaveRecycleCrossPropertyCB(json) {
        $(".k-state-selected").fadeOut();
    }

    //删除数据
    $("#Delete").click(function () {
        if ((typeof data) === "string") {
            if (confirm("是否确定删除数据！")) {
                DataOperate.DeleteRecycleCrossProperty(JSON.parse(data), DeleteRecycleCrossPropertyCB);
             }
         }

    });
    function DeleteRecycleCrossPropertyCB(json) {
        $(".k-state-selected").fadeOut();
    }

    //交易管理（回收管理）检索查询
    $("#PoolDBNameBtn").click(function () {
        var PoolDBNameDate = $("#PoolDBNameDate").val();
        var PoolDBNameDate1 = $("#PoolDBNameDate1").val();
        var tabelPoolData = $(".table-PoolDBName");
        if (PoolDBNameDate1 == "") {
            var PoolDBNameDate1 = "";
            DataOperate.viewQueryTransferPropertyFroRecycleCross(PoolDBNameDate1, PoolDBNameDate, viewQueryTransferPropertyFroRecycleCrossCB);
        } else if (PoolDBNameDate == "") {
            var PoolDBNameDate = "";
            DataOperate.viewQueryTransferPropertyFroRecycleCross(PoolDBNameDate1, PoolDBNameDate, viewQueryTransferPropertyFroRecycleCrossCB);
        } else {
            DataOperate.viewQueryTransferPropertyFroRecycleCross(PoolDBNameDate1, PoolDBNameDate, viewQueryTransferPropertyFroRecycleCrossCB);
        }
    })
    function viewQueryTransferPropertyFroRecycleCrossCB(jsondata) {
        $("#btnItemCRUD").fadeIn();
        $("#AddDetailsDiv").fadeIn();
        $("#AddDetails").dialog();
        for (i = 0; i < jsondata.length; i++) {
            var date = new Date(parseInt(jsondata[i].RecycleDate.slice(6)));
            var Month = date.getMonth();
            var D = date.getDate();

            if (parseInt(Month) + 1 < 10)
                Month = "0" + String(parseInt(Month) + 1);
            else
                Month = String(parseInt(Month) + 1);
            if (parseInt(D) < 10)
                D = "0" + D;
            jsondata[i].RecycleDate = date.getFullYear() + '-' + Month + '-' + D;
        }
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
                    field: "DivisionName",
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
                    field: "PoolDBName",
                    title: "资产池",
                    attributes: {
                        "class": "table-PoolDBName",
                        "id": "table-PoolDBName"
                    },
                    width: 80
                },
                {
                    field: "RecycleDate",
                    title: "回收上划日",
                    attributes: {
                        "class": "table-RecycleDate",
                        "id": "table-RecycleDate"
                    },
                    width: 80
                },
                {
                    field: "ShouldPaySum",
                    title: "应付本金",
                    attributes: {
                        "class": "tabel-TrustCode",
                        "id": "table-TrustCode"
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
