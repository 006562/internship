//资产转让：39 资产赎回：44   清仓回购：40 回购上划42：   信托对价：43   回收上划：41
//EC方法
function RunTask(SceneCodeval, SceneNameval, SceneTypeCodeval, TradeTypeval) {
    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem("SceneCode", SceneCodeval, 'NVarChar');
    tpi.AddVariableItem("SceneName", SceneNameval, 'NVarChar');
    tpi.AddVariableItem("SceneTypeCode", SceneTypeCodeval, 'NVarChar');
    tpi.AddVariableItem("TradeType", TradeTypeval, 'NVarChar');
    tpi.ShowIndicator("Task", 'Exe_EC');
}
//重载PopupTaskProcessIndicator函数，调用父窗口的div
function PopupTaskProcessIndicator(fnCallBack) {
    $("#taskIndicatorArea").dialog({
        modal: true,
        dialogClass: "TaskProcessDialogClass",
        closeText: "",
        //closeOnEscape:false,
        height: 550,
        width: 450,
        close: function (event, ui) {
            if (typeof fnCallBack === 'function') { fnCallBack(1); }
            else { parent.window.location.reload(); }
            close();
            //$mask.trigger('click');
            //self.onClose();
        }, // refresh report repository while close the task process screen.
        //open: function (event, ui) { $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide(); },
        title: "任务处理"
    });
}
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
};
var TaskProcessIndicatorHelper = function () {
    this.Variables = [];
    this.VariableTemp = '<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>{3}</IsConstant><IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>';

    this.AddVariableItem = function (name, value, dtatType, isConstant, isKey, keyIndex) {
        this.Variables.push({ Name: name, Value: value, DataType: dtatType, IsConstant: isConstant || 0, IsKey: isKey || 0, KeyIndex: keyIndex || 0 });
    };

    this.BuildVariables = function () {
        var pObj = this;

        var vars = '';
        $.each(this.Variables, function (i, item) {
            vars += pObj.VariableTemp.format(item.Name, item.Value, item.DataType, item.IsConstant, item.IsKey, item.KeyIndex);
        });

        var strReturn = "<SessionVariables>{0}</SessionVariables>".format(vars);
        return strReturn;
    };

    this.ShowIndicator = function (app, code, fnCallBack) {
        sContext = {
            appDomain: app,
            sessionVariables: this.BuildVariables(),
            taskCode: code,
        };

        this.CreateSessionByTaskCode(sContext, function (response) {
            sessionID = response;
            taskCode = code;
            IndicatorAppDomain = app;
            if (IsSilverlightInitialized) {
                PopupTaskProcessIndicator(fnCallBack);
                InitParams();
            } else {
                PopupTaskProcessIndicator(fnCallBack);
            }
        });
    };


    this.CreateSessionByTaskCode = function (sContext, callback) {
        var sessionVariables_p = encodeURIComponent(sContext.sessionVariables);
        var uriHostInfo = location.protocol + "//" + location.host;
        var TaskProcessEngineServiceURL = uriHostInfo + '/TaskProcessEngine/SessionManagementService.svc/jsAccessEP/';
        var serviceUrl = TaskProcessEngineServiceURL + "CreateSessionByTaskCode?applicationDomain=" + sContext.appDomain + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + sContext.taskCode;
        //var serviceUrl = TaskProcessEngineServiceURL + "CreateSessionPostByTaskCode";
        var obj = {};
        obj.appDomain = sContext.appDomain;
        obj.sessionVariables = sContext.sessionVariables;
        obj.taskCode = sContext.taskCode;
        $.ajax({
            type: "GET",                    //modify to POST method
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (sessionId) {
                callback(sessionId);
            },
            error: function (response) { alert(response); }
        });
    };
};

var sessionID, taskCode, IndicatorAppDomain;
var clientName = 'TaskProcess';

var IsSilverlightInitialized = false;
function InitParams() {
    if (!IsSilverlightInitialized) {
        IsSilverlightInitialized = true;
    }
    $(document.getElementById("TaskProcessCtl").Content.SL_Agent.InitParams(sessionID, IndicatorAppDomain, taskCode, clientName))

}
//调用Runtask

//资产转让：33 资产赎回：38   清仓回购：34 回购上划36：   信托对价：37   回收上划：35
function saveItem(){
    if(document.getElementById("check1").checked)
        DataOperate.UpdateEC(33, 1);
    else
        DataOperate.UpdateEC(33, 0);
    if (document.getElementById("check2").checked)
        DataOperate.UpdateEC(38, 1);
    else
        DataOperate.UpdateEC(38, 0);
    if (document.getElementById("check3").checked)
        DataOperate.UpdateEC(34,1);
    else
        DataOperate.UpdateEC(34, 0);
    if (document.getElementById("check4").checked)
        DataOperate.UpdateEC(36, 1);
    else
        DataOperate.UpdateEC(36, 0);
    if (document.getElementById("check5").checked)
        DataOperate.UpdateEC(37, 1);
    else
        DataOperate.UpdateEC(37, 0);
    if (document.getElementById("check6").checked)
        DataOperate.UpdateEC(35, 1);
    else
        DataOperate.UpdateEC(35, 0);
    var SceneCodeval = $("#addSceneCode").val();
    var SceneNameval = $("#addSceneName").val();
    var SceneTypeCodeval = $("#addSceneTypeCode").val();
    var TradeTypeval = $("#addTradeType").val();
    RunTask(SceneCodeval, SceneNameval, SceneTypeCodeval,TradeTypeval);
    
}
    DataOperate.viewScene(viewSceneCB);
    function viewSceneCB(json) {
        console.log(json);
        $("#grid").kendoGrid({
            dataSource: {
                data: json,
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
            },
            selectable: "row",
            height: 550,
            sortable: true,
            reorderable: true,
            resizable: true,
            pageable: true,
            columns: [
                {
                    field: "SceneCode",
                    title: "场景代码",
                    attributes: {
                        "class": "table-SceneCode",
                        "id": "Tabel-SceneCode"
                    },
                    width: 80
                },
                {
                    field: "SceneName",
                    title: "场景名称",
                    attributes: {
                        "class": "table-SceneName",
                        "id": "Tabel-SceneName"
                    },
                    width: 80
                },
                {
                    field: "SceneTypeCode",
                    title: "场景类型代码",
                    attributes: {
                        "class": "table-SceneTypeCode",
                        "id": "Tabel-SceneTypeCode"
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

            ]
        });
        $("#moreData").click(function () {
            DataOperate.getSceneAccountMSG(getSceneAccountMSGCB);
        });
        function getSceneAccountMSGCB(jsondata) {
            console.log(jsondata);
            for (i = 0; i < jsondata.length; i++) {
                //时间转换
                var date = new Date(parseInt(jsondata[i].PropertyRedemptionDate.slice(6)));
                var Month = date.getMonth();
                var D = date.getDate();

                if (parseInt(Month) + 1 < 10)
                    Month = "0" + String(parseInt(Month) + 1);
                else
                    Month = String(parseInt(Month) + 1);
                if (parseInt(D) < 10)
                    D = "0" + D;
                jsondata[i].PropertyRedemptionDate = date.getFullYear() + '-' + Month + '-' + D;
            }
            $("#gridjson").kendoGrid({
                dataSource: {
                    data: jsondata,
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: true,
                },
                selectable: "row",
                height: 550,
                sortable: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                columns: [
                    {
                        field: "AccountNo",
                        title: "资产编号",
                        attributes: {
                            "class": "table-SceneCode",
                            "id": "Tabel-SceneCode"
                        },
                        width: 80
                    },
                    {
                        field: "CustomerId",
                        title: "场景名称",
                        attributes: {
                            "class": "table-CustomerId",
                            "id": "Tabel-CustomerId"
                        },
                        width: 80
                    },
                    {
                        field: "DealSum",
                        title: "实际结算金额",
                        attributes: {
                            "class": "table-DealSum",
                            "id": "Tabel-DealSum"
                        },
                        width: 80
                    },
                    {
                        field: "DevisionName",
                        title: "交易主体",
                        attributes: {
                            "class": "table-TradeType",
                            "id": "Tabel-TradeType"
                        },
                        width: 80
                    },
                     {
                         field: "PoolDBName",
                         title: "资产池",
                         width: 80
                     },
                    {
                        field: "PropertyRedemptionDate",
                        title: "赎回日",
                        attributes: {
                            "class": "table-PropertyRedemptionDate",
                            "id": "Tabel-PropertyRedemptionDate"
                        },
                        width: 80
                    },
                    {
                        field: "TrustCode",
                        title: "专项计划标识",
                        attributes: {
                            "class": "table-TrustCode",
                            "id": "Tabel-TrustCode"
                        },
                        width: 80
                    },

                ]
            });
        };

        //查看数据
        var grid = $("#grid").data("kendoGrid");
        var dataRows = grid.items();
        var data;
        var delectData;
        var BussinessNoData;
        for (i = 0; i < dataRows.length; i++) {
            dataRows[i].onclick = function () {
                data = $(this).find(".table-SceneCode")[0].innerHTML;
                //delectData = $(this).find(".table-TransferDate")[0].innerHTML + "," + $(this).find(".table-PoolDBName")[0].innerHTML + "," + $(this).find(".table-BussinessNo")[0].innerHTML + "," + $(this).find(".table-AccountNo")[0].innerHTML;
            }
        }
        $("#abc").click(function () {
            if ((typeof data) == "string") {
                $("#dialogDetails").dialog();
                $("#StandDiv").fadeIn();
                DataOperate.ViewgetSceneByCode(data, ViewgetSceneByCodeCB);
            } else {
                alert("请选择想要查看的条目");
            };
        });
        function ViewgetSceneByCodeCB(json) {
            console.log(json);
            $("#detailSceneCode").val(json[0].SceneCode);
            $("#detailSceneName").val(json[0].SceneName);
            $("#detailSceneTypeCode").val(json[0].SceneTypeCode);
            $("#detailTradeType").val(json[0].TradeType);
            //for (i = 0; i < json.length; i++) {
            //    //时间转换
            //    var date = new Date(parseInt(json[i].TransferDate.slice(6)));
            //    var Month = date.getMonth();
            //    var D = date.getDate();

            //    if (parseInt(Month) + 1 < 10)
            //        Month = "0" + String(parseInt(Month) + 1);
            //    else
            //        Month = String(parseInt(Month) + 1);
            //    if (parseInt(D) < 10)
            //        D = "0" + D;
            //    json[i].TransferDate = date.getFullYear() + '-' + Month + '-' + D;
            //}
            //$("#TransferDate").val(json[0].TransferDate);
            //vm.viewtransationManagerDataCB = json;
        }
        //删除
        //删除数据
        $("#Delete").click(function () {
            if ((typeof data) === "string") {
                if (confirm("是否确定删除数据！")) {
                    DataOperate.deleteSceneByCode(data, deleteSceneByCodeCB);
                }
            }

        });
        function deleteSceneByCodeCB(json) {
            $(".k-state-selected").fadeOut();
        }

        
    };
