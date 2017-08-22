/// <reference path="../../Scripts/jquery.min.js" />
/// <reference path="../../Scripts/App.Global.js" />

var set;
var viewModel;
var dataModel = {AllCurve:[], BondLayers: [], TotalCost:'--', TotalSpread:'--' };
$(function () {
    //set = getLanguageSet();

    var executeParam = { SPName: '[Pricing].[usp_GetAvailableCurves]', SQLParams: [] };
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGet?exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        $.each(data, function (i, v) {
            var obj = {};
            obj.id = v.CurveName;
            obj.name = v.CurveName;
            dataModel.AllCurve.push(obj);
        });
    });

    viewModel = ko.mapping.fromJS(dataModel);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    curverOperation.LoadAllCurverZTree();

    $('#loading').fadeOut();
});

var StepPage = {
    qwFrame: window.top.qwFrame,

    AddLayer: function () {
        var obj = { BondName: '', Duration: '', ExpectRating: '', Curve:'', CouponRate: '--' };
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
    }
};
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
            var ztreeObj = $.fn.zTree.init($("#ulAllCurverTree"), setting, zNodes);
            ztreeObj.expandAll(true);

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
            legend: { verticalAlign: 'bottom', borderWidth: 0 },
            series: self.curverSeries
        });
    }
};


