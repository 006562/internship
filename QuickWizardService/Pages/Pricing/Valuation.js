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
            Title: '现金流定价',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'TaskCode', ItemAliasValue: '现金流模型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'Cashflows', ItemAliasValue: '现金流名称', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'YTM', ItemAliasValue: '预期收益率%(年化)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '6.5' },

                    { ItemId: '4', ItemCode: 'YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'IssueDate', ItemAliasValue: '发行日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'SettlementDate', ItemAliasValue: '交割日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '7', ItemCode: 'RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    {
                        ItemId: '8', ItemCode: 'InterpolationMethod1', ItemAliasValue: '插值方式', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'Linear', Text: '线性插值' }, { Value: 'Cubic', Text: '立方插值' }, { Value: 'MCS', Text: '单调三次方样条插值' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'DayCountConvention1', ItemAliasValue: '计日规则', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: '30/360', Text: '30/360' }, { Value: 'Actual/360', Text: 'Actual/360' }, { Value: 'Actual/365', Text: 'Actual/365' }, { Value: 'Actual/Actual', Text: 'Actual/Actual' }]
                    },
                    { ItemId: '10', ItemCode: 'UseInteresSimulation', ItemAliasValue: '使用利率路径模拟', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '11', ItemCode: 'UseOptionsSimulation', ItemAliasValue: '使用期权设定', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '12', ItemCode: 'SimulationTimes', ItemAliasValue: '蒙特卡罗模拟次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                //{ Text: '上传文件', Click: 'uploadFile()', Class: 'btn btn-primary' },
                { Text: '计算现金流定价', Click: 'runPricing("RiskFunctionEstimation")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'viewPricingResult()', Class: 'btn btn-default' }
            ]
        }, {
            //show: false,
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '现金流定价',
            Identity: 'Section002Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'BondPricing_FaceValue', ItemAliasValue: '面值', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '100' },
                    { ItemId: '2', ItemCode: 'BondPricing_Coupon', ItemAliasValue: '年化票面利率%', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '9.0' },
                    { ItemId: '3', ItemCode: 'BondPricing_Frequency', ItemAliasValue: '年付息次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '2' },

                    { ItemId: '4', ItemCode: 'BondPricing_Maturity', ItemAliasValue: '期限(年)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '4' },
                    { ItemId: '5', ItemCode: 'BondPricing_YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '7', ItemCode: 'BondPricing_RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '25' },
                    { ItemId: '6', ItemCode: 'BondPricing_YTM', ItemAliasValue: '预期收益率%(年化)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '6.5' },
                    {
                        ItemId: '8', ItemCode: 'InterpolationMethod2', ItemAliasValue: '插值方式', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'Linear', Text: '线性插值' }, { Value: 'Cubic', Text: '立方插值' }, { Value: 'MCS', Text: '单调三次方样条插值' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'DayCountConvention2', ItemAliasValue: '计日规则', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: '30/360', Text: '30/360' }, { Value: 'Actual/360', Text: 'Actual/360' }, { Value: 'Actual/365', Text: 'Actual/365' }, { Value: 'Actual/Actual', Text: 'Actual/Actual' }]
                    },
                    { ItemId: '10', ItemCode: 'UseInteresSimulation', ItemAliasValue: '使用利率路径模拟', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '11', ItemCode: 'UseOptionsSimulation', ItemAliasValue: '使用期权设定', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '12', ItemCode: 'SimulationTimes', ItemAliasValue: '蒙特卡罗模拟次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '计算债券定价', Click: 'runBondPricing("Section002Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'viewBondPricingResult()', Class: 'btn btn-default' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '现金流定价',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'TaskCode', ItemAliasValue: '现金流模型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'Cashflows', ItemAliasValue: '现金流名称', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'YTM', ItemAliasValue: '预期收益率%(年化)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },

                    { ItemId: '4', ItemCode: 'YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'IssueDate', ItemAliasValue: '发行日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'SettlementDate', ItemAliasValue: '交割日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '7', ItemCode: 'RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    {
                        ItemId: '8', ItemCode: 'InterpolationMethod1', ItemAliasValue: '插值方式', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'Linear', Text: '线性插值' }, { Value: 'Cubic', Text: '立方插值' }, { Value: 'MCS', Text: '单调三次方样条插值' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'DayCountConvention1', ItemAliasValue: '计价规则', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: '30/360', Text: '30/360' }, { Value: 'Actual/360', Text: 'Actual/360' }, { Value: 'Actual/365', Text: 'Actual/365' }, { Value: 'Actual/Actual', Text: 'Actual/Actual' }]
                    },
                    { ItemId: '10', ItemCode: 'UseInteresSimulation', ItemAliasValue: '使用利率路径模拟', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '11', ItemCode: 'UseOptionsSimulation', ItemAliasValue: '使用期权设定', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '12', ItemCode: 'SimulationTimes', ItemAliasValue: '蒙特卡罗模拟次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                //{ Text: '选择文件', Click: 'chooseFile()', Class: 'btn btn-primary' },
                //{ Text: '上传文件', Click: 'uploadFile()', Class: 'btn btn-primary' },
                { Text: '计算现金流定价', Click: 'runPricing("Section001Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'viewPricingResult()', Class: 'btn btn-default' }
            ]
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '现金流定价',
            Identity: 'Section002Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'BondPricing_FaceValue', ItemAliasValue: '面值', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'BondPricing_Coupon', ItemAliasValue: '年化票面利率%', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'BondPricing_Frequency', ItemAliasValue: '年付息次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },

                    { ItemId: '4', ItemCode: 'BondPricing_Maturity', ItemAliasValue: '期限(年)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'BondPricing_YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '7', ItemCode: 'BondPricing_RiskPremium', ItemAliasValue: '风险溢价(bps)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'BondPricing_YTM', ItemAliasValue: '预期收益率%(年化)', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    {
                        ItemId: '8', ItemCode: 'InterpolationMethod2', ItemAliasValue: '插值方式', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'Linear', Text: '线性插值' }, { Value: 'Cubic', Text: '立方插值' }, { Value: 'MCS', Text: '单调三次方样条插值' }]
                    },
                    {
                        ItemId: '9', ItemCode: 'DayCountConvention2', ItemAliasValue: '计价规则', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: '30/360', Text: '30/360' }, { Value: 'Actual/360', Text: 'Actual/360' }, { Value: 'Actual/365', Text: 'Actual/365' }, { Value: 'Actual/Actual', Text: 'Actual/Actual' }]
                    },
                    { ItemId: '10', ItemCode: 'UseInteresSimulation', ItemAliasValue: '使用利率路径模拟', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '11', ItemCode: 'UseOptionsSimulation', ItemAliasValue: '使用期权设定', DataType: 'bool', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '12', ItemCode: 'SimulationTimes', ItemAliasValue: '蒙特卡罗模拟次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '计算债券定价', Click: 'runBondPricing("Section002Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'viewBondPricingResult()', Class: 'btn btn-default' }
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

    $(document.body).on('change','#TaskCode',function(){
        var p1 = $(this).children('option:selected').val();
        GetCashflowModelCashflows(p1);
    });
    $(document.body).on('change','#Cashflows',function(){
        var p1 = $('#TaskCode').children('option:selected').val();
        var p2 = $(this).children('option:selected').val();
        GetBondSettlementDate(p1, p2);
    });

    var executeParam = { SPName: '[Pricing].[usp_GetAvailableModels]', SQLParams: [] };
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        showTrusts(data);
    });

    // get bond names for selected cashflow model
    GetCashflowModelCashflows($('#TaskCode').children('option:selected').val());
    GetBondSettlementDate($('#TaskCode').children('option:selected').val(), $('#Cashflows').children('option:selected').val());

    // get available pricing curves
    executeParam = { SPName: '[Pricing].[usp_GetAvailableCurves]', SQLParams: [] };
    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        showCurves(data);
    });

    setFieldPlugins();
    $('#loading').fadeOut();
}

var GetCashflowModelCashflows = function (taskCode) {
    var executeParam = { SPName: '[Pricing].[usp_GetCashflowModelCashflows]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TaskCode', Value: taskCode, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        showCashflows(data);
    });
}

var GetBondSettlementDate = function (taskCode, bondName) {
    var executeParam = { SPName: '[Pricing].[usp_GetBondSettlementDate]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TaskCode', Value: taskCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'BondName', Value: bondName, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        showSettlementDate(data);
    });
}


//显示该页下拉列表
var showCurves = function (response) {
    var jsonObject;
    var jsonArray = eval(response);
    for (var i = 0; i < jsonArray.length; i++) {
        jsonObject = jsonArray[i];
        $('#BondPricing_YieldCurve').append("<option value='" + jsonObject.CurveName + "'>" + jsonObject.CurveName + "</option>");
        $('#YieldCurve').append("<option value='" + jsonObject.CurveName + "'>" + jsonObject.CurveName + "</option>");
    }
}
var showCashflows = function (response) {
    var jsonObject;
    var jsonArray = eval(response);
    $('#Cashflows').empty();
    for (var i = 0; i < jsonArray.length; i++) {
        jsonObject = jsonArray[i];
        $('#Cashflows').append("<option value='" + jsonObject.CashflowName + "'>" + jsonObject.DisplayName + "</option>");
    }
}
var showTrusts = function (response) {
    var jsonObject;
    var jsonArray = eval(response);
    for (var i = 0; i < jsonArray.length; i++) {
        jsonObject = jsonArray[i];
        $('#TaskCode').append("<option value='" + jsonObject.TaskCode + "'>" + jsonObject.TaskCode + "</option>");
    }
}
var showSettlementDate = function (response) {
    var jsonObject;
    var jsonArray = eval(response);
    $('#SettlementDate').val(jsonArray[0].SettlementDate);
    $('#IssueDate').val(jsonArray[0].SettlementDate);
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

function runPricing(sectionId) {
    if (!ValidateSectionFields(sectionId)) { return; }

    var InstrumentName = $('#Cashflows').val();
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

function viewPricingResult() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1006");
}

function runBondPricing(sectionId) {
    if (!ValidateSectionFields(sectionId)) { return; }

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

function viewBondPricingResult() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1006");
}

function uploadFile() {
    var filePath = $('#fileInput').val();
    var fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);

    if (typeof filePath === 'undefined' || filePath == '') {
        alert('请先选择文件！');
        return;
    }

    var fileCtrlId = 'fileInput';
    filePath = 'E:\\TSSWCFServices\\QuickWizardUpload\\Pricing\\';

    UploadFile(fileCtrlId, fileName, filePath, function() {
        var tpi = new top.TaskProcessIndicatorHelper();
        tpi.AddVariableItem('FilePath', filePath, 'String');
        tpi.AddVariableItem('FileName', fileName, 'String');

        tpi.ShowIndicator('Task', 'BondPricing', function () { });
    });
}
