
var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;

var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '违约分布曲线蒙特卡罗模拟',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '1', ItemCode: 'OrganisationCode', ItemAliasValue: '资产来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'ArrearsSection', ItemAliasValue: '逾期区间', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'Interval', ItemAliasValue: '采样步长', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '0.001' },
                    { ItemId: '5', ItemCode: 'MCAmortisationSource', ItemAliasValue: '回款数据来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'MCPoolBalance', ItemAliasValue: '资产池规模', DataType: 'float', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' },
                ]
            },
            Buttons: [
                { Text: '显示违约分布曲线', Click: 'ViewLogNormalCurve("Section0Identity")', Class: 'btn btn-default' },
                { Text: '开始模拟', Click: 'RunLogNormalCurve("Section0Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        },
        {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '指定违约率单情景测算',
            Identity: 'Section02dentity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '1', ItemCode: 'DefaultRate', ItemAliasValue: '指定违约率 %', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'AmortisationSource', ItemAliasValue: '回款数据来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'PoolBalance', ItemAliasValue: '资产池本金规模', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                ]
            },
            Buttons: [
                { Text: '开始计算', Click: 'RunSingleScenario("Section02dentity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewResultSingleScenario()', Class: 'btn btn-default' },
                { Text: '现金流入流出表', Click: 'ViewResultSpreadsheet()', Class: 'btn btn-default' }
        ]
        }
        ],
        Customize: { MCResult: '蒙特卡洛模拟', StressResult: '现金流压力测试结果明细', StressResultAggregation: '现金流压力测试结果' }
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Monte Carlo Simulation',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'Trust', ItemAliasValue: 'Target Trust', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'Pool', ItemAliasValue: 'Target Asset Pool', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'MCReportingDate', ItemAliasValue: 'Reporting Date', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'MCSimulationPeriods', ItemAliasValue: 'Simulation Periods', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'MCRecovery', ItemAliasValue: 'Recovery Ratio', DataType: 'string', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'MCSimulationTimes', ItemAliasValue: 'Simulation Times', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'RunLogNormalCurve("Section0Identity")', Class: 'btn btn-primary' },
                { Text: 'View Result', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        },
        {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Result',
            Identity: 'Section02dentity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '4', ItemCode: 'CurveChoice', ItemAliasValue: 'Curve Choice', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'Name', ItemAliasValue: 'Name', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                ]
            },
            Buttons: [
                { Text: 'Save Result', Click: 'Save("Section02dentity")', Class: 'btn btn-primary pull-right' }
            ]
        }
        ],
        Customize: { MCResult: 'Monte Carlo Simulation' }
    },

    Model: function () {
        return dataModel[set];
    }
};

$(function () {
    set = getLanguageSet();

    BusinessIdentifier = getQueryString("id");
    if (!BusinessIdentifier) {
        alert('Business Identifier is Required!');
        return;
    }

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    $('#loading').fadeOut();
    $('.date-plugins').date_input();
    //$('#Section02dentity,#page_main_customize').hide();
    $('#page_main_customize, #page_main_result').hide();
	
	getOrganisationAndAssetType();
});

function RunLogNormalCurve(sectionId) {

    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    //if (!validControls(sectionFieldsSelector)) return;

    var OrganisationCode = $('#OrganisationCode').val();
    var AssetType = $('#AssetType').val();
    var ArrearsSection = $('#ArrearsSection').val();
    var Interval = $('#Interval').val();
    var MCAmortisationSource = $('#MCAmortisationSource').val();
    var MCPoolBalance = $('#MCPoolBalance').val();

    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('TrustID', BusinessIdentifier, 'string', 1, 1, 0);
    tpi.AddVariableItem('OrganisationCode', OrganisationCode, 'string', 1, 1, 0);
    tpi.AddVariableItem('AssetType', AssetType, 'string', 1, 1, 0);
    tpi.AddVariableItem('ArrearsSection', ArrearsSection, 'string', 1, 1, 0);
    tpi.AddVariableItem('Interval', Interval, 'string', 1, 1, 0);
    tpi.AddVariableItem('MCAmortisationSource', MCAmortisationSource, 'string', 1, 1, 0);
    tpi.AddVariableItem('MCPoolBalance', MCPoolBalance, 'string', 1, 1, 0);
    tpi.AddVariableItem('r', Math.random(), 'string', 1, 1, 0);

    tpi.ShowIndicator('Task', 'CashflowStressTest_LogNormalCurve', function (result) {
        ViewResult();
    });
	
}

function RunSingleScenario() {
    var defaultRate = $('#DefaultRate').val();
    var poolBalance = $('#PoolBalance').val();
    var AmortisationSource = $('#AmortisationSource').val();

    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('TrustID', BusinessIdentifier, 'String');
    tpi.AddVariableItem('DefaultRate', defaultRate, 'String');
    tpi.AddVariableItem('AmortisationSource', AmortisationSource, 'string');
    tpi.AddVariableItem('PoolBalance', poolBalance, 'String');
    
    tpi.ShowIndicator('Task', 'CashflowStressTestSingleScenario', function (result) {
        ViewResultSingleScenario();
    });
}

function ViewResult() {
    //getStressResults(function (rows) { displayTableData('#table_StressResults', rows); });
    getStressResultsAggregation(function (rows) { displayTableData('#table_StressResultsAggregation', rows); });

    $('#page_main_result').show();
}

function displayTableData(tbDom, rows) {
    var $table = $(tbDom)
    if (!rows || rows.length < 1) { return }
    var tblThs = [];
    var row = rows[0];
    for (var col in row) {
        var th = { field: col, title: col, align: 'center' }
        tblThs.push(th);
    }
    $table.bootstrapTable({ columns: tblThs, data: rows });
}
function getStressResults(callback) {
    var executeParam = { SPName: 'CashflowStressTest.GetStressResults', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuickWizard&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', callback);
}
function getStressResultsAggregation(callback) {
    var executeParam = { SPName: 'CashflowStressTest.GetStressResultsAggregation', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuickWizard&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', callback);
}

function getOrganisationAndAssetType() {
    var executeParam = { SPName: 'CashflowStressTest.GetTrustInfo', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuickWizard&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', function(response) {
		var jsonObject;
		var jsonArray = eval(response);
		$('#OrganisationCode').val(jsonArray[0].OrganisationCode);
		$('#AssetType').val(jsonArray[0].AssetType);
	});
}


function ViewResultSingleScenario() {
    var executeParam = { SPName: 'CashflowStressTest.GetLatestSessionByTrustID', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuickWizard&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', function (data) {
        var url = 'https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&sessionId=' + data[0]['SessionId'] + '&taskCode=' + data[0]['TaskCode'] + '&r=' + Math.random();
        window.open(url);
    });
}

function ViewResultSpreadsheet() {
    var executeParam = { SPName: 'CashflowStressTest.GetLatestSessionByTrustID', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuickWizard&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', function (data) {
		var url = 'https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&sessionId=' + data[0]['SessionId'] + '&taskCode=' + data[0]['TaskCode'] + '&isShowGrid=1' + '&r=' + Math.random();
		window.open(url);
    });
}

function ViewLogNormalCurve() {
    //var executeParam = { SPName: 'DefaultAnalysis.GetPredictedLossRate', SQLParams: [] };
    //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    //CallWCFSvc(serviceUrl, true, 'GET', function (response) {
    //    DrawLine(response);
    //});
    ChartOperation.DrawLossDistribution();

    $('#page_main_customize').show();
}

var ChartOperation = {

    DrawLossDistribution: function () {
        var self = this;
        var executeParam = { SPName: 'CreditRating.GetLossDistribution', SQLParams: [] };

        var orgCode = $('#OrganisationCode').val();
        var assetType = $('#AssetType').val();
        var section = $('#ArrearsSection').val();

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
                title: '累积违约率概率分布（对数正态分布假设）',
                xDatas: losses,
                yAxis: { title: { text: '概率密度(%)' } },
                label: false,
                cross: false,
                yDatas: [{ name: '损失率', type: 'line', data: probabilities }]
            };
            //var options1 = {
            //    title: 'LossDistributionCDF',
            //    xDatas: losses,
            //    label: false,
            //    cross: false,
            //    yAxis: { title: { text: '百分比(%)' } },
            //    yDatas: [{ name: '损失率', type: 'line', data: CDFs }]
            //};

            self._drawChart('#divChartLogNormal', options);
        });
    },

    _drawChart: function (obj, options) {
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
}

function DrawLine(response) {
    var x_value = new Array();
    var y_value = new Array();
    var y1_value = new Array();

    for (var i = 0; i < response.length; i++) {
        var x = response[i].Period;
        var y = response[i].lossresult / 10000;
        var y1 = response[i].lossresult_total / 10000;
        x_value.push(x);
        y_value.push(y);
        y1_value.push(y1)
    }
    $(function () {
        $('#container').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '累积违约率分布曲线'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: x_value
            },
            yAxis: {
                title: {
                    text: '百分比(%)'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b>' + this.x + ': ' + this.y;
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: '违约率',
                data: y_value
            },
			{
			    name: '违约率（总金额）',
			    data: y1_value
			}]
        });
    });
}



//***********//StandViews Data Sort and UI Operation Events//***********//
var sdvOperation = {
    SortSourceData: function (items, sectionIndex) {
        var model = dataModel.Model(set).Sections[sectionIndex].FieldsSetting;
        model.Fields = items;
    },
    AddOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var selSelector = '#' + sectionId + ' .sdv-optionalfields-select';
        var itemIndex = $(selSelector).val();
        if (!itemIndex) return;

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Fields()[itemIndex];
        item.IsDisplay(true);
        setFieldPlugins();
    },
    RemoveOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');

        var itemIndex = $(obj).attr('itemIndex');

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Fields()[itemIndex];
        item.ItemValue('');
        item.IsDisplay(false);
    },
    GetItems: function (sectionIndex) {
        var array = [];
        var standViewData = viewModel.Sections()[sectionIndex].FieldsSetting.Fields();
        $.each(standViewData, function (i, field) {
            var itemId = field.ItemId();
            if (itemId && field.IsDisplay()) {
                var item = {};
                item.ItemId = itemId;
                item.ItemValue = field.ItemValue();
                item.SectionIndex = sectionIndex;
                array.push(item);
            }
        });
        return array;
    }
};
function setFieldPlugins() {
    $('#page_main_container .date-plugins').date_input();
}
