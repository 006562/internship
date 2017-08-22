
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
                    {
                        ItemId: '1', ItemCode: 'PriorDistribution', ItemAliasValue: '先验分布', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Text: 'Bell Curve', Value: 'Normal' }, { Text: 'LogNormal', Value: 'LogNormal' }]
                    },
                    { ItemId: '1', ItemCode: 'Param1', ItemAliasValue: '参数1', DataType: '', IsCompulsory: 0, IsDisplay: 1, ItemValue: '0.3' },
                    { ItemId: '1', ItemCode: 'Param2', ItemAliasValue: '参数2', DataType: '', IsCompulsory: 0, IsDisplay: 1, ItemValue: '0.1' },
                    { ItemId: '2', ItemCode: 'NumOfSamples', ItemAliasValue: '采样次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '2000' },
                    { ItemId: '3', ItemCode: 'DistributionStart', ItemAliasValue: '分布区间(起始)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '-0.2' },
                    { ItemId: '4', ItemCode: 'DistributionEnd', ItemAliasValue: '分布区间(终止)', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '0.8' },
                    { ItemId: '5', ItemCode: 'NumOfBuckets', ItemAliasValue: '分布区间数', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '400' },
                    {
                        ItemId: '6', ItemCode: 'OutputFunction', ItemAliasValue: '输出函数', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
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
            Title: 'Parametric Sampling',
            Identity: 'Section001Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    {
                        ItemId: '1', ItemCode: 'PriorDistribution', ItemAliasValue: 'Prior Distribution', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Text: 'Bell Curve', Value: 'Normal' }, { Text: 'LogNormal', Value: 'LogNormal' }]
                    },
                    { ItemId: '1', ItemCode: 'Param1', ItemAliasValue: 'Param1', DataType: '', IsCompulsory: 0, IsDisplay: 1, ItemValue: '0.3' },
                    { ItemId: '1', ItemCode: 'Param2', ItemAliasValue: 'Param2', DataType: '', IsCompulsory: 0, IsDisplay: 1, ItemValue: '0.1' },
                    { ItemId: '2', ItemCode: 'NumOfSamples', ItemAliasValue: 'Number of Samples', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '2000' },
                    { ItemId: '3', ItemCode: 'DistributionStart', ItemAliasValue: 'Distribution Start', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '-0.2' },
                    { ItemId: '4', ItemCode: 'DistributionEnd', ItemAliasValue: 'Distribution End', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '0.8' },
                    { ItemId: '5', ItemCode: 'NumOfBuckets', ItemAliasValue: 'Numer of Buckets', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '400' },
                    {
                        ItemId: '6', ItemCode: 'OutputFunction', ItemAliasValue: 'Output Function', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
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

function runMonteCarlo(sectionId) {
    if (!ValidateSectionFields(sectionId)) return;

	var priorDistribution =$('#PriorDistribution').val();
	var numOfSamples =$('#NumOfSamples').val();
    var distributionStart = $('#DistributionStart').val();
    var distributionEnd = $('#DistributionEnd').val();
    var numOfBuckets = $('#NumOfBuckets').val();
    var outputFunction = $('#OutputFunction').val();
    var param1 = $('#Param1').val();
    var param2 = $('#Param2').val();

    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('PriorDistribution', priorDistribution, 'string', 0, 0, 0);
    tpi.AddVariableItem('NumOfSamples', numOfSamples, 'string', 0, 0, 0);
    tpi.AddVariableItem('DistributionStart', distributionStart, 'string', 0, 0, 0);
    tpi.AddVariableItem('DistributionEnd', distributionEnd, 'string', 0, 0, 0);
    tpi.AddVariableItem('NumOfBuckets', numOfBuckets, 'string', 0, 0, 0);
    tpi.AddVariableItem('OutputFunction', outputFunction, 'string', 0, 0, 0);
    tpi.AddVariableItem('Param1', param1, 'string', 0, 0, 0);
    tpi.AddVariableItem('Param2', param2, 'string', 0, 0, 0);

    tpi.ShowIndicator('Task', 'MonteCarloParam', function () {
        //window.location.reload();
    });
}

function viewMonteCarlo(){
	window.open(location.protocol + '//' + location.host+"/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1008");
	//window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1008");
}
