/// <reference path="E:\dev_tfs02\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery-1.7.2.min.js" />
document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var orgCode;
var assetType;

var set;


$(function() {
    set = getLanguageSet();
    orgCode = getQueryString('orgCode');
    assetType = getQueryString('assetType');
    if (!orgCode || !assetType) {
        alert('Organisation Code and Asset Type are Required!');
        return;
    }

    DefaultDataOperation.showIntervalData();//???????,???table?
    $('#loading').fadeOut();
});

var DefaultDataOperation = {
    chartSeries: []
    , colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#DDDF00','#FF9655'],
    showIntervalData: function() {
            var $tabel = $('#tblDataList')
            this.getIntervalData(function(rows) {
                if (rows && rows.length > 0) {
                    var tblThs = [];
                    var row = rows[0];
                    for (var col in row) {
                        var th = { field: col, title: col, align: 'center' }
                        tblThs.push(th);
                    }
                    $tabel.bootstrapTable({ columns: tblThs, data: rows });
                  
                } 
            });
        
    },
    getIntervalData: function(callback) {
        var executeParam = { SPName: 'dbo.usp_GetStaticPoolRetrieveFundData', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', callback);
    },
    
};



