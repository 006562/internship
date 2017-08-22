document.write("<script language=javascript src='../Scripts/common.js'></script>");
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

var appDomain;
var trustId;
var sessionId;

var currentChartType= 'column';
var currentChartTypeName = "柱状图";
var cashFlowPeriodList=[];

function getLanguage(set) {
    var zh_CN = { BtnDownLoadShibor:"下载最新SHIBOR数据"
				,BtnViewHistoryShiBor:"查看SHIBOR历史数据"
				,BtnDownLoadCHINABONGDATA:"下载最新中债数据"
				,BtnViewHistoryCHINABONDDATA:"查看中债历史数据"
				,BtnViewCHINABONDCURVE:"查看中债曲线"
				,BtnViewShiBor:"查看SHIBOR曲线"
				,BtnRun:"运行"
				,BtnView:"查看"
				,YieldCurve:"参考利率曲线"
				,RiskPremium:"风险溢价（bps）"
				,PriorDistribution:"先验分布"
				,Param1:"参数1"
				,Param2:"参数2"
				,NumOfSamples:"采样次数"
				,Distribution:"分布区间"
				,NumOfBuckets:"分布区间数"
				,OutputFunction:"输出函数"
				,DataSetName:"数据集"
			};
    var en_US = { BtnDownLoadShibor:"Download Shibor"
				,BtnViewHistoryShiBor:"View Historical Shibor"
				,BtnDownLoadCHINABONGDATA:"Download ChinaBond"
				,BtnViewHistoryCHINABONDDATA:"View Historical ChinaBond"
				,BtnViewCHINABONDCURVE:"ChinaBond Curve"
				,BtnViewShiBor:"Shibor Curve"
				,BtnRun:"Run"
				,BtnView:"Result"
				,YieldCurve:"Yield Curve"
				,RiskPremium:"Risk Premium(bps)"
				,PriorDistribution:"Prior Distribution"
				,Param1:"Parameter 1"
				,Param2:"Parameter 2"
				,NumOfSamples:"Num Of Samples"
				,Distribution:"Distribution"
				,NumOfBuckets:"Num Of Buckets"
				,OutputFunction:"Output Function"
				,DataSetName:"Data Set Name"
			};
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

var gridColumns = [];
var getItemId = {};

$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    myModel.Language = getLanguage(set);
	DataOperate.getZCYCurveData('D',showZCYCurveList);
	$('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, getTrustBond);
});

//显示该页下拉列表
//已修改dataOperation.js文件
var showZCYCurveList=function(response){
	var jsonObject;
	var jsonArray=eval(response);
	for(var i=0;i<jsonArray.length;i++)
	{
		jsonObject=jsonArray[i];
		//$('#BondPricing_YieldCurve').append("<option value='"+jsonObject.CurveName+"'>"+jsonObject.CurveName+"</option>"); 
		$('#YieldCurve').append("<option value='"+jsonObject.CurveName+"'>"+jsonObject.CurveName+"</option>"); 
	}
}

function getTrustBond(items) {
    databind(items);
    $('#loading').fadeOut();
}

function databind(items) {
    var go = true;
    var rowId = 0;
    var details = null;
    while (go) {
        var row = $.grep(items, function (trustItem) {
            return trustItem.GroupId01 == rowId;
        })

        if (row.length == 0) {
            //当tbid=0时，row.length == 0，说明返回的只有模板
            if (details == null) {
                details = items;
            }
            go = false;
        }
        else {
            //将第一组数据作为Detial模板
            if (details == null) {
                details = row;
            }


            //排序
            row = row.sort(function (a, b) {
                return parseInt(a.SequenceNo) - parseInt(b.SequenceNo)
            });

            var gridItem = {};
            $.each(row, function (i, d) {
                gridItem[d.ItemCode] = d.ItemValue;
                if (d.DataType == "Select") {
                    var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                    gridItem[d.ItemCode + "_Text"] = item.ItemAliasValue;
                }
                else if (d.DataType == "Decimal") {
                    gridItem[d.ItemCode + "_Text"] = getMoneyText(d.ItemValue, d.ItemAliasSetName);
                }
            });
            myModel.GridView.push(gridItem);
        }
        rowId++;

    }

    $.each(details, function (i, d) {
        d['IsDisplay'] = false;
        d['IsNew'] = false;
        d.ItemValue = "";
        if (d.IsCompulsory) {
            d.IsDisplay = true;
        }
        else {
            d.IsDisplay = false;
            myModel.SelectCompulsory.push(d);
        }

        if (d.Bit01) {
            gridColumns.push(d);
        }
        getItemId[d.ItemCode] = d.ItemId;
        myModel.Detail.push(d);
    });
    console.log(myModel);
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
};

	
function CreateSessionCompleted(response) {
    sessionID = response;
    PopupTaskProcessIndicator();
    if (IsSilverlightInitialized) {
        InitParams();
    }
	//alert(sessionID);
}

function viewCurves(){
	window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1005");
	var tt = $('.radioChart');
	tt[0].checked=true;
	$('#viewChart').show();
	appDomain='Task';
	trustId=1005;
	getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
		var arrayObj = new viewFormCashFlowResult("Task", jQuery.parseJSON(response).SessionId, jQuery.parseJSON(response).TaskCode);
		arrayObj.render('综合曲线');
	});		//得到TaskCode & SessionId
}


function viewHistoricalSHIBOR(){
	window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1003");
	var tt = $('.radioChart');
	tt[0].checked=true;
	$('#viewChart').show();
	appDomain='Task';
	trustId=1003;
	getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
		var arrayObj = new viewFormCashFlowResult("Task", jQuery.parseJSON(response).SessionId, jQuery.parseJSON(response).TaskCode);
		arrayObj.render('SHIBOR历史数据');
	});		//得到TaskCode & SessionId
	
}
function viewHistoricalCHINABOND(){
	window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1004");
	var tt = $('.radioChart');
	tt[0].checked=true;
	$('#viewChart').show();
	appDomain='Task';
	trustId=1004;
	getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
		var arrayObj = new viewFormCashFlowResult("Task", jQuery.parseJSON(response).SessionId, jQuery.parseJSON(response).TaskCode);
		arrayObj.render('中债历史数据');
	});		//得到TaskCode & SessionId
}

function loadSHIBOR(){
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>BusinessId</Name>'+
									'<Value>'+ bid +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="LoadExcel_Shibor";
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

function loadCHINABOND(){
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>BusinessId</Name>'+
									'<Value>'+ bid +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="LoadExcel_ChinaBond";
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




var getCaskFlowRunResultBySessionId = function (appDomain, sessionId, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetCaskFlowRunResultBySessionId/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("load CaskFlow run result error.");
            }
        });
};



var getTaskCodeAndSessionIdFromTrustId = function (appDomain, trustId, callback) {
	var serviceUrl = CashFlowStudioServiceBase + "GetTaskCodeAndSessionIdFromTrustId/" + appDomain + "/" + trustId + "?r=" + Math.random() * 150;;

	$.ajax({
		type: "GET",
		url: serviceUrl,
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (response) {
			callback(response);
		},
		error: function (response) {
			alert("load TaskCode And SessionId From TrustId error.");
		}
	});
}

function runMonteCarlo(){
	var priorDistribution=$('#priorDistribution').val();
	var numOfSamples=$('#numOfSamples').val();
	var distributionStart=$('#distributionStart').val();
	var distributionEnd=$('#distributionEnd').val();
	var numOfBuckets=$('#numOfBuckets').val();
	var outputFunction=$('#outputFunction').val();
	var param1=$('#param1').val();
	var param2=$('#param2').val();
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>PriorDistribution</Name>'+
									'<Value>'+ priorDistribution +'</Value>'+
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
								'<SessionVariable>'+
									'<Name>Param1</Name>'+
									'<Value>'+ param1 +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>Param2</Name>'+
									'<Value>'+ param2 +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="MonteCarloParam";
	serviceUrl = serviceUrl + "?applicationDomain=" + indicatorAppDomain_p + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + taskCode;
	jQuery.support.cors = true;
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

function viewMonteCarlo(){

	window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1008")
}
