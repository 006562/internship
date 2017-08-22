/// <reference path="../Scripts/jquery-1.7.2.min.js" />
/// <reference path="../Scripts/jquery.datagrid.js" />
/// <reference path="../Scripts/jquery.datagrid.options.js" />
/// <reference path="../Scripts/common.js" />
/// <reference path="../Scripts/PoolCutCommon.js" />
var TargetSqlConnection;
var PagerListModule = function () {
    var basePoolId, spName, svcUrl, $dtGrid;
    var displayColumns = [
        {
            field: "PoolId", title: "<div class='allSelectTitle'>√</div>", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                var htmPoolHeader = encodeURIComponent(JSON.stringify(data.row));
                return '<input type="checkbox" poolHeader="{0}" class="datalist-item" />'.format(htmPoolHeader);
            }
        }
        , { field: "PoolId", title: "标识", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd }
        , {
            field: "PoolName", title: "名称", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTdLeft
            , render: function (data) {
                var poolTypeId = data.row.PoolTypeId;
                var indent = (poolTypeId - 4) * 10;
                var html = '<div style="text-indent:{0}px">{1}<div>'.format(indent, data.value);
                return html;
            }
        }
        , {
            field: "PoolId", title: "处理组件", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                var html = { '4': '资产筛选', '5': '目标化', '6': '额度调整' };
                return '<a href="javascript:PoolProcess({0})">{1}</a>'.format(data.value, html[data.row.PoolTypeId]);
            }
        }
        , {
            field: "ReportingFilePath", title: "报表", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                return data.value ? '<a href="{0}">报表</a>'.format(data.value) : '';
            }
        }
        , {
            field: "ProjectPlanFilePath", title: "项目计划书", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                return data.value ? '<a href="{0}">项目文档</a>'.format(data.value):'';
            }
        }
        , {
            field: "PurchaseListFilePath", title: "拟购买池列表", sortable: false, attrHeader: settable.tableTh, attr: settable.tableTd
                    , render: function (data) {
                        return data.value ? '<a href="{0}">报表</a>'.format(data.value) : '';
                    }
        }
        , {
            field: "CreatedDate", title: "创建日期", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                return data.value ? getStringDate(data.value).dateFormat('yyyy-MM-dd') : '';
            }
        }
        , {
            field: "PoolTypeId", title: "结构", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                var html = { '4': 'Base', '5': 'Parent', '6': 'Child' };
                return html[data.value];
            }
        }
        , { field: "LoanCount", title: "信贷数量", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd }
        , { field: "CurrentPrincipalBalance", title: "规模", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd }
    ];

    var initArgs = function (pId, sp, continerId, url) {
        basePoolId = pId;
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
            paramsDefault: { paging: 20 },
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
        var start = (gridParams.page - 1) * gridParams.paging + 1;
        var end = gridParams.page * gridParams.paging;
        executeParam.SQLParams.push({ Name: 'BasePoolId', Value: basePoolId, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'total', Value: 0, DBType: 'int', IsOutput: true });
        var executeParams = encodeURIComponent(JSON.stringify(executeParam));

        var sourceData = { total: 0, data: [] };
        var serviceUrl = svcUrl + 'CommonGet?connName=DAL_SEC_PoolConfig&exeParams=' + executeParams;
        var poolData = CallWCFSvc(serviceUrl, false, 'GET');

        var ecpassNo = "";
        for (var i = 0; i < poolData.data.length; i++) {
            poolData.data[i] = getAggregationData(poolData.data[i], "ECPass3", "Total");
        }
      
        return poolData;
    };

    var getAggregationData = function (poolData, ecpassNo, category, callback) {
        var executeParam = { SPName: 'dbo.usp_GetAggregationData', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'DimPoolID', Value: poolData.PoolId, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'LTVPassNo', Value: ecpassNo, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AggregationCategory', Value: category, DBType: 'string' });

        var executeParams = encodeURIComponent(JSON.stringify(executeParam));
        var serviceUrl = GlobalVariable.PoolCutServiceURL
            + 'CommonGetWithConnStr?connStr={0}&exeParams={1}'.format(encodeURIComponent(poolData.TargetSqlConnection), executeParams);
        var aggregationData = CallWCFSvc(serviceUrl, false, 'GET');
        if (aggregationData) {
            for (var name in poolData) {
                for (var i = 0; i < aggregationData.length; i++) {
                    if (name == aggregationData[i].AggregationItem) {
                        poolData[name] = aggregationData[i].Value;
                    }
                }
            }
        }
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