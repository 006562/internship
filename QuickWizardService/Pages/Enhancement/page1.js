/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Tab,
            Title: '资产概况',
            Identity: 'Section01Identity',
            FieldsSetting: {
                Tabs: [{
                    TabId: 'InputAssetSummary', TabTitle: '输入资产概况', Fields: [
                        { ItemId: '1', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '2', ItemCode: 'AvgDuration', ItemAliasValue: '平均久期', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '3', ItemCode: 'MaxTerm', ItemAliasValue: '最短期限', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '4', ItemCode: 'MinTerm', ItemAliasValue: '最长期限', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '5', ItemCode: 'AvgYield', ItemAliasValue: '平均收益率', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '6', ItemCode: 'AUM', ItemAliasValue: '资产规模', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                    ]
                }, {
                    TabId: 'ChoiceAssetSummary', TabTitle: '指定已导入资产', Fields: [
                        { ItemId: '1', ItemCode: 'AssetType2', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '7', ItemCode: 'AssetSource', ItemAliasValue: '资产来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '6', ItemCode: 'ReportingDate', ItemAliasValue: '数据日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '2', ItemCode: 'Choice_AvgDuration', ItemAliasValue: '平均久期', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' },
                        { ItemId: '3', ItemCode: 'Choice_MaxTerm', ItemAliasValue: '最短期限', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' },
                        { ItemId: '4', ItemCode: 'Choice_MinTerm', ItemAliasValue: '最长期限', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' },
                        { ItemId: '5', ItemCode: 'Choice_AvgYield', ItemAliasValue: '平均收益率', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' }
                    ]
                }]
            },
            Buttons: [
                { Text: '查找模板', Click: 'StepPage.FetchTmpl("Section01Identity")', Class: 'btn btn-default' },
                { Text: '使用模板', Click: 'StepPage.UseTmpl("Section01Identity")', Class: 'btn btn-primary' },
                { Text: '新设计', Click: 'StepPage.NewDesign("Section01Identity")', Class: 'btn btn-primary' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Tab,
            Title: '资产概况',
            Identity: 'Section01Identity',
            FieldsSetting: {
                Tabs: [{
                    TabId: 'InputAssetSummary', TabTitle: '输入资产概况', Fields: [
                        { ItemId: '1', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '2', ItemCode: 'AvgDuration', ItemAliasValue: '平均久期', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '3', ItemCode: 'MaxTerm', ItemAliasValue: '最短期限', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '4', ItemCode: 'MinTerm', ItemAliasValue: '最长期限', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '5', ItemCode: 'AvgYield', ItemAliasValue: '平均收益率', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '6', ItemCode: 'AUM', ItemAliasValue: '资产规模', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                    ]
                }, {
                    TabId: 'ChoiceAssetSummary', TabTitle: '指定已导入资产', Fields: [
                        { ItemId: '1', ItemCode: 'AssetType2', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '7', ItemCode: 'AssetSource', ItemAliasValue: '资产来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '6', ItemCode: 'ReportingDate', ItemAliasValue: '数据日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                        { ItemId: '2', ItemCode: 'Choice_AvgDuration', ItemAliasValue: '平均久期', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' },
                        { ItemId: '3', ItemCode: 'Choice_MaxTerm', ItemAliasValue: '最短期限', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' },
                        { ItemId: '4', ItemCode: 'Choice_MinTerm', ItemAliasValue: '最长期限', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' },
                        { ItemId: '5', ItemCode: 'Choice_AvgYield', ItemAliasValue: '平均收益率', DataType: 'text', IsCompulsory: 0, IsDisplay: 1, ItemValue: '--' }
                    ]
                }]
            },
            Buttons: [
                { Text: '查找模板', Click: 'StepPage.FetchTmpl("Section01Identity")', Class: 'btn btn-default' },
                { Text: '使用模板', Click: 'StepPage.UseTmpl("Section01Identity")', Class: 'btn btn-primary' },
                { Text: '新设计', Click: 'StepPage.NewDesign("Section01Identity")', Class: 'btn btn-primary' }
            ]
        }]
    },

    Model: function (set) { return dataModel[set]; }
};
$(function () {
    set = getLanguageSet();
    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    StepPage.EventsBind();
    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    EventsBind: function () {
        $('.nav-tabs>li').click(function () {
            var $li = $(this);
            $li.addClass('active').siblings().removeClass('active');
            var target = $li.find('a').attr('href');
            $(target).addClass('active').siblings().removeClass('active');
        });

        $('.date-plugins').date_input();
    },
    FetchTmpl: function (sectionId) {
        var self = this;

        //clear values from last selected 
        $('#Choice_AvgDuration').text('');
        $('#Choice_MaxTerm').text('');

        $('.nav-tabs li:nth(1)').click();
        var sectionFieldsSelector = '#' + sectionId + ' .active input[data-valid]';
        if (!validControls(sectionFieldsSelector)) { return; }

        //var AssetType = $('#AssetType').val();
        //var AvgDuration = $('#AvgDuration').val();
        //var MaxTerm = $('#MaxTerm').val();
        //var MinTerm = $('#MinTerm').val();

        //var executeParam = { SPName: 'ProcName-getTemplates', SQLParams: [] };
        //executeParam.SQLParams.push({ Name: 'AssetType', Value: AssetType, DBType: 'string' });
        //executeParam.SQLParams.push({ Name: 'AvgDuration', Value: AvgDuration, DBType: 'string' });
        //executeParam.SQLParams.push({ Name: 'MaxTerm', Value: MaxTerm, DBType: 'string' });
        //executeParam.SQLParams.push({ Name: 'MinTerm', Value: MinTerm, DBType: 'string' });

        //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        //CallWCFSvc(serviceUrl, true, 'GET', function (response) {
        var response = [{ id: 1, AssetName: 'Sample Static 1', AssetType: 'AssetType1', AvgDuration: 'AvgDuration1', MaxTerm: 'MaxTerm1' },
                { id: 2, AssetName: 'Sample Static 2', AssetType: 'AssetType2', AvgDuration: 'AvgDuration2', MaxTerm: 'MaxTerm2' }];

        var $table = $('#tbTemplates');
        var ths = [{ field: 'rbtnSelect', radio: true },
            { field: 'AssetName', title: '产品名称' }, { field: 'AssetType', title: '资产类型' },
            { field: 'AvgDuration', title: '平均久期' }, { field: 'MaxTerm', title: '最长期限' }];
        $table.bootstrapTable('destroy').bootstrapTable({
            columns: ths, data: response,
            onCheck: function (row) {
                $('#Choice_AvgDuration').text(row.AvgDuration);
                $('#Choice_MaxTerm').text(row.MaxTerm);
            }
        });
        $table.removeClass('hidden');
        //});
    },
    UseTmpl: function (sectionId) {
        $('.nav-tabs li:nth(1)').click();
        var sectionFieldsSelector = '#' + sectionId + ' .active input[data-valid]';
        if (!validControls(sectionFieldsSelector)) { return; }

        var seleRow = $('#tbTemplates').bootstrapTable('getSelections');
        if (seleRow[0] && seleRow[0].AvgDuration) {//指定一个不包含在jquery(dom)对象中的属性，判断一下是否确实选择了template
            this.qwFrame.ChangeSetp(1);
        }else{
            alert('请选择模板！');
        }
    },
    NewDesign: function (sectionId) {
        $('#tbTemplates').addClass('hidden');
        $('.nav-tabs li:nth(0)').click();
        var sectionFieldsSelector = '#' + sectionId + ' .active input[data-valid]';
        if (!validControls(sectionFieldsSelector)) { return; }
       
        this.qwFrame.ChangeSetp(1);
    }
};

