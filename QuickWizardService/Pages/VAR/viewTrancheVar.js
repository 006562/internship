/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />

document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var BusinessCode = GlobalVariable.Business_Unique;
var BusinessIdentifier = '0';
var PageId = 17;
var set;

var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '分层信息',
            Identity: 'sectionId001',
            FieldsSetting: { HasOptionalFields: true, Fields: [] },
            Buttons: []
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '发行金额',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '1', ItemCode: 'OfferAmount', ItemAliasValue: '发行金额', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '保存', Click: 'SavePageItems()', Class: 'btn btn-primary' },
                { Text: '运行', Click: 'CalculateVAR_Run()', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'View()', Class: 'btn btn-default' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Pool Setting',
            Identity: 'sectionId001',
            FieldsSetting: { HasOptionalFields: true, Fields: [] },
            Buttons: []
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Offer Amount',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '1', ItemCode: 'OfferAmount', ItemAliasValue: 'Offer Amount', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Save', Click: 'SavePageItems()', Class: 'btn btn-primary' },
                { Text: 'Run', Click: 'CalculateVAR_Run()', Class: 'btn btn-primary' },
                { Text: 'View', Click: 'View()', Class: 'btn btn-default' }
            ]
        }]
    },

    Model: function (set) {
        return dataModel[set];
    }
};

$(function () {

    set = getLanguageSet();
    DataOperate.getPageData(BusinessCode, BusinessIdentifier, PageId, set, PageItemsLoaded);
});

function PageItemsLoaded(items) {
    sdvOperation.SortSourceData(items, 0);

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    DataOperate.getTrustOfferAmount(BusinessIdentifier, function (response) {
        var jsonArray = eval(response);

        $('#OfferAmount').val(jsonArray[0].IssueAmount);
    });

    setFieldPlugins();
    $('#loading').fadeOut();
}
function setFieldPlugins() {
    $('.date-plugins').date_input();
}

function ValidateSectionFields(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    return validControls(sectionFieldsSelector);
}
function SavePageItems(sectionId) {
    if (!ValidateSectionFields(sectionId)) return;

    var items = sdvOperation.GetItems(0);

    var pop = mac.wait("Data Saving");
    DataOperate.savePageData(BusinessCode, BusinessIdentifier, PageId, items, function (result) {
        pageStorage.Set('dsSessionId', result.OutSessionId);
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


function CalculateVAR_Run() {
    var OfferAmount = $('#OfferAmount').val();
    var businessId = pageStorage.Get('dsSessionId');

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('OfferAmount', OfferAmount, 'String');
    tpi.AddVariableItem('BusinessId', businessId, 'String');

    tpi.ShowIndicator('Task', 'CalculateValueAtRisk', function () { });
}

function View() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1000");
    //window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1000")	
}
