/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {Category1:[], Table1: [], TotalCost:'--', TotalSpread:'--' };
$(function () {
    //set = getLanguageSet();
	
	
	var obj = {	};
	obj.id = '510225 代理证券公司资产服务收入';
	obj.name = '510225 代理证券公司资产服务收入';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '510220 代理信托公司资产服务收入';
	obj.name = '510220 代理信托公司资产服务收入';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '510227 代理其他金融机构的其他业务收入';
	obj.name = '510227 代理其他金融机构的其他业务收入';
	dataModel.Category1.push(obj);
	
    viewModel = ko.mapping.fromJS(dataModel);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));
	
	StepPage.load();

    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    AddLayer: function () {
        var obj = { Category: '', Amount: '', Date: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table1.push(obsObj);
        this.DateRegister();
    },
    RemoveLayer: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.Table1()[itemIndex];
        viewModel.Table1.remove(objObj);
    },
    CalculateRate: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var obsLayer = viewModel.Table1()[itemIndex];
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
	load:function(){
		$.each(viewModel.Table1(),function(index){
			var objObj = viewModel.Table1()[index];
			viewModel.Table1.remove(objObj);
		});		
		
		var r_trustId = null;
		//var r_date = null;
		//r_date = getQueryString('reportingDate');
		r_trustId = getQueryString('id');
		if (!r_trustId || isNaN(r_trustId)) {
			return;
		}
		var TableSelect = 1;
		var Page = 'Accounting_ServicerFee';		
		var executeParam = { SPName: 'TrustManagement.TrustManagement.usp_LoadAccountingBook', SQLParams: [{ Name: 'trustId', Value: r_trustId, DBType: 'int' },
		//{Name: 'DimReportingDateId', Value: r_date, DBType: 'int' },
		{Name: 'PageCode', Value: Page, DBType: 'string' },{Name: 'Section', Value: TableSelect, DBType: 'int' }] };
		var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
		CallWCFSvc(serviceUrl, false, 'GET', function (data) {
			$.each(data,function(index){
				var obj={   Category: '', Amount: '', Date: '' };
				obj.Category = data[index].ItemCode;
				obj.Date = data[index].TransactionDate;
				obj.Amount = data[index].ItemValue;
				var obsObj = ko.mapping.fromJS(obj);
				viewModel.Table1.push(obsObj);
			});
			StepPage.DateRegister();
		});	
	},
	Save: function() {
		var r_trustId = null;
		//var r_date = null;
		//r_date = getQueryString('reportingDate');
		r_trustId = getQueryString('id');
		if (!r_trustId || isNaN(r_trustId)) {
			return;
		}
		var str='<Variables>';
		var table1 = viewModel.Table1;
		table1 = ko.mapping.toJS(table1);		
		$.each(table1,function(index){
			str=str+'<Variable><Section>1</Section><Name>'+table1[index].Category+'</Name><Value>'+table1[index].Amount+'</Value><Date>'+table1[index].Date+'</Date></Variable>'
		});
		str=str+'</Variables>';
		
		var executeParam = { SPName: 'TrustManagement.TrustManagement.usp_SaveAccountingInput', SQLParams: [{ Name: 'TrustId', Value: r_trustId, DBType: 'string' },{ Name: 'PageCode', Value: 'Accounting_ServicerFee', DBType: 'string' },{ Name: 'xml', Value: str, DBType: 'string' }] };
		var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
		CallWCFSvc(serviceUrl, false, 'GET', function () {
			alert('保存成功');
		});			
	},
    DateRegister: function () {
        $('.date-plugins').date_input();
    }

};

