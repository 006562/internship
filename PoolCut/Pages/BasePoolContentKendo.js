var height = $(window).height() - 40;

var BasePoolId = getQueryString('PoolId');
if (!BasePoolId || isNaN(BasePoolId)) {
    alert("PoolId错误");
}
var PoolName = getQueryString('PoolName');
$('#spanCurrentPoolName').text(PoolName);
     
$('#clearStorge').click(function () {
    sessionStorage.clear();
});


//设置缓存
sessionStorage.PoolId = BasePoolId
sessionStorage.PoolName = PoolName;

var kendouiGrid = new kendoGridModel(height);
kendouiGrid.Init({
    renderOptions: {
        //height: 400,
        rowNumber: true
        , columns: [
                     { field: "PoolId", title: '标识', width: "8%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "PoolName", title: '名称', width: "25%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { template: '#=PoolId?TranToHtml(4,PoolId,PoolTypeId):""#', title: '处理组件', width: "8%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { template: '#=ReportingFilePath?TranToHtml(1,ReportingFilePath):""#', title: '报表', width: "7%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { template: '#=ProjectPlanFilePath?TranToHtml(2,ProjectPlanFilePath):""#', title: '项目计划书', width: "9%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { template: '#=PurchaseListFilePath?TranToHtml(3,PurchaseListFilePath):""#', title: '拟购买池列表', width: "9%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { template: '#=CreatedDate?getStringDate(CreatedDate).dateFormat("yyyy-MM-dd"):""#', title: '创建日期', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { template: '#=PoolTypeId?TranToHtml(5,PoolTypeId):""#', title: '结构', width: "8%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "LoanCount", title: '信贷数量', width: "8%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "CurrentPrincipalBalance", title: '规模', width: "13%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
        ]
    }
    , dataSourceOptions: {
        pageSize: 20
        , otherOptions: {
            orderby: ""
            ,direction: ""
             ,appDomain: 'config'
            , executeParamType: 'cover'
            , executeParam: function () {
                var result = {
                    SPName: 'usp_GetBasePoolContent'
                    , SQLParams: [
                        { Name: 'BasePoolId', Value: BasePoolId, DBType: 'int' }
                    ]
                };
                return result;
            }
        }
    }
});

function TranToHtml(index, data, data2) {
    var html;
    switch (index) {
        case 1:
            html = '<a href="{0}">报表</a>'.format(data);
            break;
        case 2:
            html = '<a href="{0}">项目计划书</a>'.format(data);
            break;
        case 3:
            html = '<a href="{0}">拟购买资产池</a>'.format(data.replace('xlsx','csv'));
            break;
        case 4:
            var type = { '4': '资产筛选', '5': '目标化', '6': '额度调整' };
            html = '<a href="javascript:PoolProcess({0})">{1}</a>'.format(data, type[data2]);
            break;
        case 5:
            var type = { '4': 'Base', '5': 'Parent', '6': 'Child' };
            html = '<a>{0}</a>'.format(type[data]);
            break;
    }
    return html;
}


function getPoolHeader() {
    var grid = $("#" + gridDomId).data("kendoExtGrid");
    if (grid.select().length != 1) {
        alert('请选择要操作的资产池');
    } else {
        //var dataRows = grid.items();
        //// 获取行号
        //var rowIndex = dataRows.index(grid.select());
        // 获取行对象
        var data = grid.dataItem(grid.select());
        return data;
    }
}



