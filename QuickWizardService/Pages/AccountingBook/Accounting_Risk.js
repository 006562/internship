/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {Categroy:[], BondLayers: [], TotalCost:'--', TotalSpread:'--' };
$(function () {
    //set = getLanguageSet();

	
	var obj = {	};
	obj.id = '借：155560 应收款项类次级权益';
	obj.name = '借：155560 应收款项类次级权益';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '贷：224799 其他应付款项等科目';
	obj.name = '贷：224799 其他应付款项等科目';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '贷：100201 银行存款';
	obj.name = '或：100201银行存款';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '借：195101 次级权益继续涉入资产';
	obj.name = '借：195101 次级权益继续涉入资产';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '贷：235101 次级权益继续涉入负债';
	obj.name = '贷：235101 次级权益继续涉入负债';
	dataModel.Categroy.push(obj);
	
	
	

    viewModel = ko.mapping.fromJS(dataModel);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));


    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    AddLayer: function () {
        var obj = {  Categroy: '', Amount: ''  };
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

