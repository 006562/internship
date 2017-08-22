var winHeight = 500;
var winWidth = 500;
var set = "zh-CN"
var selectedRowIndex = -1;
var pageIndex = 0;

$(function () {
    winHeight = $(window.parent.document).height();
    winWidth = $(window.parent.document).width();
    registerEvent();
    runderGrid();
    kendo.culture("zh-CN");
});

function registerEvent() {
    $("#btnAppAdd").click(function () {
        showDialogPage('appDetail.html?flag=0', '添加', winWidth * 3 / 5, winHeight * 4 / 5, function () {
            var haveDoneAction = window.frames["dialogIframe"].HaveDoneAction;
            if (haveDoneAction) {
               runderGrid();
            }
        });

    });   
}


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
                title: "应用名称",                
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
                title: "应用描述",
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

                  title: "操作",
                  template: '#=getOperate(ApplicationId,IsRoot)#',
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

function getOperate(applicationId,isRoot) {
    var html = "";
    if (!isRoot) {
        var editPageUrl = 'appDetail.html?flag=1&appId=' + applicationId;
        html += '<button class="row-number btn btn-primary"  onclick="rowEdit(this,\'' + editPageUrl + '\');">编辑</button>';
        html += '&nbsp;&nbsp;';
    }
    var appPathsUrl = 'appPaths.html?appId=' + applicationId;//需要修改
    html += '<button class="row-number btn btn-primary" onclick="appPathsPage(this,\'' + appPathsUrl + '\');">子菜单</button>';
    html += '&nbsp;&nbsp;';
    var appRolesUrl = 'appRoles.html?appId=' + applicationId;//需要修改
    html += '<button class="row-number btn btn-primary" onclick="appRoles(this,\'' + appRolesUrl + '\');">角色</button>';
    if (!isRoot) {
        html += '&nbsp;&nbsp;';
        html += '<button class="btn btn-delete btn-danger" onclick="deleteApp(\'' + applicationId + '\')">删除</button>';
    }
    return html;
}


function dataSource() {
    var dataSource = new kendo.data.DataSource({
        transport: {

            read: {
                url: RoleOperate.roleService + 'DataReadKendoGrid',
                contentType: "application/json",
                type: "POST",
                dataType: "jsonp",

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
                        tableName: RoleOperate.schema + '.[Applications]',
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
                    Description: { type: "string" }
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

function appPathsPage(obj, appPathsUrl) {
    //alert('暂无链接页面！');
    selectedRowIndex = $(obj).attr("index");
    selectGridRow(selectedRowIndex);
    showDialogPage(appPathsUrl, '添加子菜单', winWidth * 3 / 5, winHeight * 4 / 5, function () { });
}

function deleteApp(ApplicationId) {
    if (confirm("确定删除此条记录？")) {
        RoleOperate.deleteAppById(ApplicationId, function () {
            //刷新数据
            $("#grid").data('kendoGrid').dataSource.read();
            $("#grid").data('kendoGrid').refresh();
        })

    }
}

function appRoles(obj, appRoleUrl)
{
    selectedRowIndex = $(obj).attr("index");
    selectGridRow(selectedRowIndex);
    showDialogPage(appRoleUrl, '角色管理', winWidth * 3 / 5, winHeight * 4 / 5, function () { });
}

function rowEdit(obj, editPageUrl) {
    selectedRowIndex = $(obj).attr("index");
    selectGridRow(selectedRowIndex);
    showDialogPage(editPageUrl, '编辑', winWidth * 3 / 5, winHeight * 4 / 5, function () {
        var haveDoneAction = window.frames["dialogIframe"].HaveDoneAction;
        if (haveDoneAction) {
            //刷新数据
            $("#grid").data('kendoGrid').dataSource.read();
            $("#grid").data('kendoGrid').refresh();
        }
    });
}

function selectGridRow(rowIndex) {
    var grid = $("#grid").data("kendoGrid");
    grid.clearSelection();
    row = grid.tbody.find(">tr:not(.k-grouping-row)").eq(rowIndex);
    grid.select(row);
}

function closeWindow() {
    $('#modal-close').trigger('click');   
}






