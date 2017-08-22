/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/renderControl.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />

var BusinessCode = GlobalVariable.Business_Unique;
var BusinessIdentifier = '0';
var PageId = 27;
var set;

var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '参数设置',
            Identity: 'sectionId001',
            FieldsSetting: { HasOptionalFields: false, Fields: []},
            Buttons: [
                { Text: '生成', Click: 'SavePageItems("sectionId001")', Class: 'btn btn-primary' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Parameters Setting',
            Identity: 'sectionId001',
            FieldsSetting: { HasOptionalFields: false, Fields: [] },
            Buttons: [
                { Text: 'Generate', Click: 'SavePageItems("sectionId001")', Class: 'btn btn-primary' }
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
        if (pop != null) {
            pop.close();
            pop = mac.complete("Saved Successfully!");
        }

        RunGenerateDB();
    });
}

function RunGenerateDB() {
    var assetType;
    var selValue = $('#DBType').val();
    switch (selValue) {
        case '25006':
            assetType = 'BaiTiao';
            break;
        case '25007':
            assetType = 'Loarn Factory';
            break;
        default:
            break;
    }
    var dateNow = (new Date()).dateFormat('yyyy-MM-dd_HH:mm:ss');

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('CreateDate', dateNow, 'string');
    tpi.AddVariableItem('AssetType', assetType, 'string');

    tpi.ShowIndicator('Task', 'GenerateDALDatabasesByType', function () {
        //window.location.reload();
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

