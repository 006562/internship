
DataOperate.GetClearanceBuyBackDisplay(GetClearanceBuyBackDisplayCB);
function GetClearanceBuyBackDisplayCB(json) {
     InitialDta= json;
    $("#grid").kendoGrid({
        dataSource: {
            data: InitialDta,
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
                field: "PoolDBName",
                title: "资产池",
                attributes: {
                    "class": "table-PoolDBName",
                    "id": "table-PoolDBName"
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
                field: "ClearanceBuyBackDate",
                title: "清仓回购日",
                attributes: {
                    "class": "table-ClearanceBuyBackDate",
                    "id": "table-ClearanceBuyBackDate"
                },
                width: 80
            },
            {
                field: "PrincipalSum",
                title: "借据本金余额（元）",
                attributes: {
                    "class": "table-PrincipalSum",
                    "id": "table-PrincipalSum"
                },
                width: 80
            },
            {
                field: "FactSum",
                title: "交易份额（元）",
                attributes: {
                    "class": "table-FactSum",
                    "id": "table-FactSum"
                },
                width: 80
            },
            {
                field: "PropertyType",
                title: "资产组合类型",
                attributes: {
                    "class": "table-PropertyType",
                    "id": "table-PropertyType"
                },
                width: 80
            },
        ]
    });
    //查看数据
    var grid = $("#grid").data("kendoGrid");
    var dataRows = grid.items();
    var data0;
    var data1;
    var data2;
    var AccountNo;
    var deleteData;
    var PoolDBNamegrid;

    for (i = 0; i < dataRows.length; i++) {
        dataRows[i].onclick = function () {
            data0 = $(this).find(".table-PoolDBName")[0].innerHTML;
            data1 = $(this).find(".table-ClearanceBuyBackDate")[0].innerHTML;
            data2 = $(this).find(".table-DevisionName")[0].innerHTML;
            deleteData = $(this).find(".table-ClearanceBuyBackDate")[0].innerHTML + "," + $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-DevisionName")[0].innerHTML;
        }
    }
    //查看详情
    $("#ViewDetails").click(function () {
        console.log(data0)
        if ((typeof data0) == "string") {
            var NetAssetValueDateDiv = $(".NetAssetValueDateDiv");
            NetAssetValueDateDiv.fadeIn();
            DataOperate.ViewClearanceBuyBackProperty(data0, data1, data2, QueryRedemptionCB);
        } else {
            alert("请选择想要查看的条目");
        };
    });
    function QueryRedemptionCB(json) {
        $("#StandDiv").fadeIn();
        $("#dialogDetails").dialog();
        $("#detailsGrid").kendoGrid({
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
                    field: "AccountNo",
                    title: "资产编号",
                    attributes: {
                        "class": "table-PoolDBNamegrid",
                        "id": "TabelAccountNo"
                    },
                    width: 80
                },
                {
                    field: "CustomerId",
                    title: "客户编号",
                    attributes: {
                        "class": "table-DevisionNamegrid",
                    },
                    width: 80
                },

                {
                    field: "DealSum",
                    title: "交易份额",
                    attributes: {
                        "class": "table-ClearanceBuyBackDategrid",
                    },
                    width: 80
                },
                {
                    field: "DealSum1",
                    title: "实际结算金额",
                    attributes: {
                        "class": "table-DevisionNamegrid",
                    },
                    width: 80
                },
                {
                    field: "NetAssetValue",
                    title: "单位进价（元）",
                    attributes: {
                        "id": "table-NetAssetValueGrid",
                    },
                    width: 80
                }

            ]
        });
        //交易管理（清仓回购）批量修改单位净价
        $("#NetAssetValueBtn").click(function () {
            var NetAssetValueDate = $("#NetAssetValueDate");
            var deleteDataobj = deleteData.split(",");
            var updatasum = {
                PoolDBName: {
                    updatasumDataTime: deleteDataobj[0],
                    updatasumDataname: deleteDataobj[1],
                    updatasumDevisionName: deleteDataobj[2]
                },
                NetAssetValue:NetAssetValueDate.val(),
            }
            DataOperate.UpdateClearanceBuyBackNetAssetValue(updatasum.PoolDBName.updatasumDataname, updatasum.PoolDBName.updatasumDataTime,updatasum.PoolDBName.updatasumDevisionName, updatasum.NetAssetValue, UpdateClearanceBuyBackNetAssetValueCB);
        })
        function UpdateClearanceBuyBackNetAssetValueCB(json) {
            alert("修改成功！")
        };
    }
    //删除
    $("#Delete").click(function () {
        if ((typeof data0) === "string") {
            if (confirm("是否确定删除数据！")) {
            var deleteDataobj = deleteData.split(",");
            console.log(deleteDataobj)
            DataOperate.DeleteClearanceBuyBackProperty(deleteDataobj[1], deleteDataobj[0], deleteDataobj[2], DeleteClearanceBuyBackPropertyCB);
             }
        }
    });
    function DeleteClearanceBuyBackPropertyCB(json) {
        $(".k-state-selected").fadeOut();
    }
    //交易管理（清仓回购）检索查询
    var MaturityDate;
    $("#PoolDBNameBtn").click(function () {
        MaturityDate = $("#PoolDBNameDate").val();
        var tabelPoolData = $(".table-PoolDBName");
        if (!(MaturityDate == "")) {
            DataOperate.QueryClearanceBuyBack(MaturityDate, QueryClearanceBuyBackCB);
        } else {
            alert("检索的内容有误");
        }
    })
    function QueryClearanceBuyBackCB(jsondata) {
        $("#AddDetailsDiv").fadeIn();
        $("#AddDetails").dialog();
        for (i = 0; i < jsondata.length; i++) {
            var date = new Date(parseInt(jsondata[i].ClearanceBuyBackDate.slice(6)));
            var Month = date.getMonth();
            var D = date.getDate();

            if (parseInt(Month) + 1 < 10)
                Month = "0" + String(parseInt(Month) + 1);
            else
                Month = String(parseInt(Month) + 1);
            if (parseInt(D) < 10)
                D = "0" + D;
            jsondata[i].ClearanceBuyBackDate = date.getFullYear() + '-' + Month + '-' + D;
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
                    field: "PoolDBName",
                    title: "资产池",
                    attributes: {
                        "class": "table-PoolDBName",
                        "id": "table-PoolDBName"
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
                    field: "ClearanceBuyBackDate",
                    title: "清仓回购日",
                    attributes: {
                        "class": "table-ClearanceBuyBackDate",
                        "id": "table-ClearanceBuyBackDate"
                    },
                    width: 80
                },
                {
                    field: "PrincipalSum",
                    title: "借据本金余额（元）",
                    attributes: {
                        "class": "table-PrincipalSum",
                        "id": "table-PrincipalSum"
                    },
                    width: 80
                },
                {
                    field: "FactSum",
                    title: "交易份额（元）",
                    attributes: {
                        "class": "table-FactSum",
                        "id": "table-FactSum"
                    },
                    width: 80
                },
                {
                    field: "PropertyType",
                    title: "资产组合类型",
                    attributes: {
                        "class": "table-PropertyType",
                        "id": "table-PropertyType"
                    },
                    width: 80
                },
            ]
        })
    }
};