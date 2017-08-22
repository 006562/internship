var height = window.screen.availHeight - 270
var kendouiGrid = new kendoGridModel(height);
kendouiGrid.Init({
    renderOptions: {
        //height: 400,
         rowNumber: true
        , columns: [
                    { template: '#=ReportingDate?getStringDate(ReportingDate).dateFormat("yyyy-MM-dd"):""#', filterable: false, sortable: false, title: '报告日', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "AccountNo", title: '合同编号', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "CustomerName", title: '债务人名称', width: "20%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "StartDate", title: '开始日', template: '#=StartDate?getStringDate(StartDate).dateFormat("yyyy-MM-dd"):""#', width: "9%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "EndDate", title: '到期日', template: '#=EndDate?getStringDate(EndDate).dateFormat("yyyy-MM-dd"):""#', width: "9%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "InterestRate", title: '利率（%）', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "CurrentPrincipalBalance", title: '本金余额（元）', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "status", title: '状态', width: "9%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "IsInTrust", title: '是否入池', template: '#=IsInTrust?"是":"否"#', width: "8%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { title: '操作', template: '#=getOperate(TrustId,AccountNo,DimReportingDateId,PayDate)#', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
        ]
    }
    , dataSourceOptions: {
        pageSize: 20
        , otherOptions: {
            orderby: "AccountNo"
            , direction: ""
            , appDomain: 'TrustManagement'
            , executeParamType: 'extend'
            , executeParam: function () {
                var result = {
                    SPName: 'usp_GetAssetDetailsWithPager', SQLParams: [
                        { Name: 'trustId', Value: trustId, DBType: 'int' }
                    ]
                };
                if (typeof getPayDate() != "undefined")
                    result.SQLParams.push({ Name: 'payDate', Value: (getPayDate()) ? getPayDate() : null, DBType: 'string' });
                return result;
            }
        }
    }
});


function getOperate(tid, accountno, dimreportingdateid, payDate) {
    var viewPageUrl = './TrustFollowUp/AssetPaymentSchedule.html?trustId=' + tid + '&accountNo=' + accountno;
    var html = '<a href="javascript: showDialogPage(\'' + viewPageUrl + '\',\'资产现金流\',1000,600);">现金流</a>';

    //html += '&nbsp;&nbsp;&nbsp;';
    //var editPageUrl = './TrustFollowUp/AssetDetail.html?tid=' + tid + '&ano=' + accountno + '&dimreportingdateid=' + dimreportingdateid + '&payDate=' + payDate;
    //html += '<a href="javascript: showDialogPage(\'' + editPageUrl + '\',\'基础资产编辑\',1000,600);">编辑</a>';

    return html;
}

