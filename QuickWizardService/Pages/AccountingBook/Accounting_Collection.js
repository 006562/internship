/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {	Category1:[], Category2:[], Category3:[], Category4:[],
					Table1: [], Table2: [], Table3: [], Table4: [],
					TotalCost:'--', TotalSpread:'--' };
$(function () {
    //set = getLanguageSet();
	
	var obj = {};
	obj.id = '借：100201 银行存款';
	obj.name = '借：100201 银行存款';
	dataModel.Category1.push(obj);		
	var obj = {	};
	obj.id = '贷：224719 代收代管理贷款应付款';
	obj.name = '贷：224719 代收代管理贷款应付款';
	dataModel.Category1.push(obj);
	var obj = {};
	obj.id = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
	obj.name = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
	dataModel.Category1.push(obj);		
	var obj = {	};
	obj.id = '收：613402 代管理贷款应收未收利息';
	obj.name = '收：613402 代管理贷款应收未收利息';
	dataModel.Category1.push(obj);
	
	var obj = {	};
	obj.id = '借：100201 银行存款';
	obj.name = '借：100201 银行存款';
	dataModel.Category2.push(obj);
	var obj = {	};
	obj.id = '贷：193171 代管理正常贷款';
	obj.name = '贷：193171 代管理正常贷款';
	dataModel.Category2.push(obj);
	var obj = {	};
	obj.id = '借：231192 代管理贷款资金';
	obj.name = '借：231192 代管理贷款资金';
	dataModel.Category2.push(obj);
	var obj = {	};
	obj.id = '贷：224719 代收代管理贷款应付款';
	obj.name = '贷：224719 代收代管理贷款应付款';
	dataModel.Category2.push(obj);
	var obj = {	};
	obj.id = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
	obj.name = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
	dataModel.Category2.push(obj);
	var obj = {	};
	obj.id = '贷：193172 代管理逾期贷款';
	obj.name = '贷：193172 代管理逾期贷款';
	dataModel.Category2.push(obj);
	
	var obj = {};
	obj.id = '借：193172 代管理逾期贷款';
	obj.name = '借：193172 代管理逾期贷款';
	dataModel.Category3.push(obj);		
	var obj = {	};
	obj.id = '贷：193171 代管理正常贷款';
	obj.name = '贷：193171 代管理正常贷款';
	dataModel.Category3.push(obj);
	var obj = {	};
	obj.id = '收：613402 代管理贷款应收未收利息';
	obj.name = '收：613402 代管理贷款应收未收利息';
	dataModel.Category3.push(obj);
	
	var obj = {	};
	obj.id = '借：231192 代管理贷款资金';
	obj.name = '借：231192 代管理贷款资金';
	dataModel.Category4.push(obj);
	var obj = {	};
	obj.id = '贷：193172 代管理逾期贷款';
	obj.name = '贷：193172 代管理逾期贷款';
	dataModel.Category4.push(obj);
	var obj = {	};
	obj.id = '付：613402 代管理贷款应收未收利息';
	obj.name = '付：613402 代管理贷款应收未收利息';
	dataModel.Category4.push(obj);
	

    viewModel = ko.mapping.fromJS(dataModel);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));


    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    AddLayer1: function () {
        var obj = {  Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table1.push(obsObj);
    },
	AddLayer2: function () {
        var obj = {  Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table2.push(obsObj);
    },
	AddLayer3: function () {
        var obj = {  Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table3.push(obsObj);
    },
	AddLayer4: function () {
        var obj = {  Category: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table4.push(obsObj);
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
    CalculateRate: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var obsLayer = viewModel.BondLayers()[itemIndex];
        var curve = obsLayer.Curve();
        if (curve) {
            alert(curve);
        }       
    },
    CalculateTotal: function (obj) {
        //do calculations here and then:
        viewModel.TotalCost(100);
        viewModel.TotalSpread(20);
    },
	Save: function() {
		alert('保存成功');
	}
};


