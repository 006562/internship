/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout-3.4.0.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout.mapping-latest.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/asyncBoxDialog.js" />
/// <reference path="E:\SFM\Projects\JD_Cloud\QuickWizardService\QuickWizard\Scripts\highcharts.js" />

document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;
var PageId = 35;
var set;

var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: '分层信息',
            Identity: 'Section01Identity',
            FieldsSetting: {
                GridView: [], Detail: [], DetailsTitle: '分层详细信息', DetailsOptionalFields: [], HasOptionalFields: true
                , InnerText: { Operate: '操作', BtnView: '查看', BtnRun: '运行', BtnEdit: '编辑', BtnDelete: '删除', BtnSave: '保存', BtnClear: '清除' }
            },
            Buttons: [
                { Text: '保存', Click: 'SavePageItems(this)', Class: 'btn btn-primary' },
                { Text: '运行', Click: 'Run(this)', Class: 'btn btn-primary' },
                 { Text: '刷新曲线', Click: 'RefreshChart(this)', Class: 'btn btn-primary' }
                //{ Text: '查看结果', Click: 'ViewResults(this)', Class: 'btn btn-default' }
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
                , InnerText: { Operate: 'Operation', BtnView: 'View', BtnRun: 'Run', BtnEdit: 'Edit', BtnDelete: 'Delete', BtnSave: 'Save', BtnClear: 'Reset' }
            },
            Buttons: [
                { Text: 'Save', Click: 'SavePageItems(this)', Class: 'btn btn-primary' },
                { Text: 'Run', Click: 'run(this)', Class: 'btn btn-primary' }
                //{ Text: 'View', Click: 'ViewResults(this)', Class: 'btn btn-default' }
            ]
        }]
    },

    Model: function () {
        return dataModel[set];
    }
};

$(function () {
    var CDitem;
    BusinessIdentifier = getQueryString("id");
    if (!BusinessIdentifier) {
        alert('Business Identifier is Required!');
        return;
    }
    
    set = getLanguageSet();
    //DataOperate.getPageData(BusinessCode, BusinessIdentifier, PageId, set, PageItemsLoaded);
    var executeParam = { SPName: 'TrustManagement.Project.usp_GetStressTestData', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'int' });
    executeParam.SQLParams.push({ Name: 'PageStep', Value: 'collection', DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        CDitem = $.grep(data, function (item) { return item.ItemCode == 'CD' || item.ItemCode == 'Number'; });
        PageItemsLoaded(CDitem);
        //callback(data);
    });
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
function SavePageItems() {

    var temp = gdvOperation.GetItems(0);

    var array = temp;

    var pop = mac.wait("Data Saving");

    var itemsTmpl = '<is>{0}</is>';
    var itemTmpl = '<i><id>{0}</id><v>{1}</v><g1>{2}</g1><si>{3}</si></i>';

    var items = '';
    $.each(array, function (i, v) {
        var grouId01 = (typeof v.GroupId01 == 'undefined') ? '' : v.GroupId01;//存在GroupId01==0 情况
        items += itemTmpl.format(v.ItemId, v.ItemValue || '', grouId01, v.SectionIndex || 0);
    });
    items = itemsTmpl.format(items);

    var executeParam = { SPName: 'TrustManagement.Project.usp_SaveStressTestData', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'int' });
    executeParam.SQLParams.push({ Name: 'PageStep', Value: 'collection', DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'PageItemXML', Value: items, DBType: 'xml' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        //callback(data);
    });
    if (pop != null) {
        pop.close();
        pop = mac.complete("Saved Successfully!");
    }
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
                    } else if (d.DataType == "Decimal") {
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
                var code = item.ItemCode();
                if (item.DataType() == "Select") {
                    var text = $("#" + code).find("option:selected").text();
                    newItem[code + '_Text'] = text;
                } else if (item.DataType() == "Decimal") {
                    newItem[code + '_Text'] = getMoneyText(item.ItemValue(), set);
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
                var text_s = $("#" + code).find("option:selected").text();
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
        top.GSDialog.Open('&nbsp;&nbsp;&nbsp;&nbsp;', '/QuickWizardService/Pages/CashflowStressTest/CurveDialog_CD.html', transData, function (result) {
            if (result && result.isSave) {
                var item = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[itemIndex];
                item[itemCode](result.data);
            }
        }, 900, 560);
    }
    , View: function (obj) {
        window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=" + BusinessIdentifier);
    }
    , Run: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var itemIndex = $(obj).attr('itemIndex');

        var items = gdvOperation.GetItems(sectionIndex);
        DataOperate.savePageData(BusinessCode, BusinessIdentifier, PageId, items, function (r) {
            var tpi = new top.TaskProcessIndicatorHelper();
            tpi.AddVariableItem('TrustId', BusinessIdentifier, 'int');
            tpi.AddVariableItem('PageId', PageId, 'int');
            tpi.AddVariableItem('EditIndex', itemIndex, 'int');

            tpi.ShowIndicator('Task', 'CashflowStressRun');
        });
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
            if (code == 'CD') {
                html += '<td align="center"><div class="fixed-len" onclick="gdvOperation.OpenDialog(this)" itemCode="' + code + '"'
                    + ' data-bind="text: ' + code + ', attr:{itemIndex:$index,  title:' + code + ' }"></div></td>';
            } else {
                html += '<td data-bind="text: ' + code + '"></td>';
            }
        });
        html += '<td class="btn-group-sm">';
        html += '<input type="button" class="btn btn-primary btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.View(this)" value="' + displayText.BtnView() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-primary btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Run(this)" value="' + displayText.BtnRun() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-primary btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Detail(this)" value="' + displayText.BtnEdit() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-danger btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Delete(this)" value="' + displayText.BtnDelete() + '"//>';
        html += '</td>';
        $(html).appendTo($(element));
    }
}
function ChartClass() {
    var chartOperation = {
        curverSeries: [],
        curverCategories: [],
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#DDDF00', '#FF9655']
    , colorIndex: -1,
        LoadCharts: function () {
            var self = this;
            //self.curverCategories = [];
            //self.curverSeries = [];
            var data = gdvOperation.GetItems(0);
            for (var i = 0; i < data.length; i += 2) {

                //self.curverCategories = "1,2,3".split(',');
                self.colorIndex = (self.colorIndex == 10) ? 0 : self.colorIndex + 1;
                var aryData = data[i + 1].ItemValue.split(',');
                for (var j = 0; j < aryData.length; j++)
                    self.curverCategories.push(j + 1);
                aryData = $.map(aryData, function (item, index) {
                    return parseFloat(item);
                });
                self.curverSeries.push({ name: data[i].ItemValue, data: aryData, color: self.colors[self.colorIndex] });
            }
        }
    , showCharts: function () {
        var self = this;
        $('#AllCurveChart').highcharts({
            title: { text: '循环购买曲线' },
            subtitle: { text: 'Curvers for Circular Buying' },
            xAxis: { categories: self.curverCategories },
            yAxis: {
                title: { text: '循环购买率' },
                plotLines: [{ value: 0, width: 1, color: '#808080' }]
            },
            tooltip: { valueSuffix: '%' },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', width: 150, borderWidth: 0 },
            series: self.curverSeries
        });
    }

    };
    return chartOperation;
}
function RefreshChart()
{
    var co = ChartClass();
    co.LoadCharts();
    co.showCharts();

}

