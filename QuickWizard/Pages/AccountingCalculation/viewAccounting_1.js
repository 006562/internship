$(function(){
$("#tabs").tabs();
//第一次加载
var str = "";
DataOperate.viewSubject(str, viewSubjectCB);
function viewSubjectCB(json) {

    console.log(json);
    $("#grid0").kendoGrid({

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
                field: "SubjectNo",
                title: "科目编号",
                attributes: {
                    "class": "table-SubjectNo",
                    "id": "Tabel-SubjectNo"
                },
                width: 80
            },
            {
                field: "SubjectName",
                title: "科目名称",
                attributes: {
                    "class": "table-SubjectName",
                    "id": "Tabel-SubjectName"
                },
                width: 80
            },
            {
                field: "SubjectType",
                title: "科目类别",
                attributes: {
                    "class": "table-SubjectType",
                    "id": "Tabel-SubjectType"
                },
                width: 80
            },
            {
                field: "BalanceDirection",
                title: "余额方向",
                attributes: {
                    "class": "table-BalanceDirection",
                    "id": "Tabel-BalanceDirection"
                },
                width: 80
            },
            {
                field: "RecAndDisDirection",
                title: "收支方向",
                attributes: {
                    "class": "table-RecAndDisDirection",
                    "id": "Tabel-RecAndDisDirection"
                },
                width: 80
            },

        ]
    });
    var grid0 = $("#grid0").data("kendoGrid");
    var dataRows = grid0.items();
    var data0;
    var data1;
    var data2;
    var AccountNo;
    var deleteData;
    var PoolDBNamegrid;
    for (i = 0; i < dataRows.length; i++) {
        dataRows[i].onclick = function () {
            data0 = $(this).find(".table-SubjectNo")[0].innerHTML;
        }
    }
    //新增
    var Newsave=$("#Newsave");
    $("#ViewDetails").click(function () {
        $("#StandDiv").fadeIn();
        $("#dialogDetails").dialog();
    });
    Newsave.click(function () {
        var SubjectNo = $("#SubjectNoval").val();
        var SubjectName = $("#SubjectNameval").val();
        var SuperiorSubject = $("#SuperiorSubjectVal").val();
        var SubjectType = $("#SubjectTypeval").val();
        var BalanceDirection = $("#BalanceDirectionval").val();
        var RecAndDisDirection = $("#RecAndDisDirectionval").val();
        if (!(SubjectNo == "") && !(SubjectName == "") && !(SuperiorSubject == "") && !(SubjectType == "") && !(BalanceDirection == "") && !(RecAndDisDirection == "")) {
            DataOperate.AddSubject(SubjectNo, SubjectName, SuperiorSubject, SubjectType,BalanceDirection, RecAndDisDirection, AddSubjectCB);
        } else {
            alert("输入有误");
        }
    })
    function AddSubjectCB(json) {
        console.log(json)
    }
    //编辑
    $("#Edit").click(function () {
        if ((typeof data0) == "string") {
            $("#EditDetailsDiv").fadeIn();
            $("#EditDetails").dialog();
            DataOperate.getSubjectByNo(data0, getSubjectByNoCB);
        } else {
            alert("请选择想要编辑的条目");
        };
    });
    function getSubjectByNoCB(json) {
        console.log(json)
        $("#SubjectNoEdit").val(json[0].SubjectNo);
        $("#RecAndDisDirectionEdit").val(json[0].RecAndDisDirection);
        $("#SubjectNameEdit").val(json[0].SubjectName);
        $("#BalanceDirectionEdit").val(json[0].BalanceDirection);
        $("#SubjectTypeEdit").val(json[0].SubjectType);
        $("#SuperiorSubjectEdit").val(json[0].SuperiorSubject);
    }
    //编辑保存
    $("#EditSave").click(function () {
        var EditObj = {
            SubjectNoEdit: $("#SubjectNoEdit").val(),
            RecAndDisDirectionEdit: $("#RecAndDisDirectionEdit").val(),
            SubjectNameEdit: $("#SubjectNameEdit").val(),
            BalanceDirectionEdit: $("#BalanceDirectionEdit").val(),
            SubjectTypeEdit: $("#SubjectTypeEdit").val(),
            SuperiorSubjectEdit: $("#SuperiorSubjectEdit").val(),
        };
        DataOperate.editSubjectByNo(EditObj.SubjectNoEdit, EditObj.SubjectNameEdit, EditObj.SuperiorSubjectEdit, EditObj.SubjectTypeEdit, EditObj.BalanceDirectionEdit,EditObj.RecAndDisDirectionEdit);
    });
    ////检索
    //$("#PoolDBNameBtn").click(function () {
    //    var MaturityDate = $("#PoolDBNameDate").val();
    //    if (!(MaturityDate == "")) {
    //        DataOperate.getSubjectByNo(MaturityDate, getSubjectByNoCB);
    //    } else {
    //        alert("检索的内容有误");
    //    }
    //})
    //删除
    $("#Delete").click(function () {
        if ((typeof data0) === "string") {
            if (confirm("是否确定删除数据！")) {
                DataOperate.deleteSubjectByNo(data0, deleteSubjectByNoCB);
            }
        }
        
    });
    function deleteSubjectByNoCB(json) {
        $(".k-state-selected").fadeOut();
        alert("删除成功！");
    }
    //资产
    $("#subject1").click(function () {
        var str = "资产";
        DataOperate.viewSubject(str, viewSubjectCB);
        function viewSubjectCB(json) {
            console.log(json);
            $("#grid").kendoGrid({
                dataSource: json,
                selectable: "row",
                sortable: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "SubjectNo",
                        title: "科目编号",
                        attributes: {
                            "class": "table-SubjectNo",
                            "id": "Tabel-SubjectNo"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectName",
                        title: "科目名称",
                        attributes: {
                            "class": "table-SubjectName",
                            "id": "Tabel-SubjectName"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectType",
                        title: "科目类别",
                        attributes: {
                            "class": "table-SubjectType",
                            "id": "Tabel-SubjectType"
                        },
                        width: 80
                    },
                    {
                        field: "BalanceDirection",
                        title: "余额方向",
                        attributes: {
                            "class": "table-BalanceDirection",
                            "id": "Tabel-BalanceDirection"
                        },
                        width: 80
                    },
                    {
                        field: "RecAndDisDirection",
                        title: "收支方向",
                        attributes: {
                            "class": "table-RecAndDisDirection",
                            "id": "Tabel-RecAndDisDirection"
                        },
                        width: 80
                    },

                ]
            });
        };
        //变量初始化
        var grid1 = $("#grid1").data("kendoGrid");
        var dataRows = grid1.items();
        var data;
        var delectData;
        var BussinessNoData;
        for (i = 0; i < dataRows.length; i++) {
            dataRows[i].onclick = function () {
                data = $(this).find(".table-BussinessNo")[0].innerHTML;
                delectData = $(this).find(".table-TransferDate")[0].innerHTML + "," + $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-BussinessNo")[0].innerHTML + "," + $(this).find(".table-AccountNo")[0].innerHTML;
            }
        }
        //删除
        //查询



    })
    //成本
    $("#subject2").click(function () {
        var str = "成本";
        DataOperate.viewSubject(str, viewSubjectCB);
        function viewSubjectCB(json) {

            //console.log(json);
            $("#grid1").kendoGrid({
                dataSource: json,
                height: 550,
                selectable: "row",
                sortable: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "SubjectNo",
                        title: "科目编号",
                        attributes: {
                            "class": "table-SubjectNo",
                            "id": "Tabel-SubjectNo"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectName",
                        title: "科目名称",
                        attributes: {
                            "class": "table-SubjectName",
                            "id": "Tabel-SubjectName"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectType",
                        title: "科目类别",
                        attributes: {
                            "class": "table-SubjectType",
                            "id": "Tabel-SubjectType"
                        },
                        width: 80
                    },
                    {
                        field: "BalanceDirection",
                        title: "余额方向",
                        attributes: {
                            "class": "table-BalanceDirection",
                            "id": "Tabel-BalanceDirection"
                        },
                        width: 80
                    },
                    {
                        field: "RecAndDisDirection",
                        title: "收支方向",
                        attributes: {
                            "class": "table-RecAndDisDirection",
                            "id": "Tabel-RecAndDisDirection"
                        },
                        width: 80
                    },

                ]
            });
        };
    })
    //费用
    $("#subject3").click(function () {
        var str = "费用";
        DataOperate.viewSubject(str, viewSubjectCB);
        function viewSubjectCB(json) {
            //console.log(json);
            $("#grid2").kendoGrid({
                dataSource: json,
                height: 550,
                selectable: "row",
                sortable: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "SubjectNo",
                        title: "科目编号",
                        attributes: {
                            "class": "table-SubjectNo",
                            "id": "Tabel-SubjectNo"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectName",
                        title: "科目名称",
                        attributes: {
                            "class": "table-SubjectName",
                            "id": "Tabel-SubjectName"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectType",
                        title: "科目类别",
                        attributes: {
                            "class": "table-SubjectType",
                            "id": "Tabel-SubjectType"
                        },
                        width: 80
                    },
                    {
                        field: "BalanceDirection",
                        title: "余额方向",
                        attributes: {
                            "class": "table-BalanceDirection",
                            "id": "Tabel-BalanceDirection"
                        },
                        width: 80
                    },
                    {
                        field: "RecAndDisDirection",
                        title: "收支方向",
                        attributes: {
                            "class": "table-RecAndDisDirection",
                            "id": "Tabel-RecAndDisDirection"
                        },
                        width: 80
                    },

                ]
            });
        };
    })
    //负债
    $("#subject4").click(function () {
        var str = "负债";
        DataOperate.viewSubject(str, viewSubjectCB);
        function viewSubjectCB(json) {
            //console.log(json);
            $("#grid3").kendoGrid({
                dataSource: json,
                height: 550,
                selectable: "row",
                sortable: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "SubjectNo",
                        title: "科目编号",
                        attributes: {
                            "class": "table-SubjectNo",
                            "id": "Tabel-SubjectNo"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectName",
                        title: "科目名称",
                        attributes: {
                            "class": "table-SubjectName",
                            "id": "Tabel-SubjectName"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectType",
                        title: "科目类别",
                        attributes: {
                            "class": "table-SubjectType",
                            "id": "Tabel-SubjectType"
                        },
                        width: 80
                    },
                    {
                        field: "BalanceDirection",
                        title: "余额方向",
                        attributes: {
                            "class": "table-BalanceDirection",
                            "id": "Tabel-BalanceDirection"
                        },
                        width: 80
                    },
                    {
                        field: "RecAndDisDirection",
                        title: "收支方向",
                        attributes: {
                            "class": "table-RecAndDisDirection",
                            "id": "Tabel-RecAndDisDirection"
                        },
                        width: 80
                    },

                ]
            });
        };
    })
    //权益
    $("#subject5").click(function () {
        var str = "权益";
        DataOperate.viewSubject(str, viewSubjectCB);
        function viewSubjectCB(json) {
            //console.log(json);
            $("#grid4").kendoGrid({
                dataSource: json,
                height: 550,
                selectable: "row",
                sortable: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "SubjectNo",
                        title: "科目编号",
                        attributes: {
                            "class": "table-SubjectNo",
                            "id": "Tabel-SubjectNo"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectName",
                        title: "科目名称",
                        attributes: {
                            "class": "table-SubjectName",
                            "id": "Tabel-SubjectName"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectType",
                        title: "科目类别",
                        attributes: {
                            "class": "table-SubjectType",
                            "id": "Tabel-SubjectType"
                        },
                        width: 80
                    },
                    {
                        field: "BalanceDirection",
                        title: "余额方向",
                        attributes: {
                            "class": "table-BalanceDirection",
                            "id": "Tabel-BalanceDirection"
                        },
                        width: 80
                    },
                    {
                        field: "RecAndDisDirection",
                        title: "收支方向",
                        attributes: {
                            "class": "table-RecAndDisDirection",
                            "id": "Tabel-RecAndDisDirection"
                        },
                        width: 80
                    },

                ]
            });
        };
    })
    //收入
    $("#subject6").click(function () {
        var str = "收入";
        DataOperate.viewSubject(str, viewSubjectCB);
        function viewSubjectCB(json) {
            //console.log(json);
            $("#grid5").kendoGrid({
                dataSource: json,
                height: 550,
                selectable: "row",
                sortable: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "SubjectNo",
                        title: "科目编号",
                        attributes: {
                            "class": "table-SubjectNo",
                            "id": "Tabel-SubjectNo"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectName",
                        title: "科目名称",
                        attributes: {
                            "class": "table-SubjectName",
                            "id": "Tabel-SubjectName"
                        },
                        width: 80
                    },
                    {
                        field: "SubjectType",
                        title: "科目类别",
                        attributes: {
                            "class": "table-SubjectType",
                            "id": "Tabel-SubjectType"
                        },
                        width: 80
                    },
                    {
                        field: "BalanceDirection",
                        title: "余额方向",
                        attributes: {
                            "class": "table-BalanceDirection",
                            "id": "Tabel-BalanceDirection"
                        },
                        width: 80
                    },
                    {
                        field: "RecAndDisDirection",
                        title: "收支方向",
                        attributes: {
                            "class": "table-RecAndDisDirection",
                            "id": "Tabel-RecAndDisDirection"
                        },
                        width: 80
                    },
                ]
            });
        };
    })

};
})