
var set;
var viewModel;
var dataModel = {
    'zh-CN': { PageTitle: 'Loss Distribution' },
    'en-US': { PageTitle: 'Loss Distribution' },
    Model: function (set) { return dataModel[set]; }
};


var orgCode;
var assetType;
var section;
$(function () {
    set = getLanguageSet();
    orgCode = getQueryString('orgCode');
    assetType = getQueryString('assetType');
    section = getQueryString('section');

    if (!orgCode || !assetType || !section) {
        alert('Organisation Code, Asset Type and section are Required!');
        return;
    }
    $('#loading').fadeOut();
	
    ViewPageOperation.DrawCumulativeLosses();
    ViewPageOperation.DrawLossTimingCurve();
    ViewPageOperation.DrawLossDistribution();
    ViewPageOperation.ShowLossSampleData();
    ViewPageOperation.GetModelParamData(function (response) {
        if (!response) { return }

        var ModelParams = [];
        var params = response[0];
        for (var param in params) {
            var obj = {};
            obj['ItemCode'] = param;
            obj['ItemValue'] = params[param];
            ModelParams.push(obj);
        }
        dataModel = dataModel.Model(set);
        dataModel['ModelParams'] = ModelParams;
        viewModel = ko.mapping.fromJS(dataModel);
        ko.applyBindings(viewModel, $('html').get(0));
    });

});


var ViewPageOperation = {
    DrawLossTimingCurve: function () {
        var self = this;
        var executeParam = { SPName: 'CreditRating.GetLossTimingCurve', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Section', Value: section, DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', function (data) {
            var periods = [], cumulatives = [], destributions = [];
            $.each(data, function (i, v) {
                periods.push(v.CollectionPeriod);
                cumulatives.push(v.Cumulative);
                destributions.push(v.Distribution);
            });

            var options = {
                title: 'LossTimingCurve',
                xDatas: periods,
                yAxis: [{ title: { text: '百分比(%)' } }, { title: { text: '时间分布' }, opposite: true }],
                yDatas: [{ name: '时间分布', type: 'column', yAxis: 1, data: destributions },
                    { name: '增长曲线', type: 'spline', data: cumulatives }
                ]
            };

            self._drawChart('#divChart1', options);
        });
    },
    DrawLossDistribution: function () {
        var self = this;
        var executeParam = { SPName: 'CreditRating.GetLossDistribution', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Section', Value: section, DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', function (data) {
            var losses = [], probabilities = [], CDFs = [];
            $.each(data, function (i, v) {
                if (v.Probability < 0.0001) {
                    return true;//equals to continue
                }
                losses.push(v.Loss);
                probabilities.push(v.Probability);
                CDFs.push(v.CDF);
            });

            var options = {
                title: 'LossDistribution',
                xDatas: losses,
                yAxis: { title: { text: '百分比(%)' } },
                label: false,
                cross: false,
                yDatas: [{ name: '损失率', type: 'line', data: probabilities }]
            };
            var options1 = {
                title: 'LossDistributionCDF',
                xDatas: losses,
                label: false,
                cross: false,
                yAxis: { title: { text: '百分比(%)' }},
                yDatas: [{ name: '损失率', type: 'line', data: CDFs }]
            };

            self._drawChart('#divChart2', options);
            self._drawChart('#divChart4', options1);
        });
    },
    DrawCumulativeLosses: function () {
        var self = this;
        var executeParam = { SPName: 'CreditRating.GetCumulativeLosses', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Section', Value: section, DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', function (data) {
            var maxCount = 0, xDatas = [], dataSeries = [];
            $.each(data, function (i, v) {
                var serie = {};
                serie.name = v.StartDate;

                var aryData = v.Value.split(',');
                serie.data = $.map(aryData, function (item, index) { return parseFloat(item); });

                dataSeries.push(serie);
                if (v.Counts > maxCount) maxCount = v.Counts;
            });
            for (var i = 0; i < maxCount; i++) {
                xDatas.push(i + 1);
            }
            var options = {
                title: '静态池样本累计违约率时间曲线',
                xDatas: xDatas,
                legend: true,
                yDatas: dataSeries
            };

            self._drawChart('#divChart3', options);
        });
    },
    ShowLossSampleData: function () {
        var executeParam = { SPName: 'DefaultAnalysis.GetLossSamples', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Section', Value: section, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Log', Value: '0', DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', function (response) {
            var $table = $('#tbLossSample');

            var ths = [];
            var row = {};
            $.each(response, function (i, v) {
                var fieldIndex = 'field_' + i;
                var th = { field: fieldIndex, title: (i + 1) };
                row[fieldIndex] = v.Loss;
                ths.push(th)
            });

            $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: [row] });
        });

        executeParam = { SPName: 'DefaultAnalysis.GetLossSamples', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Section', Value: section, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Log', Value: '1', DBType: 'string' });

        serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', function (response) {
            var $table = $('#tbLossSampleLog');

            var ths = [];
            var row = {};
            $.each(response, function (i, v) {
                var fieldIndex = 'field_' + i;
                var th = { field: fieldIndex, title: (i + 1) };
                row[fieldIndex] = v.Loss;
                ths.push(th)
            });

            $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: [row] });
        });
    },
    GetModelParamData: function (fncallback) {
        var executeParam = { SPName: 'DefaultAnalysis.GetLossModelParams', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Section', Value: section, DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', fncallback);
    }

    , _drawChart: function (obj, options) {
        var hchartOptions = {
            title: { text: options.title || '' },
            subtitle: { text: options.subTitle || '' },
            xAxis: { categories: options.xDatas || [] },
            yAxis: options.yAxis || { title: { text: '' } },
            tooltip: {
                enabled: true,
                valueSuffix: options.tooltip || ''
            },
            plotOptions: {
                //column: { colorByPoint: true },
                line: {
                    dataLabels: { enabled: options.label || false },
                    enableMouseTracking: true
                }
            },
            series: options.yDatas || []
        };
        if (options.legend) {
            hchartOptions.legend = {
                verticalAlign: 'bottom',
                borderWidth: 0
            }
        }
        if (options.cross) {
            hchartOptions.tooltip.crosshairs = [{
                width: 1,
                color: "#006cee",
                dashStyle: 'longdashdot'
            }, {
                width: 1,
                color: "#006cee",
                dashStyle: 'longdashdot',
                zIndex: 100
            }]
        }
        $(obj).highcharts(hchartOptions);
    }
};