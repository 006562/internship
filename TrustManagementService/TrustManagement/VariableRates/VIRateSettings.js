//var gridDomId = 'grid';
//330是经验值
var userName = RoleOperate.cookieName();
var isAdmin = false;
var filter = '';
var height = $(window).height() - 30;
RoleOperate.getRolesByUserName(userName, function (data) {  //检查用户是否是管理员
    $.each(data, function (i, item) {
        if (item.IsRoot) {
            isAdmin = true;
        }
    })

   
    var kendouiGrid = new kendoGridModel(height);
    kendouiGrid.Init({
        renderOptions: {
            columns: [
                     { field: "Id", title: '序号', width: "0%", headerAttributes: { "class": "table-header-cell", style: "text-align: center; display:none" }, attributes: { "class": "table-cell", style: "text-align: center; display:none" } }
                    , { field: "Category", title: '类型', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "SubCategory", title: '子类型', width: "15%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "SubCategoryCode", title: '子类型代码', width: "0%", headerAttributes: { "class": "table-header-cell", style: "text-align: center; display:none" }, attributes: { "class": "table-cell", style: "text-align: center; display:none" } }
                    , { field: "BaseRate", title: '基准利率', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "type", title: '利率类别', width: "25%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
                    , { field: "PubDate", title: '发布日期',template: '#=PubDate?getStringDate(PubDate).dateFormat("yyyy-MM-dd"):""#', width: "10%", headerAttributes: { "class": "table-header-cell", style: "text-align: center" }, attributes: { "class": "table-cell", style: "text-align: center" } }
            ]
        }
        , dataSourceOptions: {
            otherOptions: {
                orderby: "type"
                , appDomain: 'TrustManagement'
                    , defaultfilter: filter
                , executeParamType: 'extend'
                , executeParam: {
                    SQLParams: [
                        { Name: 'tableName', Value: 'TrustManagement.view_VIRates', DBType: 'string' }
                    ]
                }
            }
        }
    });
    kendouiGrid.RunderGrid();
});

$(function () {
    $("#btnNewVISet").anyDialog({
        width: 600,	// 弹出框内容宽度
        height: 500, // 弹出框内容高度
        title: '新增',	// 弹出框标题
        url: './VIRateOperation.html?operation=new'
    });

    $("#btnEditVI").click(function () {
        getVIRowData(
            function (data) {
                $.anyDialog({
                    width: 600,	// 弹出框内容宽度
                    height: 500, // 弹出框内容高度
                    title: '编辑',	// 弹出框标题
                    url: './VIRateOperation.html?operation=edit&subcategorycode=' + data.SubCategoryCode + '&pubdate=' + data.PubDate + '&baserate=' + data.BaseRate + '&subcategory=' + data.SubCategory + '&type=' + data.type + '&id=' + data.Id + '&category' + data.Category
                });
            }
        )
    });
});

function getVIRowData(callback) {
    var grid = $("#grid").data("kendoExtGrid");
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

