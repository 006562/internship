var winHeight = 500;
var winWidth = 500;
var set = "zh-CN"
var selectedRowIndex = -1;
var pageIndex = 0;
var db;
var sc;
$(function () {
    db = getQueryString("db");
    sc = getQueryString("sc");
    AdminOperate.dbName = db;
    AdminOperate.schema = sc;
    winHeight = $(window.parent.document).height();
    winWidth = $(window.parent.document).width();
    registerEvent();
    runderGrid();
    kendo.culture("zh-CN");
})

function registerEvent() {
    $("#btnAdd").click(function () {
        showDialogPage('addItemList.html?db='+db+'&sc='+sc, '添加', winWidth * 2.5 / 5, winHeight * 4 / 5, function () {
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
                          field: "ItemId",
                          title: "字段编码",
                          width: "60px",
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
                field: "ItemAliasValue",
                title: "字段名称",
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
                 field: "ItemAliasSetName",
                 title: "设置名称",
                 width: "50px",
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
                field: "ItemCode",
                title: "英文名称",
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
                  field: "CategoryAlias",
                  title: "所属类别",
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
                  template: '#=getOperate(ItemAliasId)#',
                  width: "100px",
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

function getOperate(ItemAliasId) {
    var html = "";
    html += '<button class="row-number btn btn-primary" onclick="editList(\'' + ItemAliasId + '\')" >编辑</button>';
    html += '&nbsp;&nbsp;<button class="btn btn-delete btn-danger" onclick="deleteList(\'' + ItemAliasId + '\')">删除</button>';
    return html;
}

function editList(iaid) {
    showDialogPage('addItemList.html?iaid=' + iaid+'&db='+db+'&sc='+sc, '编辑', winWidth * 2.5 / 5, winHeight * 4 / 5, function () {
        var haveDoneAction = window.frames["dialogIframe"].HaveDoneAction;
        if (haveDoneAction) {
            runderGrid();
        }
    });
}

function deleteList(iaid) {
    if (confirm("确定删除此条记录？")) {
        AdminOperate.DeleteItem(iaid, function (r) {
            if (r == "0") {
                runderGrid();
            } else { alertMsg('Failed：' + r, 'icon-warning'); }
        });
    }
}

function dataSource() {
    var dataSource = new kendo.data.DataSource({
        transport: {

            read: {
                url: AdminOperate.wizardService + 'DataReadKendoGrid',
                contentType: "application/json",
                type: "POST",
                dataType: "jsonp",

            },

            parameterMap: function (options, operation) {
                if (operation == "read") {

                    var orderby = 'ItemAliasId';
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
                        DBName: AdminOperate.dbName,
                        Schema: AdminOperate.schema,
                        spName: 'usp_GetDataWithPager',
                        tableName: AdminOperate.schema + '.[View_Admin_Item]',
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
                    ItemId: { type: "string" },
                    ItemAliasValue: { type: "string" },
                    ItemAliasSetName: { type: "string" },
                    ItemCode: { type: "string" },
                    ICategoryAlias: { type: "string" },
                    ItemCode: { type: "string" }
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

function selectGridRow(rowIndex) {
    var grid = $("#grid").data("kendoGrid");
    grid.clearSelection();
    row = grid.tbody.find(">tr:not(.k-grouping-row)").eq(rowIndex);
    grid.select(row);
}

function closeWindow() {
    $('#modal-close').trigger('click');
}
