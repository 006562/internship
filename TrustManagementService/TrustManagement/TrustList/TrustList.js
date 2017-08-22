//var gridDomId = 'grid';
//330是经验值
var userName = RoleOperate.cookieName();
var isAdmin = false;
var filter = '';
var height = $(window).height() - 30;
RoleOperate.getRolesByUserName(userName, function (data) {  //检查用户是否是管理员
    $.each(data, function(i, item) {
        if (item.IsRoot) {
            isAdmin = true;
        }
    });

    if (!isAdmin) {
        filter = "and ((UserName='{userName}' and AuditorUserName is null) or (UserName<>'{userName}' and AuditorUserName = '{userName}') or UserName is null)".replace(/\{userName\}/g, userName);
    } else {
        filter = "and AuditorUserName is null";
    }
    
var kendouiGrid = new kendoGridModel(height);
kendouiGrid.Init({
    renderOptions: {
            columns: [{ field: "TrustId", title: '专项计划标识', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "TrustCode", title: '专项计划名称', width: "15%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "TrustNameShort", title: '专项计划简称', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                        , { field: "TrustName", title: '专项计划描述', width: "25%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                        , { field: "OrganisationCode", title: '信托所属单位', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , {field: "OrganisationDesc", title: '信托所属单位名称', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" }}
                    , { field: "UserName", title: '创建人', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "AuditorUserName", title: '审批人', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
        ]
    }
    , dataSourceOptions: {
        otherOptions: {
            orderby: "TrustId"
            , appDomain: 'TrustManagement'
                , defaultfilter: filter
            , executeParamType: 'extend'
            , executeParam: {
                SQLParams: [
                    { Name: 'tableName', Value: 'TrustManagement.View_Trusts', DBType: 'string' }
                ]
            }
        }
    }
});
    kendouiGrid.RunderGrid();
});


function trustAction(callback) {
    var grid = $("#" + gridDomId).data("kendoExtGrid");
    if (grid.select().length != 1) {
        alert('请选择一条要操作的数据');
    } else {
        var dataRows = grid.items();
        // 获取行号
        var rowIndex = dataRows.index(grid.select());
        // 获取行对象
        var data = grid.dataItem(grid.select());
        callback(data);
    }
}

function MangeTrust() {
    trustAction(function (data) {
        var tid = data.TrustId;
        window.open(GlobalVariable.TrustManagementServiceHostURL + "TrustManagement/viewTrust.html?tid=" + tid, '_blank');
    });
}

function Open_WorkBench() {        
    trustAction(function (data) {
        var tid = data.TrustId;
        //url = 'https://poolcutwcf/TrustManagementService/Clients/HNGTrust/TrustWizard.html?tid=' + tid;
        url = GlobalVariable.SslHost + 'TrustManagementService/Clients/HNGTrust/TrustWizard.html?tid=' + tid;
        window.open(url, '_blank');

    });
  
}

function DeleteTrust() {
    trustAction(function (data) {
        var tid = data.TrustId;
        if (confirm('确定要删除吗？')) {
            var sessionVariables_p = '<SessionVariables>' +
							 '<SessionVariable>' +
								 '<Name>TrustId</Name>' +
								 '<Value>' + tid + '</Value>' +
								 '<DataType>Int</DataType>' +
								 '<IsConstant>1</IsConstant>' +
								 '<IsKey>0</IsKey>' +
								 '<KeyIndex>0</KeyIndex>' +
							 '</SessionVariable>' +							 
						 '</SessionVariables>';
            parent.window.TaskProcessWProxy.CreateSessionShowTask("Task", sessionVariables_p, "RemoveTrust", "CashFlowProcess");
        }
    });
}

function Open_TrustCollectionPickerPage() {
    trustAction(function (data) {
        var tid = data.TrustId;
        GSDialog.Open('交易现金流', GlobalVariable.TrustManagementServiceHostURL+'TrustManagement/TrustList/TrustCollectionPicker.html?TrustId=' + tid + '&taskCode=TrustWaterfall&IsDlg=1&random=' + Math.random(), { a: 1, b: 2 }, function (res) {
            //alert(res);
        }, 768, 300);
    });
}

function ViewIncomeDistributionHistoryData() {
    trustAction(function (data) {
        var tid = data.TrustId;
        window.open(GlobalVariable.TrustManagementServiceHostURL + "TrustManagement/TrustList/IncomeDistributionHistoryData.html?tid=" + tid, '_blank');
    });
}

var OpenCashflow = function () {
    trustAction(function (data) {
        var tcode = data.TrustCode;
        window.open(GlobalVariable.CashFlowEngineServiceHostURL + "UITaskStudio/index.html?appDomain=Task&taskCode=" + tcode, '_blank');
    });
}
//添加现金流模型ribbon
var OpenCashflowAddMessage = function () {
    trustAction(function (data) {
        var tcode = data.TrustCode
        window.open(GlobalVariable.CashFlowEngineServiceHostURL + "UITaskStudio/index.html?appDomain=Task&taskCode=" +(tcode+'_Cashflow'), '_blank');
    });
}

var ShowCashFlowResult = function () {
    trustAction(function (data) {
        var tid = data.TrustId;
        window.open(GlobalVariable.TrustManagementServiceHostURL + "TrustManagement/CashFlowResult.html?trustId="+tid, '_blank');
    });
}

function RunTrustWaterFall(reportingDate, periods) {
    //var serviceUrl = GlobalVariable.SessionManagementServiceUrl + "/CreateSessionByTaskCode";
    //var r = PagerListModule.GetRows(true);
    //var tid = r.attr('TrustId'), tCode = r.attr('TrustCode');
    var grid = $("#" + gridDomId).data("kendoExtGrid");
    var dataRows = grid.items();
    // 获取行号
    var rowIndex = dataRows.index(grid.select());
    // 获取行对象
    var data = grid.dataItem(grid.select());
    var tid = data.TrustId, tCode = data.TrustCode;
    var dparts = reportingDate.split('-');
    var DimReportingDateId = dparts[0] + dparts[1] + dparts[2];
    var startPeriod = 0;
    var endPeriod = 0;
    var period = 1;
    if (periods.length != 0) {
        if (periods.indexOf(',') != -1) {
            var parts = periods.split(',');
            startPeriod = parts[0];
            endPeriod = parts[1];
            period = parseInt(endPeriod) + 1;
        }
        else {
            period = parseInt(periods);
            endPeriod = period - 1;
        }
    }
    _taskCode = tCode;
    //var reportName = 'TrustWaterfall_JD_Trust_' + trustId;
    //if (waterfallConfigCategory == 'TrustWaterfallTaskConfig')
    //    reportName += '_TM';

    //var documentUrl = 'https://poolcutsp/poolcutoperationcenter/' + reportName + '.xls';

    sessionVariables_p = '<SessionVariables>' +
                            '<SessionVariable>' +
                                '<Name>TrustId</Name>' +
	                            '<Value>' + tid + '</Value>' +
	                            '<DataType>String</DataType>' +
	                            '<IsConstant>0</IsConstant>' +
	                            '<IsKey>0</IsKey>' +
	                            '<KeyIndex>0</KeyIndex>' +
	                        '</SessionVariable>' +
                            '<SessionVariable>' +
                                '<Name>ReportingDate</Name>' +
	                            '<Value>' + reportingDate + '</Value>' +
	                            '<DataType>String</DataType>' +
	                            '<IsConstant>0</IsConstant>' +
	                            '<IsKey>0</IsKey>' +
	                            '<KeyIndex>0</KeyIndex>' +
	                        '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>StartPeriod</Name>' +
     	                     '<Value>' + startPeriod + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>EndPeriod</Name>' +
     	                     '<Value>' + endPeriod + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>Period</Name>' +
     	                     '<Value>' + period + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>CashFlowECSet</Name>' +
     	                     '<Value>' + tCode + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>InterestRate</Name>' +
     	                     '<Value>0.05</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             //'<SessionVariable>' +
                             // '<Name>ReportName</Name>' +
     	                     //'<Value>' + reportName + '</Value>' +
     	                     //'<DataType>Int</DataType>' +
     	                     //'<IsConstant>1</IsConstant>' +
     	                     //'<IsKey>0</IsKey>' +
     	                     //'<KeyIndex>0</KeyIndex>' +
     	                     //'</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>DimReportingDateID</Name>' +
     	                     '<Value>' + DimReportingDateId + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             //'<SessionVariable>' +
                             // '<Name>Document_URL</Name>' +
     	                     //'<Value>' + documentUrl + '</Value>' +
     	                     //'<DataType>Int</DataType>' +
     	                     //'<IsConstant>1</IsConstant>' +
     	                     //'<IsKey>0</IsKey>' +
     	                     //'<KeyIndex>0</KeyIndex>' +
     	                     //'</SessionVariable>' +
                         '</SessionVariables>';
    //sessionVariables_p = encodeURIComponent(sessionVariables_p);

    parent.TaskProcessWProxy.CreateSessionShowTask("Task", sessionVariables_p, _taskCode, 'CashFlowProcess');
}


//---------------Quant Anaylysis------------------------------


function PoolAnalysis() {
    var url = location.protocol + '//' + location.host + '/QuickWizardService/PoolAnalysis.html';
    window.location.href = url;
}
function DefaultAnalysis() {
    var url = location.protocol + '//' + location.host + '/QuickWizardService/DefaultAnalysis.html';
    window.location.href = url;
}
function CashflowStressTest() {
    trustAction(function (data) {
        var tid = data.TrustId;
        var url = location.protocol + '//' + location.host + '/QuickWizardService/CashflowStressTest.html?id=' + tid;  //to do bring trustid here
        window.location.href = url;
    });
}

function RatingSimulation() {
    trustAction(function (data) {
        var tid = data.TrustId;
        var url = location.protocol + '//' + location.host + '/QuickWizardService/RatingSimulation.html?trustId=' + tid;  //to do bring trustid here
        window.location.href = url;
    });
}

function Pricing() {
    var url = location.protocol + '//' + location.host + '/QuickWizardService/Pricing.html';
    window.location.href = url;
}
function RiskTransfer() {
    trustAction(function (data) {
        var tid = data.TrustId;
        var url = location.protocol + '//' + location.host + '/QuickWizardService/RiskTransfer.html?trustId=' + tid;  //to do bring trustid here
        window.location.href = url;
    });
}
function TransferPricing() {
    var url = location.protocol + '//' + location.host + '/QuickWizardService/TransferPricing.html';
    window.location.href = url;
}
function VAR() {
    var url = location.protocol + '//' + location.host + '/QuickWizardService/VAR.html';
    window.location.href = url;
}
function MonteCarlo() {//generate a subpool
    var url = location.protocol + '//' + location.host + '/QuickWizardService/MonteCarlo.html';
    window.location.href = url;
}
function RStudio() {//make pool salable
    var url = location.protocol + '//' + location.host + '/QuickWizardService/RStudio.html';
    window.location.href = url;
}

