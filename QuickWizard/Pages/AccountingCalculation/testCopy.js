

function UploadFiles() {
    if ($('#reportingDate').val() === '') {
        alert('请选择导入日期！');
        return false;
    }
    if ($('#file_BasePool').val() === "") {
        alert('上传文件不能为空！');
        return false;
    }
    else {
        var $uploadControl = $('.file');
        var isExcels = true;
        $.each($uploadControl, function (index, obj) {
            if ($(obj).attr('id') !== 'file_TopUpPool') {
                var fileType = $(obj).val().substring($(obj).val().lastIndexOf('.') + 1);
                if (fileType !== 'xlsx' && fileType !== 'xls') {
                    isExcels = false;
                }
            }
            else {
                if ($(obj).val() !== '') {
                    var fileType = $(obj).val().substring($(obj).val().lastIndexOf('.') + 1);
                    if (fileType !== 'xlsx' && fileType !== 'xls') {
                        isExcels = false;
                    }
                }
            }
        });
        if (isExcels === false) {
            alert('文件只能是Excel文件!');
            return false;
        }
    }
    $('#tips').html('正在上传……');

    var TrustId = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);
    //TrustId输出zh-CN
    var ReportingDate = $('#reportingDate').val();
    var fileDatas = [];
    $('.file').each(function (index, obj) {
        var file = {};
        file.name = "transfer.xlsx";
        file.data = $(obj).get(0).files[0];
        file.url = 'trustId=' + TrustId + '&fileFolder=Asset&fileName=' + encodeURIComponent(file.name);
        if (file.name != '') {
            fileDatas.push(file);

        }
    });
    console.log(fileDatas);
    var Uploaded = true;
    $.ajax({
        //上传的位置
        url: GlobalVariable.DataProcessServiceUrl + 'CommonFileUpload' + '?' + fileDatas[0].url,
        type: 'POST',
        data: fileDatas[0].data,
        cache: false,
        dataType: 'json',
        async: false,
        processData: false,
        error: function () {
            Uploaded = true;
        }
    });
    if (Uploaded) {
        $('#tips').html('上传成功！');
        RunTask(TrustId, ReportingDate, fileDatas);
    }
}
function RunTask(TrustId, ReportingDate, files) {
    var tpi = new TaskProcessIndicatorHelper();
    var dir = 'E:/TSSWCFServices/TrustManagementService/TrustFiles/' + TrustId + '/Asset/';
    //上传时间ReportingDate
    console.log(typeof files);
    tpi.AddVariableItem("TrustId", TrustId, 'NVarChar');
    tpi.AddVariableItem("ReportingDate", ReportingDate, "NVarChar");
    tpi.AddVariableItem("SourceFilePath_BasePool", dir + files[0].name, "NVarChar");
    var myselect = document.getElementById("select");
    var index = myselect.selectedIndex;
    var op = myselect.options[index].value;
    console.log(op);
    if (op == 1) {
        var TaskCode = 'certificate';
    } else if (op == 2) {
        var TaskCode = 'account_subject';
    } else if (op == 3) {
        var TaskCode = 'accountDetails';
    } else {
        var TaskCode = 'certificate';
    }
    tpi.ShowIndicator("Task", TaskCode);
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

       
