/// <reference path="../../Scripts/TaskIndicatorScript.js" />

document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;
var PageId = 23; //13;
var set;

var ServiceHostURL = "https://poolcutwcf/TaskProcessEngine/";
var sessionContext = '', sessionContextArray = [], tmpArray = [];
var configService = "https://poolcutwcf/TrustManagementServices/TrustManagementService.svc/jsAccessEP/";

var viewTemplate1 = "<table class=\"imagetable\"> <h2 align=\"center\";>加权平均</h2>" +
"<tr>" +
	"<th>情景</th><th>概率</th><th>总现金流</th><th>转出部分</th><th>自持部分</th>" +
"</tr>";
var viewTemplate2 = "<table class=\"imagetable\"> <h2 align=\"center\";>方差</h2>" +
"<tr>" +
	"<th>情景</th><th>概率</th><th>总现金流</th><th>转出部分</th><th>自持部分</th>" +
"</tr>";
var contentTemplate = "<tr>" +
	"<td>$ScenarioId$</td><td>$Probability$</td><td>$TotalCashflow_NPV$</td><td>$OutgoingCashflow_NPV$</td><td>$RetainedCashflow_NPV$</td>" +
"</tr>";


var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: '分层信息',
            Identity: 'Section01Identity',
            FieldsSetting: {
                GridView: [], Detail: [], DetailsTitle: '分层详细信息', DetailsOptionalFields: [], HasOptionalFields: true
                , InnerText: { Operate: '操作', BtnEdit: '编辑', BtnDelete: '删除', BtnView: '查看', BtnSave: '保存', BtnClear: '清除' }
            },
            Buttons: [
                { Text: '保存信息', Click: 'SavePageItems()', Class: 'btn btn-primary' },
                { Text: ' 运行 ', Click: 'RunItems(this)', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'LookItems(this)', Class: 'btn btn-default' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: 'Layer Information',
            Identity: 'Section01Identity',
            FieldsSetting: {
                GridView: [], Detail: [], DetailsTitle: 'Layer Details', DetailsOptionalFields: [], HasOptionalFields: true
                , InnerText: { Operate: 'Operation', BtnEdit: 'Edit', BtnDelete: 'Delete', BtnView: 'View', BtnSave: 'Save', BtnClear: 'Reset' }
            },
            Buttons: [
                { Text: 'Save', Click: 'SavePageItems()', Class: 'btn btn-primary' },
                { Text: ' Run ', Click: 'RunItems(this)', Class: 'btn btn-primary' },
                { Text: 'View', Click: 'LookItems(this)', Class: 'btn btn-default' }
            ]
        }]
    },

    Model: function () {
        return dataModel[set];
    }
};

$(function () {
    BusinessIdentifier = getQueryString("id");
    if (!BusinessIdentifier) {
        alert('Business Identifier is Required!');
        return;
    }

    set = getLanguageSet();
    DataOperate.getPageData(BusinessCode, BusinessIdentifier, PageId, set, PageItemsLoaded);
});

function PageItemsLoaded(items) {
    gdvOperation.SortSourceData(items, 0);

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    setFieldPlugins();
    $('#loading').fadeOut();
}
function setFieldPlugins() {
    $("#page_main_container").find('.date-plugins').date_input();
    $(".fixed-len").tooltip();
}

function ValidateSectionFields(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    return validControls(sectionFieldsSelector);
}
function SavePageItems(callback) {
    var items = gdvOperation.GetItems(0);

    var allItems = items;

    var pop = mac.wait("Data Saving");
    DataOperate.savePageData(BusinessCode, BusinessIdentifier, PageId, allItems, function (result) {
        if (pop != null) {
            pop.close();
            pop = mac.complete("Saved Successfully!");
        }
        if (callback) callback(result);
    });
}

//***********//GridViews Data Sort and UI Operation Events//***********//
var gdvsGridSetting = {};
var gdvOperation = {
    SortSourceData: function (items, sectionIndex) {
        var model = dataModel.Model(set).Sections[sectionIndex].FieldsSetting;
        var go = true;
        var rowId = 0;
        var details = null;
        while (go) {
            var row = $.grep(items, function (trustItem) {
                return trustItem.GroupId01 == rowId;
            });

            if (row.length == 0) {
                //当tbid=0时，row.length == 0，说明返回的只有模板
                if (details == null) {
                    details = items;
                }
                go = false;
            } else {
                if (details == null) {
                    details = row;
                }
                row = row.sort(function (a, b) {
                    return parseInt(a.SequenceNo) - parseInt(b.SequenceNo)
                });

                var gridItem = {};
                $.each(row, function (i, d) {
                    gridItem[d.ItemCode] = d.ItemValue;
                    if (d.DataType == "Select") {
                        var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                        gridItem[d.ItemCode + "_Text"] = item.ItemAliasValue;
                    }
                    else if (d.DataType == "Decimal") {
                        gridItem[d.ItemCode + "_Text"] = getMoneyText(d.ItemValue, set);
                    }
                });
                model.GridView.push(gridItem);
            }
            rowId++;
        }

        var gColumns = [];
        var gCodeIds = {};
        $.each(details, function (i, d) {
            d.ItemValue = '';
            if (d.Bit01) {//IsInGrid
                gColumns.push(d);
            }
            if (!d.IsCompulsory) {//IsOptional
                d.IsDisplay = 0;
            }

            gCodeIds[d.ItemCode] = d.ItemId;
            model.Detail.push(d);
        });
        gdvsGridSetting[sectionIndex] = { gridColumns: gColumns, gridCodeIds: gCodeIds };
    },
    AddOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var selSelector = '#' + sectionId + ' .gdv-optionalfields-select';
        var itemIndex = $(selSelector).val();
        if (!itemIndex) return;

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Detail()[itemIndex];
        item.IsDisplay(true);
        setFieldPlugins();
    },
    RemoveOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');

        var itemIndex = $(obj).attr('itemIndex');

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Detail()[itemIndex];
        item.ItemValue('');
        item.IsDisplay(false);
    },
    Save: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        if (!ValidateSectionFields(sectionId)) return;

        var btnSaveSelector = '#' + sectionId + ' .gdv-detail-btnSave';
        var editIndex = $(btnSaveSelector).attr('editIndex');

        if (editIndex && editIndex != -1) {
            //Edit Existed
            this.Update(sectionIndex, editIndex);
        } else {
            //New Add
            var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
            var newItem = {};
            $.each(detail, function (i, item) {
                if (item.DataType() == "Select") {
                    var text = $("#" + item.ItemCode()).find("option:selected").text();
                    newItem[item.ItemCode() + '_Text'] = text;
                } else if (item.DataType() == "Decimal") {
                    newItem[item.ItemCode() + '_Text'] = getMoneyText(item.ItemValue(), set);
                }

                newItem[item.ItemCode()] = item.ItemValue();
            });

            newItem = ko.mapping.fromJS(newItem);
            viewModel.Sections()[sectionIndex].FieldsSetting.GridView.push(newItem);

            this.InitDetail(sectionIndex);
        }
        $(btnSaveSelector).attr('editIndex', -1);
    },
    Clear: function (obj) {
        var sectionIndex;
        if (isNaN(obj)) {
            var $section = $(obj).parents('.main-section');
            sectionIndex = $section.attr('sectionIndex');
        } else { sectionIndex = obj; }

        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
        $.each(detail, function (i, item) {
            var dataType = item.DataType().toLocaleLowerCase();
            if (dataType == "bool") {
                item.ItemValue("0");
            } else {
                if (dataType != "select") {
                    item.ItemValue("");
                }
            }
        });
    },
    Detail: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var editIndex = $(obj).attr('itemIndex');

        var btnSaveSelector = '#' + sectionId + ' .gdv-detail-btnSave';
        $(btnSaveSelector).attr('editIndex', editIndex);

        this.InitDetail(sectionIndex);

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[editIndex];
        for (var key in item) {
            //key就是ItemCode
            var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
            $.each(detail, function (i, d) {
                if (d.ItemCode() == key) {
                    var itemValue = item[key]();
                    if (itemValue != "") {
                        d.ItemValue(itemValue);
                        d.IsDisplay(true);
                    }
                }
            })
        }

        setFieldPlugins();
    },
    Update: function (sectionIndex, editIndex) {
        var item = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[editIndex];//里面包含所有属性
        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
        $.each(detail, function (i, d) {
            var code = d.ItemCode();
            item[code](d.ItemValue());
            if (d.DataType() == "Select") {
                var text_s = $("#dropDown_" + d.ItemId()).find("option:selected").text();
                item[d.ItemCode() + '_Text'](text_s);
            } else if (d.DataType() == "Decimal") {
                var text_d = getMoneyText(d.ItemValue(), set);
                item[d.ItemCode() + '_Text'](text_d);
            }
        })
        this.InitDetail(sectionIndex);
    },
    Delete: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var index = $(obj).attr('itemIndex');
        var oNew = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[index];
        viewModel.Sections()[sectionIndex].FieldsSetting.GridView.remove(oNew);

        var btnSaveSelector = '#' + sectionId + ' .gdv-detail-btnSave';
        $(btnSaveSelector).attr('editIndex', -1);

        this.InitDetail(sectionIndex);
    },
    InitDetail: function (sectionIndex) {
        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();

        $.each(detail, function (i, item) {
            item.ItemValue("");
            if (!item.IsCompulsory()) {//IsOptional
                item.IsDisplay(false);
            }
        });

        setFieldPlugins();
    },
    GetItems: function (sectionIndex) {
        var array = [];
        var gCodeIds = gdvsGridSetting[sectionIndex].gridCodeIds;
        var gridViewData = viewModel.Sections()[sectionIndex].FieldsSetting.GridView();
        $.each(gridViewData, function (i, data) {
            for (field in data) {
                var itemId = gCodeIds[field];
                if (itemId) {
                    var item = {};
                    item.ItemId = itemId;
                    item.ItemValue = data[field]();
                    item.SectionIndex = sectionIndex;
                    item.GroupId01 = i;
                    array.push(item);
                }
            }
        });
        return array;
    }
    , OpenDialog: function (obj) {
        var $obj = $(obj);
        var $section = $obj.parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var itemIndex = $obj.attr('itemIndex');
        var itemCode = $obj.attr('itemCode');
        var itemValue = $obj.text();

        var transData = { ItemCode: itemCode, ItemValue: itemValue };
        top.GSDialog.Open('&nbsp;&nbsp;&nbsp;&nbsp;', 'Pages/CashflowStressTest/CurveDialog_CD.html', transData, function (result) {
            if (result && result.isSave) {
                var item = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[itemIndex];
                item[itemCode](result.data);
            }
        }, 900, 560);
    }
};
////Konckout Rendering Plugin Register----for GridView display////
ko.bindingHandlers.renderGridHeader = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var header = valueAccessor();
        var sectionIndex = allBindings.get('sectionIndex');
        var html = '';

        var gColumns = gdvsGridSetting[sectionIndex].gridColumns;
        $.each(gColumns, function (i, item) {
            html += '<th>' + item.ItemAliasValue + '</th>';
        });

        html += '<th>' + header + '</th>';
        $(html).appendTo($(element));
    }
}
ko.bindingHandlers.renderGridColumn = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var displayText = valueAccessor();
        var sectionIndex = allBindings.get('sectionIndex');
        var html = '';

        var gColumns = gdvsGridSetting[sectionIndex].gridColumns;
        $.each(gColumns, function (i, item) {
            var code = item.ItemCode;
            if (item.DataType == "Select" || item.DataType == "Decimal") {
                code = code + "_Text";
            }
            if (code == 'PP' || code == 'PD') {
                html += '<td align="center"><div class="fixed-len" onclick="gdvOperation.OpenDialog(this)" itemCode="' + code + '"'
                    + ' data-bind="text: ' + code + ', attr:{itemIndex:$index,  title:' + code + ' }"></div></td>';
            } else {
                html += '<td  data-bind="text: ' + code + '"></td>';
            }
        });
        html += '<td class="btn-group-sm">';
        html += '<input type="button" class="btn btn-primary btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Detail(this)" value="' + displayText.BtnEdit() + '"/> &nbsp;';
        //html += '<input type="button" class="btn btn-primary byn-sm" data-bind="attr: { itemIndex: $index }" onclick="trustBond_Run(this)" value="' + displayText.BtnRun() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-primary byn-sm" data-bind="attr: { itemIndex: $index }" onclick="trustBond_View(this)" value="' + displayText.BtnView() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-danger btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Delete(this)" value="' + displayText.BtnDelete() + '"//>';
        html += '</td>';
        $(html).appendTo($(element));
    }
}



///////////////////Extra Business Codes///////////////////////
function RunItems() {
    SavePageItems(function (result) {
        var tpi = new top.TaskProcessIndicatorHelper();
        tpi.AddVariableItem('BusinessIdentifier', BusinessIdentifier, 'String', 0, 0, 0);

        tpi.ShowIndicator('Task', 'QuickWizardProcess', function (response) {
            pageStorage.Set('sessionid_Bond', response);
        });
    });
}
function trustBond_Run(obj) {
    var editIndex = $(obj).attr('itemIndex');

    SavePageItems(function (result) { 
        var tpi = new top.TaskProcessIndicatorHelper();
        tpi.AddVariableItem('BusinessIdentifier', BusinessIdentifier, 'String', 0, 0, 0);
        tpi.AddVariableItem('editIndex', editIndex, 'String', 0, 0, 0);

        tpi.ShowIndicator('Task', 'RiskTransferBondRun', function (response) {
            pageStorage.Set('sessionid_Bond' + editIndex, response);
            //$.cookie('sessionid_Bond' + editIndex, response, { expires: 7 });
        });
    });
}
function trustBond_View(obj) {
    window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=998")
}
function LookItems() {
    var executeParam = { SPName: 'RiskTransfer.usp_GetRiskTransferResult', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'BusinessIdentifier', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', Show);
}

function Show(response) {
    var rs;
    var TotalCash
    var OutCash
    var RetainedCash
    var repl = document.getElementById('RawValue');
    var repp = document.getElementById("Variance");
    var reps = document.getElementById("ShowResult");
    $(repl).empty();
    $(repp).empty();
    $(reps).empty();
    var showResult = ''
    var html = '';
    var html2 = '';
    var flag = 1;
    html = html + viewTemplate1;
    html2 = html2 + viewTemplate2;
    var contentHtml;
    var json = response;
    var obj = eval(json);			//字符串转化为 数组

    for (var i = 0; i < obj.length; i++) {
        var dataJson = obj[i].DataJson;	//取出JSON字符串
        var dataArray = eval(dataJson);	//转化为数组
        for (var k = 0; k < dataArray.length; k++) {
            contentHtml = contentTemplate;	//获取模板
            var dataJsonObj = eval(dataArray[k]);	//转化为JSON对象
            for (j in dataJsonObj) {
                contentHtml = contentHtml.replace('$' + j + '$', dataJsonObj[j]);
                if (dataJsonObj[j] == 'Variance' || dataJsonObj[j] == 'Variance_WeighedAverage' || dataJsonObj[j] == 'SD') {
                    html2 += contentHtml;
                    if (dataJsonObj[j] == 'Variance_WeighedAverage') {
                        TotalCash = dataJsonObj['TotalCashflow_NPV'];
                        OutCash = dataJsonObj['OutgoingCashflow_NPV'];
                        RetainedCash = dataJsonObj['RetainedCashflow_NPV'];
                    }
                    //html2+='<br />';
                }
                else if (dataJsonObj[j] == 'RawValue' || dataJsonObj[j] == 'RawValue_WeighedAverage') {
                    html += contentHtml;
                    //html+='<br />';
                }
                else
                    flag = 0;
            }
        }
        html += '</table><br /><br />'
        html2 += '</table><br /><br />'

    }
    rs = (0.5 + (OutCash - RetainedCash) / (2 * TotalCash)) * 100;
    showResult += '<h3 style="text-align:center">风险报酬转移:' + rs.toFixed(2) + '%' + '</h3><br /><br /><br /><br />'
    $(html).appendTo($(repl));
    $(html2).appendTo($(repp));
    $(showResult).appendTo($(reps));
}
