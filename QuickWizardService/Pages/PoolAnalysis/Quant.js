
var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '资产池量化分析',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'Trust', ItemAliasValue: '目标信托', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'Pool', ItemAliasValue: '目标资产池', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'ReportingDate', ItemAliasValue: '资产数据日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                ]
            },
            Buttons: [
                { Text: '运行', Click: 'RunTask("Section0Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        }//,
        //{
        //    Templ: GlobalVariable.UiTempl_Stand,
        //    Title: '结果展示',
        //    Identity: 'Section02dentity',
        //    FieldsSetting: {
        //        HasOptionalFields: false,
        //        Fields: [
        //            { ItemId: '4', ItemCode: 'CurveChoice', ItemAliasValue: '曲线选择', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
        //            { ItemId: '5', ItemCode: 'Name', ItemAliasValue: '命名', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
        //        ]
        //    },
        //    Buttons: [
        //        { Text: '保存结果', Click: 'Save("Section02dentity")', Class: 'btn btn-primary pull-right' }
        //    ]
        //}
        ],
        Customize: { MCResult: '蒙特卡洛模拟' }
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
                    { ItemId: '3', ItemCode: 'ReportingDate', ItemAliasValue: 'Reporting Date', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'RunTask("Section0Identity")', Class: 'btn btn-primary' },
                { Text: 'View Result', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        }//,
        //{
        //    Templ: GlobalVariable.UiTempl_Stand,
        //    Title: 'Result',
        //    Identity: 'Section02dentity',
        //    FieldsSetting: {
        //        HasOptionalFields: false,
        //        Fields: [
        //            { ItemId: '4', ItemCode: 'CurveChoice', ItemAliasValue: 'Curve Choice', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
        //            { ItemId: '5', ItemCode: 'Name', ItemAliasValue: 'Name', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
        //        ]
        //    },
        //    Buttons: [
        //        { Text: 'Save Result', Click: 'Save("Section02dentity")', Class: 'btn btn-primary pull-right' }
        //    ]
        //}
        ],
        Customize: { MCResult: 'Monte Carlo Simulation' }
    },

    Model: function () {
        return dataModel[set];
    }
};

$(function () {
    set = getLanguageSet();

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    $('#loading').fadeOut();
    $('.date-plugins').date_input();
    $('#Section02dentity,#page_main_customize').hide();
});

function RunTask(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    if (!validControls(sectionFieldsSelector)) return;

    var trustId = $('#Trust').val();
    var reporintDate = $('#MCReportingDate').val();
    var simulationPeriods = $('#MCSimulationPeriods').val();
    var recovery = $('#MCRecovery').val();
    var simulationTimes = $('#MCSimulationTimes').val();
    var dalConnStr = 'Data Source=MSSQL;Initial Catalog=SFM_DAL_ConsumerLoan;Integrated Security=SSPI;';

    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('TrustId', trustId, 'string', 1, 1, 0);
    //tpi.AddVariableItem('DimReportingDate', beginDate, 'string', 1, 1, 0);
    tpi.AddVariableItem('ReportingDate', reporintDate, 'string', 1, 1, 0);
    tpi.AddVariableItem('SimulationPeriods', simulationPeriods, 'string', 1, 1, 0);
    tpi.AddVariableItem('SimulationTimes', simulationTimes, 'string', 1, 1, 0);
    tpi.AddVariableItem('DALConnStr', dalConnStr, 'string', 1, 1, 0);
    tpi.AddVariableItem('Recovery', recovery, 'string', 1, 1, 0);
    tpi.AddVariableItem('TimeStamp', new Date().getTime(), 'string', 1, 1, 0);


    tpi.ShowIndicator('Task', 'SurvivalAnalysis_MCS', function (result) {
        ViewResult();
    });
}

function ViewResult() {
    var executeParam = { SPName: 'DefaultAnalysis.GetPredictedLossRate', SQLParams: [] };
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', function (response) {
        DrawLine(response);
    });

    $('#Section02dentity,#page_main_customize').show();    
}

/*绘画折线图*/

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
                text: '资产池违约率曲线预测'
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
