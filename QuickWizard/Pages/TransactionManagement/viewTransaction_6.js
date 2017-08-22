DataOperate.GetRedemptionDisplay(GetRedemptionDisplayCB);
function GetRedemptionDisplayCB(json) {
    console.log(json);
    for (i = 0; i < json.length; i++) {
        var date = new Date(parseInt(json[i].PropertyRedemptionDate.slice(6)));
        var Month = date.getMonth();
        var D = date.getDate();

        if (parseInt(Month) + 1 < 10)
            Month = "0" + String(parseInt(Month) + 1);
        else
            Month = String(parseInt(Month) + 1);
        if (parseInt(D) < 10)
            D = "0" + D;
        json[i].PropertyRedemptionDate = date.getFullYear() + '-' + Month + '-' + D;
    }
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
                field: "DevisionName",
                title: "机构",
                attributes: {
                    "class": "table-DevisionName"
                },
                width: 80
            },
            {
                field: "FactSum",
                title: "实际结算金额",
                attributes: {
                    "class": "table-FactSum"
                },
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
                field: "PrincipalSum",
                title: "理论结算金额",
                attributes: {
                    "class": "table-RecycleCrossDate"
                },
                width: 80
            },
            {
                field: "PropertyRedemptionDate",
                title: "赎回日",
                attributes: {
                    "class": "table-PropertyRedemptionDate"
                },
                width: 80
            },
            {
                field: "PropertyType",
                title: "资产类型",
                attributes: {
                    "class": "table-PropertyType"
                },
                width: 80
            }
        ]
    });
    //查看数据
    var grid = $("#grid").data("kendoGrid");
    var dataRows = grid.items();
    var data;
    var AccountNo;
    var delectData;
    var eidtData;
    var edit;
    for (i = 0; i < dataRows.length; i++) {
        dataRows[i].onclick = function () {
            data = $(this).find(".table-PoolDBName")[0].innerHTML;
            delectData = $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-PropertyRedemptionDate")[0].innerHTML + "," + $(this).find(".table-DevisionName")[0].innerHTML;
            //delectData = $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-PropertyRedemptionDate")[0].innerHTML + "," + $(this).find(".table-DevisionName")[0].innerHTML;
            deleteData = $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-PropertyRedemptionDate")[0].innerHTML + "," + $(this).find(".table-DevisionName")[0].innerHTML;
            edit = $(this).find(".table-PoolDBName")[0].innerHTML;

        }
    }
    $("#ViewDetails").click(function () {
        console.log(data)
        if ((typeof data) == "string") {
            $("#StandDiv").fadeIn();
            $("#dialogDetails").dialog();
            DataOperate.QueryRedemption(data, QueryRedemptionCB);
        } else {
            alert("请选择想要查看的条目");
        };
    });
    function QueryRedemptionCB(json) {
        $("#NetAssetValueDateDiv").fadeIn();
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
        $("#DevisionName").val(json[0].DevisionName);
        $("#FactSum").val(json[0].FactSum);
        $("#PoolDBName").val(json[0].PoolDBName);
        $("#PrincipalSum").val(json[0].PrincipalSum);
        $("#PropertyRedemptionDate").val(getDateTime(ConvertJSONDateToJSDate(json[0].PropertyRedemptionDate)));
        $("#PropertyType").val(json[0].PropertyType);
    }

    // 删除
    $("#Delete").click(function () {
        if ((typeof delectData) === "string") {
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
            var dateS = delectDataobj[1];
            DataOperate.DeleteRedemptionProperty(delectDataobj[0], getDateTime(ConvertJSONDateToJSDate(dateS)), delectDataobj[2], DeleteRedemptionPropertyCB);
        }
        
        }
    });
    function DeleteRedemptionPropertyCB(json) {
        $(".k-state-selected").fadeOut();
        alert("删除成功！")
        console.log(json);
    }
    //编辑
    EditData = {};
    $("#Edit").click(function () {
        if ((typeof data) === "string") {
            $("#DeleteDetailsDiv").fadeIn();
            $("#DeleteDetails").dialog();
            DataOperate.GetRedemptionProperty(data, GetRedemptionPropertyCB);
        } else {
            alert("请选择所要编辑的数据")
        }
    });
    function GetRedemptionPropertyCB(json) {
        console.log(json);
    };
    //交易管理（回收管理）检索查询
    $("#PoolDBNameBtn").click(function () {
        var PoolDBNameDate = $("#PoolDBNameDate1").val();
        var reportingDate2 = $("#PoolDBNameDate2").val();
        var PoolDBNameDate3 = $("#PoolDBNameDate3").val();
        var tabelPoolData = $(".table-PoolDBName");
        console.log(PoolDBNameDate)
        if (!(PoolDBNameDate == "") && !(reportingDate2 == "") && !(PoolDBNameDate3 == "")) {
            DataOperate.ViewRedemptionProperty(PoolDBNameDate, reportingDate2, PoolDBNameDate3, ViewRedemptionPropertyCB);
        } else {
            alert("检索的内容有误");
        }
    })
    function ViewRedemptionPropertyCB(jsondata) {
        console.log(jsondata)
        $("#AddDetailsDiv").fadeIn();
        $("#AddDetails").dialog();
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
                    title: "借据编号",
                    attributes: {
                        "class": "table-PoolDBName",
                        "id": "table-PoolDBName"
                    },
                    width: 80
                },
                {
                    field: "CustomerId",
                    title: "客户编号",
                    attributes: {
                        "class": "table-DevisionName",
                        "id": "table-DevisionName"

                    },
                    width: 80
                },

                {
                    field: "DealSum",
                    title: "理论结算金额",
                    attributes: {
                        "class": "table-DealSum",
                        "id": "table-DealSum"
                    },
                    width: 80
                },
                {
                    field: "DealSum1",
                    title: "实际结算金额",
                    attributes: {
                        "class": "table-DealSum1",
                        "id": "table-DealSum1"
                    },
                    width: 80
                },
                {
                    field: "NetAssetValue",
                    title: "单位竞价",
                    attributes: {
                        "class": "table-NetAssetValue",
                        "id": "table-NetAssetValue"
                    },
                    width: 80
                },
            ]
        });
        //修改竞价
        $("#NetAssetValueBtn").click(function () {
            alert(1);
            var NetAssetValueDate = $("#NetAssetValueDate");
            var deleteDataobj = deleteData.split(",");
            var updatasum = {
                PoolDBName: {
                    updatasumDataTime: deleteDataobj[0],
                    updatasumDataname: deleteDataobj[1],
                    updatasumDevisionName: deleteDataobj[2]
                },
                NetAssetValue: NetAssetValueDate.val(),
            }
            console.log(updatasum);
            //DataOperate.UpdateClearanceBuyBackNetAssetValue( NetAssetValue, UpdateClearanceBuyBackNetAssetValueCB);
        })
        function UpdateClearanceBuyBackNetAssetValueCB(json) {
            alert("修改成功！")
        };
    }

    };








