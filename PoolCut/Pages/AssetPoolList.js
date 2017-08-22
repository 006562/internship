/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/jquery-1.7.2.min.js" />
/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/jquery.datagrid.js" />
/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/jquery.datagrid.options.js" />
/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/common.js" />


var PagerListModule = function () {    
    var spName, svcUrl, $dtGrid;
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
            field: "PoolName", title: "名称", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                return '<a href="BasePoolContent.html?PoolId={0}&PoolName={1}">{1}</a>'.format(data.row.PoolId, data.value);
            }
        }
        , { field: "PoolDescription", title: "工作组描述", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd }
        , { field: "OrganisationCode", title: "所属企业", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd }
        , {
            field: "CreatedDate", title: "创建日期", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                return data.value ? getStringDate(data.value).dateFormat('yyyy-MM-dd') : '';
            }
        }
        , {
            field: "PoolStatusId", title: "状态", sortable: true, attrHeader: settable.tableTh, attr: settable.tableTd
            , render: function (data) {
                var status;
                switch (data.value) {
                    case 148:
                        status = 'OPEN';
                        break;
                    case 149:
                        status = 'INVALID';
                        break;
                    default:
                        status = '';
                        break;
                }
                return status;
            }
        }
    ];
   

    var initArgs = function (sp, continerId, url) {
        spName = sp;
        svcUrl = url;
        $dtGrid = $(continerId);
    };

    var dataBind = function (fnCallBack) {
        //减去上面的空间高度，370是经验值
        var height = $(window).height() - 30;
        //-1是为了显示翻页按钮
        var page = parseInt(height / 28)-1;
        $dtGrid.datagrid({
            source: function () {
                window.onbeforeunload = function () {
                    sessionStorage.statuss = "fresh";
                }
                if (sessionStorage.statuss == 'fresh') {
                    this.params().page = parseInt(sessionStorage.page);
                    this.params().orderby = sessionStorage.orderby;
                    this.params().direction = sessionStorage.direction;
                }
                else {
                    sessionStorage.page = this.params().page;
                    sessionStorage.orderby = this.params().orderby;
                    sessionStorage.direction = this.params().direction;
                }
                sessionStorage.statuss = 'nofresh';                
                return syncGetRemoteData(this.params())
            },
            col: displayColumns,
            attr: 'mytable',
            paramsDefault: { paging: page },
            noData: "<p class='noData'>当前视图没有可显示记录。</p>",
            pagerPosition: "bottom",
            pager: "mypager",
            sorter: "mysorter",
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

        executeParam.SQLParams.push({ Name: 'tableName', Value: 'config.PoolHeader', DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'start', Value: start, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'end', Value: end, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'orderby', Value: (gridParams.orderby) ? gridParams.orderby : 'PoolId', DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'direction', Value: (gridParams.direction) ? gridParams.direction : null, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'where', Value: ((gridParams.where) ? gridParams.where : 'where ParentPoolId=0'), DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'total', Value: 0, DBType: 'int', IsOutput: true });
        var executeParams = encodeURIComponent(JSON.stringify(executeParam));

        var sourceData = { total: 0, data: [] };
        var serviceUrl= svcUrl + 'CommonGet?connName=DAL_SEC_PoolConfig&exeParams=' + executeParams
     
        return CallWCFSvc(serviceUrl, false, 'GET');
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


