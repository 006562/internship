document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var bid;
var mid;
var pid;
var set;
var ServiceHostURL = "https://poolcutwcf/TaskProcessServices/";
var sessionContext = '', sessionContextArray = [],tmpArray = [];
var configService="https://poolcutwcf/TaskProcessServices/TrustManagementService.svc/jsAccessEP/";
var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";

var viewModel;
var myModel = {
    GridView: [],//ko.observableArray(),
    Detail: [],// ko.observableArray(),
    SelectCompulsory: [],//ko.observableArray(),
    Language: {},
}

function getLanguage(set) {
    var zh_CN = { DataSet: "数据集", NumOfSamples: "采样次数", Distribution: "分布区间", 
                    NumOfBuckets: "分布区间数", OutputFunction: "输出函数", BtnRun: "运行", BtnLook: "查看"};
    var en_US = { DataSet: "Data Set Name", NumOfSamples: "Num Of Samples", Distribution: "Distribution", 
                    NumOfBuckets: "Num Of Buckets", OutputFunction: "Output Function", BtnRun: "Run", BtnLook:"Result"};
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

var appDomain;
var trustId;
var sessionId;

var currentChartType= 'column';
var currentChartTypeName = "柱状图";
var cashFlowPeriodList=[];


var gridColumns = [];
var getItemId = {};

$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
	myModel.Language = getLanguage(set);
	ko.applyBindings(myModel);
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, getTrustBond);
});

function getTrustBond(items) {
    $('#loading').fadeOut();
}

	
function CreateSessionCompleted(response) {
    sessionID = response;
    PopupTaskProcessIndicator();
    if (IsSilverlightInitialized) {
        InitParams();
    }
}

function viewMonteCarlo(){
	window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1007");
	//window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1007");
}

function runMonteCarlo(){
	var dataSetName=$('#dataSetName').val();
	var numOfSamples=$('#numOfSamples').val();
	var distributionStart=$('#distributionStart').val();
	var distributionEnd=$('#distributionEnd').val();
	var numOfBuckets=$('#numOfBuckets').val();
	var outputFunction=$('#outputFunction').val();
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>DataSetName</Name>'+
									'<Value>'+ dataSetName +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>NumOfSamples</Name>'+
									'<Value>'+ numOfSamples +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>DistributionStart</Name>'+
									'<Value>'+ distributionStart +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>DistributionEnd</Name>'+
									'<Value>'+ distributionEnd +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>NumOfBuckets</Name>'+
									'<Value>'+ numOfBuckets +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>OutputFunction</Name>'+
									'<Value>'+ outputFunction +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="MonteCarloHistorical";
	serviceUrl = serviceUrl + "?applicationDomain=" + indicatorAppDomain_p + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + taskCode;
	jQuery.support.cors = true;
	//alert(sessionVariables_p);
	$.ajax(
		{
			type:"GET",
			url:serviceUrl,
			dataType:"jsonp",
			crossDomain:"true",
			contentType: "application/json;charset=utf-8",
			success: CreateSessionCompleted,
			error: function (response) { alert("error is :" + response); }
		}
	)
	
}
