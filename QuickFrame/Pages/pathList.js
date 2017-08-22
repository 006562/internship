var winHeight = 500;
var winWidth = 500;

$(function () {
    winHeight = $(window.parent.document).height();
    winWidth = $(window.parent.document).width();
  
    runderGrid();
    kendo.culture("zh-CN");
});


function dataSource() {
    var dataSource = new kendo.data.DataSource({
        transport: {

            read: {
                url: RoleOperate.roleService + 'DataReadKendoGrid',
                contentType: "application/json",
                type: "POST",
                dataType: "jsonp"

            },

            parameterMap: function (options, operation) {
                if (operation == "read") {

                    var orderby = 'ApplicationName';
                    if (dataSource.sort() != null) {
                        if (dataSource.sort().length > 0) {
                            orderby = dataSource.sort()[0].field + " " + dataSource.sort()[0].dir;
                            orderby = encodeURIComponent(orderby);
                        }
                    };

                    var filter = '';
                    if (dataSource.filter() != null) {
                        var filters = dataSource.filter().filters;
                        $.each(filters, function (i, f) {
                            filter += KendridFilterToSQL(f.field, f.operator, f.value);
                        });

                        filter = encodeURIComponent(filter);
                    };

                    var parameter = {
                        dbName: RoleOperate.dbName,
                        schema: RoleOperate.schema,
                        spName: 'usp_GetDataWithPager',
                        tableName: RoleOperate.schema + '.[ViewPaths]',
                        page: options.page,
                        pageSize: options.pageSize,
                        filter: filter,
                        orderby: orderby
                    };
                    return kendo.stringify(parameter);
                }


            }
        },
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
        pageSize: 20,
        schema: {
            model: {
                fields: {
                    ApplicationName: { type: "string" },
                    ApplicationDescription: { type: "string" },
                    PathDescription: { type: "string" },
                    Path: { type: "string" },
                }

            },
            data: function (response) {
                return jQuery.parseJSON(response.DataReadKendoGridResult).data;
            },
            total: function (response) {
                return jQuery.parseJSON(response.DataReadKendoGridResult).total;
            }

        },
    });


    return dataSource;
}

function KendridFilterToSQL(field, operator, value) {
    var hasZH = false;
    if (/[\u4E00-\u9FA5]/g.test(value)) {
        hasZH = true;
    }

    switch (operator) {
        case "eq":
            if (value.constructor == Number) {
                return " and " + field + " = " + value;
            }
            else if (value.constructor == Date) {
                return " and " + field + " = '" + value.dateFormat("yyyy-MM-dd") + "'";
            }

            if (hasZH) {
                return " and " + field + " = N'" + value + "'";
            }
            return " and " + field + " = '" + value + "'";
        case "neq ":
            if (value.constructor == Number) {
                return " and " + field + " != " + value;
            }
            else if (value.constructor == Date) {
                return " and " + field + " = '" + value.dateFormat("yyyy-MM-dd") + "'";
            }
            if (hasZH) {
                return " and " + field + " != N'" + value + "'";
            }
            return " and " + field + " != '" + value + "'";
        case "startswith":
            if (hasZH) {
                return " and " + field + " like N'" + value + "%'";
            }
            return " and " + field + " like '" + value + "%'";
        case "contains":
            if (hasZH) {
                return " and " + field + " like N'%" + value + "%'";
            }
            return " and " + field + " like '%" + value + "%'";
        case "doesnotcontain":
            if (hasZH) {
                return " and " + field + " not like N'%" + value + "%'";
            }
            return " and " + field + " not like '%" + value + "%'";
        case "endswith":
            if (hasZH) {
                return " and " + field + " like N'%" + value + "'";
            }
            return " and " + field + " like '%" + value + "'";
        case "isnull":
            return " and " + field + " is null";
        case "isnotnull":
            return " and " + field + " is not null";
        case "isempty":
            return " and " + field + " = ''";
        case "isnotempty":
            return " and " + field + " != ''";
        case "gte":
            if (value.constructor == Date) {
                return " and " + field + " >= '" + value.dateFormat("yyyy-MM-dd") + "'";
            }
            return " and " + field + " >= " + value;
        case "gt":
            if (value.constructor == Date) {
                return " and " + field + " > '" + value.dateFormat("yyyy-MM-dd") + "'";
            }
            return " and " + field + " > " + value;
        case "lte":
            if (value.constructor == Date) {
                return " and " + field + " <= '" + value.dateFormat("yyyy-MM-dd") + "'";
            }
            return " and " + field + " <= " + value;
        case "lt":
            if (value.constructor == Date) {
                return " and " + field + " < '" + value.dateFormat("yyyy-MM-dd") + "'";
            }
            return " and " + field + " < " + value;
    }
}

var selectedRowIndex = -1;
var pageIndex = 0;




function runderGrid() {
    $("#grid").html("");
    var grid = $("#grid").kendoGrid({
        dataSource: dataSource(),
        height: winHeight - 100,
        selectable: "multiple",
        filterable: true,
        sortable: true,

        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5,
            page: 1,
            pageSize: 20,
            pageSizes: [20, 50, 100, 500]
        },
        columns: [
            {
                field: "ApplicationName",
                title: '应用名称',
                width: "150px",
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center"
                }
            },
            {
                field: "ApplicationDescription",
                title: '应用描述',
                width: "150px",
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center"
                }
            },
            {
                field: "PathName",
                title: '菜单名称',
                width: "150px",
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center"
                }
            },
            {
                field: "PathDescription",
                title: '菜单描述',
                width: "150px",
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center"
                }
            },
            {
                title: '路径链接',
                template: '#=getURL(Path)#',
                width: "400px",
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center"
                }
            },
            {

                title: '角色管理',
                template: '#=getOperate(PathId)#',
                width: "150px",
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center"
                }
            }
        ],
        dataBound: function () {
            var rows = this.items();
            var page = this.pager.page() - 1;
            var pagesize = this.pager.pageSize();
            if (page != pageIndex) {
                selectedRowIndex = -1;
                pageIndex = page;
            }
            $(rows).each(function () {
                var index = $(this).index();
                var dataIndex = $(this).index() + page * pagesize;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).attr("index", index);
                $(rowLabel).attr("dataIndex", dataIndex);
            });

            if (selectedRowIndex > -1) {
                selectGridRow(selectedRowIndex);
            }
        }
    });

}

function getURL(path)
{
    return '<a class="row-number" target="_top" href="' + path + '"> ' + path + '</a>';
}

function getOperate(pathId) {
    var html = "";
    //var modulesUrl = 'pathModules.html?pathId=' + pathId;
    //html += '<button class="row-number  btn btn-primary"  onclick="pathModules(this,\'' + modulesUrl + '\');">模块 </button>';
    //html += '&nbsp;&nbsp;&nbsp;';
    var pathRolesUrl = 'pathRoles.html?pathId=' + pathId + '&flag=1';
    html += '<button class="row-number  btn btn-primary"  onclick="pathRoles(this,\'' + pathRolesUrl + '\');"> 角色</button>';
    return html;
}

function pathRoles(obj, pathRolesUrl) {
    selectedRowIndex = $(obj).attr("index");
    selectGridRow(selectedRowIndex);
    showDialogPage(pathRolesUrl, '角色', winWidth * 3 / 5, winHeight * 4 / 5, function () {  });
}

function pathModules(obj, modulesUrl) {
    selectedRowIndex = $(obj).attr("index");
    selectGridRow(selectedRowIndex);
    showDialogPage(modulesUrl, '页面模块', winWidth * 3 / 5, winHeight * 4 / 5, function () { });
}


function selectGridRow(rowIndex) {
    var grid = $("#grid").data("kendoGrid");
    grid.clearSelection();
    row = grid.tbody.find(">tr:not(.k-grouping-row)").eq(rowIndex);
    grid.select(row);
}



