/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {Categroy:[], BondLayers: [], TotalCost:'--', TotalSpread:'--' };
$(function () {
    //set = getLanguageSet();
	
	var obj = {	};
	obj.id = '193171 代管理正常贷款';
	obj.name = '193171 代管理正常贷款';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '193172 代管理逾期贷款';
	obj.name = '193172 代管理逾期贷款';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '231192 代管理贷款资金';
	obj.name = '231192 代管理贷款资金';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '224719 代收代管理贷款应付款';
	obj.name = '224719 代收代管理贷款应付款';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '613402 代管理贷款应收未收利息';
	obj.name = '613402 代管理贷款应收未收利息';
	dataModel.Categroy.push(obj);
	
	
    viewModel = ko.mapping.fromJS(dataModel);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));


    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    AddLayer: function () {
        var obj = { Categroy: '', Amount: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.BondLayers.push(obsObj);
    },
    RemoveLayer: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.BondLayers()[itemIndex];
        viewModel.BondLayers.remove(objObj);
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

