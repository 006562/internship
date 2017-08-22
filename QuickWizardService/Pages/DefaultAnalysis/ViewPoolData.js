/// <reference path="E:\dev_tfs02\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />


var orgCode;
var assetType;

var set;
var viewModel;
var dataModel = {
    'zh-CN': { PageTitle: '违约数据', DefaultIntervals: '选择违约区间：', Intervals: [], EmptyMsg: '没有数据', MuLabel: '均值加压', SigmaLabel: '方差加压', RecoveryLabel: '指定回收率' },
    'en-US': { PageTitle: 'Default Data', DefaultIntervals: 'Choose Interval:', Intervals: [], EmptyMsg: 'No Records Here', MuLabel: 'u Multiplier', SigmaLabel: 'var Multiplier', RecoveryLabel: 'Recovery Ratio' },
    Model: function (set) { return dataModel[set]; }
};

$(function () {
    set = getLanguageSet();
    orgCode = getQueryString('orgCode');
    assetType = getQueryString('assetType');
    if (!orgCode || !assetType) {
        alert('Organisation Code and Asset Type are Required!');
        return;
    }

    DefaultDataOperation.getIntervalsList(PageDataLoaded);
});

function PageDataLoaded(data) {

    viewModel = dataModel.Model(set);
    viewModel.Intervals = data;
    ko.applyBindings(viewModel, $('html').get(0));

    $('#loading').fadeOut();
}

var DefaultDataOperation = {
    getIntervalsList: function (callback) {
        var executeParam = { SPName: 'dbo.GetStaticPoolRegions', SQLParams: [] };

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, false, 'GET', callback);
    }

    , ckbCheckedChange: function (obj) {
        var $obj = $(obj);
        var regionId = $obj.attr('regionId');

        if ($obj.is(':checked')) {
            $obj.parent('li').addClass('selected');
            this.showIntervalData(regionId);
        } else {
            $obj.parent('li').removeClass('selected');
            $('#divDefaultData_' + regionId).addClass('hidden');
        }
    },
    showIntervalData: function (id) {
        var $section = $('#divDefaultData_' + id);
        if ($section.attr('data-loaded') === '1') {
            $section.removeClass('hidden');
        } else {
            var $tabel = $('#tblDataList_' + id);
            this.getIntervalData(id, function (rows) {
                if (rows && rows.length > 0) {
                    var tblThs = [];
                    var row = rows[0];
                    for (var col in row) {
                        var th = { field: col, title: col, align: 'center' }
                        tblThs.push(th);
                    }

                    $tabel.bootstrapTable({ columns: tblThs, data: rows });
                    $tabel.removeClass('hidden');
                    $('#divOperations_' + id).removeClass('hidden');

                    setTableThsEvent(id);
                } else {
                    $section.find('.emptymsg').removeClass('hidden');
                }
                $section.attr('data-loaded', 1);
                $section.removeClass('hidden');
            });
        }
    },
    getIntervalData: function (id, callback) {
        //for test
        //callback([{ a: 1, b: 2, c: 3 }, { a: 11, b: 22, c: 33 }, { a: 111, b: 222, c: 333 }]);
        //callback(null);
        //return;
        var executeParam = { SPName: 'dbo.GetStaticPoolInvertedtriangleView', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'RegionId', Value: id, DBType: 'int' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, false, 'GET', callback);
    },

    calculateLossDistribution: function (obj) {
        var $obj = $(obj);
        var regionId = $obj.attr('regionId');
        var regionCode = $obj.attr('regionCode');

        var muMultiplier = $('#inputMuMultiplier_' + regionId).val();
        if (typeof muMultiplier === 'undefined' || muMultiplier == '') muMultiplier = '1.0';

        var sigmaMultiplier = $('#inputSigmaMultiplier_' + regionId).val();
        if (typeof sigmaMultiplier === 'undefined' || sigmaMultiplier == '') sigmaMultiplier = '1.0';

        var recoveryRatio = $('#inputRecovery_' + regionId).val();
        if (typeof recoveryRatio === 'undefined' || recoveryRatio == '') recoveryRatio = '0.0';

        var allDates = getSelectedDates(regionId);

        var tpi = new top.TaskProcessIndicatorHelper();
        tpi.AddVariableItem('OrganisationCode', orgCode, 'string');
        tpi.AddVariableItem('AssetType', assetType, 'string');
        tpi.AddVariableItem('Section', regionCode, 'string');
        tpi.AddVariableItem('muMultiplier', muMultiplier, 'string');
        tpi.AddVariableItem('sigmaMultiplier', sigmaMultiplier, 'string');
        tpi.AddVariableItem('RecoveryRatio', recoveryRatio, 'string');
        tpi.AddVariableItem('SelectedDates', allDates, 'string');

        tpi.ShowIndicator('Task', 'CalculateLossDistribution', function (result) {
            //code in this place will be executed after the TaskIndicator be closed
        });
    },

    viewLossDistribution: function (obj) {
        var $obj = $(obj);
        var regionCode = $obj.attr('regionCode');
        var pageUrl = 'ViewLossDistribution.html?orgCode=' + orgCode + '&assetType=' + assetType + '&section=' + regionCode;
        window.open(pageUrl);
    }
};


function setTableThsEvent(reginId) {
    var curTbThs = '#tblDataList_' + reginId + ' th';
    $(curTbThs).click(function () {
        var $this = $(this);
        var cellIndex = $this.prop('cellIndex');

        $this.toggleClass('choiced');
        $('#tblDataList_' + reginId + ' tr').each(function (i, o) {
            var selector = 'td:nth-child(' + (cellIndex + 1) + ')';
            $(this).children(selector).toggleClass('choiced');
        });

    });
}

function getSelectedDates(reginid) {
    var allDates = [];
    $('#tblDataList_' + reginid).find('th').each(function () {
        if (!$(this).hasClass('choiced')) {
            allDates.push($(this).text());
        }
    });
    return allDates.splice(1, allDates.length).join(',')
}