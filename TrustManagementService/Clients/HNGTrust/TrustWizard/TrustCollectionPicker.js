var trustId = getQueryString("TrustId") ? getQueryString("TrustId") : "";
var trustCode = getQueryString("TrustCode") ? getQueryString("TrustCode") : "";
var taskCode = getQueryString("taskCode") ? getQueryString("taskCode") : "";
var svcUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";

$(function () {
    GetPeriodData(function (list) {
        if (list) {
            var html = '';//'<option value="all">所有</option>';
            //sortData(list, 'OptionValue');
            $.each(list, function (i, item) {
                //var t = item.EndDate ? getStringDate(item.EndDate).dateFormat('yyyy-MM-dd') : '';
                html += '<option value="' + item.EndDate + '">' + item.Period + '</option>';
            });
            $('#collectPeriod').html(html);
        }
    });
})


function GetPeriodData(callback) {
    var executeParam = {
        SPName: 'usp_GetTrustCollectionPeriods', SQLParams: [
            { Name: 'TrustId', value: trustId, DBType: 'int' },
        ]
    };
    var data = ExecuteGetData(false, svcUrl, 'TrustManagement', executeParam);
    callback(data);
}
function Submit() {
    var endDate = $('#collectPeriod').val();
    var period = $('#period').val();
    
    RunTrustWaterFall(endDate, period);
}
function Cancel() {
    //GSDialog.Close('');
}
function OpenTransactionInput() {
    var htmlurl = '../TrustWizard/TrustTransactionInput.html?tid=' + trustId + '&IsDlg=1&random=' + Math.random();
    window.open(htmlurl, '_blank');
}


function RunTrustWaterFall(reportingDate, periods) {
    ////var serviceUrl = GlobalVariable.SessionManagementServiceUrl + "/CreateSessionByTaskCode";
    ////var r = PagerListModule.GetRows(true);
    ////var tid = r.attr('TrustId'), tCode = r.attr('TrustCode');
    //var grid = $("#" + gridDomId).data("kendoExtGrid");
    //var dataRows = grid.items();
    //// 获取行号
    //var rowIndex = dataRows.index(grid.select());
    //// 获取行对象
    //var data = grid.dataItem(grid.select());
    //var tid = data.TrustId, tCode = data.TrustCode;
    var tid = trustId, tCode = trustCode;
    
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