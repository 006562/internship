/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {Categroy:[], BondLayers: [], TotalCost:'--', TotalSpread:'--' };
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
	
	var obj = {	};
	obj.id = '借：100201 银行存款';
	obj.name = '借：100201 银行存款';
	dataModel.Categroy.push(obj);
	var obj = {	};
	obj.id = '贷：520240 应收款项类其他债券利息收入';
	obj.name = '贷：520240 应收款项类其他债券利息收入';
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
		alert(viewModel.BondLayers()[0].Amount());
        //viewModel.TotalCost(100);
        //viewModel.TotalSpread(20);
    },
	Save: function() {
		alert('保存成功');
	}
};

