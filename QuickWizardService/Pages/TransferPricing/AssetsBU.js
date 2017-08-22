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
            Title: '单笔资产转移定价',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    {
                        ItemId: '1', ItemCode: 'AssetType', ItemAliasValue: '资产类别', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'BT', Text: '白条' }, { Value: 'BL', Text: '保理' }]
                    },
                    { ItemId: '2', ItemCode: 'LoanAccountNo', ItemAliasValue: '资产编号', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'FTP_YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    { ItemId: '5', ItemCode: 'AreaRiskAdjustment', ItemAliasValue: '地区风险调整(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '10' },
                    { ItemId: '6', ItemCode: 'LiquidityRiskAdjustment', ItemAliasValue: '流动性风险调整(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '15' },
                    { ItemId: '7', ItemCode: 'StrategicAdjustment', ItemAliasValue: '策略性调整(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    {
                        ItemId: '8', ItemCode: 'PricingMethodology', ItemAliasValue: '转移定价方法', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'StaticStrip', Text: '静态利差法(Static Strip)' }, { Value: 'Duration', Text: '久期法(Duration)' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'PrepaymentAdjustment', ItemAliasValue: '早偿费用定价', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'CompensationFee', Text: '补偿性费用' }, { Value: 'OAS', Text: '期权调整利差法' }]
                    }
                ]
            },
            Buttons: [
                { Text: '计算单笔资产FTP', Click: 'runAssetFTP("Section001Identity")', Class: 'btn btn-primary' },
                { Text: '查看单笔FTP结果', Click: 'viewAssetFTPResult()', Class: 'btn btn-primary' }
            ]
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '资产池批量转移定价',
            Identity: 'Section002Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    {
                        ItemId: '1', ItemCode: 'BatchFTP_AssetType', ItemAliasValue: '资产类别', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'BT', Text: '白条' }, { Value: 'BL', Text: '保理' }]
                    },
                    { ItemId: '2', ItemCode: 'Date', ItemAliasValue: '数据日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'BatchFTP_YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'BatchFTP_RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    { ItemId: '5', ItemCode: 'BatchAreaRiskAdjustment', ItemAliasValue: '地区风险调整(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '10' },
                    { ItemId: '6', ItemCode: 'BatchLiquidityRiskAdjustment', ItemAliasValue: '流动性风险调整(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '15' },
                    { ItemId: '7', ItemCode: 'BatchStrategicAdjustment', ItemAliasValue: '策略性调整(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    {
                        ItemId: '8', ItemCode: 'BatchPricingMethodology', ItemAliasValue: '转移定价方法', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'StaticStrip', Text: '静态利差法(Static Strip)' }, { Value: 'Duration', Text: '久期法(Duration)' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'BatchPrepaymentAdjustment', ItemAliasValue: '早偿费用定价', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'CompensationFee', Text: '补偿性费用' }, { Value: 'OAS', Text: '期权调整利差法' }]
                    }
                ]
            },
            Buttons: [
                { Text: '计算批量资产FTP', Click: 'runBatchAssetFTP("Section002Identity")', Class: 'btn btn-primary' },
                { Text: '查看批量资产FTP', Click: 'viewBatchAssetFTPResult()', Class: 'btn btn-primary' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Individual',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    {
                        ItemId: '1', ItemCode: 'AssetType', ItemAliasValue: 'Asset Type', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'BT', Text: 'Baitiao' }, { Value: 'BL', Text: 'Factoring' }]
                    },
                    { ItemId: '2', ItemCode: 'LoanAccountNo', ItemAliasValue: 'Loan Account NO.', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'FTP_YieldCurve', ItemAliasValue: 'FTP Yield Curve', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'RiskPremium', ItemAliasValue: 'Risk Premium(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    { ItemId: '5', ItemCode: 'AreaRiskAdjustment', ItemAliasValue: 'Area Risk Adjustment(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '10' },
                    { ItemId: '6', ItemCode: 'LiquidityRiskAdjustment', ItemAliasValue: 'Liquidity Risk Adjustment(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '15' },
                    { ItemId: '7', ItemCode: 'StrategicAdjustment', ItemAliasValue: 'Strategic Adjustment(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    {
                        ItemId: '8', ItemCode: 'PricingMethodology', ItemAliasValue: 'Pricing Methodology', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'StaticStrip', Text: 'Static Strip' }, { Value: 'Duration', Text: 'Duration' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'PrepaymentAdjustment', ItemAliasValue: 'Prepayment Adjustment', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'CompensationFee', Text: 'Compensation Fee' }, { Value: 'OAS', Text: 'OAS' }]
                    }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'runAssetFTP("Section001Identity")', Class: 'btn btn-primary' },
                { Text: 'View', Click: 'viewAssetFTPResult()', Class: 'btn btn-primary' }
            ]
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Batch',
            Identity: 'Section002Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    {
                        ItemId: '1', ItemCode: 'BatchAssetType', ItemAliasValue: 'Asset Type', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'BT', Text: 'Baitiao' }, { Value: 'BL', Text: 'Factoring' }]
                    },
                    { ItemId: '2', ItemCode: 'Date', ItemAliasValue: 'Date', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'BatchFTP_YieldCurve', ItemAliasValue: 'FTP Yield Curve', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'BatchRiskPremium', ItemAliasValue: 'Risk Premium(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    { ItemId: '5', ItemCode: 'BatchAreaRiskAdjustment', ItemAliasValue: 'Area Risk Adjustment(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '10' },
                    { ItemId: '6', ItemCode: 'BatchLiquidityRiskAdjustment', ItemAliasValue: 'Liquidity Risk Adjustment(bps)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '15' },
                    { ItemId: '7', ItemCode: 'BatchStrategicAdjustment', ItemAliasValue: 'Strategic Adjustment(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    {
                        ItemId: '8', ItemCode: 'BatchPricingMethodology', ItemAliasValue: 'Pricing Methodology', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'StaticStrip', Text: 'Static Strip' }, { Value: 'Duration', Text: 'Duration' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'BatchPrepaymentAdjustment', ItemAliasValue: 'Prepayment Adjustment', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'CompensationFee', Text: 'Compensation Fee' }, { Value: 'OAS', Text: 'OAS' }]
                    }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'runBatchAssetFTP("Section002Identity")', Class: 'btn btn-primary' },
                { Text: 'View', Click: 'viewBatchAssetFTPResult()', Class: 'btn btn-primary' }
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
            $('#FTP_YieldCurve,#BatchFTP_YieldCurve').append("<option value='" + v.CurveName + "'>" + v.CurveName + "</option>");
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



function runAssetFTP(sectionId) {
    if (!ValidateSectionFields(sectionId)) { return; }
    alert('任务参数有误，需要修改');
    var InstrumentName = $('#AssetType').val();
    var YTM = $('#YTM').val();
    var YieldCurve = $('#YieldCurve').val();
    var SettlementDate = $('#SettlementDate').val();
    var IssueDate = $('#IssueDate').val();
    var RiskPremium = $('#RiskPremium').val();
    var TaskCode = $('#TaskCode').val();

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('InstrumentName', InstrumentName, 'String');
    tpi.AddVariableItem('YTM', YTM, 'String');
    tpi.AddVariableItem('TaskCode', TaskCode, 'String');
    tpi.AddVariableItem('YieldCurve', YieldCurve, 'String');
    tpi.AddVariableItem('SettlementDate', SettlementDate, 'String');
    tpi.AddVariableItem('IssueDate', IssueDate, 'String');
    tpi.AddVariableItem('RiskPremium', RiskPremium, 'String');

    tpi.ShowIndicator('Task', 'CashflowPricing', function () { });
}

function viewAssetFTPResult() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1006");
}

function runBatchAssetFTP(sectionId) {
    if (!ValidateSectionFields(sectionId)) { return; }
    alert('任务参数有误，需要修改');
    var FaceValue = $('#BondPricing_FaceValue').val();
    var Coupon = $('#BondPricing_Coupon').val();
    var YieldCurve = $('#BondPricing_YieldCurve').val();
    var YTM = $('#BondPricing_YTM').val();
    var Frequency = $('#BondPricing_Frequency').val();
    var RiskPremium = $('#BondPricing_RiskPremium').val();
    var Maturity = $('#BondPricing_Maturity').val();

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('FaceValue', FaceValue, 'String');
    tpi.AddVariableItem('Coupon', Coupon, 'String');
    tpi.AddVariableItem('YieldCurve', YieldCurve, 'String');
    tpi.AddVariableItem('YTM', YTM, 'String');
    tpi.AddVariableItem('Frequency', Frequency, 'String');
    tpi.AddVariableItem('Maturity', Maturity, 'String');
    tpi.AddVariableItem('RiskPremium', RiskPremium, 'String');

    tpi.ShowIndicator('Task', 'BondPricing', function () { });
}

function viewBatchAssetFTPResult() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1006");
}

