var currentChartType = 'column';
var currentChartTypeName = "柱状图";
var cashFlowPeriodList = [];

var set;//Language set name
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '蒙特卡罗模拟',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'Trust', ItemAliasValue: '目标信托', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'Pool', ItemAliasValue: '目标资产池', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'MCReportingDate', ItemAliasValue: '模拟开始日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'MCSimulationMethod', ItemAliasValue: '模拟方法', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'MCStartPoint', ItemAliasValue: '起始点', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'MCSimulationTimes', ItemAliasValue: '模拟次数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '运行', Click: 'RunTask("Section0Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        },
		/*
        {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '结果展示',
            Identity: 'Section02dentity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '4', ItemCode: 'CurveChoice', ItemAliasValue: '曲线选择', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'Name', ItemAliasValue: '命名', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                ]
            },
            Buttons: [
                { Text: '保存结果', Click: 'Save("Section02dentity")', Class: 'btn btn-primary pull-right' }
            ]
        }
		*/
		],
        Customize: { MCResult: '蒙特卡洛模拟' }
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Monte Carlo Simulation',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'Trust', ItemAliasValue: 'Target Trust', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'Pool', ItemAliasValue: 'Target Asset Pool', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'MCReportingDate', ItemAliasValue: 'Reporting Date', DataType: 'int', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'MCSimulationMethod', ItemAliasValue: 'Simulation Method', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'MCStartPoint', ItemAliasValue: 'Start Point', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'MCSimulationTimes', ItemAliasValue: 'Simulation Times', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Run', Click: 'RunTask("Section0Identity")', Class: 'btn btn-primary' },
                { Text: 'View Result', Click: 'ViewResult()', Class: 'btn btn-default' }
            ]
        },
		/*
        {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Result',
            Identity: 'Section02dentity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '4', ItemCode: 'CurveChoice', ItemAliasValue: 'Curve Choice', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'Name', ItemAliasValue: 'Name', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                ]
            },
            Buttons: [
                { Text: 'Save Result', Click: 'Save("Section02dentity")', Class: 'btn btn-primary pull-right' }
            ]
        }
		*/
		],
        Customize: { MCResult: 'Monte Carlo Simulation' }
    },

    Model: function () {
        return dataModel[set];
    }
};

$(function () {
    set = getLanguageSet();

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    $('#loading').fadeOut();
    $('.date-plugins').date_input();
    $('#Section02dentity,#page_main_customize').hide();
});

function RunTask(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    if (!validControls(sectionFieldsSelector)) return;

    var trustId = $('#Trust').val(); 
    var reportingDate = $('#MCReportingDate').val(); 
    var simulationMethod = $('#MCSimulationMethod').val(); 
    var startPoint = $('#MCStartPoint').val(); 
    var simulationTimes = $('#MCSimulationTimes').val(); 
	var dalConnStr = 'Data Source=MSSQL;Initial Catalog=SFM_DAL_Main;Integrated Security=SSPI;';
	
    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('TrustId', trustId, 'string', 1, 1, 0);
    tpi.AddVariableItem('ReportingDate', reportingDate, 'string', 1, 1, 0);
    tpi.AddVariableItem('SimulationMethod', simulationMethod, 'string', 1, 1, 0);
    tpi.AddVariableItem('StartPoint', startPoint, 'string', 1, 1, 0);
    //tpi.AddVariableItem('DALConnStr', dalConnStr, 'string', 1, 1, 0);
    tpi.AddVariableItem('SimulationTimes', simulationTimes, 'string', 1, 1, 0);
    tpi.AddVariableItem('TimeStamp', new Date().getTime(), 'string', 1, 1, 0);
	
	if (startPoint == 1) {
		if (reportingDate == '') { alert('请输入模拟开始日期'); return; }
		tpi.ShowIndicator('Task', 'PaymentAnalysis_MCS_FromDate', function (result) {
			ViewResult();
		});
	} 
    else {
		tpi.ShowIndicator('Task', 'PaymentAnalysis_MCS', function (result) {
			ViewResult();
		});
	}
}

function ViewResult() {   
	
    var trustId = $('#Trust').val(); 
	var executeParam = { SPName: 'DefaultAnalysis.GetPaymentSimulationResult', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: trustId, DBType: 'string' });
	var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, false, 'GET', function (response) {
	    var $table = $('#tbResult');
	    var ths = [{ field: 'StartDate', title: '区间开始' },
            { field: 'EndDate', title: '区间结束' },
            { field: 'Principal', title: '本金回收' },
            { field: 'Fee', title: '利息回收' },
            { field: 'PrincipalVolatility', title: '本金波动(标准差)' },
	        { field: 'FeeVolatility', title: '利息波动(标准差)' }];
	    $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });

	    $('.main-customize').removeClass('hidden');
	});
}
