/// <reference path="../../Scripts/knockout-3.4.0.js" />
/// <reference path="../../Scripts/knockout.mapping-latest.js" />
/// <reference path="../../Scripts/jquery-1.7.2.min.js" />
/// <reference path="../../Scripts/jquery.color-2.1.2.min.js" />
/// <reference path="../../Scripts/common.js" />
/// <reference path="../TrustWizard/Scripts/calendar.min.js" />

var gsTrustEventDefinedMessage = {
    cn: {
        loadingError: '加载信托事件出错!',
        current: '当前',
        valueIs: '为',
        match: '符合预定值',
        unMatch: '不符合预定值',
        updateSuccess: '更新成功!',
        updateError: '更新信托事件时出现错误。'
    },
    en: {
        loadingError: 'Error occursed when loading Trust events!',
        current: 'Current ',
        valueIs: ' is ',
        match: ' match the predetermined value ',
        unMatch: ' unmatch the predetermined value ',
        updateSuccess: 'Events Updated Successfull!',
        updateError: 'Error occursed when updating Trust events.'
    }
};
var gsTrustEvent = (function () {
    var svcGetUrl, svcUpdateUrl;
    var trustId, domId;
    var dataTrustEventItem = [], dataTrustEventItemCondition = [];
    var dataModel = {
        TrustEventItem: []
    };
    var viewModel;
    var defMsg = gsTrustEventDefinedMessage.cn;

    var initPageDataBinding = function (nodeId, tId, svcGet, svcUpdate, afterBindCallBack) {
        svcGetUrl = svcGet;
        svcUpdateUrl = svcUpdate;
        trustId = tId;
        domId = nodeId;
        getSourceDataAndSetDataModel(afterBindCallBack)
    };
    var getSourceDataAndSetDataModel = function (callBack) {
        $.ajax({
            type: "GET",
            url: svcGetUrl + trustId,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            cache:false,
            data: {},
            success: function (response) {
                if (response) {
                    setDataModel(eval(response));
                }
                dataBinding(callBack);
            },
            error: function (response) { alert(defMsg.loadingError); }
        });
    };
    var setDataModel = function (sourceData) {
        //设定 专项事件  和  违约条件  源数据集合
        $.each(sourceData, function (i, data) {
            var eventType = data.EventType;
            if (eventType === 'SpecificPlan') {
                dataTrustEventItem.push(data);
            } else {
                dataTrustEventItemCondition.push(data);
            }
        });
        //为  专项事件  源数据集合排序
        dataTrustEventItem.sort(function (a, b) {
            return a.ItemId - b.ItemId;
        });
        //检查每条  违约条件  数据的检查结果 checkingResult
        $.each(dataTrustEventItemCondition, function (i, data) {
            data['checkingResult'] = checkingSetting(data);
        });
        //为  专项事件  设定触发条件和检查结果
        $.each(dataTrustEventItem, function (i, data) {
            triggersAndCheckingResultSetting(data);

            var start = data.StartDate;
            if (start) {
                start = start.replace(/\//g, '');
                data.StartDate = (eval('new ' + start)).dateFormat('yyyy-MM-dd');
            }

            dataModel.TrustEventItem.push(data);
        });
    }
    var checkingSetting = function (data) {
        var currentValue = data.CurrentValue;
        var operator = getOperatorByName(data.Operator);
        data.Operator = operator;
        var threshold = data.Threshold;

        var expression = currentValue + ' ' + operator + ' ' + threshold;
        if (expression.indexOf('NA') >= 0) { return true; }

        return !eval(expression);
    };
    var triggersAndCheckingResultSetting = function (data) {
        data['checkingResult'] = true;
        data['triggers'] = [];

        var triggeredBy = data.TriggeredBy;
        if (!triggeredBy) { return; }

        data['triggers'] = $.grep(dataTrustEventItemCondition, function (value, index) {
            return triggeredBy.indexOf(value.ItemCode) > -1;
        }) || [];

        $.each(data['triggers'], function (i, value) {
            var conditionResult = value.checkingResult;
            if (!conditionResult) {
                data['checkingResult'] = false;
                return false;
            }
        });
    };
    var dataBinding = function (afterBindingCallBack) {
        var domNode = document.getElementById(domId);
        viewModel = ko.mapping.fromJS(dataModel);
        ko.applyBindings(viewModel, domNode);
        if (afterBindingCallBack) {
            afterBindingCallBack(dataTrustEventItem.length);
        }
    };

    var statusChanged = function (obj) {
        var $ckb = $(obj);
        var $tr = $ckb.parents('tr');

        $tr.removeClass('blink');
        var itemIndex = $ckb.attr('itemIndex');
        var crtEvent = viewModel.TrustEventItem()[itemIndex];
        var $txt = $('#startDate_txt' + itemIndex);
        if ($ckb.is(':checked')) {
            crtEvent.EventStatus('Y');
            crtEvent.StartDate((new Date()).dateFormat('yyyy-MM-dd'));
        } else {
            crtEvent.StartDate('');
            crtEvent.EventStatus('N');
        }
    };

    var postUpdates = function () {
        var items = '<root>' + encodeURIComponent(getPostItems()) + '</root>'; //alert(items); return;
        $.ajax({
            url: svcUpdateUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            type: 'POST',
            cache: false,
            data: items,
            success: function (data) {
                alert(defMsg.updateSuccess);
            },
            error: function (error) {
                alert(defMsg.updateError);
            }
        });
    };
    var getPostItems = function () {
        var items = '<items>';
        $('#' + domId + ' input:checkbox').each(function () {
            var $this = $(this);
            var itemIndex = $this.attr('itemIndex');
            var crtEvent = viewModel.TrustEventItem()[itemIndex];

            var eventId = crtEvent.TrustEventId();
            var status = crtEvent.EventStatus();
            var start = crtEvent.StartDate() == null ? '' : crtEvent.StartDate();
            items += '<item>';
            items += '<TrustEventId>' + eventId + '</TrustEventId>';
            items += '<EventStatus>' + status + '</EventStatus>';
            items += '<StartDate>' + start + '</StartDate>';
            items += '</item>';
        });
        items += '</items>';

        return items;
    };

    return {
        InitPageDataBinding: initPageDataBinding,
        StatusChanged: statusChanged,
        PostUpdates: postUpdates
    };
})();


if (!trustId || isNaN(trustId) || trustId <= 0) {
    alert('no trustid');
} else {
    gsTrustEvent.InitPageDataBinding('TrustEventList'
        , trustId
        , GlobalVariable.DataProcessServiceUrl+'GetTrustEvents/TrustManagement/'
        , GlobalVariable.DataProcessServiceUrl+'UpdateTrustEvents'
        , function (dataCount) {
            if (dataCount > 0) {
                $('.list-view-tr-emptymsg').hide();
                $('#btnTrustEventUpdate').attr('disabled', false);
                $('.date-plugins').date_input();
            }
        });
}