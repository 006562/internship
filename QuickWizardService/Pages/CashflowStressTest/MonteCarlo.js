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

        Sections: [
		/*
		{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '输入参数',
            Identity: 'Section01dentity',
            FieldsSetting: {
                HasOptionalFields: false,
                Fields: [
                    { ItemId: '1', ItemCode: 'CashflowInput', ItemAliasValue: '现金流入', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'RecoveryRate', ItemAliasValue: '回收率', DataType: 'float', IsCompulsory: 1, IsDisplay: 1, ItemValue: '' }
                ]
            }
			
			,
            Buttons: [
                { Text: '开始计算', Click: 'RunSingleScenario("Section02dentity")', Class: 'btn btn-primary' },
                { Text: '查看结果', Click: 'ViewResultSingleScenario()', Class: 'btn btn-default' }
			]
			
        },
		*/
		{
		    Templ: GlobalVariable.UiTempl_Grid,
		    Title: '分档违约景况表',
		    Identity: 'Section01Identity',
		    FieldsSetting: {
		        GridView: [], Detail: [], DetailsTitle: '景况编辑', DetailsOptionalFields: [], HasOptionalFields: true
                , InnerText: { Operate: '操作', BtnEdit: '编辑', BtnDelete: '删除', BtnSave: '保存', BtnClear: '清除' }
		    },
		    Buttons: [
                { Text: '保存', Click: 'SavePageItems()', Class: 'btn btn-primary' },
                { Text: '运行压力景况1&2', Click: 'RunStressScenario()', Class: 'btn btn-primary' },
                { Text: '计算', Click: 'CalculateMCResults(this)', Class: 'btn btn-primary' },
                 { Text: '导出', Click: 'Export()', Class: 'btn btn-primary' }
           ]
        }
		
		],
        Customize: { MCResult: '蒙特卡洛压力测试结果', RecoveryRateMapping: '回收率下降表', StressResultAggregation: '现金流压力测试结果' },
        MonteCarloItem: [],
        CalulateDetail: [],
        ShowCalulate: false
    },

    // 'en-US': {
        // Sections: [{
            // Templ: GlobalVariable.UiTempl_Grid,
            // Title: 'Layer Information',
            // Identity: 'Section01Identity',
            // FieldsSetting: {
                // GridView: [], Detail: [], DetailsTitle: 'Layer Details', DetailsOptionalFields: [], HasOptionalFields: true
                // , InnerText: { Operate: 'Operation', BtnEdit: 'Edit', BtnDelete: 'Delete', BtnSave: 'Save', BtnClear: 'Reset' }
            // },
            // Buttons: [
                // { Text: 'Save', Click: 'SavePageItems(this)', Class: 'btn btn-primary' }
            // ]
        // }]
    // },

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
    gdvOperation.TrustId = BusinessIdentifier;
    getViewMonteCarloTest()
    ViewMonteCarloItem(BusinessIdentifier);
    //getPageData_press(BusinessCode, BusinessIdentifier, PageId, set, PageItemsLoaded);
        
		ViewRecoveryRateMapping();
		ViewMCResult();
});

function getViewMonteCarloTest() {
    var executeParam = { SPName: 'TrustManagement.usp_GetCalculateMonteCarloTest', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (items) {
        var calulates = dataModel.Model(set).CalulateDetail;
        $.each(items, function (i, d) {
            calulates.push(d);
    })
    });
    }
function calculateMC(BusinessIdentifier) {
    var executeParam = { SPName: '[TrustManagement].[usp_CalculateMonteCarloTest]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
    });
        }

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
    //var a = viewModel.Model('zh-CN').MonteCarloItem();

    var items = gdvOperation.GetItems(0);

    var allItems = items;

    //var pop = mac.wait("Data Saving");
    savePageData(BusinessCode, BusinessIdentifier, PageId, allItems, function (result) {
		SaveMCItems();
        // if (pop != null) {
            // pop.close();
            // pop = mac.complete("Saved Successfully!");
        // }
    });
}

function Export() {

    //var sContext = {
    //    appDomain: 'Task',
    //    sessionVariables: "<SessionVariables><SessionVariable><Name>TrustID</Name><Value>" + BusinessIdentifier + "</Value><DataType>String</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable></SessionVariables>",
    //    taskCode: 'ExportMonteCarloTable'
    //};
    //var downloadPath = 'https://poolcutwcf/QuickWizardService/Files/Output/MonteCarlo.xlsx'
    //mywebProxy.createSessionByTaskCode(sContext, function (sessionId) {
    //    mywebProxy.runCashFlow("Task", sessionId, function () {
    //        window.location.href = downloadPath;
    //    })
    //});

    var tpi = new TaskProcessIndicatorHelper();

    var downloadPath = 'https://poolcutwcf/QuickWizardService/Files/Output/MonteCarlo.xlsx';
    tpi.AddVariableItem('TrustID', BusinessIdentifier, 'String');

    tpi.ShowIndicator('Task', 'ExportMonteCarloTable', function (result) {
        //ViewResultSingleScenario();
        window.location.href = downloadPath; 

    });


}

function RunStressScenario(obj) {
    var MonteCarloDetail = viewModel.MonteCarloItem();
    var PoolBalance = 0.00;
    var DefaultRate = 0.00;
    $.each(MonteCarloDetail, function (i, d) {
        if (d.ItemCode() == 'PoolBalance')
        {
            PoolBalance = parseFloat(d.ItemValue());
        } else if (d.ItemCode() == 'DefaultRate') {
            DefaultRate = parseFloat(d.ItemValue());
        }
    });

    var tpi = new TaskProcessIndicatorHelper();
	
    tpi.AddVariableItem('TrustID', BusinessIdentifier, 'String');
    tpi.AddVariableItem('PoolBalance', PoolBalance, 'String');
    tpi.AddVariableItem('DefaultRate', DefaultRate, 'String');
    
    tpi.ShowIndicator('Task', 'RunMCScenario', function (result) {
		window.location.reload();
    });
}



var mywebProxy = {
    createSessionByTaskCode: function (sContext, callback) {
        var sessionVariables_p = encodeURIComponent(sContext.sessionVariables);
        var serviceUrl = GlobalVariable.TaskProcessEngineServiceURL + "CreateSessionByTaskCode?applicationDomain=" + sContext.appDomain + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + sContext.taskCode;
	
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (sessionId) {
                callback(sessionId);
            },
            error: function (response) { alert(response); }
    });
    },
    runCashFlow: function (appDomain, sessionId, callback) {
        var serviceUrl = "https://poolcutwcf/CashFlowEngine/CashFlowStudioService.svc/jsAccessEP/" + "RunTask/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                callback(false);
			}
        });
    },
}


var mywebProxy = {
    createSessionByTaskCode: function (sContext, callback) {
        var sessionVariables_p = encodeURIComponent(sContext.sessionVariables);
        var serviceUrl = GlobalVariable.TaskProcessEngineServiceURL + "CreateSessionByTaskCode?applicationDomain=" + sContext.appDomain + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + sContext.taskCode;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (sessionId) {
                callback(sessionId);
            },
            error: function (response) { alert(response); }
        });
    },
    runCashFlow: function (appDomain, sessionId, callback) {
        var serviceUrl = "https://poolcutwcf/CashFlowEngine/CashFlowStudioService.svc/jsAccessEP/" + "RunTask/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                callback(false);
            }
        });
    },
}

//***********//GridViews Data Sort and UI Operation Events//***********//
var gdvsGridSetting = {};
var calulateTitle = {
    ClassName: '证券简称',
    Rating: '原始评级',
    RequiredDefaultRate: '需承受的违约比率',
    NormalScenarioDefaultRate: '正常情况下能承受的违约比率',
    StressScenario1DefaultRate: '压力景况1下能承受的违约比率',
    StressScenario2DefaultRate: '压力景况2下能承受的违约比率'
}

var gdvOperation = {
    TrustId: 0,
    SortSourceData: function (items, sectionIndex) {
        var calulates = dataModel.Model(set).CalulateDetail;
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
                var calulate = {};
                $.each(row, function (i, d) {
                    gridItem[d.ItemCode] = d.ItemValue;
                    if (d.DataType == "Select") {
                        //var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                        gridItem[d.ItemCode + "_Text"] = d.ItemValue;
                    } else if (d.DataType == "Decimal") {
                        gridItem[d.ItemCode + "_Text"] = getMoneyText(d.ItemValue, set);
                    }
                });
                gridItem['GroupId01'] = row[0].GroupId01
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
            if (d.Bit01) {
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
            this.Update(sectionIndex, editIndex, obj);
        } else {
            //New Add
            
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
            if (key == 'GroupId01') {
                $.each(detail, function (i, d) {
                    var itemValue = item[key]();
                    d.GroupId01(itemValue)
                })
            }
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
    Update: function (sectionIndex, editIndex, obj) {
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
        // var pop = mac.wait("Data Saving");
        // saveSaveMonteCarloToTrustBond(detail, this.TrustId, function (result) {
            // if (pop != null) {
                // pop.close();
                // pop = mac.complete("Saved Successfully!");
            // }
        // });
        this.InitDetail(sectionIndex);
    },
/*
    Savetems: function (obj) {
        var detail = viewModel.MonteCarloItem();
        var items = '<Items>'
        $.each(detail, function (i, d) {
            items += '<Item>'
            items += '<ItemId>' + d.ItemId() + '</ItemId>';
            items += '<ItemCode>' + d.ItemCode() + '</ItemCode>';
            items += '<ItemValue>' + d.ItemValue() + '</ItemValue>';
            items += '</Item>';
        })
        items += '</Items>';
        var executeParam = { SPName: '[TrustManagement].[usp_SaveMonteCarloToTrustInfo]', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'TrustId', Value: this.TrustId, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'Items', Value: items, DBType: 'xml' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        var pop = mac.wait("Data Saving");
        CallWCFSvc(serviceUrl, false, 'GET', function (data) {
            if (pop != null) {
                pop.close();
                pop = mac.complete("Saved Successfully!");
            }
        });
    },
*/	
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
        html += '</td>';
        $(html).appendTo($(element));
    }
}

ko.bindingHandlers.renderGridMonteCarloHeader = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var header = valueAccessor();
        var sectionIndex = allBindings.get('sectionIndex');
        var html = '';
        var gColumns = calulateTitle;
        html += '<th>' + gColumns.ClassName + '</th>';
        html += '<th>' + gColumns.Rating + '</th>';
        html += '<th>' + gColumns.RequiredDefaultRate + '</th>';
        html += '<th>' + gColumns.NormalScenarioDefaultRate + '</th>';
        html += '<th>' + gColumns.StressScenario1DefaultRate + '</th>';
        html += '<th>' + gColumns.StressScenario2DefaultRate + '</th>';
        $(html).appendTo($(element));
    }
}
ko.bindingHandlers.renderGridMonteCarloColumn = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        //var displayText = valueAccessor();
        //var sectionIndex = allBindings.get('sectionIndex');
        var html = '';
        html += '<td  data-bind="text: ClassName"></td>';
        html += '<td  data-bind="text: Rating"></td>';
        html += '<td  data-bind="text: RequiredDefaultRate"></td>';
        html += '<td  data-bind="text: NormalScenarioDefaultRate"></td>';
        html += '<td  data-bind="text: StressScenario1DefaultRate"></td>';
        html += '<td  data-bind="text: StressScenario2DefaultRate"></td>';
        $(html).appendTo($(element));
    }
}

function ViewMonteCarloItem(BusinessIdentifier) {
    var executeParam = { SPName: 'TrustManagement.usp_GetMonteCarloItembyId', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', function (data) {
        var MonteCarloItem = dataModel.Model('zh-CN').MonteCarloItem;
        $.each(data, function (i, d) {
            //gCodeIds[d.ItemCode] = d.ItemValue;
            if (d.ItemCode == 'CashflowInput') {
                d.ItemAliasValue = '现金流入（元）'
            } else if (d.ItemCode == 'RecoveryRate') {
                d.ItemAliasValue = '回收率 （%）'
            }
            dataModel.Model('zh-CN').MonteCarloItem.push(d);
        });
        getPageData_press(BusinessCode, BusinessIdentifier, PageId, set, PageItemsLoaded);
    });
}

function ViewRecoveryRateMapping() {
    //getStressResults(function (rows) { displayTableData('#table_StressResults', rows); });
    getRecoveryRateMapping(function (rows) { displayDiscountTableData('#table_RecoveryRateMapping', rows); });

    $('#page_main_result1').show();
}

function ViewMCResult() {
    //getStressResults(function (rows) { displayTableData('#table_StressResults', rows); });
    getMCResult(function (rows) { displayTableData('#table_MCResult', rows); });

    $('#page_main_result2').show();
}

function displayDiscountTableData(tbDom, rows) {
    var $table = $(tbDom)
    if (!rows || rows.length < 1) { return }
    var tblThs = [];
    var row = rows[0];
    for (var col in row) {
        var this_title = ''
        if (col == 'Rating')
        { this_title = '评级档位' } else if (col == 'Discount') {
            this_title = '回收率降低比例 (%)'
        } else if (col == 'ReducedRecovery') {
            this_title = '降低后的回收率 (%)'
        }
        var th = { field: col, title: this_title, align: 'center' }
        tblThs.push(th);
    }
    $table.bootstrapTable({ columns: tblThs, data: rows });
}

function displayTableData(tbDom, rows) {
    var $table = $(tbDom)
    if (!rows || rows.length < 1) { return }
    var tblThs = [];
    var row = rows[0];
    for (var col in row) {
        var th = { field: col, title: col, align: 'center' }
        tblThs.push(th);
    }
    $table.bootstrapTable({ columns: tblThs, data: rows });
}

function getRecoveryRateMapping(callback) {
    var executeParam = { SPName: 'TrustManagement.usp_GetRecoveryRateMapping', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', callback);
}

function ViewMCResult(callback) {
    var executeParam = { SPName: 'TrustManagement.usp_GetRecoveryRateMapping', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustID', Value: BusinessIdentifier, DBType: 'string' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, true, 'GET', callback);
}

function getPageData_press(businessCode, businessIdentifier, pageId, set, callback) {
    var executeParam = { SPName: '[TrustManagement].[usp_GetPageItems_MonteCarlo]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'BusinessCode', Value: businessCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'BusinessIdentifier', Value: businessIdentifier, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'ItemAliasSetName', Value: set, DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        callback(data);
    });
}

var pop;

function SaveMCItems(obj) {
    var detail = viewModel.MonteCarloItem();
    var items = '<Items>'
    $.each(detail, function (i, d) {
        items += '<Item>'
        items += '<ItemId>' + d.ItemId() + '</ItemId>';
        items += '<ItemCode>' + d.ItemCode() + '</ItemCode>';
        items += '<ItemValue>' + d.ItemValue() + '</ItemValue>';
        items += '</Item>';
    })
    items += '</Items>';
    var executeParam = { SPName: '[TrustManagement].[usp_SaveMonteCarloToTrustInfo]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'Items', Value: items, DBType: 'xml' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));

    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
	    alertMsg('保存成功！');
    });
}

function CalculateMCResults(obj) {
	calculateMC(BusinessIdentifier);
	location.reload(true);
}

function SaveGridItems() {
    var items = gdvOperation.GetItems(0);

    var allItems = items;
    savePageData(BusinessCode, BusinessIdentifier, PageId, allItems, function (result) {
        if (pop != null) {
            pop.close();
            pop = mac.complete("Saved Successfully!");
        }
    });
}

function saveSaveMonteCarloToTrustBond(data, businessIdentifier, callback) {
    var items = '<Items>'

    var item = viewModel.Sections()[0].FieldsSetting.GridView();//里面包含所有属性
    var detail = viewModel.Sections()[0].FieldsSetting.Detail();
    var RequiredDefaultRateId = ''
    var StressScenario1AmountId = ''
    var StressScenario2AmountId = ''
    $.each(detail, function (i, d) {
        if (d.ItemCode() == 'RequiredDefaultRate') {
            RequiredDefaultRateId = d.ItemId()
        } else if (d.ItemCode() == 'StressScenario1Amount') {
            StressScenario1AmountId = d.ItemId()
        } else if (d.ItemCode() == 'StressScenario2Amount') {
            StressScenario2AmountId = d.ItemId()
        }
    });
    $.each(item, function (i, row) {
		items += '<Item>'
        items += '<ItemId>' + RequiredDefaultRateId + '</ItemId>';
        items += '<ItemCode>RequiredDefaultRate</ItemCode>';
        if (row.RequiredDefaultRate() != 'null') {
            items += '<ItemValue>' + row.RequiredDefaultRate() + '</ItemValue>';
        } else {
            items += '<ItemValue></ItemValue>';
        }
        items += '<TrustBondId>' + row.GroupId01() + '</TrustBondId>';
        items += '</Item>';
        items += '<Item>'
        items += '<ItemId>' + StressScenario1AmountId + '</ItemId>';
        items += '<ItemCode>StressScenario1Amount</ItemCode>';
        if (row.StressScenario1Amount() != 'null') {
            items += '<ItemValue>' + row.StressScenario1Amount() + '</ItemValue>';
        } else {
            items += '<ItemValue></ItemValue>';
        }
        items += '<TrustBondId>' + row.GroupId01() + '</TrustBondId>';
        items += '</Item>';
        items += '<Item>'
        items += '<ItemId>' + StressScenario2AmountId + '</ItemId>';
        items += '<ItemCode>StressScenario2Amount</ItemCode>';
        if (row.StressScenario2Amount() != 'null') {
            items += '<ItemValue>' + row.StressScenario2Amount() + '</ItemValue>';
        } else {
            items += '<ItemValue></ItemValue>';
            }
        items += '<TrustBondId>' + row.GroupId01() + '</TrustBondId>';
        items += '</Item>';
    })
    items += '</Items>';


    var Param = { SPName: '[TrustManagement].[usp_SaveMonteCarloToTrustBond]', SQLParams: [] };
    Param.SQLParams.push({ Name: 'TrustId', Value: businessIdentifier, DBType: 'string' });
    Param.SQLParams.push({ Name: 'Items', Value: items, DBType: 'xml' });

    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(Param));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
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

    var executeParam = { SPName: '[TrustManagement].[usp_SavePageItems_presstesting]', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'BusinessIdentifier', Value: businessIdentifier, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'PageItemXML', Value: items, DBType: 'xml' });
  
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        callback(data);
    });
}
