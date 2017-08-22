/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />
/// <reference path="../../Scripts/calendar.min.js" />
/// <reference path="../../Scripts/knockout-3.4.0.js" />
/// <reference path="../../Scripts/knockout.mapping-latest.js" />

var set;
var viewModel;
var dataModel = {
    Category1: [], Category2: [], Category3: [], Category4: [], Category5: [],
    Table1: [], Table2: [], Table3: [], Table4: [], Table5: [],
    TotalCost: '--', TotalSpread: '--'
};
$(function () {
    //set = getLanguageSet();

    // var executeParam = { SPName: '[Pricing].[usp_GetAvailableCurves]', SQLParams: [] };
    // var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    // CallWCFSvc(serviceUrl, false, 'GET', function (data) {
    // $.each(data, function (i, v) {
    // var obj = {};
    // obj.id = v.CurveName;
    // obj.name = v.CurveName;
    // dataModel.AllCurve.push(obj);
    // });
    // });

    var obj = {};
    obj.id = '借：100201 银行存款';
    obj.name = '借：100201 银行存款';
    dataModel.Category1.push(obj);
    var obj = {};
    obj.id = '贷：224799 其他应付款';
    obj.name = '贷：224799 其他应付款';
    dataModel.Category1.push(obj);

    var obj = {};
    obj.id = '借：224799 其他应付款';
    obj.name = '借：224799 其他应付款';
    dataModel.Category2.push(obj);
    var obj = {};
    obj.id = '贷：114101 个人消费贷款';
    obj.name = '贷：114101 个人消费贷款';
    dataModel.Category2.push(obj);
    var obj = {};
    obj.id = '贷：140110 个人逾期贷款';
    obj.name = '贷：140110 个人逾期贷款';
    dataModel.Category2.push(obj);
    var obj = {};
    obj.id = '贷：140201 个人非应计贷款';
    obj.name = '贷：140201 个人非应计贷款';
    dataModel.Category2.push(obj);
    var obj = {};
    obj.id = '借：193171 代管理正常贷款';
    obj.name = '借：193171 代管理正常贷款';
    dataModel.Category2.push(obj);
    var obj = {};
    obj.id = '借：193172 代管理逾期贷款';
    obj.name = '借：193172 代管理逾期贷款';
    dataModel.Category2.push(obj);
    var obj = {};
    obj.id = '贷：231192 代管理贷款资金';
    obj.name = '贷：231192 代管理贷款资金';
    dataModel.Category2.push(obj);

    var obj = {};
    obj.id = '借：161199 其他应收款项';
    obj.name = '借：161199 其他应收款项';
    dataModel.Category3.push(obj);
    var obj = {};
    obj.id = '贷：224719 代收代管理贷款应付款';
    obj.name = '贷：224719 代收代管理贷款应付款';
    dataModel.Category3.push(obj);

    var obj = {};
    obj.id = '借：224799 其他应付款项';
    obj.name = '借：224799 其他应付款项';
    dataModel.Category4.push(obj);
    var obj = {};
    obj.id = '贷：161199 其他应收款项';
    obj.name = '贷：161199 其他应收款项';
    dataModel.Category4.push(obj);
    var obj = {};
    obj.id = '贷：522108 信贷资产转让收益';
    obj.name = '贷：522108 信贷资产转让收益';
    dataModel.Category4.push(obj);
    var obj = {};
    obj.id = '借：550708 信贷资产转让损失';
    obj.name = '借：550708 信贷资产转让损失';
    dataModel.Category4.push(obj);

    var obj = {};
    obj.id = '借：5101 贷款利息收入';
    obj.name = '借：5101 贷款利息收入';
    dataModel.Category5.push(obj);
    var obj = {};
    obj.id = '贷：224719 代收代管理贷款应付款';
    obj.name = '贷：224719 代收代管理贷款应付款';
    dataModel.Category5.push(obj);
    var obj = {};
    obj.id = '借：224719 代收代管理贷款应付款';
    obj.name = '借：224719 代收代管理贷款应付款';
    dataModel.Category5.push(obj);
    var obj = {};
    obj.id = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
    obj.name = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
    dataModel.Category5.push(obj);

    //StepPage.Load();
    viewModel = ko.mapping.fromJS(dataModel);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    //curverOperation.LoadAllCurverZTree();
	
    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    AddLayer1: function () {
        var obj = { Category: '', Amount: '', TranscationDate: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table1.push(obsObj);
        this.DateRegister();
    },

    AddLayer2: function () {
        var obj = { Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table2.push(obsObj);
    },
    AddLayer3: function () {
        var obj = { Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table3.push(obsObj);
    },
    AddLayer4: function () {
        var obj = { Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table4.push(obsObj);
    },
    AddLayer5: function () {
        var obj = { Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table5.push(obsObj);
    },
    RemoveLayer1: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.Table1()[itemIndex];
        viewModel.Table1.remove(objObj);
    },
    RemoveLayer2: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.Table2()[itemIndex];
        viewModel.Table2.remove(objObj);
    },
    RemoveLayer3: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.Table3()[itemIndex];
        viewModel.Table3.remove(objObj);
    },
    RemoveLayer4: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.Table4()[itemIndex];
        viewModel.Table4.remove(objObj);
    },
    RemoveLayer5: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.Table5()[itemIndex];
        viewModel.Table5.remove(objObj);
    },
    CalculateTotal: function () {
        //alert(Number(viewModel.Table1()[0].Amount()));
        //alert(viewModel.Table1()[0].Category());
        for (i = 0; i < viewModel.Table1().length; i++) {
            alert(viewModel.Table1()[i].Category() + Number(viewModel.Table1()[i].Amount()));
        }
    },
    Save: function () {
        var table1 = viewModel.Table1;
        table1 = ko.mapping.toJS(table1);
        //  table1  is a json array  
        // $.each()

        alert('保存成功');
    },
    LoadPageItems: function () {
        //trustid .... fetch args
        //callwcf and get an items array(all page tables)
        //sort items 
        //dataModel.Table1=[items above]

    },


    DateRegister: function () {
        $('.date-plugins').date_input();
    }

};


