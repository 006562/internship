var currentChartType = 'column';
var currentChartTypeName = "柱状图";
var cashFlowPeriodList = [];

var set;//Language set name
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '资产池存续分析',
            Identity: 'Section0Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'Trust', ItemAliasValue: '目标信托', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'Pool', ItemAliasValue: '目标资产池', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'OrganisationCode', ItemAliasValue: '资产来源', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'StartDate', ItemAliasValue: '模拟开始日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '6', ItemCode: 'EndDate', ItemAliasValue: '模拟结束日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '7', ItemCode: 'DaysToStop', ItemAliasValue: '循环购买截止天数', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '8', ItemCode: 'InitialAmount', ItemAliasValue: '初始资金', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '9', ItemCode: 'AssetTermLimit', ItemAliasValue: '资产期长上限', DataType: 'int', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '10', ItemCode: 'DailyPurchaseLimit', ItemAliasValue: '日均循环购买限额', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '上传数据', Click: 'OpenUpload()', Class: 'btn btn-primary' },
                { Text: '循环购买模拟', Click: 'RunTask("Section0Identity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewResult()', Class: 'btn btn-default' },
                // { Text: '查看曲线视图', Click: 'ViewChart()', Class: 'btn btn-default' }
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
        Customize: { MCResult: '资产池迭代分析' }
    },

    Model: function () {
        return dataModel[set];
    }
};

$('.title>span').click(function () {
	var $span = $(this);
	var target = $span.attr('target');
	var elseTarget = $span.siblings().attr('target');
	$span.removeClass('gray').siblings().addClass('gray');
	$(target).show();
	if(target == '#chartResult')
	{
		$('#distChartResult').show();
	}else
	{
		$('#distChartResult').hide();
	}
	$(elseTarget).hide();
});

var chartSeries = [
	{name:"AccountNum",data:[]}
	,{name:"Amount",data:[]}
	,{name:"AmountPurchased",data:[]}
	,{name:"AvailableAmountForPurchase",data:[]}
	,{name:"FeeCollection",data:[]}
	,{name:"PrincipalCollection",data:[]}
	,{name:"PurchaseResidual",data:[]}	
];
var xAxis = [];
var distXAxis = [];
var distChartSeries = [];

$(function () {
    set = getLanguageSet();

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    $('#loading').fadeOut();
    $('.date-plugins').date_input();
    $('#Section02dentity,#page_main_customize').hide();
});

function OpenUpload() {
    $('#fileUploadPoolLifeCycle').click();
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
        var endDate = $('#EndDate').val();

        var filePath = d.FileUploadResult;
        var fileDirectory = filePath.substring(0, (filePath.length - fileName.length - 1));

        var tpi = new TaskProcessIndicatorHelper();
        tpi.AddVariableItem('sourceFilePath', fileDirectory, 'string');
        tpi.AddVariableItem('sourceFileName', fileName, 'string');
        tpi.AddVariableItem('OrganisationCode', orgCode, 'string');
        tpi.AddVariableItem('AssetType', assetType, 'string');
        tpi.AddVariableItem('BusinessDate', endDate, 'string');

        tpi.ShowIndicator('ConsumerLoan', 'ImportPaymentHistory_PoolAnalysis', function(result) {
            //code in this place will be executed after the TaskIndicator be closed
        });
    });
}

function RunTask(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    if (!validControls(sectionFieldsSelector)) return;

    var trustId = $('#Trust').val(); 
    var StartDate = $('#StartDate').val(); 
    var EndDate = $('#EndDate').val(); 
    var OrganisationCode = $('#OrganisationCode').val(); 
    var AssetType = $('#AssetType').val(); 
    var DaysToStop = $('#DaysToStop').val(); 
    var InitialAmount = $('#InitialAmount').val(); 
    var AssetTermLimit = $('#AssetTermLimit').val(); 
	var DailyPurchaseLimit = $('#DailyPurchaseLimit').val();
	
    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('TrustId', trustId, 'string', 1, 1, 0);
    tpi.AddVariableItem('StartDate', StartDate, 'string', 1, 1, 0);
    tpi.AddVariableItem('EndDate', EndDate, 'string', 1, 1, 0);
    tpi.AddVariableItem('OrganisationCode', OrganisationCode, 'string', 1, 1, 0);
    tpi.AddVariableItem('AssetType', AssetType, 'string', 1, 1, 0);
    tpi.AddVariableItem('DaysToStop', DaysToStop, 'string', 1, 1, 0);
    tpi.AddVariableItem('InitialAmount', InitialAmount, 'string', 1, 1, 0);
    tpi.AddVariableItem('AssetTermLimit', AssetTermLimit, 'string', 1, 1, 0);
    tpi.AddVariableItem('DailyPurchaseLimit', DailyPurchaseLimit, 'string', 1, 1, 0);
    tpi.AddVariableItem('Rand', Math.random(), 'string', 1, 1, 0);
	
	tpi.ShowIndicator('Task', 'PoolAnalysis_RevolvingSimulation', function (result) {
		ViewResult();
	});
}

function ViewResult() {
	$('#tab').hide();
	$('#chartResult').show();
	$('#distChartResult').show();
	$('#tabDesc').addClass('gray');
	$('#chartDesc').removeClass('gray');
    var OrganisationCode = $('#OrganisationCode').val(); 
    var AssetType = $('#AssetType').val(); 
	ViewStats();
	chartSeries=[
		{name:"AccountNum",data:[]}
		,{name:"Amount",data:[]}
		,{name:"AmountPurchased",data:[]}
		,{name:"AvailableAmountForPurchase",data:[]}
		,{name:"FeeCollection",data:[]}
		,{name:"PrincipalCollection",data:[]}
		,{name:"PurchaseResidual",data:[]}	
	];
	xAxis=[];
    var trustId = $('#Trust').val(); 
	var executeParam = { SPName: 'DefaultAnalysis.GetPoolSimulationResult', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: OrganisationCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'AssetType', Value: AssetType, DBType: 'string' });
	var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, false, 'GET', function (response) {
	    var $table = $('#tbResult');
	    var ths = [{ field: 'DateIndex', title: '日期' },
            { field: 'PrincipalCollection', title: '本金回收' },
            { field: 'FeeCollection', title: '利息回收' },
            { field: 'AvailableAmountForPurchase', title: '可用资金' },
            { field: 'AmountPurchased', title: '循环购买金额' },
	        { field: 'PurchaseResidual', title: '剩余资金' },
	        { field: 'AccountNum', title: '当日购买资产数量' },
	        { field: 'Amount', title: '当日购买资产金额' }
			];
	    $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });		
	    $('.main-customize').removeClass('hidden');		
		$.each(response,function(i,o){
			xAxis.push(o.DateIndex);
			chartSeries[0].data.push(o.AccountNum);
			chartSeries[1].data.push(o.Amount);
			chartSeries[2].data.push(o.AmountPurchased);
			chartSeries[3].data.push(o.AvailableAmountForPurchase);
			chartSeries[4].data.push(o.FeeCollection);
			chartSeries[5].data.push(o.PrincipalCollection);
			chartSeries[6].data.push(o.PurchaseResidual);
		});
		ViewChart();
		ViewDistCharts();
	});
}

function ViewChart(){	
	$('#chartResult').highcharts({
		title: { text: '结果展示图' },
		subtitle: { text: '曲线图表' },
		xAxis: { categories: xAxis },
		yAxis: {
			title: { text: 'Value' },
			plotLines: [{ value: 0, width: 1, color: '#808080' }]
		},
		tooltip: { valueSuffix: '' },
		legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', x:0,y:0 },
		series: chartSeries
	});
}

function ViewStats(){
    var OrganisationCode = $('#OrganisationCode').val(); 
    var AssetType = $('#AssetType').val(); 

	var executeParam = { SPName: 'DefaultAnalysis.GetPoolSimulationStats', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: OrganisationCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'AssetType', Value: AssetType, DBType: 'string' });
	var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, false, 'GET', function (response) {
		var $table = $('#tbStats');
		var ths = [{ field: 'RevolvingDays', title: '循环购买天数' },
            { field: 'TotalRevolvingAmount', title: '循环购买总金额' },
            { field: 'TotalRevolvingLoans', title: '循环购买总笔数' },
            { field: 'AverageRevolvingAmount', title: '日均购买金额' },
            { field: 'AverageRevolvingLoans', title: '日均购买笔数' },
	        { field: 'AverageAccountResidual', title: '日均账户存留金额' },
	        { field: 'InitialAmount', title: '账户初始金额' },
	        { field: 'ClosingAmount', title: '账户结束金额' },
			{ field: 'RateOfReturn', title: '回报率' }
		];
		$table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });
	});
}

function ViewDistCharts(){
	distXAxis = [];
	distChartSeries = [];
	var OrganisationCode = $('#OrganisationCode').val(); 
    var AssetType = $('#AssetType').val(); 
	var executeParam = { SPName: 'DefaultAnalysis.GetBalanceDistributionByTerm', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: OrganisationCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'AssetType', Value: AssetType, DBType: 'string' });
	var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, false, 'GET', function (response) {
		debugger;
		console.log(response);
		if(response.length>0){
			for(var i in response[0]){
				if (response[0].hasOwnProperty(i) && typeof response[0][i] != "function") {
					var re = /^[0-9]*$/;
					if(re.test(i))
					{
						distXAxis.push(i);
					}
				}
			}
		}
		
		$.each(response, function(i,o){
			var chart = {};
			chart.data = [];
			chart.name = String(o.Period);
			for(var i in o){
				if (o.hasOwnProperty(i) && typeof o[i] != "function") {
					var re = /^[0-9]*$/;
					if(re.test(i))
					{
						chart.data.push(o[i]);
					}
				}
			}
			distChartSeries.push(chart);
		});
		
		$('#distChartResult').highcharts({
		title: { text: '分布曲线图' },
		subtitle: { text: '分布曲线' },
		xAxis: { categories: distXAxis },
		yAxis: {
			title: { text: 'Rate' },
			plotLines: [{ value: 0, width: 1, color: '#808080' }]
		},
		tooltip: { valueSuffix: '' },
		legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', x:0,y:0 },
		series: distChartSeries
	});
	});
}