/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout-3.4.0.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout.mapping-latest.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />

document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");


var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;
var PageId = 1;

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
                , IsShowPaymentSchedule: false, PaymentScheduleData: []
                , InnerText: { Operate: '操作', BtnEdit: '编辑', BtnDelete: '删除', BtnSave: '保存', BtnClear: '清除' }
            },
            Buttons: [
                { Text: '保存', Click: 'SavePageItems(this)', Class: 'btn btn-primary' }
            ]
        }]
    },

    Model: function () {
        return dataModel[set];
    }
};

var trustId = '';

$(function () {
    trustId = BusinessIdentifier = getQueryString("id");
    //BusinessIdentifier = getQueryString("id");
    if (!BusinessIdentifier) {
        alert('Business Identifier is Required!');
        return;
    }

    set = getLanguageSet();
    getPageData_press(BusinessCode, BusinessIdentifier, PageId, set, PageItemsLoaded);

    $('#PaymentConvention').change(function () {
        var objVal = $(this).val();
        if (objVal == '计划还本，按期付息') {
            viewModel.Sections()[0].FieldsSetting.IsShowPaymentSchedule(true);
        }
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
}

function ValidateSectionFields(sectionId) {
    var sectionFieldsSelector = '#' + sectionId + ' input[data-valid]';
    return validControls(sectionFieldsSelector);
}
function SavePageItems(obj) {
    var items = gdvOperation.GetItems(0);

    var allItems = items;

    //Loading.Show("Data Saving");
    savePageData(BusinessCode, BusinessIdentifier, PageId, allItems, function (result) {
        //Loading.Close();
        parent.qwFrame.ReloadStep('fee');
        parent.qwFrame.ReloadStep('sequence');
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
                        //var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                        gridItem[d.ItemCode + "_Text"] = d.ItemValue;
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
            if (d.ItemCode != 'StressScenario1Amount'
                && d.ItemCode != 'StressScenario2Amount'
                && d.ItemCode != 'RequiredDefaultRate') {
                gCodeIds[d.ItemCode] = d.ItemId;
                model.Detail.push(d);
            }
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
                var itemValue = item.ItemValue();
                if (code == 'PrincipalSchedule') {
                    return true;
                }
                if (item.DataType() == "Select") {
                    var text = $("#" + code).find("option:selected").text();
                    newItem[code + '_Text'] = text;
                } else if (item.DataType() == "Decimal") {
                    newItem[code + '_Text'] = getMoneyText(itemValue, set);
                }
                if (code == 'PaymentConvention') {
                    if (itemValue == '计划还本，按期付息') {
                        var plans = viewModel.Sections()[sectionIndex].FieldsSetting.PaymentScheduleData();
                        var pps = [];
                        $.each(plans, function (s, o) {
                            var planDate = o.PlanPayDate();
                            var planAmount = o.PlanAmount();
                            pps.push(planDate + ':' + planAmount);
                        });
                        newItem['PrincipalSchedule'] = pps.join(';');
                    } else {
                        newItem['PrincipalSchedule'] = '';
                    }
                }
                newItem[item.ItemCode()] = itemValue;
            });

            newItem = ko.mapping.fromJS(newItem);
            viewModel.Sections()[sectionIndex].FieldsSetting.GridView.push(newItem);
            viewModel.Sections()[sectionIndex].FieldsSetting.IsShowPaymentSchedule(false);
            viewModel.Sections()[sectionIndex].FieldsSetting.PaymentScheduleData.removeAll();

            this.InitDetail(sectionIndex);
        }
        $(btnSaveSelector).attr('editIndex', -1);
        $('#PaymentConvention').val('一次性还本付息');
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
        var detail = viewModel.Sections()[sectionIndex].FieldsSetting.Detail();
        for (var key in item) {
            //key就是ItemCode   
            if (key == 'PrincipalSchedule') {
                continue;
            }
            $.each(detail, function (i, d) {
                if (d.ItemCode() == key) {
                    var itemValue = item[key]();
                    if (itemValue != "") {
                        d.ItemValue(itemValue);
                        d.IsDisplay(true);
                    }
                
                    if (key == 'PaymentConvention') {
                        if (item[key]() == '计划还本，按期付息') {
                            var plans = item['PrincipalSchedule']();
                            viewModel.Sections()[sectionIndex].FieldsSetting.IsShowPaymentSchedule(true);
                            var obsPlans= viewModel.Sections()[sectionIndex].FieldsSetting.PaymentScheduleData;
                            var plansAry = plans.split(';');
                            $.each(plansAry, function (s, o) {
                                var plan = o.split(':');
                                var pps = { PlanPayDate: plan[0], PlanAmount: plan[1] };
                                obsPlans.push(ko.mapping.fromJS(pps));
                            });
                        }
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
            if (code == 'PrincipalSchedule') {
                return true;
            }
            var itemValue = d.ItemValue();
            item[code](itemValue);
            if (d.DataType() == "Select") {
                var text_s = $("#" + code).find("option:selected").text();
                item[d.ItemCode() + '_Text'](text_s);
            } else if (d.DataType() == "Decimal") {
                var text_d = getMoneyText(d.ItemValue(), set);
                item[d.ItemCode() + '_Text'](text_d);
            }
            if (code == 'PaymentConvention') {
                if (itemValue == '计划还本，按期付息') {
                    var plans = viewModel.Sections()[sectionIndex].FieldsSetting.PaymentScheduleData();
                    var pps = [];
                    $.each(plans, function (s, o) {
                        var planDate = o.PlanPayDate();
                        var planAmount = o.PlanAmount();
                        pps.push(planDate + ':' + planAmount);
                    });
                    item.PrincipalSchedule(pps.join(';'));
                }
                viewModel.Sections()[sectionIndex].FieldsSetting.IsShowPaymentSchedule(false);
                viewModel.Sections()[sectionIndex].FieldsSetting.PaymentScheduleData.removeAll();
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
        viewModel.Sections()[sectionIndex].FieldsSetting.IsShowPaymentSchedule(false);
        viewModel.Sections()[sectionIndex].FieldsSetting.PaymentScheduleData.removeAll();
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
                    item.ItemCode = field;
                    item.ItemValue = data[field]();
                    //item.SectionIndex = sectionIndex;
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


function getPageData_press(businessCode, businessIdentifier, pageId, set, callback) {
    var executeParam = { SPName: '[TrustManagement].[usp_GetPageItems_AllocationAdjustment]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'BusinessCode', Value: businessCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'BusinessIdentifier', Value: businessIdentifier, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'ItemAliasSetName', Value: set, DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        callback(data);
    });
}

function savePageData(businessCode, businessIdentifier, pageId, array, callback) {
    var itemsTmpl = '<is>{0}</is>';
    var itemTmpl = '<i><id>{0}</id><v>{1}</v><g1>{2}</g1><c1>{3}</c1></i>';

    var items = '';
    $.each(array, function (i, v) {
        var grouId01 = (typeof v.GroupId01 == 'undefined') ? '' : v.GroupId01;//存在GroupId01==0 情况
        items += itemTmpl.format(v.ItemId, v.ItemValue || '', grouId01, v.ItemCode || '');
    });
    items = itemsTmpl.format(items);

    var executeParam = { SPName: '[TrustManagement].[usp_SavePageItems_AllocationAdjustment]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'BusinessIdentifier', Value: businessIdentifier, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'PageItemXML', Value: items, DBType: 'xml' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
		alertMsg('保存成功！');
        callback(data);
    });
}
