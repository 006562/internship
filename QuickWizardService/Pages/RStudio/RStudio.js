document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '历史数据采样',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'DataSetName', ItemAliasValue: '数据集', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: 'ConsumerLoan' },
                    { ItemId: '2', ItemCode: 'NumOfSamples', ItemAliasValue: '采样次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '2000' },
                    { ItemId: '3', ItemCode: 'DistributionStart', ItemAliasValue: '分布区间(起始)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '0' },
                    { ItemId: '4', ItemCode: 'DistributionEnd', ItemAliasValue: '分布区间(终止)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '1' },
                    {
                        ItemId: '5', ItemCode: 'OutputFunction', ItemAliasValue: '输出函数', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'y=1/(1+x)', Text: 'y=1/(1+x)' }, { Value: 'y=x^2', Text: 'y=x^2' }, { Value: 'y=x', Text: 'y=x' }]
                    }
                ]
            },
            Buttons: [
                { Text: '运行', Click: 'runMonteCarlo("Section001Identity")', Class: 'btn btn-primary' },
                { Text: '查看', Click: 'viewMonteCarlo()', Class: 'btn btn-default' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Historical Sampling',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'DataSetName', ItemAliasValue: 'DataSet Name', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: 'ConsumerLoan' },
                    { ItemId: '2', ItemCode: 'NumOfSamples', ItemAliasValue: 'Number of Samples', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '2000' },
                    { ItemId: '3', ItemCode: 'DistributionStart', ItemAliasValue: 'Distribution Start', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '0' },
                    { ItemId: '4', ItemCode: 'DistributionEnd', ItemAliasValue: 'Distribution End', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '1' },
                    {
                        ItemId: '5', ItemCode: 'OutputFunction', ItemAliasValue: 'Output Function', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'y=1/(1+x)', Text: 'y=1/(1+x)' }, { Value: 'y=x^2', Text: 'y=x^2' }, { Value: 'y=x', Text: 'y=x' }]
                    }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'runMonteCarlo("Section001Identity")', Class: 'btn btn-primary' },
                { Text: 'View', Click: 'viewMonteCarlo()', Class: 'btn btn-default' }
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


function viewMonteCarlo() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1007");
    //window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1007");
}

function runMonteCarlo(sectionId) {
    if (!ValidateSectionFields(sectionId)) return;

    var dataSetName = $('#DataSetName').val();
    var numOfSamples = $('#NumOfSamples').val();
    var distributionStart = $('#DistributionStart').val();
    var distributionEnd = $('#DistributionEnd').val();
    var numOfBuckets = $('#NumOfBuckets').val();
    var outputFunction = $('#OutputFunction').val();

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('DataSetName', dataSetName, 'string');
    tpi.AddVariableItem('NumOfSamples', numOfSamples, 'string');
    tpi.AddVariableItem('DistributionStart', distributionStart, 'string');
    tpi.AddVariableItem('DistributionEnd', distributionEnd, 'string');
    tpi.AddVariableItem('NumOfBuckets', numOfBuckets, 'string');
    tpi.AddVariableItem('OutputFunction', outputFunction, 'string');

    tpi.ShowIndicator('Task', 'RunRScriptDemo', function () {
        //window.location.reload();
    });
}
