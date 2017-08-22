/// <reference path="jquery-1.12.1.min.js" />
/// <reference path="jquery.tmpl.min.js" />
/// <reference path="GoldenStand.Common.js" />
/// <reference path="jqueryUi/jquery-ui.min.js" />

var gsTrustEventDefinedMessage = {
    cn: {
        loadingError: '加载信托事件出错!',
        current: '当前',
        valueIs: '为',
        match: '符合预定值',
        unMatch: '不符合预定值',
        updateSuccess: '更新成功!'
    },
    en: {
        loadingError: 'Error occursed when loading Trust events!',
        current: 'Current ',
        valueIs: ' is ',
        match: ' match the predetermined value ',
        unMatch: ' unmatch the predetermined value ',
        updateSuccess: 'Events Updated Successfull!'
    }
};
var gsTrustEvent = (function () {
    var svcUrl;
    var trustId;
    var domNode;
    var variables = {};
    var trustEvents = [];
    var defMsg = gsTrustEventDefinedMessage.cn;

    var init = function (url, tId, vars, lang) {
        svcUrl = url;
        trustId = tId;
        variables = vars;
        if (lang) defMsg = lang;
    };

    var rendering = function (node, templ, callback) {
        if (!svcUrl || !trustId || !node || !templ) {
            if (callback) { callback(false); }
            return;
        }
        domNode = node;
        $.ajax({
            url: svcUrl,
            dataType: 'json',
            type: 'GET',
            cache: false,
            data: { 'action': 'getTrustEvents', 'trustId': trustId },
            success: function (data) {
                trustEvents = data;
                doRendering(node, templ);
                if (callback) { callback(true); }
            },
            error: function (error) {
                alert(defMsg.loadingError + '\n' + error.statusText);
            }
        });
    };

    var doRendering = function (node, templ) {
        sortingEvents();
        $(templ).tmpl(trustEvents).appendTo(node);
    }

    var sortingEvents = function () {
        $.each(trustEvents, function (i, value) {
            //add ext properties for each trust event 
            value['checkingResult'] = '';
            value['checkingDescription'] = '';
            value['triggers'] = [];
            value['itemIndex'] = i;

            var start = value.StartDate;
            if (start) {
                start = start.replace(/\//g, '');
                value.StartDate = (eval('new ' + start)).dateFormat('MM/dd/yyyy');
            }

            checkingSetting(value);
            triggeringSetting(value);
            triggeredBySetting(value);
        });
    }

    var checkingSetting = function (value) {
        var checking = value.Checking;
        if (!checking) { return true; }

        var $checking = $(checking);
        var query = $checking.find('Query').text();
        var $paras = $checking.find('Parameters Parameter');
        var paramHasValue = true;
        $paras.each(function (i, value) {
            var $p = $(value);
            var paramName = $p.attr('Name');
            if (query.indexOf(paramName) < 0) { return true; }

            var paramValue;
            var reg;
            var paramType = $p.attr('Type');
            if (paramType == 'ReplaceOperator') {
                paramValue = getOperatorByName($p.attr('Operator'));                
            } else {
                if (variables[paramName]) {
                    paramValue = variables[paramName];
                } else {
                    paramValue = htmlDecodeDom($p.attr('Value'));
                }
                paramName = '@' + paramName;                
            }
            if (!paramValue || paramValue === 'NA') {
                paramHasValue = false;
            }
            reg = new RegExp(paramName, 'g');
            query = query.replace(reg, paramValue);
        });

        var checkingResult = paramHasValue ? eval(query) : false;
        var checkingDescription = [];

        value["checkingResult"] = checkingResult;
        value["checkingDescription"] = checkingDescription;
    };

    var triggeringSetting = function (value) {
        var triggering = value.Triggering;
        if (!triggering || triggering === 'NA') {
            value.Triggering = [];
            return true;
        }
        var triggerings = triggering.split(',');
        value.Triggering = triggerings;

        $.each(triggerings, function (s, o) {
            var triggerEvent = getTrustEventByItemCode(o);
            triggerEvent['triggers'].push(value);
        });
    };

    var triggeredBySetting = function (value) {
        var triggeredBy = value.TriggeredBy;
        value.TriggeredBy = triggeredBy && triggeredBy != 'NA' ? triggeredBy.split(',') : [];
    };

    var statusChanged = function (eId, index) {
        var $ckb = $('#eventCkb' + eId);
        var $tr = $('#eventTr' + eId);
        var $txt = $('#eventTxtDt' + eId);
        var $trigger = $('.eventTrigger' + eId);

        $tr.removeClass('blink');
        var crtEvent = trustEvents[index];
        var targetEventIds = crtEvent.Triggering;

        if ($ckb.is(':checked')) {
            crtEvent.EventStatus = 'Y';
            $txt.val((new Date()).dateFormat('MM/dd/yyyy')).removeAttr('disabled');
            $trigger.addClass('triggerWarn');

            $.each(targetEventIds, function (i, value) {
                var targetEvent = getTrustEventByItemCode(value);
                if (targetEvent.TriggeredBy.indexOf(eId) < 0) {
                    targetEvent.TriggeredBy.push(eId);
                }
                if (targetEvent.EventStatus == 'N') {
                    var $targetTr = $('#eventTr' + value);
                    $targetTr.addClass('blink');
                }
            });
        } else {
            crtEvent.EventStatus = 'N';
            $txt.val('').attr('disabled', 'disabled');
            $trigger.removeClass('triggerWarn').removeClass('warnStatus');

            $.each(targetEventIds, function (i, value) {
                var targetEvent = getTrustEventByItemCode(value);
                var $targetTr = $('#eventTr' + value);
                targetEvent.TriggeredBy.remove(eId);
                if (targetEvent.TriggeredBy.lenght == 0 ||
                    (targetEvent.EventStatus == 'N' && $targetTr.find('.triggerWarn').length == 0)) {
                    $targetTr.removeClass('blink');
                }
            });
        }
    };

    var postUpdates = function () {
        var items = getPostItems(); //alert(items); return;
        $.ajax({
            url: svcUrl,
            dataType: 'text',
            type: 'POST',
            cache: false,
            data: { action: 'updateTrustEvents', 'items': items, 'trustId': trustId },
            success: function (data) {
                alert(defMsg.updateSuccess);
            },
            error: function (error) {
                alert(error.responseText);
            }
        });
    };

    var getTrustEventByItemCode = function (trustEventItemCode) {
        var tEvent;
        $.each(trustEvents, function (i, value) {
            if (value.ItemCode == trustEventItemCode) {
                tEvent = trustEvents[i];
                return false;
            }
        });
        return tEvent;
    }

    var getPostItems = function () {
        var items = '<items>';
        $(domNode + ' input:checkbox').each(function () {
            var $this = $(this);
            var status = $this.is(':checked') ? 'Y' : 'N';
            var index = $this.attr('date-index');
            var crtEvent = trustEvents[index];
            var start = $this.is(':checked') ? $('#eventTxtDt' + crtEvent.ItemCode).val() : '';
            items += '<item>';
            items += '<TrustEventId>' + crtEvent.TrustEventId + '</TrustEventId>';
            items += '<EventStatus>' + status + '</EventStatus>';
            //items += '<TriggeredBy>' + crtEvent.TriggeredBy.join(',') + '</TriggeredBy>';
            items += '<StartDate>' + start + '</StartDate>';
            items += '</item>';
        });
        items += '</items>';

        return items;
    };

    return {
        Init: init,
        Rendering: rendering,
        StatusChanged: statusChanged,
        PostUpdates: postUpdates
    };
})();