var trustId = getQueryString("TrustId") ? getQueryString("TrustId") : "";
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
    
    parent.frames[0].RunTrustWaterFall(endDate, period);

    GSDialog.Close('');
}
function Cancel() {
    GSDialog.Close('');
}
function OpenTransactionInput() {
    var htmlurl = '../TrustWizard/TrustTransactionInput.html?tid=' + trustId + '&IsDlg=1&random=' + Math.random();
    window.open(htmlurl, '_blank');
}
