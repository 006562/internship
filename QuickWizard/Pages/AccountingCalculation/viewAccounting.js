  $(document).ready(function () {
            //第一次加载
            var str = "资产";
            DataOperate.viewSubject(str, viewSubjectCB);
            function viewSubjectCB(json) {
                console.log(json);
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
                    columns: [
                        {
                            field: "SubjectNo",
                            title: "科目编号",
                            width: 80
                        },
                        {
                            field: "SubjectName",
                            title: "科目名称",
                            width: 80
                        },
                        {
                            field: "SubjectType",
                            title: "科目类别",
                            width: 80
                        },
                        {
                            field: "BalanceDirection",
                            title: "余额方向",
                            width: 80
                        },
                        {
                            field: "RecAndDisDirection",
                            title: "收支方向",
                            width: 80
                        },

                    ]
                });
            };
        });
$("#grid1").kendoGrid({
    dataSource: {
        type: "data",
        transport: {
            //数据
            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        },
        schema: {
            model: {
                fields: {

                }
            }
        },
        pageSize: 10
    },
    height: 550,
    sortable: true,
    reorderable: true,
    resizable: true,
    pageable: true,
    columns: [
        {
            field: "",
            title: "科目编号",
            width: 80
        },
        {
            field: "",
            title: "科目名称",
            width: 80
        },
        {
            field: "",
            title: "科目类别",
            width: 80
        },
        {
            field: "",
            title: "余额方向",
            width: 80
        },
        {
            field: "",
            title: "收支方向",
            width: 80
        },

    ]
});
$("#grid6").kendoGrid({
    dataSource: {
        type: "data",
        transport: {
            //数据
            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        },
        schema: {
            model: {
                fields: {

                }
            }
        },
        pageSize: 10
    },
    height: 550,
    sortable: true,
    reorderable: true,
    resizable: true,
    pageable: true,
    columns: [
        {
            field: "",
            title: "科目编号",
            width: 80
        },
        {
            field: "",
            title: "科目名称",
            width: 80
        },
        {
            field: "",
            title: "科目类别",
            width: 80
        },
        {
            field: "",
            title: "余额方向",
            width: 80
        },
        {
            field: "",
            title: "收支方向",
            width: 80
        },

    ]
});
$("#grid5").kendoGrid({
    dataSource: {
        type: "data",
        transport: {
            //数据
            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        },
        schema: {
            model: {
                fields: {

                }
            }
        },
        pageSize: 10
    },
    height: 550,
    sortable: true,
    reorderable: true,
    resizable: true,
    pageable: true,
    columns: [
        {
            field: "",
            title: "科目编号",
            width: 80
        },
        {
            field: "",
            title: "科目名称",
            width: 80
        },
        {
            field: "",
            title: "科目类别",
            width: 80
        },
        {
            field: "",
            title: "余额方向",
            width: 80
        },
        {
            field: "",
            title: "收支方向",
            width: 80
        },

    ]
});
$("#grid4").kendoGrid({
    dataSource: {
        type: "data",
        transport: {
            //数据
            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        },
        schema: {
            model: {
                fields: {

                }
            }
        },
        pageSize: 10
    },
    height: 550,
    sortable: true,
    reorderable: true,
    resizable: true,
    pageable: true,
    columns: [
        {
            field: "",
            title: "科目编号",
            width: 80
        },
        {
            field: "",
            title: "科目名称",
            width: 80
        },
        {
            field: "",
            title: "科目类别",
            width: 80
        },
        {
            field: "",
            title: "余额方向",
            width: 80
        },
        {
            field: "",
            title: "收支方向",
            width: 80
        },

    ]
});
$("#grid3").kendoGrid({
    dataSource: {
        type: "data",
        transport: {
            //数据
            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        },
        schema: {
            model: {
                fields: {

                }
            }
        },
        pageSize: 10
    },
    height: 550,
    sortable: true,
    reorderable: true,
    resizable: true,
    pageable: true,
    columns: [
        {
            field: "",
            title: "科目编号",
            width: 80
        },
        {
            field: "",
            title: "科目名称",
            width: 80
        },
        {
            field: "",
            title: "科目类别",
            width: 80
        },
        {
            field: "",
            title: "余额方向",
            width: 80
        },
        {
            field: "",
            title: "收支方向",
            width: 80
        },

    ]
});
$("#grid2").kendoGrid({
    dataSource: {
        type: "data",
        transport: {
            //数据
            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        },
        schema: {
            model: {
                fields: {

                }
            }
        },
        pageSize: 10
    },
    height: 550,
    sortable: true,
    reorderable: true,
    resizable: true,
    pageable: true,
    columns: [
        {
            field: "",
            title: "科目编号",
            width: 80
        },
        {
            field: "",
            title: "科目名称",
            width: 80
        },
        {
            field: "",
            title: "科目类别",
            width: 80
        },
        {
            field: "",
            title: "余额方向",
            width: 80
        },
        {
            field: "",
            title: "收支方向",
            width: 80
        },

    ]
});
//获取数据
//DataOperate.GetBuyBackDisplay(GetBuyBackDisplayCB);
//function GetBuyBackDisplayCB(json) {
//    console.log(json);
//    for (i = 0; i < json.length; i++) {
//        var JsonTransferDate = json[i].TransferDate;
//    }
//    $("#grid").kendoGrid({
//        dataSource: json,
//        height: 550,
//        sortable: true,
//        selectable: "row",
//        reorderable: true,
//        resizable: true,
//        pageable: true,
//        columns: [
//            {
//                field: "BussinessType",
//                title: "业务类型",
//                attributes: {
//                    "class": "table-BussinessType",
//                    "id": "table-BussinessType"
//                },
//                width: 80
//            },
//            {
//                field: "DevisionName",
//                title: "经办机构（分行）",
//                attributes: {
//                    "class": "table-DevisionName",
//                    "id": "table-DevisionName"
//                },
//                width: 80
//            },
//            {
//                field: "FactSum",
//                title: "实际结算金额（元）",
//                width: 80
//            },
//            {
//                field: "OperationDate",
//                title: "赎回/回购日",
//                attributes: {
//                    "class": "table-OperationDate",
//                    "id": "table-OperationDate"
//                },
//                width: 80
//            },
//            {
//                field: "PoolDBName",
//                title: "资产池",
//                attributes: {
//                    "class": "table-PoolDBName",
//                    "id": "table-PoolDBName"
//                },
//                width: 80
//            },
//            {
//                field: "Principal",
//                title: "借据本金余额（元）",
//                width: 80
//            },
//            {
//                field: "PropertyType",
//                title: "资产组合类型",
//                attributes: {
//                    "class": "table-PropertyType",
//                    "id": "table-PropertyType"
//                },
//                width: 80
//            },
//        ]
//    });

//    //交易管理（回购上划）查询数据
//    var grid = $("#grid").data("kendoGrid");
//    var dataRows = grid.items();
//    var data0;
//    var data1;
//    var data2;
//    var AccountNo;
//    var deleteData;
//    var PoolDBNamegrid;
//    for (i = 0; i < dataRows.length; i++) {
//        dataRows[i].onclick = function () {
//            data0 = $(this).find(".table-PoolDBName")[0].innerHTML;
//            data1 = $(this).find(".table-BussinessType")[0].innerHTML;
//            data2 = $(this).find(".table-OperationDate")[0].innerHTML;
//            //deleteData = $(this).find(".table-ClearanceBuyBackDate")[0].innerHTML + "," + $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-DevisionName")[0].innerHTML;
//        }
//    }
//    //查看详情
//    $("#ViewDetails").click(function () {
//        console.log(data0)
//        if ((typeof data0) == "string") {
//            var NetAssetValueDateDiv = $(".NetAssetValueDateDiv");
//            NetAssetValueDateDiv.fadeIn();
//            DataOperate.ViewBuyBackOn(data0, data1, data2, ViewBuyBackOnCB);
//        } else {
//            alert("请选择想要查看的条目");
//        };
//    });
//    function ViewBuyBackOnCB(json) {
//        console.log(json)
//        $("#StandDiv").fadeIn();
//        $("#dialogDetails").dialog();
//        $("#detailsGrid").kendoGrid({
//            dataSource: json,
//            height: 550,
//            selectable: "row",
//            sortable: true,
//            reorderable: true,
//            resizable: true,
//            pageable: true,
//            columns: [
//                {
//                    field: "CustomerId",
//                    title: "客户编号",
//                    attributes: {
//                        "class": "table-CustomerId",
//                        "id": "tableCustomerId"
//                    },
//                    width: 80
//                },
//                {
//                    field: "AccountNo",
//                    title: "资产编号",
//                    attributes: {
//                        "class": "table-AccountNo",
//                    },
//                    width: 80
//                },

//                {
//                    field: "DealSum",
//                    title: "交易份额",
//                    attributes: {
//                        "class": "table-DealSum",
//                    },
//                    width: 80
//                },
//                {
//                    field: "NetAssetValue",
//                    title: "单位进价（元）",
//                    attributes: {
//                        "class": "table-NetAssetValue",
//                    },
//                    width: 80
//                },
//                {
//                    field: "DealSum",
//                    title: "实际结算金额",
//                    attributes: {
//                        "id": "table-DealSum",
//                    },
//                    width: 80
//                }

//            ]
//        });
//        //交易管理（清仓回购）批量修改单位净价
//        $("#NetAssetValueBtn").click(function () {
//            var NetAssetValueDate = $("#NetAssetValueDate");
//            var deleteDataobj = deleteData.split(",");
//            var updatasum = {
//                PoolDBName: {
//                    updatasumDataTime: deleteDataobj[0],
//                    updatasumDataname: deleteDataobj[1],
//                    updatasumDevisionName: deleteDataobj[2]
//                },
//                NetAssetValue: NetAssetValueDate.val(),
//            }
//            DataOperate.UpdateClearanceBuyBackNetAssetValue(updatasum.PoolDBName.updatasumDataname, updatasum.PoolDBName.updatasumDataTime, updatasum.PoolDBName.updatasumDevisionName, updatasum.NetAssetValue, UpdateClearanceBuyBackNetAssetValueCB);
//        })
//        function UpdateClearanceBuyBackNetAssetValueCB(json) {
//            alert("修改成功！")
//        };
//    }

//    //交易管理（回购上划）检索查询

//    $("#PoolDBNameBtn").click(function () {
//        var MaturityDate = $("#PoolDBNameDate").val();
//        var tabelPoolData = $(".table-PoolDBName");
//        var DevisionNameData = $("#table-DevisionName");
//        if (!(MaturityDate == "")) {
//            DataOperate.QueryBuyBackOn(MaturityDate, DevisionNameData.html(), QueryBuyBackOnCB);
//        } else {
//            alert("检索的内容有误");
//        }
//    })
//    function QueryBuyBackOnCB(jsondata) {
//        console.log(jsondata)
//        $("#AddDetailsDiv").fadeIn();
//        $("#AddDetails").dialog();
//        for (i = 0; i < jsondata.length; i++) {
//            var date = new Date(parseInt(jsondata[i].OperationDate.slice(6)));
//            var Month = date.getMonth();
//            var D = date.getDate();

//            if (parseInt(Month) + 1 < 10)
//                Month = "0" + String(parseInt(Month) + 1);
//            else
//                Month = String(parseInt(Month) + 1);
//            if (parseInt(D) < 10)
//                D = "0" + D;
//            jsondata[i].OperationDate = date.getFullYear() + '-' + Month + '-' + D;
//        }
//        $("#queryGrid").kendoGrid({
//            dataSource: jsondata,
//            height: 550,
//            selectable: "row",
//            sortable: true,
//            reorderable: true,
//            resizable: true,
//            pageable: true,
//            columns: [
//                {
//                    field: "BussinessType",
//                    title: "业务类型",
//                    attributes: {
//                        "class": "table-BussinessType",
//                        "id": "table-BussinessType"
//                    },
//                    width: 80
//                },
//                {
//                    field: "DevisionName",
//                    title: "交易主体",
//                    attributes: {
//                        "class": "table-DevisionName",
//                        "id": "table-DevisionName"

//                    },
//                    width: 80
//                },

//                {
//                    field: "FactSum",
//                    title: "实际结算金额",
//                    attributes: {
//                        "class": "table-FactSum",
//                        "id": "table-FactSum"
//                    },
//                    width: 80
//                },
//                {
//                    field: "OperationDate",
//                    title: "回购上划日",
//                    attributes: {
//                        "class": "table-OperationDate",
//                        "id": "table-OperationDate"
//                    },
//                    width: 80
//                },
//                {
//                    field: "PoolDBName",
//                    title: "资产池",
//                    attributes: {
//                        "class": "table-PoolDBName",
//                        "id": "table-PoolDBName"
//                    },
//                    width: 80
//                },
//                {
//                    field: "Principal",
//                    title: "本金总额",
//                    attributes: {
//                        "class": "table-Principal",
//                        "id": "table-Principal"
//                    },
//                    width: 80
//                },
//                {
//                    field: "PropertyType",
//                    title: "资产组合类型",
//                    attributes: {
//                        "class": "table-PropertyType",
//                        "id": "table-PropertyType"
//                    },
//                    width: 80
//                },
//            ]
//        })
//    }

//    //交易管理（回购上划）批量修改单位净价

//    $("#Edit").click(function () {
//        $("#EditDetailsDiv").fadeIn();
//        $("#EditDetails").dialog();
//    });
//    $("#Add").click(function () {
//        $("#AddDetailsDiv").fadeIn();
//        $("#AddDetails").dialog();
//    });
//    $("#Delete").click(function () {
//        $("#DeleteDetailsDiv").fadeIn();
//        $("#DeleteDetails").dialog();
//    });







//};
