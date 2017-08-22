/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {Category1:[], Category2:[], Category3:[], Category4:[], Category5:[],Category6:[],
					Table1: [], Table2: [], Table3: [], Table4: [], Table5:[],Table6:[],
					TotalCost:'--', TotalSpread:'--' };
$(function () {
    //set = getLanguageSet();

	
	var obj = {	};
	obj.id = '借：114101 个人消费贷款';
	obj.name = '借：114101 个人消费贷款';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '借：140110 个人逾期贷款 ';
	obj.name = '借：140110 个人逾期贷款 ';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '借：140201 个人非应计贷款';
	obj.name = '借：140201 个人非应计贷款';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '贷：193171 代管理正常贷款';
	obj.name = '贷：193171 代管理正常贷款';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '贷：193172 代管理逾期贷款';
	obj.name = '贷：193172 代管理逾期贷款';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '借：231192 代管理贷款资金';
	obj.name = '借：231192 代管理贷款资金';
	dataModel.Category1.push(obj);
	var obj = {	};
	obj.id = '贷：224799 其他应付款';
	obj.name = '贷：224799 其他应付款';
	dataModel.Category1.push(obj);
	
	var obj = {	};
	obj.id = '借：161199 其他应收款（本公司垫付给受托机构/管理人的应收客户的利息）';
	obj.name = '借：161199 其他应收款（本公司垫付给受托机构/管理人的应收客户的利息）';
	dataModel.Category2.push(obj);
	var obj = {	};
	obj.id = '贷：224799 其他应付款';
	obj.name = '贷：224799 其他应付款';
	dataModel.Category2.push(obj);
	var obj = {	};
	obj.id = '付：613402 代管理贷款应收未收利息';
	obj.name = '付：613402 代管理贷款应收未收利息';
	dataModel.Category2.push(obj);
	
	var obj = {};
	obj.id = '161199 其他应收款项';
	obj.name = '161199 其他应收款项';
	dataModel.Category3.push(obj);
	
	var obj = {	};
	obj.id = '借：224799 其他应付款';
	obj.name = '借：224799 其他应付款';
	dataModel.Category4.push(obj);
	var obj = {	};
	obj.id = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
	obj.name = '贷：100201 银行存款（受托机构/管理人指定收款账户）';
	dataModel.Category4.push(obj);
	
	var obj = {	};
	obj.id = '借：100201 银行存款';
	obj.name = '借：100201 银行存款';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '贷：224799 其他应付款';
	obj.name = '贷：224799 其他应付款';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '借：224799 其他应付款';
	obj.name = '借：224799 其他应付款';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '贷：5101 利息收入';
	obj.name = '贷：5101 利息收入';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '贷：114101个人消费贷款';
	obj.name = '贷：114101个人消费贷款';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '贷：140110 个人逾期贷款';
	obj.name = '贷：140110 个人逾期贷款';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '贷：140201 个人非应计贷款';
	obj.name = '贷：140201 个人非应计贷款';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '借：224719 代收代管理贷款应付款';
	obj.name = '借：224719 代收代管理贷款应付款';
	dataModel.Category5.push(obj);
	var obj = {	};
	obj.id = '贷：140201 个人非应计贷款';
	obj.name = '贷：140201 个人非应计贷款';
	dataModel.Category5.push(obj);
	
	var obj = {	};
	obj.id = '550708 信贷资产流转损失';
	obj.name = '550708 信贷资产流转损失';
	dataModel.Category6.push(obj);
	var obj = {	};
	obj.id = '522108 信贷资产流转收益';
	obj.name = '522108 信贷资产流转收益';
	dataModel.Category6.push(obj);
	
	
    viewModel = ko.mapping.fromJS(dataModel);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    StepPage.Load();

    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    AddLayer1: function () {
        var obj = {  Category: '', Amount: '' ,Date:''};
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table1.push(obsObj);
        this.DateRegister();
    },
	AddLayer2: function () {
	    var obj = { Category: '', Amount: '', Date: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table2.push(obsObj);
        this.DateRegister();
    },
	AddLayer3: function () {
	    var obj = { Category: '', Amount: '', Date: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table3.push(obsObj);
        this.DateRegister();
    },
	AddLayer4: function () {
	    var obj = { Category: '', Amount: '', Date: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table4.push(obsObj);
        this.DateRegister();
    },
	AddLayer5: function () {
	    var obj = { Category: '', Amount: '', Date: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table5.push(obsObj);
        this.DateRegister();
    },
	AddLayer6: function () {
	    var obj = { Category: '', Amount: '', Date: '' };
        var obsObj = ko.mapping.fromJS(obj);
        viewModel.Table6.push(obsObj);
        this.DateRegister();
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
	RemoveLayer6: function (obj) {
        var $obj = $(obj);
        var itemIndex = $obj.attr('itemIndex');
        var objObj = viewModel.Table6()[itemIndex];
        viewModel.Table6.remove(objObj);
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
    Save: function () {
        var r_trustId = null;
        r_trustId = getQueryString('id');
        if (!r_trustId || isNaN(r_trustId)) {
            return;
        }
        var str = '<Variables>';
        var table1 = viewModel.Table1;
        table1 = ko.mapping.toJS(table1);
        var table2 = viewModel.Table2;
        table2 = ko.mapping.toJS(table2);
        var table3 = viewModel.Table3;
        table3 = ko.mapping.toJS(table3);
        var table4 = viewModel.Table4;
        table4 = ko.mapping.toJS(table4);
        var table5 = viewModel.Table5;
        table5 = ko.mapping.toJS(table5);
        var table6 = viewModel.Table6;
        table6 = ko.mapping.toJS(table6);
        $.each(table1, function (index) {
            str = str + '<Variable><Section>1</Section><Name>' + table1[index].Category + '</Name><Value>' + table1[index].Amount + '</Value><Date>' + table1[index].Date + '</Date></Variable>'
        });
        $.each(table2, function (index) {
            str = str + '<Variable><Section>2</Section><Name>' + table2[index].Category + '</Name><Value>' + table2[index].Amount + '</Value><Date>' + table2[index].Date + '</Date></Variable>'
        });
        $.each(table3, function (index) {
            str = str + '<Variable><Section>3</Section><Name>' + table3[index].Category + '</Name><Value>' + table3[index].Amount + '</Value><Date>' + table3[index].Date + '</Date></Variable>'
        });
        $.each(table4, function (index) {
            str = str + '<Variable><Section>4</Section><Name>' + table4[index].Category + '</Name><Value>' + table4[index].Amount + '</Value><Date>' + table4[index].Date + '</Date></Variable>'
        });
        $.each(table5, function (index) {
            str = str + '<Variable><Section>5</Section><Name>' + table5[index].Category + '</Name><Value>' + table5[index].Amount + '</Value><Date>' + table5[index].Date + '</Date></Variable>'
        });
        $.each(table6, function (index) {
            str = str + '<Variable><Section>6</Section><Name>' + table6[index].Category + '</Name><Value>' + table6[index].Amount + '</Value><Date>' + table6[index].Date + '</Date></Variable>'
        });
        str = str + '</Variables>';
        var executeParam = { SPName: 'TrustManagement.TrustManagement.usp_SaveAccountingInput', SQLParams: [{ Name: 'TrustId', Value: r_trustId, DBType: 'string' }, { Name: 'PageCode', Value: 'Accounting_Repurchase', DBType: 'string' }, { Name: 'xml', Value: str, DBType: 'string' }] };
        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, false, 'GET', function () {
            alert('保存成功');
        });
		//alert('保存成功');
	},
	Load:function() {
	    $.each(viewModel.Table1(), function (index) {
	        var objObj = viewModel.Table1()[index];
	        viewModel.Table1.remove(objObj);
	    });
	    $.each(viewModel.Table2(), function (index) {
	        var objObj = viewModel.Table2()[index];
	        viewModel.Table2.remove(objObj);
	    });
	    $.each(viewModel.Table3(), function (index) {
	        var objObj = viewModel.Table3()[index];
	        viewModel.Table3.remove(objObj);
	    });
	    $.each(viewModel.Table4(), function (index) {
	        var objObj = viewModel.Table4()[index];
	        viewModel.Table4.remove(objObj);
	    });
	    $.each(viewModel.Table5(), function (index) {
	        var objObj = viewModel.Table5()[index];
	        viewModel.Table5.remove(objObj);
	    });
	    $.each(viewModel.Table6(), function (index) {
	        var objObj = viewModel.Table6()[index];
	        viewModel.Table6.remove(objObj);
	    });

	    var r_trustId = null;
	    r_trustId = getQueryString('id');
	    if (!r_trustId || isNaN(r_trustId)) {
	        return;
	    }
	    var Page = 'Accounting_Repurchase';
	    var TableSelect = 1;
	    var executeParam = {
	        SPName: 'TrustManagement.TrustManagement.usp_LoadAccountingBook', SQLParams: [{ Name: 'trustId', Value: r_trustId, DBType: 'int' },
            { Name: 'PageCode', Value: Page, DBType: 'string' }, { Name: 'Section', Value: TableSelect, DBType: 'int' }]
	    };
	    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
	        $.each(data, function (index) {
	            var obj = { Category: '', Amount: '', Date: '' };
	            obj.Category = data[index].ItemCode;
	            obj.Date = data[index].TransactionDate;
	            obj.Amount = data[index].ItemValue;
	            var obsObj = ko.mapping.fromJS(obj);
	            viewModel.Table1.push(obsObj);
	        });
	        StepPage.DateRegister();
	    });

	    TableSelect = 2;
	    executeParam = {
	        SPName: 'TrustManagement.TrustManagement.usp_LoadAccountingBook', SQLParams: [{ Name: 'trustId', Value: r_trustId, DBType: 'int' },
            { Name: 'PageCode', Value: Page, DBType: 'string' }, { Name: 'Section', Value: TableSelect, DBType: 'int' }]
	    };
	    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
	        $.each(data, function (index) {
	            var obj = { Category: '', Amount: '', Date: '' };
	            obj.Category = data[index].ItemCode;
	            obj.Date = data[index].TransactionDate;
	            obj.Amount = data[index].ItemValue;
	            var obsObj = ko.mapping.fromJS(obj);
	            viewModel.Table2.push(obsObj);
	        });
	        StepPage.DateRegister();
	    });

	    TableSelect = 3;
	    executeParam = {
	        SPName: 'TrustManagement.TrustManagement.usp_LoadAccountingBook', SQLParams: [{ Name: 'trustId', Value: r_trustId, DBType: 'int' },
            { Name: 'PageCode', Value: Page, DBType: 'string' }, { Name: 'Section', Value: TableSelect, DBType: 'int' }]
	    };
	    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
	        $.each(data, function (index) {
	            var obj = { Category: '', Amount: '', Date: '' };
	            obj.Category = data[index].ItemCode;
	            obj.Date = data[index].TransactionDate;
	            obj.Amount = data[index].ItemValue;
	            var obsObj = ko.mapping.fromJS(obj);
	            viewModel.Table3.push(obsObj);
	        });
	        StepPage.DateRegister();
	    });

	    TableSelect = 4;
	    executeParam = {
	        SPName: 'TrustManagement.TrustManagement.usp_LoadAccountingBook', SQLParams: [{ Name: 'trustId', Value: r_trustId, DBType: 'int' },
            { Name: 'PageCode', Value: Page, DBType: 'string' }, { Name: 'Section', Value: TableSelect, DBType: 'int' }]
	    };
	    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
	        $.each(data, function (index) {
	            var obj = { Category: '', Amount: '', Date: '' };
	            obj.Category = data[index].ItemCode;
	            obj.Date = data[index].TransactionDate;
	            obj.Amount = data[index].ItemValue;
	            var obsObj = ko.mapping.fromJS(obj);
	            viewModel.Table4.push(obsObj);
	        });
	        StepPage.DateRegister();
	    });

	    TableSelect = 5;
	    executeParam = {
	        SPName: 'TrustManagement.TrustManagement.usp_LoadAccountingBook', SQLParams: [{ Name: 'trustId', Value: r_trustId, DBType: 'int' },
            { Name: 'PageCode', Value: Page, DBType: 'string' }, { Name: 'Section', Value: TableSelect, DBType: 'int' }]
	    };
	    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
	        $.each(data, function (index) {
	            var obj = { Category: '', Amount: '', Date: '' };
	            obj.Category = data[index].ItemCode;
	            obj.Date = data[index].TransactionDate;
	            obj.Amount = data[index].ItemValue;
	            var obsObj = ko.mapping.fromJS(obj);
	            viewModel.Table5.push(obsObj);
	        });
	        StepPage.DateRegister();
	    });

	    TableSelect = 6;
	    executeParam = {
	        SPName: 'TrustManagement.TrustManagement.usp_LoadAccountingBook', SQLParams: [{ Name: 'trustId', Value: r_trustId, DBType: 'int' },
            { Name: 'PageCode', Value: Page, DBType: 'string' }, { Name: 'Section', Value: TableSelect, DBType: 'int' }]
	    };
	    serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
	        $.each(data, function (index) {
	            var obj = { Category: '', Amount: '', Date: '' };
	            obj.Category = data[index].ItemCode;
	            obj.Date = data[index].TransactionDate;
	            obj.Amount = data[index].ItemValue;
	            var obsObj = ko.mapping.fromJS(obj);
	            viewModel.Table6.push(obsObj);
	        });
	        StepPage.DateRegister();
	    });
	},
	DateRegister: function () {
	    $('.date-plugins').date_input();
	}
};


