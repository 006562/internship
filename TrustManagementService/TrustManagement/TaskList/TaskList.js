/// <reference path="../Common/Scripts/jquery-1.7.2.min.js" />
/// <reference path="../Common/Scripts/common.js" />

var TaskListManagementModule = function (request) {
    var wProxy = null;
    var CashFlowStudioServiceBase = GlobalVariable.CashFlowStudioServiceUrl;
    var gridRowTemplate = "<tr><td class='center'>{0}</td><td class='center'>{1}</td><td><div class='taskdesc'>{2}</div></td><td class='center'>{3}</td><td class='center'>{4}</td><td class='center'>{5}</td><td class='center'>{6}</td></tr>";
    var gridRowFileUpLoadTemplate = "<tr class='hiddenTR'><td colspan='100' class='right'>{0}</td></tr>";
    var sessionVariableTemplate = "<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>0</IsConstant><IsKey>{3}</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";

    var mainTaskActions = [];
    var mainSessionID = null;
    var actionTaskVariables = [];
    var mainTaskSessionContext = [];
    var dateLinkUrlTemplate = 'https://poolcutsp/_layouts/15/goldenstand.calendar/trustcalendar.aspx?trustId={0}&defaultDate={1}';

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var getSessionProcessStatusList = function (appDomain, sessionId) {
        var serviceUrl = CashFlowStudioServiceBase + "GetSessionProcessStatusList/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                mainTaskActions = response;
                renderTaskTitleAndDescription();
                renderSessionProcessStatusList();
                renderTrustAssociatedDates();
                $('.taskdesc').click(function () {
                    $(this).parent('td').parent('tr').find('.taskdesc').toggleClass('autoHeight');
                });
            },
            error: function (response) { alert("load Session Process Status error."); }
        });
    }
    var renderTaskTitleAndDescription = function () {
        if (mainTaskActions.length < 1) { return; }

        var firstActionXML = mainTaskActions[0].XMLProcessAction;
        var $action = $('<xml>' + firstActionXML + '</xml>');
        var mainTaskTitle = $action.find('Parameter[Name="TaskListTitle"]').attr('value');

        $('#taskTitle').html(mainTaskTitle);
    };
    var renderSessionProcessStatusList = function () {
        var content = "";
        $.each(mainTaskActions, function (i, v) {
            var endTime = (v.EndTime) ? getStringDate(v.EndTime).dateFormat('yyyy-MM-dd hh:mm:ss') : '&nbsp;&nbsp;';
            var $action = $('<xml>' + v.XMLProcessAction + '</xml>');
            content += buildSessionStatusListItem(i, v.ActionDisplayName, v.ActionStatus, endTime, $action);
        });

        if (content.length > 0) {
            $("#divProcessStatusList").empty().append(content);
            $('#divProcessStatusList button.btn-execute').click(function () {
                taskListUIButtonClick($(this));
            });
        }        
        $("#divLoading").fadeOut();
    }
    var buildSessionStatusListItem = function (i, name, status, endtime, $action) {
        var rtn = '';

        var taskStatus = getTaskStatusName(status);
        var taskDesc = $action.find('Parameter[Name="TaskDescription"]').attr('Value');
        var exeDateCode = $action.find('Parameter[Name="ExecutionDate"]').attr('Value');

        var oprtationHtml = '';
        //if (status.toLowerCase() === 'pending') {
            oprtationHtml += '<button class="btn btn-primary btn-execute" action-index="' + i + '" type="button">执行</button>';
        //} else {
        //    oprtationHtml += '<button class="btn btn-primary" disabled="disabled" action-index="' + i + '" type="button">执行</button>';
        //}

        var exeDateSpan = '<div data-datecode="{0}" class="spanExeDate taskdesc"></div>'.format(exeDateCode);
        rtn += gridRowTemplate.format(i + 1, name, taskDesc, exeDateSpan, taskStatus, endtime, oprtationHtml);

        var uiType = $action.find('Parameter[Name="UI"]').attr('value');
        var uiHtml = '';
        switch (uiType) {
            case 'fileUpload':
                uiHtml += '<span id="warnMsg_' + i + '">请上传文件</span>&nbsp;&nbsp;&nbsp;&nbsp;';
                uiHtml += '<input type="file" id="file_' + i + '" class="file" />';
                uiHtml += '<button class="btn btn-primary" type="button" id="btnFileUpload_' + i + '">上传</button>';
                uiHtml += '&nbsp;&nbsp;';
                uiHtml += '<button class="btn btn-default" type="button" id="btnCancelFileUpload_' + i + '">取消</button>';
                uiHtml += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                rtn += gridRowFileUpLoadTemplate.format(uiHtml);
                break;
            default:
                break;
        }

        return rtn;
    };
    var getTaskStatusName = function (status) {
        var rtn = '';
        switch (status) {
            case 'Success':
                rtn = '<span class="successStatus">已完成</span>';
                break;
            case 'Pending':
                rtn = '待执行';
                break;
            default:
                rtn = status;
                break;
        }
        return rtn;
    };

    var renderTrustAssociatedDates = function () {
        var svcUrl = GlobalVariable.DataProcessServiceUrl+'CommonGetExecute?';
        var objArgs = {
            SPName: 'usp_GetSessionContext',
            SQLParams: [{ Name: 'SessionId', Value: mainSessionID, DBType: 'string' }]
        };
        var executeParams = encodeURIComponent(JSON.stringify(objArgs));
        $.ajax({
            cache: false,
            type: "GET",
            url: svcUrl + 'connConfig=TaskProcess&appDomain=Task&executeParams=' + executeParams + '&resultType=Common',
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: {},
            success: function (response) {
                if (typeof response === 'string') { mainTaskSessionContext = JSON.parse(response); }
                else { mainTaskSessionContext = response; }
                bindingSessionStatusExecutionDate();
            },
            error: function (response) { alert('Error occursed when fetch the execution data!'); }
        });
    }
    var bindingSessionStatusExecutionDate = function () {
        var variableListTemplate = '<tr><td class="center">{0}</td><td class="center">{1}</td><td>{2}</td></tr>';
        var variableListContent = '';
        $.each(mainTaskSessionContext, function (i, v) {
            var vName = v.VariableName;
            var vValue = v.VariableValue;
            variableListContent += variableListTemplate.format(i + 1, vName, vValue);

            var trustId = request.TrustId || 0;
            trustId = trustId.split(';')[0];
            var selector = '.spanExeDate[data-datecode="' + vName + '"]';
            var $span = $(selector);
            if ($span && $span.length > 0) {
                var linkUrl = dateLinkUrlTemplate.format(trustId, vValue);
                var display = vValue + '<br/>';
                display += '<a href="{0}" target="_blank">{1}</a>'.format(linkUrl, vName);
                $span.html(display);
            }
        });
        if (variableListContent.length > 0) {
            $('#tbodyVariablesList').empty().html(variableListContent);
        }
    };

    var taskListUIButtonClick = function (obj) {
        var $obj = $(obj);
        var i = $obj.attr('action-index');
        actionTaskVariables = [];

        var $actionXML = $('<xml>' + mainTaskActions[i].XMLProcessAction + '</xml>');
        var uiType = $actionXML.find('Parameter[Name="UI"]').attr('Value');
        switch (uiType) {
            case 'fileUpload':
                $obj.parent('td').parent('tr').next('tr').removeClass('hiddenTR');
                $('#btnFileUpload_' + i).click(function () {
                    var $file = $('#file_' + i);
                    var $msg = $('#warnMsg_' + i);

                    var filePath = $file.val();
                    if (!filePath) {
                        $msg.addClass('redfont');
                        return;
                    }

                    var fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
                    var args = 'trustId=' + mainSessionID + '&fileFolder=&fileName=' + encodeURIComponent(fileName);

                    $("#divLoading").show();
                    $msg.html('正在上传...').removeClass('redfont');
                    uploadSourceFile($file, args, $msg, function (filePath) {
                        var sourceFilePath = filePath.substring(0, filePath.lastIndexOf('\\') + 1);
                        var sourceFileName = filePath.substring(filePath.lastIndexOf('\\') + 1);

                        actionTaskVariables.push({ VariableName: 'SourceFilePath', VariableValue: sourceFilePath });
                        actionTaskVariables.push({ VariableName: 'SourceFileName', VariableValue: sourceFileName });
                        startInvokeActionTask($actionXML);
                    });
                });
                $('#btnCancelFileUpload_' + i).click(function () {
                    $(this).parent('td').parent('tr').addClass('hiddenTR');
                });
                break;
            default:
                startInvokeActionTask($actionXML);
                break;
        }
    };
    var uploadSourceFile = function ($file, args, $msg, fnCallback) {
        var fileData = $file.get(0).files[0];
        $.ajax({
            url: GlobalVariable.DataProcessServiceUrl+'CommonFileUpload' + '?' + args,
            type: 'POST',
            data: fileData,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            //contentType: "application/octet-stream", // Set content type to false as jQuery will tell the server its a query string request
            success: function (data) {
                $msg.html('文件上传成功。');
                fnCallback(data.CommonTrustFileUploadResult);
            },
            error: function (data) {
                $msg.html('文件上传出现错误。');
                $("#divLoading").fadeOut();
            }
        });
    };
    var startInvokeActionTask = function ($actionXML) {
        var targetTaskCode = $actionXML.find('Parameter[Name="TaskCode"]').attr('Value');
        var sContext = {
            appDomain: 'Task',
            sessionVariables: buildActionTaskSessionVariables($actionXML),
            taskCode: targetTaskCode
        };

        wProxy.createSessionByTaskCode(sContext, function (actionTaskSessionID) {
            isSessionCreated = true;
            sessionID = actionTaskSessionID;
            taskCode = targetTaskCode;
            IndicatorAppDomain = request.appDomain;
            popupTaskProcessIndicator(function () {
                window.location.reload();
            });
        });
    };
    var buildActionTaskSessionVariables = function ($actionXML) {
        var variables = '';
        //$actionXML.find('Parameter[Usage="TargetTask"]').each(function (key, value) {
        //    var $this = $(this);
        //    var name = $this.attr('Name');
        //    var value = $this.attr('Value');
        //    var dataType = $this.attr('DataType');
        //    var isKey = 0;

        //    variables += sessionVariableTemplate.format(name, value, dataType, isKey);
        //});
        var actionSequenceNo = $actionXML.find('Action').attr('SequenceNo');
        variables += sessionVariableTemplate.format('FromSessionID', mainSessionID, 'String', 0, 0, 0);
        variables += sessionVariableTemplate.format('ActionSequenceNo', actionSequenceNo, 'String', 0, 0, 0);
        $.each(actionTaskVariables, function (i, v) {
            variables += sessionVariableTemplate.format(v.VariableName, v.VariableValue, 'String', 0, 0, 0);
        });
        return "<SessionVariables>{0}</SessionVariables>".format(variables);
    }

    ///////// Public Methods
    this.CreateSession = function () {
        var strRequestVars = '';
        for (var key in request) {
            if (key !== 'appDomain') {
                var value = request[key];
                var isKey = 0;
                if (value && value.indexOf(';') > 0) {
                    var argValueSplit = value.split(';');
                    value = argValueSplit[0];
                    isKey = argValueSplit[1];
                }

                strRequestVars += sessionVariableTemplate.format(key, value, 'String', isKey);
            }
        }
        var requestVars = '<SessionVariables>{0}</SessionVariables>'.format(strRequestVars);
        var taskCode = request.TaskCode.split(';')[0];
        wProxy = new webProxy();
        var sContext = { appDomain: request.appDomain, sessionVariables: requestVars, taskCode: taskCode };
        wProxy.createSessionByTaskCode(sContext, function (response) {
            mainSessionID = response;
            getSessionProcessStatusList(request.appDomain, response);
        });
    }
};

$(function () {
    var request = getRequest();
    if (!request.appDomain || !request.TaskCode) {
        $("#divLoading").fadeOut();
        return;
    }

    var tListModel = new TaskListManagementModule(request);
    tListModel.CreateSession();

    $('#btnViewVariables').anyDialog({
        width:450,	
        height:500,
        title: '任务变量列表',
        html: $('#divVariablesList'),	// 弹出框内容 支持HTML或对象 $(dom)
        status:null
    });
});

////////////////////////////Global Variables and Functions for Silverlight
var sessionID, taskCode;
var clientName = 'TaskProcess';
var IndicatorAppDomain;
var IsSilverlightInitialized = false;
function InitParams() {
    if (!IsSilverlightInitialized) {
        IsSilverlightInitialized = true;
    }
    document.getElementById("TaskProcessCtl").Content.SL_Agent.InitParams(sessionID, IndicatorAppDomain, taskCode, clientName);
}
function popupTaskProcessIndicator(fnCallBack) {
    $("#taskIndicatorArea").dialog({
        modal: true,
        dialogClass: "TaskProcessDialogClass",
        closeText: "",
        //closeOnEscape:false,
        height: 485,
        width: 470,
        close: function (event, ui) {
            if (typeof fnCallBack === 'function') { fnCallBack(); }
        },
        title: "任务处理"
    });
};