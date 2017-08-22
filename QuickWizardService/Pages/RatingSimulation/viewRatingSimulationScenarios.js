var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;
var PageId = 20;
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
                , InnerText: { Operate: '操作', BtnEdit: '编辑', BtnRun: '运行', BtnView: '查看', BtnDelete: '删除', BtnSave: '保存', BtnClear: '清除' }
            },
            Buttons: []
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '逾期区间',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'ArrearsRange', ItemAliasValue: '逾期区间', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'OrganisationCode', ItemAliasValue: '资产机构', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'AssetType', ItemAliasValue: '资产类型', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    {
                        ItemId: '4', ItemCode: 'WALSource', ItemAliasValue: '现金流回收期限WAL', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Text: '使用指定WAL', Value: 'input' }, { Text: '使用现金流模拟结果', Value: 'cashflow' }]
                    },
                    { ItemId: '5', ItemCode: 'WALInput', ItemAliasValue: '回收期WAL', DataType: '', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '保存', Click: 'SavePageItems()', Class: 'btn btn-primary' },
                { Text: '运行', Click: 'Run_All()', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'View()', Class: 'btn btn-default' }
            ]
        }],
        Customize: { CustTitle01: '模拟评级结果', CustTitle02: '推荐分层' }
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Grid,
            Title: 'Layer Information',
            Identity: 'Section01Identity',
            FieldsSetting: {
                GridView: [], Detail: [], DetailsTitle: 'Layer Details', DetailsOptionalFields: [], HasOptionalFields: true
                , InnerText: { Operate: 'Operation', BtnEdit: 'Edit', BtnRun: 'Run', BtnView: 'View', BtnDelete: 'Delete', BtnSave: 'Save', BtnClear: 'Reset' }
            },
            Buttons: []
        }, {
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Arrears Range',
            Identity: 'Section02Identity',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    { ItemId: '1', ItemCode: 'ArrearsRange', ItemAliasValue: 'Arrears Range', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'OrganisationCode', ItemAliasValue: 'Organisation', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'AssetType', ItemAliasValue: 'Asset Type', DataType: 'CustSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    {
                        ItemId: '4', ItemCode: 'WALSource', ItemAliasValue: '现金流回收期限WAL', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Text: '使用指定WAL', Value: 'input' }, { Text: '使用现金流模拟结果', Value: 'cashflow' }]
                    },
                    { ItemId: '5', ItemCode: 'WALInput', ItemAliasValue: '回收期WAL', DataType: '', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Save', Click: 'SavePageItems()', Class: 'btn btn-primary' },
                { Text: 'Run', Click: 'Run_All()', Class: 'btn btn-primary' },
                { Text: 'View', Click: 'View()', Class: 'btn btn-default' }
            ]
        }],
        Customize: { CustTitle01: 'Simulation Rating Result', CustTitle02: 'Suggestion Layer' }
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

    DataOperate.getArrearsRange(BusinessIdentifier, function (response) {
        var jsonObject;
        var jsonArray = eval(response);
        for (var i = 0; i < jsonArray.length; i++) {
            jsonObject = jsonArray[i];
            $('#ArrearsRange').append("<option value='" + jsonObject.ArrearsRange + "'>" + jsonObject.ArrearsRange + "</option>");
        }
    });

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
function SavePageItems(callback) {
    var gItems = gdvOperation.GetItems(0);
    var sItems = []//sdvOperation.GetItems(1);//current standview fields aren't in db

    var allItems = gItems.concat(sItems);

    var pop = mac.wait("Data Saving");
    DataOperate.savePageData(BusinessCode, BusinessIdentifier, PageId, allItems, function (result) {
        if (pop != null) {
            pop.close();
            pop = mac.complete("Saved Successfully!");
        }
        if (callback) {
            callback(result);
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
        //html += '<input type="button" class="btn btn-primary byn-sm" data-bind="attr: { itemIndex: $index }" onclick="creditRating_Run(this)" value="' + displayText.BtnRun() + '"/> &nbsp;';
        //html += '<input type="button" class="btn btn-primary byn-sm" data-bind="attr: { itemIndex: $index }" onclick="creditRating_View(this)" value="' + displayText.BtnView() + '"/> &nbsp;';
        html += '<input type="button" class="btn btn-danger btn-sm" data-bind="attr: { itemIndex: $index }" onclick="gdvOperation.Delete(this)" value="' + displayText.BtnDelete() + '"//>';
        html += '</td>';
        $(html).appendTo($(element));
    }
}

function Run_All() {
    var WALSource = $('#WALSource').val();
    if (WALSource == 'input' && $('#WALInput').val() == '') { alert('尚未录入各档债券的WAL值'); return; }

    _taskCode = 'CreditRatingWithParams';

    var ArrearsRange = $('#ArrearsRange').val();
    var OrganisationCode = $('#Organisation').val();
    var AssetType = $('#AssetType').val();
    var WAL = $('#WALInput').val();
    var ratingAgency = 'MOODY';

    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('BusinessIdentifier', BusinessIdentifier, 'String', 0, 0, 0);
    tpi.AddVariableItem('TrustId', BusinessIdentifier, 'String', 0, 0, 0);
    tpi.AddVariableItem('AssetType', AssetType, 'String', 1, 0, 0);
    tpi.AddVariableItem('RatingAgency', ratingAgency, 'String', 1, 0, 0);
    tpi.AddVariableItem('ArrearsRange', ArrearsRange, 'String', 1, 0, 0);
    tpi.AddVariableItem('WALSource', WALSource, 'String', 1, 0, 0);
    tpi.AddVariableItem('WAL', WAL, 'String', 1, 0, 0);
    tpi.AddVariableItem('StartPeriod', 0, 'Int', 1, 0, 0);
    tpi.AddVariableItem('EndPeriod', -1, 'Int', 1, 0, 0);
    tpi.ShowIndicator('Task', 'CreditRatingWithParams', function (sessionId) {
        pageStorage.Set('TaskSessionId', sessionId);
    }, 'CashFlowProcess');
}

function View() {
    var trustId = BusinessIdentifier;

    var executeParam = { SPName: 'CreditRating.GetBondRatings', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: trustId, DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', function (response) {
        var $table = $('#tblBondRatings');
        var ths = [{ field: 'ClassName', title: '债券名称' },
                    { field: 'Percentage', title: '分层占比' },
                    { field: 'TrustBondRating', title: '实际评级/目标评级' },
                    { field: 'SimulatedRating', title: '测试评级' }];
        $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });
    });

    executeParam = { SPName: 'CreditRating.GetTrancheTestResults', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: trustId, DBType: 'string' });
    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', function (response) {
        var $table = $('#tblTrancheTestResults');
        var ths = [{ field: 'GroupId', title: '测试组别' },
                    { field: 'Class', title: '债券名称' },
                    { field: 'Percentage', title: '分层占比' },
                    { field: 'Support', title: '支撑厚度' },
                    { field: 'Rating', title: '测试评级' }];
        $table.bootstrapTable('destroy').bootstrapTable({ columns: ths, data: response });
    });
    $('.main-customize').removeClass('hidden');
}
