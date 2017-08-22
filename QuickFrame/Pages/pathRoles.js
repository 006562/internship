var pathId;
var winHeight = 500;
var winWidth = 500;
var RoleList = [];
$(function () {
    winHeight = $(window.parent.document).height();
    winWidth = $(window.parent.document).width();
    pathId = getQueryString("pathId");
    RoleList.length = 0;
    RoleOperate.getRolesByPathId(pathId, function (data) {
        $.each(data, function (i, d) {
            RoleList.push(d);
        });
        $("#Roles").kendoMultiSelect({
            dataTextField: "RoleName",
            dataValueField: "RoleId",
            dataSource: RoleList
        });

    });
    runderGrid();
    registerEvent()
})

function refreshSelect()
{
    RoleList.length = 0;
    RoleOperate.getRolesByPathId(pathId, function (data) {
        $.each(data, function (i, d) {
           RoleList.push(d);
        });
        $("#Roles").data('kendoMultiSelect').dataSource.read();
        $("#Roles").data('kendoMultiSelect').refresh();
    });
  
}
function registerEvent()
{
    //添加角色
    $("#btnAddRoles").click(function () {
        var multiSelect = $("#Roles").data("kendoMultiSelect");
        var roleIds = multiSelect.value();
        if (roleIds.length > 0) {
            var xml = '<Items>';
            $.each(roleIds, function (i, roleId) {
                xml += '<Item>';
                xml += '<RoleId>' + roleId + '</RoleId>';
                xml += '<PathId>' + pathId + '</PathId>';
                xml += '</Item>';
            })
            xml += '</Items>';
            RoleOperate.savePathRoles(xml, function (result) {
                if (!isNaN(result)) {
                    refreshSelect();
                    //刷新数据
                    $("#grid").data('kendoGrid').dataSource.read();
                    $("#grid").data('kendoGrid').refresh();
                }
                else {
                    alertMsg("Error:" + result, 'icon-warning');
                }
            });
        } else {
            alertMsg("请选择角色");
        };
    });
}
 

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

                    var orderby = 'RoleName';
                    if (dataSource.sort() != null) {
                        if (dataSource.sort().length > 0) {
                            orderby = dataSource.sort()[0].field + " " + dataSource.sort()[0].dir;
                            orderby = encodeURIComponent(orderby);
                        }
                    };

                    var filter = "and PathId='"+pathId+"'";
                    if (dataSource.filter() != null) {
                        var filters = dataSource.filter().filters;
                        $.each(filters, function (i, f) {
                            filter += KendridFilterToSQL(f.field, f.operator, f.value);
                        });

                        filter = encodeURIComponent(filter);
                    };

                    var parameter = {
                        dbName:RoleOperate.dbName,
                        schema: RoleOperate.schema,
                        spName: 'usp_GetDataWithPager',
                        tableName: RoleOperate.schema + '.[View_PathsRoles]',
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
                    RoleName: { type: "string" },
                    Description: { type: "string" },
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
        height: winHeight - 250,
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
                field: "RoleName",
                title: '角色名称',
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
                field: "Description",
                title: '角色描述',
                width: "230px",
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

                title: '操作',
                template: '#=getOperate(PathId,RoleId)#',
                width: "60px",
               // locked: true,
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

function getOperate(PathId, RoleId)
{
    var html = '';
    html = '<button class="btn btn-delete btn-danger" onclick="deletePathRole(\''+PathId+'\',\''+RoleId+'\')">删除</button>';
    return html;
}

function deletePathRole(PathId, RoleId)
{
    if (confirm("确定要删除这条记录？")) {
        RoleOperate.deletePathRoles(PathId, RoleId, function (result) {
            if (!isNaN(result))
            {
                //刷新数据
                $("#grid").data('kendoGrid').dataSource.read();
                $("#grid").data('kendoGrid').refresh();

                refreshSelect();
            } else {
                alertMsg("Error:" + result, 'icon-warning');
            }
        })
    }
}

function selectGridRow(rowIndex) {
    var grid = $("#grid").data("kendoGrid");
    grid.clearSelection();
    row = grid.tbody.find(">tr:not(.k-grouping-row)").eq(rowIndex);
    grid.select(row);
}