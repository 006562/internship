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
                    { ItemId: '5', ItemCode: 'BusinessDate', ItemAliasValue: '数据日期', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '上传数据', Click: 'OpenUpload()', Class: 'btn btn-primary' },
                { Text: '损失率统计', Click: 'CalculateLossRate()', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewResult()', Class: 'btn btn-default' }
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
                    { ItemId: '2', ItemCode: 'Pool', ItemAliasValue: 'Target Pool', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'OrganisationCode', ItemAliasValue: 'Organisation Code', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '4', ItemCode: 'AssetType', ItemAliasValue: 'Asse tType', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '5', ItemCode: 'BusinessDate', ItemAliasValue: 'Business Date', DataType: 'Date', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Upload Data', Click: 'OpenUpload()', Class: 'btn btn-primary' },
                { Text: 'Calculate Loss Rate', Click: 'CalculateLossRate()', Class: 'btn btn-primary' },
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

$(function () {
    set = getLanguageSet();

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    $('#loading').fadeOut();
    $('.date-plugins').date_input();
    $('#Section02dentity,#page_main_customize').hide();
});


function OpenUpload() {
    $('#fileUploadPoolStatistics').click();
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
        var BusinessDate = $('#BusinessDate').val();

        var filePath = d.FileUploadResult;
        var fileDirectory = filePath.substring(0, (filePath.length - fileName.length - 1));

        var tpi = new TaskProcessIndicatorHelper();
        tpi.AddVariableItem('sourceFilePath', fileDirectory, 'string');
        tpi.AddVariableItem('sourceFileName', fileName, 'string');
        tpi.AddVariableItem('OrganisationCode', orgCode, 'string');
        tpi.AddVariableItem('AssetType', assetType, 'string');
        tpi.AddVariableItem('BusinessDate', BusinessDate, 'string');

        tpi.ShowIndicator('ConsumerLoan', 'ImportPaymentHistory_PoolAnalysis', function(result) {
            //code in this place will be executed after the TaskIndicator be closed
        });
    });
}

function CalculateLossRate() {
    var OrganisationCode = $('#OrganisationCode').val(); 
    var AssetType = $('#AssetType').val(); 
	var conn = GlobalVariable.AssetTypeDBMapping[AssetType]['DALDB'];
	
	Loading.Show('正在计算损失率...');
	var executeParam = { SPName: 'PoolAnalysis.CalculateAssetLossStatsByTerm', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: OrganisationCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'AssetType', Value: AssetType, DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=' + conn + '&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	//var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, true, 'GET', function (response) {
		Loading.Close();
		ViewStats();
	});
}

function ViewResult() {
	// $('#tab').hide();
	// $('#chartResult').show();
	// $('#tabDesc').addClass('gray');
	// $('#chartDesc').removeClass('gray');
	ViewStats();
	/*
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
    //executeParam.SQLParams.push({ Name: 'TrustID', Value: trustId, DBType: 'string' });
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
	});
	*/
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
	var executeParam = { SPName: 'DefaultAnalysis.GetAssetLossStatsByTerm', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: OrganisationCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'AssetType', Value: AssetType, DBType: 'string' });
	var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, false, 'GET', function (response) {
	    $('.main-customize').removeClass('hidden');		
		var $table = $('#tbStats');
		var ths = [{ field: 'Period', title: '资产期长（天）' },
            { field: 'LoanAmount', title: '资产总金额' },
            { field: 'PaidInTime', title: '按时还款金额' },
            { field: 'LossRate', title: '损失率' },
            { field: 'DailyLossRate', title: '日均损失率' },
	        { field: 'PaidInTimeWithRecovery', title: '总还款金额' },
	        { field: 'LossRateWithRecovery', title: '回收后损失率' },
	        { field: 'DailyLossRateWithRecovery', title: '日均回收后损失率' }
		];
		$table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });
	});
}