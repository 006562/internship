/// <reference path="../../TrustWizard/Scripts/jquery-1.7.2.min.js" />
/// <reference path="jquery.datagrid.js" />
/// <reference path="jquery.datagrid.options.js" />
/// <reference path="../../TrustWizard/Scripts/common.js" />
var listCategory = {
    AssetDetails: 'AssetDetails',//底部资产列表
    Originator: 'Originator'//原始权益人列表
};
var displayColumns = {
    AssetDetails: [
        {
            field: "AccountNo", title: "项目编号", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                return '<a href="#">' + data.value + '</a>';
            }
        },
        { field: "CustomerName", title: "客户名称", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        {
            field: "ContractDate", title: "签约日", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                return getStringDate(data.value).dateFormat('yyyy-MM-dd');
            }
        },
        {
            field: "StartDate", title: "起租日", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                return getStringDate(data.value).dateFormat('yyyy-MM-dd');
            }
        },
        {
            field: "EndDate", title: "到期日", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                return getStringDate(data.value).dateFormat('yyyy-MM-dd');
            }
        }
    ],

    Originator: [
        {
            field: "Name", title: "名称", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                return '<a href="#">' + data.value + '</a>';
            }
        },
        { field: "Rating", title: "评级", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd },
        {
            field: "ReportingDate", title: "报告日", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                return getStringDate(data.value).dateFormat('yyyy-MM-dd');
            }
        },
        { field: "TotalAssetAmt", title: "总资产额", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "NetAssetAmt", title: "NetAssetAmt", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "TurnOver", title: "TurnOver", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "NetProfit", title: "NetProfit", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "AssetDebitRatio", title: "AssetDebitRatio", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "AssetNPRatio", title: "AssetNPRatio", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        {
            field: "AuditReport", title: "AuditReport", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                return '<a href="' + data.value + '">' + data.value + '</a>';
            }
        },
        {
            field: "", title: "操作", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd,
            render: function (data) {
                var rdate = getStringDate(data.row.ReportingDate).dateFormat('yyyy-MM-dd');
                return '<a href="OriginalOwnerDetails.html?tid=' + data.row.TrustId + '&rdate=' + rdate + '">修改</a>';
            }
        }
    ]
};

var PagerListModule = function () {
    var listCate, spName, trustId, svcUrl, $dtGrid;

    var initArgs = function (cate, sp, tId, url, continerId) {
        listCate = cate;
        spName = sp;
        trustId = tId,
        svcUrl = url;
        $dtGrid = $(continerId);
    };

    var dataBind = function (fnCallBack) {
        $dtGrid.datagrid({
            source: function () {
                var params = this.params();
                return syncGetRemoteData(params)
            },
            col: displayColumns[listCate],
            attr: 'mytable',
            paramsDefault: { paging: 30 },
            noData: "<p class='noData'>当前视图没有可显示记录。</p>",
            pagerPosition: "bottom",
            pager: "mypager",
            sorter: "mysorter",
            /*onBefore: function() {
      
            },
            onData: function() {
      
            },
            onRowData: function(data) {
      
            },*/
            onComplete: function () {
                $(".mytable").on("click", ".table-td", function () {
                    $(".mytable .table-td").removeClass("active");
                    $(this).addClass("active");
                });

                if (fnCallBack) { fnCallBack(this.settings.recordCount); }
            }
        });
    };
    var syncGetRemoteData = function (gridParams) {
        var executeParam = { SPName: spName, SQLParams: [] };

        var start = (gridParams.page - 1) * gridParams.paging + 1;
        var end = gridParams.page * gridParams.paging;
        executeParam.SQLParams.push({ Name: 'start', Value: start, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'end', Value: end, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'trustId', Value: trustId, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'orderby', Value: (gridParams.orderby) ? gridParams.orderby : null, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'direction', Value: (gridParams.direction) ? gridParams.direction : null, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'where', Value: (gridParams.where) ? gridParams.where : null, DBType: 'string' });

        var executeParams = encodeURIComponent(JSON.stringify(executeParam));

        var sourceData = { total: 0, data: [] };
        $.ajax({
            type: "GET",
            async: false,
            url: svcUrl + 'appDomain=TrustManagement&executeParams=' + executeParams + '&resultType=DatagridDataSource',
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: {},
            success: function (response) {
                if (typeof response === 'String') {
                    sourceData = eval(response);
                } else {
                    sourceData = response;
                }
            },
            error: function (response) { alert('Error occursed'); }
        });
        return sourceData;
    };

    var filterData = function (filters) {
        $dtGrid.datagrid('reset');
        $dtGrid.datagrid("fetch", filters);
    };


    return {
        Init: initArgs,
        DataBind: dataBind,
        Filter: filterData
    };

}();