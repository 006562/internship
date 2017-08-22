var db;
var sc;
$(function () {
    winHeight = $(window.parent.document).height();
    winWidth = $(window.parent.document).width();
    db = getQueryString("db");
    sc = getQueryString("sc");
    AdminOperate.dbName = db;
    AdminOperate.schema = sc;
    //注册按钮事件
    regsterEvent();
    runderGrid();
});
function regsterEvent() {  
    $('#btnAdd').click(function () {
        showDialogPage('./editPage.html?flag=1&db='+db+'&sc='+sc, '', winWidth * 3 / 5, winHeight * 4 / 5, function () {
            var haveDoneAction = window.frames["dialogIframe"].HaveDoneAction;
            if (haveDoneAction) {
                runderGrid();
            }
        });
    });

    $("#pa").click(function () {
        $("#ed").text("");
        $(".rem").hide();
        $("#pageList").show();
            runderGrid();
    });
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

                    var orderby = 'PageId';
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
                        tableName: AdminOperate.schema  + '.[Page]',
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
                    PageId: { type: "int" },
                    PageCode: { type: "string" },
                    PageTitle: { type: "string" },
                    PageDescription: { type: "string" },                  
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
                field: "PageId",
                title: "页面编号",
                width: "120px",
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
                 field: "PageCode",
                 title: "页面编码",
                 width: "120px",
                 headerAttributes: {
                     "class": "table-header-cell",
                     style: "text-align: center"
                 },
                 attributes: {
                     "class": "table-cell",
                     style: "text-align: center"
                 },
             },
              {
                  field: "PageTitle",
                  title: "页面标题",
                  width: "120px",
                  headerAttributes: {
                      "class": "table-header-cell",
                      style: "text-align: center"
                  },
                  attributes: {
                      "class": "table-cell",
                      style: "text-align: center"
                  },
              },
              {
                  field: "PageDescription",
                  title: "页面描述",
                  width: "120px",
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
                   template: '#=getOperate(PageId)#',
                   width: "200px",
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
function getOperate(PageId) {
    var html = "";
    var editPageUrl1 = 'editPage.html?PageId=' + PageId+'&flag=2&db='+db+'&sc='+sc;
    var editPageUrl2 = 'pageItem.html?PageId=' + PageId+'&db='+db+'&sc='+sc;
    html += '<button class="row-number  btn btn-primary"  onclick="rowEdit(this,\'' + editPageUrl1 + '\',\'编辑\');"> 编辑</button>';
    html += '&nbsp;&nbsp;';
    html += '<button class="row-number  btn btn-primary"  onclick="rowEdit(this,\'' + editPageUrl2 + '\',\'元素\');"> 元素</button>';
    html += '&nbsp;&nbsp;';
    html += '<button class="btn btn-delete btn-danger"   onclick="deletePageById(' + PageId + ')"> 删除</button>';
    return html;
}
function deletePageById(PageId) {
    if (confirm("确定要删除吗？")) {
        AdminOperate.deletePageById(PageId, function (result) {
            if (!isNaN(result)) {
                //刷新数据
                alertMsg("Delete Successful!");
                $("#grid").data('kendoGrid').dataSource.read();
                $("#grid").data('kendoGrid').refresh();
            }
            else {
                alertMsg("Error：" + result);
            }

        })
    }
}
function rowEdit(obj, editPageUrl,txt) {
    selectedRowIndex = $(obj).attr("index");
    selectGridRow(selectedRowIndex);
    $("#pageList").hide();
    $("#ed").text(txt);
    $("#if").attr('src', editPageUrl);
    $("#iframe").show();
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