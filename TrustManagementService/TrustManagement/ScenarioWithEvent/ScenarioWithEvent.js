﻿var viewModel;
//var trustId = '1';
var currentScenarioId
var allItems = [];
var currentScenarioName = "";
var scenarioNames = [];
var myModel = {
    ScenarioList: [],
    EventListInTrust: [],
    EventListInScenario: []
}
$(function () {
    trustId = getQueryString("tid");
    if (trustId == null) {
        trustId = 0;
    }
    var winHeight = $(window.parent.document).height();
    var winWidth = $(window.parent.document).width();
    getScenarioListByTrustId(trustId);
    getEventlistInTrust(trustId);
    var itemsDropdownDiv = document.getElementById("ItemsDropdownDiv");
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel, itemsDropdownDiv);
    
    regiserEvent();
});
function regiserEvent() {
    
    $(".dropdown-btn").click(function () {
        $(".flow-list").toggle();
    })
    
    $(".role-item").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    })
    $(".search-btn").click(function () {
        $(".role-item").removeClass("active");
        viewModel.PermissionsInRole.removeAll();
        $(".role-item").each(function () {
            if ($(this).text().trim().indexOf($("#dropDownItemName").val().trim()) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        })
    })
    $("#dropDownItemName").keyup(function (event) {
        if (event.keyCode == 13) {
            $(".search-btn").click();
        };
        if (!$(this).val().trim()) {
            $(".role-item").show();
        }
    })
    $(".dropdown").click(function (event) {
        event.stopPropagation();
    })
    $(document).click(function () {
        $(".flow-list").hide();
    })
        //初始化
    $(".role-item").eq(0).click();

    $("#AddNewScenario").click(function () {
        var newScenario = '<li class="role-item" id="newScenario">' +
                        '<span"><input id="toSelect" style="width:90px;margin-top:4px;"></input></span>' +
                        '<i class="icon-right-open-1 pull-right"></i>' +
                        '</li>'
        $(".role-list").append(newScenario);
        $("#toSelect").change(function () {
            
            var itemText = $(this).val();
            currentScenarioName = itemText;
            if (itemText != "") {
                if ($.inArray(itemText, scenarioNames) > -1) {
                    alertMsg("该偿付情景已经存在！");
                    $("#toSelect").val("");
                    return;
                }
                $("#newScenario").remove();
                saveScenarioSequence();
            }
        });
    });
}

function selectScenario(indexF, data, event) {
    currentScenarioId = data.ScenarioId();
    viewModel.EventListInScenario.removeAll();
    getEventsByScenarioId("1", currentScenarioId, function (data) {
        $.each(data, function (i, d) {
            var event = { "CategoryId": d.CategoryId, "EventCode": d.EventCode, "EventId": d.EventId, "EventName": d.EventName, "ScenarioId": currentScenarioId }
            viewModel.EventListInScenario.push(event);
        })
    })
}

function addEvent(data) {
    var isExited = false;
    var events = viewModel.EventListInScenario();
    $.each(events, function (i, v) {
        if (v.EventCode.trim() == data.EventCode()) {
            isExited = true;
            alertMsg(data.EventName() + "已经存在", 0);
            return false;
        }
    });
    
    if (!isExited) {
        var event = { "CategoryId": data.CategoryId(), "EventCode": data.EventCode(), "EventId": data.EventId(), "EventName": data.EventName(), "ScenarioId": currentScenarioId }
        //var permission = { "StateCode": data.StateCode(), "StateName": data.StateName() };
        viewModel.EventListInScenario.push(event);
        var eventlist = [];
        var strEventList = '';
        $.each(viewModel.EventListInScenario(), function (i, v) {
            eventlist.push(v.EventCode);
        });
        strEventList = eventlist.join(",");
        saveEventToPaymentSequence(trustId, currentScenarioId, strEventList, function (result) {
            if (result && result.length > 0) {
                alertMsg("添加事件成功！", 1);
            }
        });
    }
}

function deleteEventInScenario(data) {
    $.anyDialog({
        width: 200,
        height: 70,
        title: '提示',
        html: '<div style="line-height:70px;text-align:center;font-size:14px;">确定要删除吗？</div>',
        status: 'confirm',
        onSuccess: function () {
            viewModel.EventListInScenario.remove(data);
            var eventlist = [];
            var strEventList = '';
            $.each(viewModel.EventListInScenario(), function (i, v) {
                eventlist.push(v.EventCode);
            });
            strEventList = eventlist.join(",");
            deleteEventFromPaymentSequence(trustId, currentScenarioId, strEventList, function (result) {
                if (result && result.length > 0) {
                    alertMsg("删除成功！", 1);
                }

            });
        }
    });
}

function deleteEventFromPaymentSequence(trustId, scenarioId, eventList, callback) {
    var executeParam = {
        'SPName': "usp_SaveEventsToPaymentSequence", 'SQLParams': [
            { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' },
            { 'Name': 'ScenarioId', 'Value': scenarioId, 'DBType': 'int' },
            { 'Name': 'EventList', 'Value': eventList, 'DBType': 'string' }
        ]
    };
    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, callback);
}
function getScenarioListByTrustId(trustId) {
    var executeParam = {
        'SPName': "usp_GetTrustPaymentSequence", 'SQLParams': [
            { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' }
        ]
    };
    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, function (data) {
        myModel.ScenarioList = data;
    });
    $.each(myModel.ScenarioList, function (i, v) {
        scenarioNames.push(v.ScenarioName);
    });
}

function getEventsByScenarioId(trustId,scenarioId,callbak) {
    var executeParam = {
        'SPName': "usp_GetEventsByScenarioId", 'SQLParams': [
            { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' },
            { 'Name': 'ScenarioId', 'Value': scenarioId, 'DBType': 'int' }
        ]
    };
    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, callbak);
}

function getEventsByTrustId(trustId) {
    var executeParam = {
        'SPName': "usp_GetEventsByScenarioId", 'SQLParams': [
            { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' }
        ]
    };
    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, function (data) {
        viewModel.EventList = data;

        //alert("支付顺序保存成功！");
    });
}

function getEventlistInTrust (trustId/*,callBack*/) {
    $.ajax({
        type: "GET",
        url: GlobalVariable.DataProcessServiceUrl + 'GetTrustEvents/TrustManagement/' + trustId,
        dataType: "json",
        contentType: "application/xml;charset=utf-8",
        cache: false,
        async: false,
        data: {},
        success: function (response) {
            if (response) {
                setDataModel(eval(response));
            }
        },
        error: function (response) { alert(defMsg.loadingError); }
    });
};
function setDataModel(sourceData) {
    $.each(sourceData, function (i, data) {
        var eventType = data.EventType;
        if (eventType === 'SpecificPlan') {
            var eventListInTrust = {"CategoryId": 9, "EventCode": data.ItemCode, "EventName": data.EventDescription, "EventId": data.ItemId,"ScenarioId": currentScenarioId}
            myModel.EventListInTrust.push(eventListInTrust);

        } 
    });
    //myModel.EventListInTrust = temp;
    console.log(myModel.EventListInTrust);
}

function saveEventToPaymentSequence(trustId, scenarioId, eventList, callback) {
    var executeParam = {
        'SPName': "usp_SaveEventsToPaymentSequence", 'SQLParams': [
            { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' },
            { 'Name': 'ScenarioId', 'Value': scenarioId, 'DBType': 'int' },
            { 'Name': 'EventList', 'Value': eventList, 'DBType': 'string' }
        ]
    };
    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, callback);
}

var saveScenarioSequence = function () {
    if (currentScenarioName == "") {
        alertMsg("请添加新的偿付情景",1);
        return false;
    }
    var scenarioJson = { TrustId: trustId, ScenarioName: currentScenarioName, StartDate: "", EndDate: "", PrincipalPrecision: "", InterestPrecision: "", AllowInterestToPrincipal: false, Levels: [], ScenarioType: 0 };
    var executeParam = {
        'SPName': "usp_GetCurrentActiveClient", 'SQLParams': []
    };

    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";//appDomain=TrustManagement&executeParams=" + context;

    ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, function (data) {
        if (data.length > 0) {
            var clientCode = data[0].ClientCode;
            if (clientCode == "HNGTrust") {
                scenarioJson.ScenarioName = currentScenarioName + "_加速清偿";
                scenarioJson.ScenarioType = 1;
                saveTrustPaymentSequence(scenarioJson, getTrustPaymentSequence)
                scenarioJson.ScenarioName = currentScenarioName + "_非加速清偿";
                scenarioJson.ScenarioType = 0;
                saveTrustPaymentSequence(scenarioJson, getTrustPaymentSequence)

            }
            else {
                saveTrustPaymentSequence(scenarioJson, getTrustPaymentSequence)
            }
        }
    });
    
    
    
};

var saveTrustPaymentSequence = function (scenarioJson, callback) {
    var scenariotoJsonStr = JSON.stringify(scenarioJson);
    var executeParam = {
        SPName: 'usp_SaveTrustPaymentSequenceHN', SQLParams: [
            { Name: 'TrustId', value: scenarioJson.TrustId, DBType: 'string' },
            { Name: 'ScenarioName', value: scenarioJson.ScenarioName, DBType: 'string' },
            { Name: 'StartDate', value: scenarioJson.StartDate, DBType: 'string' },
            { Name: 'EndDate', value: scenarioJson.EndDate, DBType: 'string' },
            { Name: 'PrincipalPrecision', value: scenarioJson.PrincipalPrecision, DBType: 'string' },
            { Name: 'InterestPrecision', value: scenarioJson.InterestPrecision, DBType: 'string' },
            { Name: 'PaymentSequence', value: scenariotoJsonStr, DBType: 'string' },
            { Name: 'ScenarioType', value: scenarioJson.ScenarioType, DBType: 'int' },
            { Name: 'PaymentPhaseName', value: currentScenarioName, DBType: 'string' }
        ]
    };

    ExecuteRemoteData(executeParam, callback);
}

var getTrustPaymentSequence = function (data) {
    if (data) {
        var executeParam = {
            'SPName': "usp_GetTrustPaymentSequence", 'SQLParams': [
                { 'Name': 'TrustId', 'Value': trustId, 'DBType': 'int' }
            ]
        };
        var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";
        ExecuteGetData(false, serviceUrl, 'TrustManagement', executeParam, function (data) {
            var scenarioData = eval(data);
            var index = data.length;
            var event = scenarioData[scenarioData.length - 1];
            viewModel.ScenarioList.push(ko.mapping.fromJS(event));
            scenarioNames.push(scenarioData.ScenarioName);
            var selectScenario = $(".role-item").eq(index - 1)
            selectScenario.click();
            $(".role-item").click(function () {
                $(this).addClass("active").siblings().removeClass("active");
            })
            alertMsg("添加偿付情景成功！");
        });
    }
   
}

var removeScenario = function (data) {
    if (confirm('确定删除偿付情景吗？')) {
        var selectScenarioName = data.ScenarioName();
        if ($.inArray(selectScenarioName, scenarioNames) > -1) {
            var executeParam = {
                SPName: 'usp_RemoveTrustPaymentSequence', SQLParams: [
                    { Name: 'TrustId', value: trustId, DBType: 'string' },
                    { Name: 'ScenarioName', value: selectScenarioName, DBType: 'string' },
                ]
            };
            ExecuteRemoteData(executeParam, function (postbackdata) {
                scenarioNames.remove(selectScenarioName);
                //alert("删除偿付情景成功！");          
            });
        }
        viewModel.ScenarioList.remove(data);

        //若删除的为新建偿付情景，添加+Tab
        //if ($("#AddNewScenario").length == 0) {
        //    addNewScenarioToList();
        //}
        currentScenarioName = "";
        $(".role-item").eq(4).click();
    }
};
var ExecuteRemoteData = function (executeParam, callback) {
    //var executeParams = encodeURIComponent(JSON.stringify(executeParam));
    var executeParams = JSON.stringify(executeParam);

    var params = '';
    params += '<root appDomain="TrustManagement" postType="">';// appDomain="TrustManagement"
    params += executeParams;
    params += '</root>';

    var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonPostExecute";

    $.ajax({
        type: "POST",
        url: serviceUrl,
        dataType: "json",
        contentType: "application/xml;charset=utf-8",
        data: params,
        processData: false,
        async:false,
        success: function (response) {
            callback(response);
        },
        error: function (response) { alert("error is :" + response); }
    });
}