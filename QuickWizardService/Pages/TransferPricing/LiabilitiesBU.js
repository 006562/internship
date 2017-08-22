/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />
document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'ABS专项计划资金转移定价',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'Trust', ItemAliasValue: '专项计划', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''},
                    {
                        ItemId: '2', ItemCode: 'Cashflows', ItemAliasValue: '现金流名称', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'StaticStrip', Text: '优先A档' }, { Value: 'Duration', Text: '优先A档' }, { Value: 'Duration', Text: '优先C档' }
                                    , { Value: 'Duration', Text: '次级' }, { Value: 'Duration', Text: '次级1档' }, { Value: 'Duration', Text: '次级2档' }]
                    },
                    { ItemId: '3', ItemCode: 'InvestedAmount', ItemAliasValue: '投资金额(元)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'AccruedInterestDays', ItemAliasValue: '距离上次付息天数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '10' },
                    { ItemId: '6', ItemCode: 'RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' }
                ]
            },
            Buttons: [
                { Text: '计算资金转移定价', Click: 'runCashflowTP("Section001Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'viewCashflowTPResult()', Class: 'btn btn-primary' }
            ]
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '公司债、银行贷款资金转移定价',
            Identity: 'Section002Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'BondPricing_FaceValue', ItemAliasValue: '面值', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '100' },
                    { ItemId: '2', ItemCode: 'BondPricing_Coupon', ItemAliasValue: '年化票面利率%', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '9.0' },
                    { ItemId: '3', ItemCode: 'BondPricing_Frequency', ItemAliasValue: '年付息次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '2' },
                    { ItemId: '4', ItemCode: 'BondPricing_Maturity', ItemAliasValue: '期限(年)', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '4' },
                    { ItemId: '5', ItemCode: 'BondPricing_YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'BondPricing_RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' }
                ]
            },
            Buttons: [
                { Text: '计算资金转移定价', Click: 'runBondTP("Section002Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'viewBondTPResult()', Class: 'btn btn-primary' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'ABS Trust Transfer Pricing',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'Trust', ItemAliasValue: 'Trust', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    {
                        ItemId: '2', ItemCode: 'Cashflows', ItemAliasValue: 'Cashflows', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'StaticStrip', Text: '优先A档' }, { Value: 'Duration', Text: '优先A档' }, { Value: 'Duration', Text: '优先C档' }
                                    , { Value: 'Duration', Text: '次级' }, { Value: 'Duration', Text: '次级1档' }, { Value: 'Duration', Text: '次级2档' }]
                    },
                    { ItemId: '3', ItemCode: 'InvestedAmount', ItemAliasValue: 'Invested Amount', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'YieldCurve', ItemAliasValue: 'Yield Curve', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'AccruedInterestDays', ItemAliasValue: 'Accrued Interest Days', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '10' },
                    { ItemId: '6', ItemCode: 'RiskPremium', ItemAliasValue: 'Risk Premium(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'runCashflowTP("Section001Identity")', Class: 'btn btn-primary' },
                { Text: 'View', Click: 'viewCashflowTPResult()', Class: 'btn btn-primary' }
            ]
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '公司债、银行贷款资金转移定价',
            Identity: 'Section002Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'BondPricing_FaceValue', ItemAliasValue: '面值', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '100' },
                    { ItemId: '2', ItemCode: 'BondPricing_Coupon', ItemAliasValue: '年化票面利率%', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '9.0' },
                    { ItemId: '3', ItemCode: 'BondPricing_Frequency', ItemAliasValue: '年付息次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '2' },
                    { ItemId: '4', ItemCode: 'BondPricing_Maturity', ItemAliasValue: '期限(年)', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '4' },
                    { ItemId: '5', ItemCode: 'BondPricing_YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'BondPricing_RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' }
                ]
            },
            Buttons: [
                { Text: '运行', Click: 'runBondTP("Section002Identity")', Class: 'btn btn-primary' },
                { Text: '查看', Click: 'viewBondTPResult()', Class: 'btn btn-primary' }
            ]
        }]
    },

    Model: function (set) {
        return dataModel[set];
    }
};

$(function () {

    set = getLanguageSet();

    PageItemsLoaded();
});

function PageItemsLoaded(items) {

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    setFieldPlugins();

    var executeParam = { SPName: '[Pricing].[usp_GetAvailableCurves]', SQLParams: [] };
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        $.each(data, function (i, v) {
            $('#YieldCurve,#BondPricing_YieldCurve').append("<option value='" + v.CurveName + "'>" + v.CurveName + "</option>");
        });
    });

    $('#loading').fadeOut();
}
function setFieldPlugins() {
    $('.date-plugins').date_input();
}

function ValidateSectionFields(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    return validControls(sectionFieldsSelector);
}
function SavePageItems(obj) {

    var items = gdvOperation.GetItems(1);

    var allItems = items;

    var pop = mac.wait("Data Saving");
    DataOperate.savePageData(BusinessCode, BusinessIdentifier, PageId, allItems, function (result) {
        if (pop != null) {
            pop.close();
            pop = mac.complete("Saved Successfully!");
        }
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



function runCashflowTP(sectionId) {
    if (!ValidateSectionFields(sectionId)) { return; }

    var InstrumentName = $('#Cashflows').val();
    var YieldCurve = $('#YieldCurve').val();
    var AccruedInterestDays = $('#AccruedInterestDays').val();
    var RiskPremium = $('#RiskPremium').val();
    var InvestedAmount = $('#InvestedAmount').val();
    var TrustID = $('#Trust').val();

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('InstrumentName', InstrumentName, 'String');
    tpi.AddVariableItem('InvestedAmount', InvestedAmount, 'String');
    tpi.AddVariableItem('TrustID', TrustID, 'String');
    tpi.AddVariableItem('YieldCurve', YieldCurve, 'String');
    tpi.AddVariableItem('AccruedInterestDays', AccruedInterestDays, 'String');
    tpi.AddVariableItem('RiskPremium', RiskPremium, 'String');

    tpi.ShowIndicator('Task', 'CashflowsTP', function () { });
}

function viewCashflowTPResult() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1009");
}

function runBondTP(sectionId) {
    if (!ValidateSectionFields(sectionId)) { return; }
    var FaceValue = $('#BondPricing_FaceValue').val();
    var Coupon = $('#BondPricing_Coupon').val();
    var YieldCurve = $('#BondPricing_YieldCurve').val();
    var Frequency = $('#BondPricing_Frequency').val();
    var RiskPremium = $('#BondPricing_RiskPremium').val();
    var Maturity = $('#BondPricing_Maturity').val();

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('FaceValue', FaceValue, 'String');
    tpi.AddVariableItem('Coupon', Coupon, 'String');
    tpi.AddVariableItem('Frequency', Frequency, 'String');
    tpi.AddVariableItem('YieldCurve', YieldCurve, 'String');
    tpi.AddVariableItem('RiskPremium', RiskPremium, 'String');
    tpi.AddVariableItem('Maturity', Maturity, 'String');

    tpi.ShowIndicator('Task', 'BondTP', function () { });
}

function viewBondTPResult() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1009");
}

