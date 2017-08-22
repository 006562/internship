
var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;
var PageId = 11;
var set;

var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '参数设置',
            Identity: 'sectionId001',
            FieldsSetting: { HasOptionalFields: true, Fields: [] },
            Buttons: [
                { Text: '保存信息', Click: 'SavePageItems("sectionId001")', Class: 'btn btn-primary' }
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
    BusinessIdentifier = getQueryString("id");
    if (!BusinessIdentifier) {
        alert('Business Identifier is Required!');
        return;
    }

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
    $("#page_main_container").find('.date-plugins').date_input();
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
