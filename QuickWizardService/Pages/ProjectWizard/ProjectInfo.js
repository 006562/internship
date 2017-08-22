/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout-3.4.0.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout.mapping-latest.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />

document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

//Language set name
var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;
var PageId = 27;

var gridColumns = [];
var getItemId = {};

var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: '分层信息',
            Identity: 'Section01Identity',
            FieldsSetting: {
                GridView: [], Detail: [], DetailsTitle: '分层详细信息', DetailsOptionalFields: [], HasOptionalFields: false
                , InnerText: { Operate: '操作', BtnEdit: '编辑', BtnDelete: '删除', BtnSave: '保存', BtnClear: '清除' }
            },
            Buttons: [
                { Text: '保存', Click: 'SaveGridData(this)', Class: 'btn btn-primary' }
            ]
        }]
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: 'Layer Information',
            Identity: 'Section01Identity',
            FieldsSetting: {
                GridView: [], Detail: [], DetailsTitle: 'Layer Details', DetailsOptionalFields: [], HasOptionalFields: false
                , InnerText: { Operate: 'Operation', BtnEdit: 'Edit', BtnDelete: 'Delete', BtnSave: 'Save', BtnClear: 'Reset' }
            },
            Buttons: [
                { Text: 'Save', Click: 'SaveGridData(this)', Class: 'btn btn-primary' }
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
    DataOperate.getPageData(BusinessCode, BusinessIdentifier, PageId, set, PageDataItemLoaded);
});

function PageDataItemLoaded(items) {
    var fieldsSetting = dataModel.Model(set).Sections[0].FieldsSetting;
    setGridViewDataModelFields(items, fieldsSetting);

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    setDatePlugins();
    $('#loading').fadeOut();
}
function setGridViewDataModelFields(items, model) {
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
            //将第一组数据作为Detial模板
            if (details == null) {
                details = row;
            }

            //排序
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

    $.each(details, function (i, d) {
        d['IsDisplay'] = false;
        d['IsNew'] = false;
        d.ItemValue = "";
        if (d.IsCompulsory) {
            d.IsDisplay = true;
        }
        else {
            d.IsDisplay = false;
            model.DetailsOptionalFields.push(d);
        }

        if (d.Bit01) {
            gridColumns.push(d);
        }
        getItemId[d.ItemCode] = d.ItemId;
        model.Detail.push(d);
    });
};
function setDatePlugins() {
    $("#page_main_container").find('.date-plugins').date_input();
}

function ValidateSectionFields(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    return validControls(sectionFieldsSelector);
}
function SaveGridData(obj) {
    var sectionIndex = $(obj).attr('sectionIndex');
    if (!sectionIndex) return;

    var pop = mac.wait("Data Saving");

    var array = [];
    var gridViewData = viewModel.Sections()[sectionIndex].FieldsSetting.GridView();
    $.each(gridViewData, function (i, d) {
        for (key in d) {
            if (key != "__ko_mapping__") {
                var index = key.indexOf("_Text");
                if (index < 0) {
                    var value = d[key]();
                    var id = getItemId[key];
                    var item = new DataOperate.DataItem();
                    item.ItemId = id;
                    item.ItemValue = value;
                    item.GroupId01 = i;
                    array.push(item);
                }
            }
        }
    });
    DataOperate.savePageData(BusinessCode, BusinessIdentifier, PageId, array, function (result) {
        if (pop != null) {
            pop.close();
            pop = mac.complete("Saved Successfully!");
        }
    });
}

var gdvOperation = {

    //创建一个动态字段
    addOptionalField: function () {
        var itemCode = $('#tb_CompulsoryDDL').val();
        if (itemCode != null) {
            var detail = viewModel.Detail();
            var itemT;
            $.each(detail, (function (i, item) {
                if (item.ItemCode() == itemCode) {
                    item.IsDisplay(true);
                    item.IsNew(true);
                    itemT = item;
                }

            }));
            viewModel.Detail.remove(itemT);
            viewModel.Detail.push(itemT);
        }
    },

    //删除动态字段
    deleteOptionalField: function (obj) {
        var itemCode = $(obj).attr('itemCode');
        var detail = viewModel.Detail();
        $.each(detail, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                item.ItemValue("");
                item.IsDisplay(false);
                item.IsNew(false);
            }
        }));
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
                    var text = $("#dropDown_" + item.ItemId()).find("option:selected").text();
                    newItem[item.ItemCode() + '_Text'] = text;
                } else if (item.DataType() == "Decimal") {
                    newItem[item.ItemCode() + '_Text'] = getMoneyText(item.ItemValue(), set);
                }

                newItem[item.ItemCode()] = item.ItemValue();
            });

            newItem = ko.mapping.fromJS(newItem);
            viewModel.Sections()[sectionIndex].FieldsSetting.GridView.push(newItem);
            this.InitDetail(sectionIndex);
            //清空已有显示内容
            this.Clear(sectionIndex);
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

    //点击编辑获取详情页
    Detail: function (obj) {
        var $section = $(obj).parents('.main-section');
        var sectionIndex = $section.attr('sectionIndex');
        var sectionId = $section.attr('id');

        var editIndex = $(obj).attr('itemIndex');

        var btnSaveSelector = '#' + sectionId + ' .gdv-detail-btnSave';
        $(btnSaveSelector).attr('editIndex', editIndex);

        this.InitDetail(sectionIndex); //初始化Detail为最初状态
        this.Clear(sectionIndex);//清空已有显示内容

        var item = viewModel.Sections()[sectionIndex].FieldsSetting.GridView()[editIndex];
        for (var key in item) {
            //key就是ItemCode
            var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
            $.each(detail, function (i, d) {
                if (d.ItemCode() == key) {
                    var itemValue = item[key]();
                    if (itemValue != "") {
                        d.ItemValue(itemValue);
                        if (d.IsCompulsory() == false) {
                            d.IsDisplay(true);
                            d.IsNew(true);
                        }
                    }
                }
            })
        }

        setDatePlugins();
    },

    //更新新分层
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
                var text_d = getMoneyText(d.ItemValue(),set);
                item[d.ItemCode() + '_Text'](text_d);
            }
        })
        this.InitDetail(sectionIndex);
        this.Clear(sectionIndex);//清空
    },

    //删除一个分层
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
        this.Clear(sectionIndex);
    },

    //删除所有动态字段从Detail模板,初始化状态
    InitDetail: function (sectionIndex) {
        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();

        $.each(detail, function (i, item) {
            if (item.DataType() == "Date") {
                item.ItemValue("");
            }

            if (item.IsNew()) {
                item.IsNew(false);
                item.IsDisplay(false);
            }
        });

        setDatePlugins();
    }
};


///////////////Konckout Rendering Plugin Register////////////////////
ko.bindingHandlers.renderGridHeader = {
    init: function (element, valueAccessor) {
        var header = valueAccessor();
        var html = '';
        $.each(gridColumns, function (i, item) {
            html += '<th>' + item.ItemAliasValue + '</th>';
        });

        html += '<th>' + header + '</th>';
        $(html).appendTo($(element));
    }
}
ko.bindingHandlers.renderGridColumn = {
    init: function (element, valueAccessor) {
        var displayText = valueAccessor();
        var html = '';
        $.each(gridColumns, function (i, item) {
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

