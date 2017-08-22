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
            Title: '动态池分析',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    //{ ItemId: '2', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    //{ ItemId: '1', ItemCode: 'Start', ItemAliasValue: '开始时间', DataType: 'date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    //{ ItemId: '2', ItemCode: 'End', ItemAliasValue: '结束时间', DataType: 'date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'OrganisationCode', ItemAliasValue: '资产来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                //{ Text: '生成模板', Click: 'GenerateTemplate("Section0Identity")', Class: 'btn btn-primary' },
                { Text: '下载模板', Click: 'Download()', Class: 'btn btn-primary' },
                { Text: '上传数据', Click: 'OpenUpload()', Class: 'btn btn-primary' },
                { Text: '查看动态池', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Dynamic Pool Analysis',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    //{ ItemId: '1', ItemCode: 'Start', ItemAliasValue: 'Start Date', DataType: 'date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    //{ ItemId: '2', ItemCode: 'End', ItemAliasValue: 'End Date', DataType: 'date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'OrganisationCode', ItemAliasValue: 'Asset Source', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                //{ Text: 'Generate Dynamic Pool Template', Click: 'GenerateTemplate("Section0Identity")', Class: 'btn btn-primary' },
                //{ Text: 'Download Dynamic Pool Excel', Click: 'Download()', Class: 'btn btn-primary' },
                { Text: 'Upload Data', Click: 'OpenUpload()', Class: 'btn btn-primary' },
                { Text: 'View Dynamic Pool Analysis Result', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        }]
    },

    Model: function() {
        return dataModel[set];
    }
};

$(function() {
    set = getLanguageSet()

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    $('#loading').fadeOut();
    $('.date-plugins').date_input();


});

function GenerateTemplate(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    if (!validControls(sectionFieldsSelector)) return;

    //var orgCode = $('#Organisation').val(); 
    var startDate = $('#Start').val();
    var endDate = $('#End').val();

    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('startdate', startDate, 'string');
    tpi.AddVariableItem('enddate', endDate, 'string');


    tpi.ShowIndicator('ConsumerLoan', 'GenerateDynamicPoolTemplate', function(result) {
        //code in this place will be executed after the TaskIndicator be closed
    });
}

function Download() {
    window.location.href = 'https://poolcutwcf/QuickWizardService/Files/Excel/DynamicPoolTemplate.xlsx';
}

function OpenUpload() {
    $('#fileUpload').click();
}

function UploadData(obj) {
    var $obj = $(obj);
    var filePath = $obj.val();
    if (!filePath) { return; }

    var objId = $obj.attr('id');
    var fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
    //var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

    UploadFile(objId, fileName, 'StaticPool', function(d) {
		$obj.val('');
        var orgCode = $('#OrganisationCode').val();
        var assetType = $('#AssetType').val();

        var filePath = d.FileUploadResult;
        var fileDirectory = filePath.substring(0, (filePath.length - fileName.length - 1));

        var tpi = new top.TaskProcessIndicatorHelper();
        tpi.AddVariableItem('sourceFilePath', fileDirectory, 'string');
        tpi.AddVariableItem('sourceFileName', fileName, 'string');
        tpi.AddVariableItem('OrganisationCode', orgCode, 'string');
        tpi.AddVariableItem('AssetType', assetType, 'string');

        tpi.ShowIndicator('ConsumerLoan', 'LoadDynamicPool', function(result) {
            //code in this place will be executed after the TaskIndicator be closed
        });
    });
}

function ViewResult() {
    var orgCode = $('#OrganisationCode').val();
    var assetType = $('#AssetType').val();
    var pageUrl = 'ViewDynamicPool.html?orgCode=' + orgCode + '&assetType=' + assetType;
    window.open(pageUrl);
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