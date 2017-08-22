$(document).ready(function () {
    DataOperate.viewCertificationDetails("",viewCertificationDetailsCB);
    function viewCertificationDetailsCB(json) {
        for (i = 0; i < json.length; i++) {
            //时间转换
            var date = new Date(parseInt(json[i].AccountDate.slice(6)));
            var Month = date.getMonth();
            var D = date.getDate();

            if (parseInt(Month) + 1 < 10)
                Month = "0" + String(parseInt(Month) + 1);
            else
                Month = String(parseInt(Month) + 1);
            if (parseInt(D) < 10)
                D = "0" + D;
            json[i].AccountDate = date.getFullYear() + '-' + Month + '-' + D;
        }
        console.log(json);
        $("#grid").kendoGrid({

            dataSource: {
                data: json,
                pageSize: 10
            },
            height: 550,
            sortable: true,
            selectable: "row",
            reorderable: true,
            resizable: true,
            pageable: true,
            columns: [
                {
                    field: "SerialNo",
                    title: "记账流水号",
                    attributes: {
                        "class": "table-SerialNo",
                        "id": "Tabel-SerialNo"
                    },
                    width: 80
                },
                {
                    field: "AccountDate",
                    title: "记账日期",
                    attributes: {
                        "class": "table-AccountDate",
                        "id": "Tabel-AccountDate"
                    },
                    width: 80
                },
                {
                    field: "TradeType",
                    title: "交易品种",
                    attributes: {
                        "class": "table-TradeType",
                        "id": "Tabel-TradeType"
                    },
                    width: 80
                },
                {
                    field: "TradeNo",
                    title: "交易编号",
                    attributes: {
                        "class": "table-TradeNo",
                        "id": "Tabel-TradeNo"
                    },
                    width: 80
                },
                {
                    field: "Agent",
                    title: "经办人",
                    attributes: {
                        "class": "table-Agent",
                        "id": "Tabel-Agent"
                    },
                    width: 80
                },
                 {
                     field: "AbatementMark",
                     title: "冲销标志",
                     attributes: {
                         "class": "table-AbatementMark",
                         "id": "Tabel-AbatementMark"
                     },
                     width: 80
                 },
                {
                    field: "Reviewer",
                    title: "复核人",
                    attributes: {
                        "class": "table-Reviewer",
                        "id": "Tabel-Reviewer"
                    },
                    width: 80
                }

            ]
        });
        var grid0 = $("#grid").data("kendoGrid");
        var dataRows = grid0.items();
        var data0;
        var data1;
        var data2;
        var AccountNo;
        var deleteData;
        var PoolDBNamegrid;
        for (i = 0; i < dataRows.length; i++) {
            dataRows[i].onclick = function () {
                data0 = $(this).find(".table-SerialNo")[0].innerHTML;
                console.log(data0);
            }
        }
        $("#ViewDetails").click(function () {
            if ((typeof data0) == "string") {
                $("#lookDetails").dialog();
                $("#lookDetailscontent").fadeIn();
                DataOperate.getSceneByCode(data0, getSceneByCodeCB);
            } else {
                alert("请选择想要查看的条目");
            };
        });
        function getSceneByCodeCB(jsondata) {
            console.logjsondata
            for (i = 0; i < jsondata.length; i++) {
                //时间转换
                var date = new Date(parseInt(jsondata[i].AccountDate.slice(6)));
                var Month = date.getMonth();
                var D = date.getDate();

                if (parseInt(Month) + 1 < 10)
                    Month = "0" + String(parseInt(Month) + 1);
                else
                    Month = String(parseInt(Month) + 1);
                if (parseInt(D) < 10)
                    D = "0" + D;
                jsondata[i].AccountDate = date.getFullYear() + '-' + Month + '-' + D;
            }
            $("#detailsSerialNo").val(jsondata[0].SerialNo);
            $("#detailAccountDate").val(jsondata[0].AccountDate);
            $("#detailAbatementMark").val(jsondata[0].AbatementMark);
            $("#detailCurrency").val(jsondata[0].currency);
            $("#detailsgrid").kendoGrid({
                dataSource: {
                    data: jsondata,
                    pageSize: 10
                },
                height: 550,
                sortable: true,
                selectable: "row",
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "Abstract",
                        title: "摘要",
                        attributes: {
                            "class": "table-Abstract",
                            "id": "Tabel-Abstract"
                        },
                        width: 80
                    },
                    {
                        field: "Subject",
                        title: "会计科目",
                        attributes: {
                            "class": "table-Subject",
                            "id": "Tabel-Subject"
                        },
                        width: 80
                    },
                    {
                        field: "Debeit",
                        title: "借",
                        attributes: {
                            "class": "table-Debeit",
                            "id": "Tabel-Debeit"
                        },
                        width: 80
                    },
                    {
                        field: "Credit",
                        title: "贷",
                        attributes: {
                            "class": "table-Credit",
                            "id": "Tabel-Credit"
                        },
                        width: 80
                    }
                ]
            });
        }


    };
    
});