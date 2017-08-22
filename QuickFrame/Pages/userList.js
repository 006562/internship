//LoadLanguage("userList", true);
//var winHeight = 500;
//var winWidth = 500;
//var viewModel;
//var myModel = {
//    Language: {},
//}
var set = "zh-CN"

$(function () {
    winHeight = $(window.parent.document).height();
    winWidth = $(window.parent.document).width();

    //set = getQueryString("set");
    //if (set == null)
    //    set = "zh-CN";
    //if (set == "zh-CN") {
    //    //汉化kendo日历
    //    kendo.culture("zh-CN");
    //}
    //myModel.Language = Language;
    //var dealNode = document.getElementById('qcList');
    //viewModel = ko.mapping.fromJS(myModel);
    //ko.applyBindings(viewModel, dealNode);

    //注册按钮事件
    regsterEvent();

    runderGrid();

    //汉化kendo日历
     kendo.culture("zh-CN");
});
function regsterEvent() {
    $('#btnAdd').click(function () {
        showDialogPage('./addUser.html?', '', winWidth * 3 / 5, winHeight * 4 / 5, function () {
            var haveDoneAction = window.frames["dialogIframe"].HaveDoneAction;
            if (haveDoneAction) {
                runderGrid();
            }
        });
    });
    
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

                    var orderby = 'UserName';
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
                        tableName: RoleOperate.schema + '.[ViewUsers]',
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
                    UserName: { type: "string" },
                    IsApproved:{ type: "bool"},
                    IsLockedOut:{ type: "bool" },
                    CreateDate: { type: "date" },
                    LastActiveDate: { type: "date" },
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
        height: winHeight-100,
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
                field: "UserName",
                title: "用户名称",
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
                 field: "IsApproved",
                 title: "是否审批",
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
                  field: "IsLockedOut",
                  title: "是否锁定",
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
                  field: "CreateDate",
                  title: "创建日期",
                  format: "{0:yyyy-MM-dd}",
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
                field: "LastActiveDate",
                title: "最新活跃日期",
                format: "{0:yyyy-MM-dd}",
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
                   template: '#=getOperate(UserId,IsRoot)#',
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

function getOperate(UserId,IsRoot) {
    var html = "";
    var flag;
    if (IsRoot == 0) {  }
    else { flag = "none";}
    var editPageUrl1 = 'membership.html?UserId=' + UserId + '&set=' + set;
    var editPageUrl2 = 'profile.html?UserId=' + UserId + '&set=' + set;
    var editPageUrl3 = 'userRoles.html?UserId=' + UserId + '&set=' + set;
    html += '<button class="row-number  btn btn-primary" style="display:' + flag + ';" onclick="rowEdit(this,\'编辑用户详情\',\'' + editPageUrl1 + '\');"> 编辑</button>';
    html += '&nbsp;&nbsp;';
    html += '<button class="row-number  btn btn-primary" style="display:' + flag + ';" onclick="rowEdit(this,\'编辑用户资料\',\'' + editPageUrl2 + '\');">资料</button>';
    html += '&nbsp;&nbsp;';
    html += '<button class="row-number  btn btn-primary"  onclick="rowEdit(this,\'编辑用户角色\',\'' + editPageUrl3 + '\');"> 角色</button>';
    html += '&nbsp;&nbsp;';
    html += '<button class="btn btn-delete btn-danger" style="display:' + flag + ';"  onclick="deleteUserById(\'' + UserId + '\')"> 删除</button>';
    return html;
}
function deleteUserById(UserId) {
    if (confirm("确定要删除吗？")) {
        RoleOperate.deleteUserById(UserId, function (result) {
            if (!isNaN(result)) {
                //刷新数据
                $("#grid").data('kendoGrid').dataSource.read();
                $("#grid").data('kendoGrid').refresh();
            }
            else {
                alertMsg("Error：" + result);
            }

        })
    }
}
function rowEdit(obj,title,editPageUrl) {
    selectedRowIndex = $(obj).attr("index");
    selectGridRow(selectedRowIndex);
    showDialogPage(editPageUrl, title, winWidth * 3 / 5, winHeight * 4 / 5, function () {
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