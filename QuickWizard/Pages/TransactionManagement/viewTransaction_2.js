//交易管理回调
DataOperate.transationManagerData(transationManagerJson);
var item;
function transationManagerJson(json) {
    for (i = 0; i < json.length; i++) {
        //时间转换
        var date = new Date(parseInt(json[i].TransferDate.slice(6)));
        var Month = date.getMonth();
        var D = date.getDate();

        if (parseInt(Month) + 1 < 10)
            Month = "0" + String(parseInt(Month) + 1);
        else
            Month = String(parseInt(Month) + 1);
        if (parseInt(D) < 10)
            D = "0" + D;
        json[i].TransferDate = date.getFullYear() + '-' + Month + '-' + D;
    }
    $("#grid").kendoGrid({
        dataSource: {
            data: json,
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
        },
        selectable: "row",
        height: 600,
        sortable: true,
        reorderable: true,
        pageable: true,
        resizable: true,
        pageable: true,
        columns: [
            {
                field: "BussinessNo",
                title: "业务编号",
                attributes: {
                    "class": "table-BussinessNo"
                },
                width: 80
            },
            {
                field: "AccountNo",
                title: "借据编号",
                attributes: {
                    "class": "table-AccountNo"
                },
                filterable: {
                    cell: {
                        showOperators: false
                    }
                },
                width: 80
            },
            {
                field: "DealSum",
                title: "交易份额",

                width: 80
            },
             {
                 field: "Dealer",
                 title: "交易主体",
                 width: 80
             },
               {
                   field: "FactSum",
                   title: "实际结算金额",
                   width: 80
               },

            {
                field: "PoolDBName",
                title: "资产池",
                attributes: {
                    "class": "table-PoolDBName"
                },
                width: 80
            },
            {
                field: "TheorySum",
                title: "利润结算金额",
                width: 80
            },
            {
                field: "TransferDate",
                title: "转让日",
                format: "{0:dd/MM/yyyy}",
                attributes: {
                    "class": "table-TransferDate"
                },
                width: 80
            },
             {
                 field: "TransferMethod",
                 title: "转让模式",
                 width: 80
             }
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
            data = $(this).find(".table-BussinessNo")[0].innerHTML;
            delectData = $(this).find(".table-TransferDate")[0].innerHTML + "," + $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-BussinessNo")[0].innerHTML + "," + $(this).find(".table-AccountNo")[0].innerHTML;
        }
    }
    $("#ViewDetails").click(function () {
        console.log(data)
        if ((typeof data) == "string") {
            $("#lookDetails").dialog();
            $("#lookDetailscontent").fadeIn();
            DataOperate.viewtransationManagerData(data, viewtransationManagerDataCB);
        } else {
            alert("请选择想要查看的条目");
        };
    });
    function viewtransationManagerDataCB(json) {
        for (i = 0; i < json.length; i++) {
            //时间转换
            var date = new Date(parseInt(json[i].TransferDate.slice(6)));
            var Month = date.getMonth();
            var D = date.getDate();

            if (parseInt(Month) + 1 < 10)
                Month = "0" + String(parseInt(Month) + 1);
            else
                Month = String(parseInt(Month) + 1);
            if (parseInt(D) < 10)
                D = "0" + D;
            json[i].TransferDate = date.getFullYear() + '-' + Month + '-' + D;
        }
        $("#TransferDate").val(json[0].TransferDate);
        vm.viewtransationManagerDataCB = json;
    }
    //提交保存数据
    $("#saveUpdata").click(function () {
            var objEidt = {
                BussinessNo: $("#BussinessNo").val(),
                AccountNo: $("#AccountNo").val(),
                DealSum: $("#DealSum").val(),
                Dealer: $("#Dealer").val(),
                DealerOpponent: $("#DealerOpponent").val(),
                DivisionName: $("#DivisionName").val(),
                FactSum: $("#FactSum").val(),
                NetAssetValue: $("#NetAssetValue").val(),
                PoolDBName: $("#PoolDBName").val(),
                Remark: $("#Remark").val(),
                StartDateTimes: $("#StartDateTimes").val(),
                TheorySum: $("#TheorySum").val(),
                TransferDateTimes: $("#TransferDateTimes").val(),
                TransferMethod: $("#TransferMethod").val(),
            };
            DataOperate.viewUpdateTransferProperty(objEidt.BussinessNo, objEidt.TransferMethod, objEidt.PoolDBName, objEidt.AccountNo, objEidt.TransferDate, objEidt.DealSum,
    objEidt.Dealer, objEidt.TheorySum, objEidt.FactSum, objEidt.StartDate, objEidt.DealerOpponent, objEidt.Remark, viewUpdateTransferPropertyCB);
        
    });
    function viewUpdateTransferPropertyCB(json) {
        alert("删除成功！");
        console.log(json)
    };
    //删除数据
    $("#Delete").click(function () {
        if ((typeof data) === "string") {
            if (confirm("是否确定删除数据！")) {
                var delectDataobj = delectData.split(",");
                //时间转换
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
                var dateS = delectDataobj[0];
                console.log(delectDataobj);
                DataOperate.DeleteTransferProperty(delectDataobj[2], delectDataobj[3], delectDataobj[1], getDateTime(ConvertJSONDateToJSDate(dateS)), DeleteTransferPropertyCB);
            }
        }
    });
    function DeleteTransferPropertyCB(json) {
        $(".k-state-selected").fadeOut();
    }
    //编辑数据
    EditData = {};
    var eidtItem1 = $("#eidtItem")
    $("#Edit").click(function () {
        if ((typeof data) === "string") {
            $("#DeleteDetailsDiv").fadeIn();
            $("#DeleteDetails").dialog();
            DataOperate.GetTransferPropertyDisplayForUpdate(data, GetTransferPropertyDisplayForUpdateCB);
        } else {
            alert("请选择所要编辑的数据")
        }
    });
    function GetTransferPropertyDisplayForUpdateCB(json) {
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
        function ConvertJSONDateToJSDate(jsondate) {
            var dateS = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
            return dateS;
        }
        TransferDateTimes = getDateTime(ConvertJSONDateToJSDate(json[0].TransferDate));
        StartDateTimes = getDateTime(ConvertJSONDateToJSDate(json[0].StartDate));
        $("#AccountNo").val(json[0].AccountNo);
        $("#BussinessNo").val(json[0].BussinessNo);
        $("#DealSum").val(json[0].DealSum);
        $("#Dealer").val(json[0].Dealer);
        $("#DealerOpponent").val(json[0].DealerOpponent);
        $("#DivisionName").val(json[0].DivisionName);
        $("#FactSum").val(json[0].FactSum);
        $("#NetAssetValue").val(json[0].NetAssetValue);
        $("#PoolDBName").val(json[0].PoolDBName);
        $("#Remark").val(json[0].Remark);
        $("#StartDateTimes").val(StartDateTimes);
        $("#TheorySum").val(json[0].TheorySum);
        $("#TransferDateTimes").val(TransferDateTimes);
        $("#TransferMethod").val(json[0].TransferMethod);

    }
    //交易管理（转让）检索查询
    $("#poolDataBtn").click(function () {
        var poolData = $("#poolData").val();
        var numbersDataVal = $("#numbersData").val();
        if (!(poolData == "")) {
            if (numbersDataVal == "") {
                var numbersDataVal = "";
                DataOperate.viewQueryTransferProperty(poolData, numbersDataVal, viewQueryTransferPropertyCB);
            } else {
                DataOperate.viewQueryTransferProperty(poolData, numbersDataVal, viewQueryTransferPropertyCB);

            }


        } else {
            alert("检索数据不能为空")
        }
    });
    function viewQueryTransferPropertyCB(json) {
        console.log(json)
        $("#AddDetailsDiv").fadeIn();
        $("#AddDetails").dialog();
        for (i = 0; i < json.length; i++) {
            var date = new Date(parseInt(json[i].TransferDate.slice(6)));
            var Month = date.getMonth();
            var D = date.getDate();
            if (parseInt(Month) + 1 < 10)
                Month = "0" + String(parseInt(Month) + 1);
            else
                Month = String(parseInt(Month) + 1);
            if (parseInt(D) < 10)
                D = "0" + D;
            json[i].TransferDate = date.getFullYear() + '-' + Month + '-' + D;
        }
        $("#queryGrid").kendoGrid({
            dataSource: json,
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
                    field: "AccountNo",
                    title: "资产编号",
                    attributes: {
                        "class": "table-AccountNo",
                        "id": "table-AccountNo"

                    },
                    width: 80
                },

                {
                    field: "BussinessNo",
                    title: "业务编号",
                    attributes: {
                        "class": "table-ClearanceBuyBackDate",
                        "id": "table-ClearanceBuyBackDate"
                    },
                    width: 80
                },
                {
                    field: "DealSum",
                    title: "交易份额",
                    attributes: {
                        "class": "table-DealSum",
                        "id": "table-DealSum"
                    },
                    width: 80
                },
                {
                    field: "Dealer",
                    title: "交易主体",
                    attributes: {
                        "class": "table-Dealer",
                        "id": "table-Dealer"
                    },
                    width: 80
                },
                {
                    field: "FactSum",
                    title: "实际结算金额",
                    attributes: {
                        "class": "table-FactSum",
                        "id": "table-FactSum"
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
                    field: "TheorySum",
                    title: "理论结算金额",
                    attributes: {
                        "class": "table-TheorySum",
                        "id": "table-TheorySum"
                    },
                    width: 80
                },
                 {
                     field: "TransferDate",
                     title: "转让日",
                     attributes: {
                         "class": "table-TransferDate",
                         "id": "table-TransferDate"
                     },
                     width: 80
                 },
                  {
                      field: "TransferMethod",
                      title: "资产组合类型",
                      attributes: {
                          "class": "table-TransferMethod",
                          "id": "table-TransferMethod"
                      },
                      width: 80
                  }
            ]
        })
    };

};








