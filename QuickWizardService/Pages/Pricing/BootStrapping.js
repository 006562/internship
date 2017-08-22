document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var set;
var PageId = 14;
var BusinessCode = GlobalVariable.Business_Unique;
var BusinessIdentifier = 0;

var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: '债券信息',
            Identity: 'Section01Identity',
            FieldsSetting: {
                HasOptionalFields: true, GridView: [], Detail: [], DetailsTitle: '债券详细信息'
                , InnerText: { Operate: '操作', BtnEdit: '编辑', BtnDelete: '删除', BtnSave: '保存', BtnClear: '清除' }
            },
            Buttons: []
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '整体信息',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'BondSeriesName', ItemAliasValue: '债券系列名称', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: 'BenchmarkBonds' },
                    {
                        ItemId: '2', ItemCode: 'InterpolationMethod', ItemAliasValue: '插值方式', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'Linear', Text: '线性插值' }, { Value: 'Cubic', Text: '立方插值' }, { Value: 'MCS', Text: '单调三次方样条插值' }]
                    },
                    {
                        ItemId: '3', ItemCode: 'DayCountConvention', ItemAliasValue: '计日规则', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: '30/360', Text: '30/360' }, { Value: 'Actual/360', Text: 'Actual/360' }, { Value: 'Actual/365', Text: 'Actual/365' }, { Value: 'Actual/Actual', Text: 'Actual/Actual' }]
                    }
                ]
            },
            Buttons: [
                { Text: '保存信息', Click: 'SavePageItems("Section02Identity")', Class: 'btn btn-primary' },
                { Text: '计算零息票曲线', Click: 'runBootStrapping()', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'viewBootStrappingResult()', Class: 'btn btn-primary' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: 'Layer Information',
            Identity: 'Section01Identity',
            FieldsSetting: {
                HasOptionalFields: true, GridView: [], Detail: [], DetailsTitle: 'Layer Details'
                , InnerText: { Operate: 'Operation', BtnEdit: 'Edit', BtnDelete: 'Delete', BtnSave: 'Save', BtnClear: 'Reset' }
            },
            Buttons: []
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'General Information',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'BondSeriesName', ItemAliasValue: 'Bond Series Name', DataType: '', IsCompulsory: 1, IsDisplay: 1, ItemValue: 'BenchmarkBonds' },
                    {
                        ItemId: '2', ItemCode: 'InterpolationMethod', ItemAliasValue: 'Interpolation Method', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'Cubic', Text: 'Cubic' }, { Value: 'MCS', Text: 'MCS' }]
                    },
                    {
                        ItemId: '3', ItemCode: 'DayCountConvention', ItemAliasValue: 'Day Count Convention', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: '30/360', Text: '30/360' }, { Value: 'Actual/360', Text: 'Actual/360' }, { Value: 'Actual/365', Text: 'Actual/365' }, { Value: 'Actual/Actual', Text: 'Actual/Actual' }]
                    }
                ]
            },
            Buttons: [
                { Text: 'Save Data', Click: 'SavePageItems("Section02Identity")', Class: 'btn btn-primary' },
                { Text: 'Run', Click: 'runBootStrapping()', Class: 'btn btn-primary' },
                { Text: 'Result', Click: 'viewBootStrappingResult()', Class: 'btn btn-primary' }
            ]
        }]
    },

    Model: function (set) {
        return dataModel[set];
    }
};

$(function () {
    //BusinessIdentifier = getQueryString("id");
    //if (!BusinessIdentifier) {
    //    alert('Business Identifier is Required!');
    //    return;
    //}

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
}

function ValidateSectionFields(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    return validControls(sectionFieldsSelector);
}
function SavePageItems(obj) {
    var gridItems=gdvOperation.GetItems(0);
    //var standItems = sdvOperation.GetItems(1);

    var allItems = gridItems;//here we can concat other items array if necessary

    var pop = mac.wait("Data Saving");
    DataOperate.savePageData(BusinessCode, BusinessIdentifier, PageId, allItems, function (result) {
        if (pop != null) {
            pop.close();
            pop = mac.complete("Saved Successfully!");
        }
    });
}


//***********//StandViews Data Sort and UI Operation Events//***********//
var sdvOperation = {
    SortSourceData: function (items, sectionIndex) {
        var model = dataModel.Model(set).Sections[sectionIndex].FieldsSetting;
        model.Fields = items;
    },
    AddOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var selSelector = '#' + sectionId + ' .sdv-optionalfields-select';
        var itemIndex = $(selSelector).val();
        if (!itemIndex) return;

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Fields()[itemIndex];
        item.IsDisplay(true);
        setFieldPlugins();
    },
    RemoveOptionalField: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');

        var itemIndex = $(obj).attr('itemIndex');

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.Fields()[itemIndex];
        item.ItemValue('');
        item.IsDisplay(false);
    },
    GetItems: function (sectionIndex) {
        var array = [];
        var standViewData = viewModel.Sections()[sectionIndex].FieldsSetting.Fields();
        $.each(standViewData, function (i, field) {
            var itemId = field.ItemId();
            if (itemId && field.IsDisplay()) {
                var item = {};
                item.ItemId = itemId;
                item.ItemValue = field.ItemValue();
                item.SectionIndex = sectionIndex;
                array.push(item);
            }
        });
        return array;
    }
};


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

            html += '<td  data-bind="text: ' + code + '"></td>';
        });
        html += '<td class="btn-group-sm">';
        html += '<input type="button" class="btn btn-primary btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Detail(this)" value="' + displayText.BtnEdit() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-danger btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Delete(this)" value="' + displayText.BtnDelete() + '"//>';
        html += '</td>';
        $(html).appendTo($(element));
    }
}


//***********//All Others Business Codes//***********//
function viewBootStrappingResult() {
    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1005");
    //window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1005")
}

function runBootStrapping() {
    var BondType = $('#BondSeriesName').val();

    var tpi = new top.TaskProcessIndicatorHelper();
    tpi.AddVariableItem('BusinessIdentifier', BusinessIdentifier, 'string', 0, 0, 0);
    tpi.AddVariableItem('BondType', BondType, 'string', 0, 0, 0);

    tpi.ShowIndicator('Task', 'BootStrapping', function () { });
}

