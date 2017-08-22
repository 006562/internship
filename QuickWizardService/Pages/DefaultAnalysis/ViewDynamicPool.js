/// <reference path="E:\dev_tfs02\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var orgCode;
var assetType;

var set;

$(function() {
    set = getLanguageSet();
    orgCode = getQueryString('orgCode');
    assetType = getQueryString('assetType');
    if (!orgCode || !assetType) {
        alert('Organisation Code and Asset Type are Required!');
        return;
    }

    DefaultDataOperation.showIntervalData();//获取所有的数据，展示到table中
    DefaultDataOperation.LoadAllCurverZTree();//获取ZTree中的节点数据
    DefaultDataOperation.LoadCurverCharts();//更新Charts中的数据
    $('#loading').fadeOut();
});

var DefaultDataOperation = {
    curverSeries: []
    , curverCategories: []
    , colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#DDDF00', '#FF9655']
    , colorIndex: -1,

    showIntervalData: function() {
            var $tabel = $('#tblDataList')
            this.getIntervalData(function(rows) {
                if (rows && rows.length > 0) {
                    var tblThs = [];
                    var row = rows[0];
                    for (var col in row) {
                        var th = { field: col, title: col, align: 'center' }
                        tblThs.push(th);
                    }
                    $tabel.bootstrapTable({ columns: tblThs, data: rows });
                  
                } 
            });
        
    },
    getIntervalData: function(callback) {
        //for test
        //callback([{ a: 1, b: 2, c: 3 }, { a: 11, b: 22, c: 33 }, { a: 111, b: 222, c: 333 }]);
        //callback(null);
        //return;
        var executeParam = { SPName: 'dbo.usp_GetDynamicPoolAllData', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', callback);
    },
    LoadAllCurverZTree: function () {
        var self = this;

        var executeParam = { SPName: 'dbo.usp_GetDynamicPoolAllCurve', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        var zNodes;
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
                    self.curverCategories = v.x_value.split(',');
                    return false;//break;
                }
            });
        });
    }
    , curverZTreeNodeClicked: function (event, treeId, treeNode) {
        var co = DefaultDataOperation;
        var checked = treeNode.checked;
        co.zTreeNodeOperation(treeNode, checked);
        co.LoadCurverCharts();
    }
    , zTreeNodeOperation: function (treeNode, checked) {
        var co = DefaultDataOperation;
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
                var aryData = treeNode.y_Value.split(',');
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
            title: { text: 'DynamicPool Data Change View' },
            subtitle: { text: 'DynamicPool Data Change View' },
            xAxis: { categories: self.curverCategories },
            yAxis: {
                title: { text: 'Data' },
                plotLines: [{ value: 0, width: 1, color: '#808080' }]
            },
            tooltip: { valueSuffix: '' },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', width: 150, borderWidth: 0 },
            series: self.curverSeries
        });
    }
};
