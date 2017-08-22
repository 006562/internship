/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout-3.4.0.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout.mapping-latest.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />

var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '风险函数估计',
            Identity: 'RiskFunctionEstimation',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'OrganisationCode', ItemAliasValue: '资产来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'HazardFunction', ItemAliasValue: '风险函数模型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'SurvivalAnalysisGroupingField', ItemAliasValue: '分组字段', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'BeginDate', ItemAliasValue: '统计起始时间', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'EndDate', ItemAliasValue: '统计结束时间', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '运行', Click: 'RunTask("RiskFunctionEstimation")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewLossRate()', Class: 'btn btn-default' },
                { Text: '损失明细', Click: 'ViewLossDetails()', Class: 'btn btn-default' }
            ]
        }],
        Customize: { ResultTitle: '结果展示', HTResult: 'h(t)结果', STResult: 'S(t)结果' }
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Risk Function Estimation',
            Identity: 'RiskFunctionEstimation',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '', ItemCode: 'OrganisationCode', ItemAliasValue: 'Asset Source', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '', ItemCode: 'AssetType', ItemAliasValue: 'Asset Type', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '', ItemCode: 'HazardFunction', ItemAliasValue: 'Risk Function Model', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '', ItemCode: 'SurvivalAnalysisGroupingField', ItemAliasValue: 'Group Field', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '', ItemCode: 'BeginDate', ItemAliasValue: 'Begin Date', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '', ItemCode: 'EndDate', ItemAliasValue: 'End Date', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'RunTask("RiskFunctionEstimation")', Class: 'btn btn-primary' },
                { Text: 'View Result', Click: 'ViewLossRate()', Class: 'btn btn-default' },
                { Text: 'View Loss Details', Click: 'ViewLossDetails()', Class: 'btn btn-default' }
            ]
        }],
        Customize: { ResultTitle: 'Results', HTResult: 'h(t) Result', STResult: 'S(t) result' }
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
});

function RunTask(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    if (!validControls(sectionFieldsSelector)) return;

    var orgCode = $('#OrganisationCode').val();
    var assetType = $('#AssetType').val();
    var hazardFunction = $('#HazardFunction').val();
    var beginDate = $('#BeginDate').val();
    var endDate = $('#EndDate').val();
    var dalConnStr = GlobalVariable.AssetTypeDBMapping[assetType]['DALConnStr'];
    var survivalAnalysisGroupingField = $('#SurvivalAnalysisGroupingField').val();

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('OrganisationCode', orgCode, 'string', 1, 1, 0);
    tpi.AddVariableItem('AssetType', assetType, 'string', 1, 1, 0);
    tpi.AddVariableItem('HazardFunction', hazardFunction, 'string', 1, 1, 0);
    tpi.AddVariableItem('BeginDate', beginDate, 'string', 1, 1, 0);
    tpi.AddVariableItem('EndDate', endDate, 'string', 1, 1, 0);
    tpi.AddVariableItem('DALConnStr', dalConnStr, 'string', 1, 1, 0);
    tpi.AddVariableItem('SurvivalAnalysisGroupingField', survivalAnalysisGroupingField, 'string', 1, 1, 0);
    tpi.AddVariableItem('TimeStamp', new Date().getTime(), 'string', 1, 1, 0);


    tpi.ShowIndicator('Task', 'SurvivalAnalysis', function (result) {
        ViewLossDetails();
    });
}
function ViewLossRate() {
    var orgCode = $('#OrganisationCode').val();
    var assetType = $('#AssetType').val();

    executeParam = { SPName: 'DefaultAnalysis.GetLossRate', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));

    CallWCFSvc(serviceUrl, true, 'GET', function (response) {
        var $table = $('#tbLossRate');
        var ths = [{ field: 'CreditRatingScore', title: '信用评级' }, { field: 'LoanTerm', title: '贷款周期' }, { field: 'LossRate', title: '损失率' }];
        $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });
        $table.removeClass('hidden');
        $('#tbLossRateDetail').addClass('hidden');
    });
}
function ViewLossDetails() {
    var orgCode = $('#OrganisationCode').val();
    var assetType = $('#AssetType').val();

    executeParam = { SPName: 'DefaultAnalysis.GetStaticPool', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));

    CallWCFSvc(serviceUrl, true, 'GET', function (response) {
        var $table = $('#tbLossRateDetail');
        var ths = [{ field: 'LoanStartDate', title: '贷款开始日期' }, { field: 'ReportingDate', title: '统计日期' },
            { field: 'CreditRatingScore', title: '信用评级' }, { field: 'LoanTerm', title: '贷款周期' },
            { field: 'LoanAmount', title: '总笔数' }, { field: 'LossLoanAmount', title: '损失数量' }];
        $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });
        $table.removeClass('hidden');
        $('#tbLossRate').addClass('hidden');
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