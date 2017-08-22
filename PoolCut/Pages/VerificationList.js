/// <reference path="../Scripts/jquery-1.7.2.min.js" />
/// <reference path="../Scripts/jquery.datagrid.js" />
/// <reference path="../Scripts/jquery.datagrid.options.js" />
/// <reference path="../Scripts/common.js" />
/// <reference path="../Scripts/PoolCutCommon.js" />
var TargetSqlConnection;
var VerificationListModule = function () {
    var basePoolId, spName, svcUrl, $dtGrid;
    var displayColumns = [
        { field: "VerifyColumn", title: "错误列", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "VerifyRow", title: "错误数据", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "VerifyType", title: "错误类型", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
        { field: "VerifyResult", title: "具体信息", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd },
    ];

    var initArgs = function (SId, sp, continerId, url) {
        SessionId = SId;
        spName = sp;
        svcUrl = url;
        $dtGrid = $(continerId);
    };

    var dataBind = function (fnCallBack) {
        $dtGrid.datagrid({
            source: function () {
                var params = this.params();
                return syncGetRemoteData(params);
            },
            col: displayColumns,
            attr: 'mytable',
            paramsDefault: { paging: 30 },
            noData: "<p class='noData'>当前视图没有可显示记录。</p>",
            pagerPosition: "bottom",
            pager: "mypager",
            sorter: "mysorter",
            onComplete: function () {
                $(".mytable").on("click", "tr td", function () {
                    $(".mytable tr td").removeClass("active");
                    $(this).addClass("active");
                });

                if (fnCallBack) { fnCallBack(this.settings.recordCount); }
            }
        });
    };
    var syncGetRemoteData = function (gridParams) {
        var executeParam = { SPName: spName, SQLParams: [] };
        //var start = (gridParams.page - 1) * gridParams.paging + 1;
        //var end = gridParams.page * gridParams.paging;
        executeParam.SQLParams.push({ Name: 'SessionId', Value: SessionId, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'total', Value: 0, DBType: 'int', IsOutput: true });
        var executeParams = encodeURIComponent(JSON.stringify(executeParam));

        var sourceData = { total: 0, data: [] };
        var serviceUrl = svcUrl + 'CommonGet?connName=TaskProcess&exeParams=' + executeParams;
        var poolData = CallWCFSvc(serviceUrl, false, 'GET');

        

        return poolData;
    };

    

    var filterData = function (filters) {
        $dtGrid.datagrid('reset');
        $dtGrid.datagrid("fetch", filters);
    };

    var fetchMetaData = function (executeParams, fnCallBack) {
        var executeParams = encodeURIComponent(JSON.stringify(executeParams));
        $.ajax({
            cache: false,
            type: "GET",
            url: svcUrl + 'appDomain=TrustManagement&executeParams=' + executeParams + '&resultType=Common',
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: {},
            success: function (response) {
                if (typeof response === 'string') { sourceData = JSON.parse(response); }
                else { sourceData = response; }

                if (fnCallBack) { fnCallBack(sourceData); }
            },
            error: function (response) { alert('Error occursed when fetch the filter metadata!'); }
        });
    };

    function getRows(isSelected) {
        var rowlistSelector = 'input[rowindex][name="checkbox"]:checkbox';
        if (isSelected)
            rowlistSelector += ':checked';
        return $dtGrid.find(rowlistSelector);
    }

    return {
        Init: initArgs,
        DataBind: dataBind,
        Filter: filterData,
        FetchMetaData: fetchMetaData,
        GetRows: getRows
    };
}();