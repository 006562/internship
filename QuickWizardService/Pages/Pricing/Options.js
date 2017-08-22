/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout-3.4.0.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout.mapping-latest.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />

document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

//Language set name
//var BusinessCode = GlobalVariable.Business_Unique;
//var BusinessIdentifier = 0;
//var PageId = 0;

var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '产生利率路径',
            Identity: 'Section01Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                     {
                         ItemId: '1', ItemCode: 'TaskCode', ItemAliasValue: '现金流模型', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: []
                     },
                    {
                        ItemId: '2', ItemCode: 'CashFlows', ItemAliasValue: '现金流名称 ', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: []
                    },


                    {
                        ItemId: '3', ItemCode: 'YieldCurve', ItemAliasValue: '参考利率曲线', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                       , Options: []
                    },
                    {
                        ItemId: '4', ItemCode: 'Volatility', ItemAliasValue: '波动率曲线', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                    , Options: []
                    },
                    { ItemId: '5', ItemCode: 'RiskPremium', ItemAliasValue: '风险溢价（bps）', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '6.5' },
                    { ItemId: '6', ItemCode: 'TreeName', ItemAliasValue: '树图命名', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '生成利率路径树图', Click: 'RunTask("Section01Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewTreeResult()', Class: 'btn btn-default' },
                { Text: '导出', Click: 'Export()', Class: 'btn btn-default' }
            ]
        }
        , {
            Templ: GlobalVariable.UiTempl_Grid,
            Title: '设置期权',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: true, GridView: [], Detail: [], DetailsTitle: '期权详细信息'
                , InnerText: { Operate: '操作', BtnEdit: '编辑', BtnDelete: '删除', BtnSave: '保存', BtnClear: '清除', BtnRunTask: '资产定价', BtnShowResult: '定价结果' }
            },
            Buttons: [
                 //{ Text: '资产定价', Click: 'Assetpricingoptions()', Class: 'btn btn-default' }
                 //, 
                 { Text: '保存', Click: 'SavePageItems(this)', Class: 'btn btn-primary' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Interest',
            Identity: 'Section01Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                     {
                         ItemId: '1', ItemCode: 'TaskCode', ItemAliasValue: 'discount cash flow', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: []
                     },
                    {
                        ItemId: '2', ItemCode: 'CashFlows', ItemAliasValue: 'The name of the cash flow ', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: []
                    },
                   { ItemId: '3', ItemCode: 'RiskPremium', ItemAliasValue: '（bps）', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '6.5' },
                   { ItemId: '4', ItemCode: 'YieldCurve', ItemAliasValue: 'Interest Rate Curve', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                   { ItemId: '5', ItemCode: 'Volatility', ItemAliasValue: 'Volatility', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                   { ItemId: '6', ItemCode: 'TreeName', ItemAliasValue: 'Tree Name', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'RunTask("Section01Identity")', Class: 'btn btn-primary' },
                { Text: 'Result', Click: 'ViewTreeResult()', Class: 'btn btn-default' },
                { Text: 'Export', Click: 'Export()', Class: 'btn btn-default' }
            ]
        }
        , {
            Templ: GlobalVariable.UiTempl_Grid,
            Title: 'Options',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: true, GridView: [], Detail: [], DetailsTitle: 'Option Details'
                , InnerText: { Operate: 'Operation', BtnEdit: 'Edit', BtnDelete: 'Delete', BtnSave: 'Save', BtnClear: 'Reset' }
            },
            Buttons: [
                { Text: 'Save', Click: 'SavePageItems(this)', Class: 'btn btn-primary' }
            ]
        }]
    },

    Model: function (set) {
        return dataModel[set];
    }
};
var yieldcurvesdatas;
var votilitydatas;
$(function () {
    set = getLanguageSet();
    var gridFields = GetGridViewFields(set);
    PageItemsLoaded(gridFields);
    // get available cashflow models

    //get  Volatility curve name
    var executeParam = { SPName: '[Pricing].[usp_GetVolatilityCurvesName]', SQLParams: [] };
    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        showVolatilityCurves(data);
    });
    // get available pricing curves
    var executeParam = { SPName: '[Pricing].[usp_GetAvailableCurves]', SQLParams: [] };
    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        showCurves(data);
    });

    var executeParam = { SPName: '[Pricing].[usp_GetAvailableModels]', SQLParams: [] };
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        showTrusts(data);
    });
    // get bond names for selected cashflow model
    GetCashflowModelCashflows($('#TaskCode').children('option:selected').val());

    //参考利率曲线
    GetYieldCurve($('#YieldCurve').children('option:selected').val());
    //参考波动率曲线
    GetVolatility($('#Volatility').children('option:selected').val());
    //将曲线画出到界面上
    Show_votilitydatas_And_yieldcurvedatas();
});

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
//获取波动率曲线  的数据
//var votilitydatas;
//var yieldcurvesdatas;
var GetVolatility = function (VolatilityName) {
    var executeParam = { SPName: '[Pricing].[usp_GetVolatilityCurvesData]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'CurvesName', Value: VolatilityName, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        //showSettlementDate(data);
        votilitydatas = data;
    });

}
//获取参考利率曲线 的数据
var GetYieldCurve = function (YieldCurveName) {
    var executeParam = { SPName: '[Pricing].[usp_GetAvailableCurvesData]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'CurveName', Value: YieldCurveName, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        // showSettlementDate(data);
        yieldcurvesdatas = data;
    });
}

var Show_votilitydatas_And_yieldcurvedatas = function () {

    var jsonObject01;//yieldcurvesdatas 收益率曲线
    var jsonObject02;//votilitydatas  波动率曲线
    var jsonArray01 = yieldcurvesdatas;
    var jsonArray02 = votilitydatas;
    //var length01 = jsonArray01.length;
    //var length02 = jsonArray02.length;

    //var 
    //if (length01 > length02) {
    //var max_length
    //}
    if (typeof (jsonArray01) != 'undefined') {
        //tbead  <tr>
        $('#Volatility_YieldCurve').empty();
        var thead;
        thead = "<thead><tr><th>期数：</th>";
        for (var i = 0; i < jsonArray01.length; i++) {
            jsonObject01 = jsonArray01[i];
            thead += "<th>" + jsonObject01.Term + "</th>";
        }
        thead += "</tr></thead>";
        //tbody <tr>
        var tbody_yieldcurves;
        tbody_yieldcurves = "<tbody><tr><th>收益率曲线：</th>";
        for (var i = 0; i < jsonArray01.length; i++) {
            jsonObject01 = jsonArray01[i];
            tbody_yieldcurves += "<th>" + jsonObject01.Rate + "</th>";
        }
        tbody_yieldcurves += "</tr>";

        var thbody_votility;

        thbody_votility = "<tr><th>波动率曲线：</th>";
        for (var i = 0; i < jsonArray02.length; i++) {
            jsonObject02 = jsonArray02[i];
            thbody_votility += "<th>" + jsonObject02.STDEV_RATE + "</th>";
        }
        thbody_votility += "</tr></tbody>";
        $('#Volatility_YieldCurve').append(thead + tbody_yieldcurves + thbody_votility);
    }
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
    var jsonArray = response;
    $('#CashFlows').empty();
    for (var i = 0; i < jsonArray.length; i++) {
        jsonObject = jsonArray[i];
        $('#CashFlows').append("<option value='" + jsonObject.CashflowName + "'>" + jsonObject.DisplayName + "</option>");
    }
}
var showTrusts = function (response) {
    var jsonObject;
    var jsonArray = response
    for (var i = 0; i < jsonArray.length; i++) {
        jsonObject = jsonArray[i];
        $('#TaskCode').append("<option value='" + jsonObject.TaskCode + "'>" + jsonObject.TaskCode + "</option>");
    }
}
var showVolatilityCurves = function (response) {
    var jsonObject;
    var jsonArray = response;
    for (var i = 0; i < jsonArray.length; i++) {
        jsonObject = jsonArray[i];
        $('#Volatility').append("<option value='" + jsonObject.VolatilityCurveName + "'>" + jsonObject.VolatilityCurveName + "</option>");
    }
}
var showSettlementDate = function (response) {
    var jsonObject;
    var jsonArray = response;
    $('#SettlementDate').val(jsonArray[0].SettlementDate);
    $('#IssueDate').val(jsonArray[0].SettlementDate);
}

function GetGridViewFields(lang) {
    var fields;
    switch (lang) {
        case GlobalVariable.Language_CN:
            fields = [
                { ItemId: '1', ItemCode: 'OptionOrder', ItemAliasValue: '期权序号', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
                {
                    ItemId: '2', ItemCode: 'OptionType', ItemAliasValue: '期权类型', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1
                    , Options: [{ Text: '回购', Value: 'Repo' }, { Text: '回售', Value: 'ReverseRepo' }]
                },
                {
                    ItemId: '3', ItemCode: 'TrigerCondition', ItemAliasValue: '触发条件', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1
                    , Options: [{ Text: '<', Value: '<' }, { Text: '<=', Value: '<=' }, { Text: '=', Value: '=' }, { Text: '>', Value: '>' }, { Text: '>=', Value: '>=' }]
                },
                { ItemId: '4', ItemCode: 'TrigerRate', ItemAliasValue: '触发利率', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
                {
                    ItemId: '5', ItemCode: 'TrigerCondition1', ItemAliasValue: '触发条件', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1
                    , Options: [{ Text: '<', Value: '<' }, { Text: '<=', Value: '<=' }, { Text: '=', Value: '=' }, { Text: '>', Value: '>' }, { Text: '>=', Value: '>=' }]
                },
                { ItemId: '6', ItemCode: 'NewDate', ItemAliasValue: '行权日期', DataType: 'date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
                { ItemId: '7', ItemCode: 'NewPrice', ItemAliasValue: '行权价格', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
            ];
            break;
        case GlobalVariable.Language_EN:
            fields = [
                { ItemId: '1', ItemCode: 'OptionOrder', ItemAliasValue: 'Option Order', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
                {
                    ItemId: '2', ItemCode: 'OptionType', ItemAliasValue: 'Option Type', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1
                    , Options: [{ Text: 'Repo', Value: 'Repo' }, { Text: 'Reverse Repo', Value: 'ReverseRepo' }]
                },
                {
                    ItemId: '3', ItemCode: 'TrigerCondition', ItemAliasValue: 'Triger Condition', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1
                    , Options: [{ Text: '<', Value: '<' }, { Text: '<=', Value: '<=' }, { Text: '=', Value: '=' }, { Text: '>', Value: '>' }, { Text: '>=', Value: '>=' }]
                },
                { ItemId: '4', ItemCode: 'TrigerRate', ItemAliasValue: 'Triger Rate', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
                {
                    ItemId: '5', ItemCode: 'TrigerCondition1', ItemAliasValue: 'Triger Condition', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1
                    , Options: [{ Text: '<', Value: '<' }, { Text: '<=', Value: '<=' }, { Text: '=', Value: '=' }, { Text: '>', Value: '>' }, { Text: '>=', Value: '>=' }]
                },
                { ItemId: '6', ItemCode: 'NewDate', ItemAliasValue: 'New Date', DataType: 'date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
                { ItemId: '7', ItemCode: 'NewPrice', ItemAliasValue: 'New Price', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '', Bit01: 1 },
            ];
            break;
        default:
            fields = [];
            break;
    }
    return fields;
}

function PageItemsLoaded(items) {
    gdvOperation.SortSourceData(items, 1);

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));


    $(document.body).on('change', '#TaskCode', function () {
        var p1 = $(this).children('option:selected').val();
        GetCashflowModelCashflows(p1);
    });
    //for  参考利率曲线

    $(document.body).on('change', '#YieldCurve', function () {
        var p1 = $(this).children('option:selected').val();
        GetYieldCurve(p1);
        Show_votilitydatas_And_yieldcurvedatas();
    });
    //for  参考波动曲线

    $(document.body).on('change', '#Volatility', function () {
        var p1 = $(this).children('option:selected').val();
        GetVolatility(p1);
        Show_votilitydatas_And_yieldcurvedatas();
    });

    setFieldPlugins();
    $('#loading').fadeOut();
}
function setFieldPlugins() {
    $("#page_main_container").find('.date-plugins').date_input();
}

function ValidateSectionFields(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    return validControls(sectionFieldsSelector);
}
function SavePageItems(obj) {
    alert('All fields are defined on page, so currently no save process will run. ');
    return;
    var standItems = sdvOperation.GetItems(0);
    var gridItems = gdvOperation.GetItems(1);

    var allItems = standItems.concat(gridItems);

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


//***********//GridViews Data Sort and UI Operation Events//***********//
var gdvsGridSetting = {};
var gdvOperation = {
    SortSourceData: function (items, sectionIndex) {
        var model = dataModel.Model(set).Sections[sectionIndex].FieldsSetting;
        var go = true;
        var rowId = 0;
        var details = null;
        while (go) {
            var row = $.grep(items, function (trustItem) {
                return trustItem.GroupId01 == rowId;
            });

            if (row.length == 0) {
                //当tbid=0时，row.length == 0，说明返回的只有模板
                if (details == null) {
                    details = items;
                }
                go = false;
            } else {
                if (details == null) {
                    details = row;
                }
                row = row.sort(function (a, b) {
                    return parseInt(a.SequenceNo) - parseInt(b.SequenceNo)
                });

                var gridItem = {};
                $.each(row, function (i, d) {
                    gridItem[d.ItemCode] = d.ItemValue;
                    if (d.DataType == "Select") {
                        var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                        gridItem[d.ItemCode + "_Text"] = item.ItemAliasValue;
                    } else if (d.DataType == "Decimal") {
                        gridItem[d.ItemCode + "_Text"] = getMoneyText(d.ItemValue, set);
                    }
                });
                model.GridView.push(gridItem);
            }
            rowId++;
        }

        var gColumns = [];
        var gCodeIds = {};
        $.each(details, function (i, d) {
            d.ItemValue = '';
            if (d.Bit01) {//IsInGrid
                gColumns.push(d);
            }
            if (!d.IsCompulsory) {//IsOptional
                d.IsDisplay = 0;
            }

            gCodeIds[d.ItemCode] = d.ItemId;
            model.Detail.push(d);
        });
        gdvsGridSetting[sectionIndex] = { gridColumns: gColumns, gridCodeIds: gCodeIds };
    },
    AddOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var selSelector = '#' + sectionId + ' .gdv-optionalfields-select';
        var itemIndex = $(selSelector).val();
        if (!itemIndex) return;

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Detail()[itemIndex];
        item.IsDisplay(true);
        setFieldPlugins();
    },
    RemoveOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');

        var itemIndex = $(obj).attr('itemIndex');

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Detail()[itemIndex];
        item.ItemValue('');
        item.IsDisplay(false);
    },
    Save: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        if (!ValidateSectionFields(sectionId)) return;

        var btnSaveSelector = '#' + sectionId + ' .gdv-detail-btnSave';
        var editIndex = $(btnSaveSelector).attr('editIndex');

        if (editIndex && editIndex != -1) {
            //Edit Existed
            this.Update(sectionIndex, editIndex);
        } else {
            //New Add
            var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
            var newItem = {};
            $.each(detail, function (i, item) {
                var code = item.ItemCode();
                if (item.DataType() == "Select") {
                    var text = $("#" + code).find("option:selected").text();
                    newItem[code + '_Text'] = text;
                } else if (item.DataType() == "Decimal") {
                    newItem[code + '_Text'] = getMoneyText(item.ItemValue(), set);
                }

                newItem[item.ItemCode()] = item.ItemValue();
            });

            newItem = ko.mapping.fromJS(newItem);
            viewModel.Sections()[sectionIndex].FieldsSetting.GridView.push(newItem);

            this.InitDetail(sectionIndex);
        }
        $(btnSaveSelector).attr('editIndex', -1);
    },
    Clear: function (obj) {
        var sectionIndex;
        if (isNaN(obj)) {
            var $section = $(obj).parents('.main-section');
            sectionIndex = $section.attr('sectionIndex');
        } else { sectionIndex = obj; }

        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
        $.each(detail, function (i, item) {
            var dataType = item.DataType().toLocaleLowerCase();
            if (dataType == "bool") {
                item.ItemValue("0");
            } else {
                if (dataType != "select") {
                    item.ItemValue("");
                }
            }
        });
    },
    Detail: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var editIndex = $(obj).attr('itemIndex');

        var btnSaveSelector = '#' + sectionId + ' .gdv-detail-btnSave';
        $(btnSaveSelector).attr('editIndex', editIndex);

        this.InitDetail(sectionIndex);

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[editIndex];
        for (var key in item) {
            //key就是ItemCode
            var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
            $.each(detail, function (i, d) {
                if (d.ItemCode() == key) {
                    var itemValue = item[key]();
                    if (itemValue != "") {
                        d.ItemValue(itemValue);
                        d.IsDisplay(true);
                    }
                }
            })
        }

        setFieldPlugins();
    },
    Update: function (sectionIndex, editIndex) {
        var item = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[editIndex];//里面包含所有属性
        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
        $.each(detail, function (i, d) {
            var code = d.ItemCode();
            item[code](d.ItemValue());
            if (d.DataType() == "Select") {
                var text_s = $("#" + code).find("option:selected").text();
                item[d.ItemCode() + '_Text'](text_s);
            } else if (d.DataType() == "Decimal") {
                var text_d = getMoneyText(d.ItemValue(), set);
                item[d.ItemCode() + '_Text'](text_d);
            }
        })
        this.InitDetail(sectionIndex);
    },
    Delete: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var index = $(obj).attr('itemIndex');
        var oNew = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[index];
        viewModel.Sections()[sectionIndex].FieldsSetting.GridView.remove(oNew);

        var btnSaveSelector = '#' + sectionId + ' .gdv-detail-btnSave';
        $(btnSaveSelector).attr('editIndex', -1);

        this.InitDetail(sectionIndex);
    },
    InitDetail: function (sectionIndex) {
        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();

        $.each(detail, function (i, item) {
            item.ItemValue("");
            if (!item.IsCompulsory()) {//IsOptional
                item.IsDisplay(false);
            }
        });

        setFieldPlugins();
    },
    GetItems: function (sectionIndex) {
        var array = [];
        var gCodeIds = gdvsGridSetting[sectionIndex].gridCodeIds;
        var gridViewData = viewModel.Sections()[sectionIndex].FieldsSetting.GridView();
        $.each(gridViewData, function (i, data) {
            for (field in data) {
                var itemId = gCodeIds[field];
                if (itemId) {
                    var item = {};
                    item.ItemId = itemId;
                    item.ItemValue = data[field]();
                    item.SectionIndex = sectionIndex;
                    item.GroupId01 = i;
                    array.push(item);
                }
            }
        });
        return array;
    }
};
////Konckout Rendering Plugin Register----for GridView display////
ko.bindingHandlers.renderGridHeader = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var header = valueAccessor();
        var sectionIndex = allBindings.get('sectionIndex');
        var html = '';

        var gColumns = gdvsGridSetting[sectionIndex].gridColumns;
        $.each(gColumns, function (i, item) {
            html += '<th>' + item.ItemAliasValue + '</th>';
        });

        html += '<th>' + header + '</th>';
        $(html).appendTo($(element));
    }
}
ko.bindingHandlers.renderGridColumn = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var displayText = valueAccessor();
        var sectionIndex = allBindings.get('sectionIndex');
        var html = '';

        var gColumns = gdvsGridSetting[sectionIndex].gridColumns;
        $.each(gColumns, function (i, item) {
            var code = item.ItemCode;
            if (item.DataType == "Select" || item.DataType == "Decimal") {
                code = code + "_Text";
            }

            html += '<td  data-bind="text: ' + code + '"></td>';
        });
        html += '<td class="btn-group-sm">';
        html += '<input type="button" class="btn btn-primary btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Detail(this)" value="' + displayText.BtnEdit() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-danger btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Delete(this)" value="' + displayText.BtnDelete() + '"//>';
        html += '</td>';
        $(html).appendTo($(element));
    }
}


function RunTask(sectionId) {
    //if (!ValidateSectionFields(sectionId)) { return; }

    var TreeName = $('#TreeName').val();

    var jsonObject01;//yieldcurvesdatas 收益率曲线
    var jsonObject02;//votilitydatas  波动率曲线
    var jsonArray01 = yieldcurvesdatas;
    var jsonArray02 = votilitydatas;
    var YieldCurve = '';
    var Volatility = '';

    if (typeof (jsonArray01) != 'undefined') {
        //tbead  <tr>
        for (var i = 0; i < jsonArray01.length - 1; i++) {
            jsonObject01 = jsonArray01[i];
            YieldCurve += jsonObject01.Rate / 100 + ";";
        }
        jsonObject01 = jsonArray01[jsonArray01.length - 1];
        YieldCurve += jsonObject01.Rate / 100;

        for (var i = 0; i < jsonArray02.length - 1; i++) {
            jsonObject02 = jsonArray02[i];
            Volatility += jsonObject02.STDEV_RATE / 10 + ";";
        }
        jsonObject02 = jsonArray02[jsonArray02.length - 1];
        Volatility += jsonObject02.STDEV_RATE / 10;
    }


    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('RouteSetName', TreeName, 'String');
    tpi.AddVariableItem('Yields', YieldCurve, 'String');
    tpi.AddVariableItem('Volatilities', Volatility, 'String');

    tpi.ShowIndicator('Task', 'Get_RateTree', function () { });
}

function ViewTreeResult() {
    var TreeName = $('#TreeName').val();
    top.GSDialog.Open('&nbsp;&nbsp;&nbsp;&nbsp;', 'Pages/Pricing/TreeDialog.html?TreeName=' + TreeName, null, null, 900, 560);
}
function Assetpricingoptions() {
    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('Parame', 'test', 'String');
    tpi.ShowIndicator('Task', 'AssetPricingOptions', function () { });
}
function ShowResult() {
    var num = Math.random();
    var kl = 100;

    var num1 = 100;

    var newprice = $('#NewPrice').val();
    if (typeof (newprice) != 'undefined') {
        num1 = newprice;
        num1 = num1 * (1 + num / 10);

        $('#ShowResults').val(num1);
    } else {

        $('#ShowResults').val('0');
    }


}

