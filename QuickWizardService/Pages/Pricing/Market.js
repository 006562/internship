
var set;
var viewModel;
var dataModel = {
    'zh-CN': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: '市场基础利率数据',
            Identity: 'SectionIdentifier001',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    {
                        ItemId: '1', ItemCode: 'DataCategory', ItemAliasValue: '数据类型', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'SHIBOR', Text: 'SHIBOR' }, { Value: 'CHINABOND', Text: '中债' }, { Value: 'ABS', Text: 'ABS' }]
                    },
                    { ItemId: '2', ItemCode: 'ReportingDate', ItemAliasValue: '报表日期', DataType: 'Date', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '3', ItemCode: 'UploadFile', ItemAliasValue: '上传文件', DataType: 'File', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: '下载最新数据', Click: 'DownloadLatest()', Class: 'btn btn-primary' },
                { Text: '上传文件', Click: 'UploadData()', Class: 'btn btn-primary' },
                { Text: '查看历史数据', Click: 'ViewHistory()', Class: 'btn btn-default' }
            ]
        }],
        Customize: { Title: '所有曲线' }
    },

    'en-US': {
        Sections: [{
            Templ: GlobalVariable.UiTempl_Stand,
            Title: 'Market Basic Rate',
            Identity: 'SectionIdentifier001',
            FieldsSetting: {
                HasOptionalFields: true,
                Fields: [
                    {
                        ItemId: '1', ItemCode: 'DataCategory', ItemAliasValue: 'Date Category', DataType: 'StaticSelect', IsCompulsory: 1, IsDisplay: 1, ItemValue: ''
                        , Options: [{ Value: 'SHIBOR', Text: 'SHIBOR' }, { Value: 'CHINABOND', Text: 'CHINABOND' }, { Value: 'ABS', Text: 'ABS' }]
                    },
                    { ItemId: '2', ItemCode: 'ReportingDate', ItemAliasValue: 'Reporting Date', DataType: 'Date', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' },
                    { ItemId: '2', ItemCode: 'UploadFile', ItemAliasValue: 'Upload File', DataType: 'File', IsCompulsory: 0, IsDisplay: 1, ItemValue: '' }
                ]
            },
            Buttons: [
                { Text: 'Download Latest', Click: 'DownloadLatest()', Class: 'btn btn-primary' },
                { Text: 'Upload File', Click: 'UploadData()', Class: 'btn btn-default' },
                { Text: 'View History', Click: 'ViewHistory()', Class: 'btn btn-default' }
            ]
        }],
        Customize: { Title: 'All Curvers' }
    },

    Model: function () {
        return dataModel[set];
    }
};

$(function () {
    set = getLanguageSet();

    viewModel = ko.mapping.fromJS(dataModel.Model(set));
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    curverOperation.LoadAllCurverZTree();

    setFieldPlugins();
	selectCharts();
    $('#loading').fadeOut();
});


function DownloadLatest() {
    var category = $('#DataCategory').val();
    var taskCode;
    switch (category) {
        case 'SHIBOR':
            taskCode = 'LoadExcel_Shibor';
            break;
        case 'CHINABOND':
            taskCode = 'LoadExcel_ChinaBond';
            break;
        case 'ABS':
            taskCode = 'LoadExcel_ChinaBond_ABS';
            break;
        default:
            break;
    }
    var rDate = $('ReportingDate').val();

    var tpi = new top.TaskProcessIndicatorHelper();

    tpi.AddVariableItem('ReportingDate', rDate, 'String');
    tpi.ShowIndicator('Task', taskCode, function () { });

}
function UploadData() {
    var $obj = $('#UploadFile');
    var filePath = $obj.val();
    if (!filePath) {
        alert('Please Choice a File!');
        return;
    }

    //var category = $('#DataCategory').val();
    //var taskCode;
    //switch (category) {
    //    case 'SHIBOR':
    //        taskCode = 'aa';
    //        break;
    //    case 'CHINABOND':
    //        taskCode = 'bb';
    //        break;
    //    case 'ABS':
    //        taskCode = 'cc';
    //        break;
    //    default:
    //        break;
    //}
    //var rDate = $('ReportingDate').val();

    var fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);

    UploadFile('UploadFile', fileName, 'Market', function (d) {
        //var filePath = d.FileUploadResult;
        //var fileDirectory = filePath.substring(0, (filePath.length - fileName.length - 1));

        //var tpi = new top.TaskProcessIndicatorHelper();
        //tpi.AddVariableItem('sourceFilePath', fileDirectory, 'string');
        //tpi.AddVariableItem('sourceFileName', fileName, 'string');
        //tpi.AddVariableItem('ReportingDate', rDate, 'string');

        //tpi.ShowIndicator('Task', taskCode, function (result) {
        //    //code in this place will be executed after the TaskIndicator be closed
        //});
    });
}
function ViewHistory() {
    var category = $('#DataCategory').val();
    var arg1;
    switch (category) {
        case 'SHIBOR':
            arg1 = '1003';
            break;
        case 'CHINABOND':
            arg1 = '1004';
            break;
        case 'ABS':
            arg1 = '1010';
            break;
        default:
            break;
    }

    window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=" + arg1);
}

var curverOperation = {
    curverSeries: []
    , curverCategories: []
    , colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#DDDF00', '#FF9655']
    , colorIndex: -1

    , LoadAllCurverZTree: function () {
        var self = this;
        var executeParam = { SPName: 'Pricing.usp_GetPricingAllCurve', SQLParams: [] };
        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuantDB_FixedIncome&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', function (zNodes) {
            var setting = {
                view: { showIcon: false },
                check: { enable: true },
                data: { simpleData: { enable: true } },
                callback: { onCheck: self.curverZTreeNodeClicked }
            };
            $.fn.zTree.init($("#ulAllCurverTree"), setting, zNodes);
            $.each(zNodes, function (i, v) {
                if (v.xDatas) {
                    self.curverCategories = v.xDatas.split(',');
                    return false;//break;
                }
            });
        });
    }
		
	
    , curverZTreeNodeClicked: function (event, treeId, treeNode) {
        var co = curverOperation;
        var checked = treeNode.checked;
        co.zTreeNodeOperation(treeNode, checked);
        co.LoadCurverCharts();
    }
    , zTreeNodeOperation: function (treeNode, checked) {
        var co = curverOperation;
        if (treeNode.isParent) {
            var children = treeNode.children;
            for (var i = 0; i < children.length; i++) {
                var tNode = children[i];
                co.zTreeNodeOperation(tNode, checked);
            }
        } else {
            var nodeName = treeNode.name;
            if (checked) {
                co.colorIndex = (co.colorIndex == 10) ? 0 : co.colorIndex + 1;
                var aryData = treeNode.yDatas.split(',');
                aryData = $.map(aryData, function (item, index) { return parseFloat(item); });

                co.curverSeries.push({ name: nodeName, data: aryData, color: co.colors[co.colorIndex] });
            } else {
                co.curverSeries.jsonArrayRemove('name', nodeName);
            }
        }
    }
    , LoadCurverCharts: function () {
        var self = this;
        $('#divAllCurverChart').highcharts({
            title: { text: '市场利率曲线' },
            subtitle: { text: 'Yield Curvers for Pricing' },
            xAxis: { categories: self.curverCategories },
            yAxis: {
                title: { text: '年化收益率' },
                plotLines: [{ value: 0, width: 1, color: '#808080' }]
            },
            tooltip: { valueSuffix: '%' },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', width: 150, borderWidth: 0 },
            series: self.curverSeries
        });
    }
};
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
function setFieldPlugins() {
    $('.date-plugins').date_input();
}




//the following code by gongsiyang 

function selectCharts(){
	var $demo1 = $('#demo1'),
		$demo2 = $('#demo2');
		
	var demo1Options_header = '<option>请选择数据</option>';
	var demo1Options_body = '';
	var executeParam = { SPName: 'Pricing.usp_GetPricingAllCurve_HistoricalBondType', SQLParams: [] };
	var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuantDB_FixedIncome&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, true, 'GET', function (zNodes) {
		console.log(zNodes)
		for(var i in zNodes){
			if(zNodes[i].Column1){
				demo1Options_body += '<option value="'+zNodes[i].Column1+'">'+zNodes[i].Column1+'</option>';
			}
		}
		var demo1Options = demo1Options_header+demo1Options_body;
		$demo1.html(demo1Options);
	});
	var demo1_value='';
	var demo2_value='';
	$demo1.change(function(){
	demo1_value  = $(this).val();
		
		
		
		
		
		
	var demo2Options_header = '<option>请选择数据</option>';
	var demo2Options_body = '';
	var executeParam = { SPName: 'Pricing.usp_GetPricingAllCurve_HistoricalBondTerm', SQLParams: [] };
	executeParam.SQLParams.push({ Name: 'BondType', Value: demo1_value, DBType: 'string' });
	var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuantDB_FixedIncome&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
	CallWCFSvc(serviceUrl, true, 'GET', function (zNodes) {
		console.log(zNodes)
		for(var i in zNodes){
			if(zNodes[i].Term){
				demo2Options_body += '<option value="'+zNodes[i].Term+'">'+zNodes[i].Term+'</option>';
			}
		}
		var demo2Options = demo2Options_header+demo2Options_body;
		$demo2.html(demo2Options);
	});
		
	});
	$demo2.change(function(){
	demo2_value = $(this).val();
		
	
		
		
		
		
var curverOperation1 = {
    curverSeries: []
    , curverCategories: []
    , colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#DDDF00', '#FF9655']
    , colorIndex: -1
    , LoadAllCurverZTree: function () {
        var self = this;
        var executeParam = { SPName: 'Pricing.usp_GetPricingAllCurve_Historical', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'BondType', Value: demo1_value, DBType: 'string' },{Name:'BondTerm',Value:demo2_value,DBType:'string'});
		var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=QuantDB_FixedIncome&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', function (zNodes) {
            $.each(zNodes, function (i, v) {
					if (v.xDatas) {
						self.curverCategories = v.xDatas.split(',');
						
						self.colorIndex = (self.colorIndex == 10) ? 0 : self.colorIndex + 1;
						 var aryData = v.yDatas.split(',');
						 aryData = $.map(aryData, function (item, index) { return parseFloat(item); }); 
						 self.curverSeries.push({ name: v.name, data: aryData, color: self.colors[self.colorIndex] });
						 
						return false;
					}
            });
			
        
        $('#divAllCurverChartHistory').highcharts({
            title: { text: '收益率历史趋势' },
            subtitle: { text: 'Historical Yield Curvers for Pricing' },
            xAxis: { categories: self.curverCategories },
            yAxis: {
                title: { text: '年化收益率' },
                plotLines: [{ value: 0, width: 1, color: '#808080' }]
            },
            tooltip: { valueSuffix: '%' },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', width: 150, borderWidth: 0 },
            series: self.curverSeries
        });
        });
    }
	 
};
		var co = curverOperation1;
		co.LoadAllCurverZTree();
		
		
		
		
		
	})
}