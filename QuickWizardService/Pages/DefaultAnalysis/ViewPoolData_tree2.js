/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />


var orgCode;
var assetType;

var set;
var viewModel;
var dataModel = {
    'zh-CN': { PageTitle: '违约数据', DefaultIntervals: '选择违约区间：', DataTitle: '数据', EmptyMsg: '请选择数据类型' },
    'en-US': { PageTitle: 'Default Data', DefaultIntervals: 'Choose Interval:', DataTitle: '数据', EmptyMsg: 'Please Choice Data Type' },
    Model: function (set) { return dataModel[set]; }
};

$(function () {
    set = getLanguageSet();
    //orgCode = getQueryString('orgCode');
    //assetType = getQueryString('assetType');
    //if (!orgCode || !assetType) {
    //    alert('Organisation Code and Asset Type are Required!');
    //    return;
    //}

    DefaultDataOperation.getIntervalsList(PageDataLoaded);
});
function PageDataLoaded(data) {
    var intervals = $.grep(data, function (d) {
        return d.pId == 0;
    });
    viewModel = dataModel.Model(set);
    viewModel.Intervals = intervals;

    ko.applyBindings(viewModel, $('html').get(0));

    var setting = {
        view: { showIcon: false, txtSelectedEnable: false },
        check: { enable: true, chkboxType: { 'Y': '', 'N': '' }, chkDisabled: false },
        data: { simpleData: { enable: true } },
        callback: { onCheck: DefaultDataOperation.ckbCheckedChange }
    };
    $.fn.zTree.init($("#ulZTreeRegionAndDatas"), setting, data);

    DefaultDataOperation.showIntervalData();

    $('#loading').fadeOut();
}


var DefaultDataOperation = {
    tableDataRows: [],
    getIntervalsList: function (callback) {
        //var executeParam = { SPName: 'dbo.usp_GetStaticPoolRegions_tree', SQLParams: [] };
        //executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        //executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });

        //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        //CallWCFSvc(serviceUrl, true, 'GET', callback);

        var data = [
            { pId: 0, id: 1, name: '蚂蚁花呗', checked: false },
            { pId: 0, id: 2, name: '京东白条', checked: false },
            { pId: 0, id: 3, name: '唯品会', checked: false },
            { pId: 1, id: 1001, name: '累计违约率1-30', checked: true },
            { pId: 1, id: 1002, name: '累计违约率31-60', checked: true },
            { pId: 1, id: 1003, name: '累计违约率61-90', checked: true },
            { pId: 1, id: 1004, name: '累计违约率91-120', checked: true },
            { pId: 1, id: 1005, name: '累计违约率121-150', checked: true },
            { pId: 1, id: 1006, name: '累计违约率151-180', checked: true },
            { pId: 2, id: 2001, name: '累计违约率1-30', checked: true },
            { pId: 2, id: 2002, name: '累计违约率31-60', checked: true },
            { pId: 2, id: 2003, name: '累计违约率61-90', checked: true },
            { pId: 2, id: 2004, name: '累计违约率91-120', checked: true },
            { pId: 2, id: 2005, name: '累计违约率121-150', checked: true },
            { pId: 2, id: 2006, name: '累计违约率151-180', checked: true },
            { pId: 3, id: 3001, name: '累计违约率1-30', checked: true },
            { pId: 3, id: 3002, name: '累计违约率31-60', checked: true },
            { pId: 3, id: 3003, name: '累计违约率61-90', checked: true },
            { pId: 3, id: 3004, name: '累计违约率91-120', checked: true },
            { pId: 3, id: 3005, name: '累计违约率121-150', checked: true },
            { pId: 3, id: 3006, name: '累计违约率151-180', checked: true },
        ];
        callback(data);
    }

    , ckbCheckedChange: function (event, treeId, treeNode) {
        var oprtObj = DefaultDataOperation;

        var isChecked = treeNode.checked;
        var isParent = treeNode.isParent;
        var rootLiId = isParent ? treeNode.tId : treeNode.parentTId;
        var index = treeNode.getIndex();

        var $rootLiId = $('#' + rootLiId).toggleClass('selected', isChecked);

        if (isParent) {
            oprtObj.showIntervalData(treeNode.name, isChecked);
        } else {
            setDateCheckUnCheck((index + 1), treeNode.name, isChecked);
        }
    }
    , showIntervalData: function (name) {
        this.getIntervalData('蚂蚁花呗');
        this.getIntervalData('京东白条');
        this.getIntervalData('唯品会');

        var $tabel = $('#tblDataList');

        var tblThs = [];
        var row = this.tableDataRows[0];
        for (var col in row) {
            var th = { field: col, title: col, align: 'center' }
            tblThs.push(th);
        }

        $tabel.bootstrapTable({ columns: tblThs, data: this.tableDataRows });
    }
    , getIntervalData: function (name) {
        //var executeParam = { SPName: 'dbo.GetStaticPoolInvertedtriangleView', SQLParams: [] };
        //executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        //executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        //executeParam.SQLParams.push({ Name: 'RegionId', Value: id, DBType: 'int' });

        //var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        //CallWCFSvc(serviceUrl, true, 'GET', callback);

        var sample = {};
        sample['应收数据'] = name;
        sample['累计违约率1-30'] = (10 * Math.random()).toFixed(2)
        sample['波动(1-30)'] = (10 * Math.random()).toFixed(2) + '%';
        sample['累计违约率31-60'] = (10 * Math.random()).toFixed(2)
        sample['波动(31-60)'] = (10 * Math.random()).toFixed(2) + '%';
        sample['累计违约率61-90'] = (10 * Math.random()).toFixed(2)
        sample['波动(61-90)'] = (10 * Math.random()).toFixed(2) + '%';
        sample['累计违约率91-120'] = (10 * Math.random()).toFixed(2)
        sample['波动(91-120)'] = (10 * Math.random()).toFixed(2) + '%';
        sample['累计违约率121-150'] = (10 * Math.random()).toFixed(2)
        sample['波动(121-150)'] = (10 * Math.random()).toFixed(2) + '%';
        sample['累计违约率151-180'] = (10 * Math.random()).toFixed(2)
        sample['波动(151-180)'] = (10 * Math.random()).toFixed(2) + '%';

        this.tableDataRows.push(sample);
        //}

       
    },

    calculateLossDistribution: function (obj) {
        var $obj = $(obj);
        var regionId = $obj.attr('regionId');
        var regionCode = $obj.attr('regionCode');

        var muMultiplier = $('#inputMuMultiplier_' + regionId).val();
        var sigmaMultiplier = $('#inputSigmaMultiplier_' + regionId).val();
        var recorveryRatio = $('#inputRecoveryRatio_' + regionId).val();


        ///get all unchoiced th dates
        var strAllDates = getneedDate(regionId);

        var tpi = new top.TaskProcessIndicatorHelper();
        tpi.AddVariableItem('OrganisationCode', 'JDJR', 'string');
        tpi.AddVariableItem('AssetType', 'ConsumerLoan', 'string');
        tpi.AddVariableItem('Section', regionCode, 'string');
        tpi.AddVariableItem('muMultiplier', muMultiplier, 'string');
        tpi.AddVariableItem('sigmaMultiplier', sigmaMultiplier, 'string');
        tpi.AddVariableItem('RecoveryRatio', sigmaMultiplier, 'string');
        tpi.AddVariableItem('SelectedDates', strAllDates, 'string');

        tpi.ShowIndicator('Task', 'CalculateLossDistribution', function (result) {
            //code in this place will be executed after the TaskIndicator be closed
        });
    },

    viewLossDistribution: function (obj) {
        var $obj = $(obj);
        var regionCode = $obj.attr('regionCode');
        var pageUrl = 'ViewLossDistribution.html?orgCode=' + orgCode + '&assetType=' + assetType + '&section=' + regionCode;
        window.open(pageUrl);
    }
};


function setTableThsEvent(reginId) {
    var curTbThs = '#tblDataList_' + reginId + ' th';
    $(curTbThs).click(function () {
        var $this = $(this);
        var cellIndex = $this.prop('cellIndex');
        var crtRegionId = $this.parents('.regiontable').attr('regionId');

        var checked = $this.hasClass('choiced');
        var thText = $this.text();
        setDateCheckUnCheck(crtRegionId, cellIndex, thText, checked);
    });
}

function setDateCheckUnCheck(crtRegionId, cellIndex, cellText, checked) {
    $('#tblDataList_' + crtRegionId + ' th:nth-child(' + (cellIndex + 1) + ')').toggleClass('choiced', !checked);
    $('#tblDataList_' + crtRegionId + ' td:nth-child(' + (cellIndex + 1) + ')').toggleClass('choiced', !checked);

    var treeObj = $.fn.zTree.getZTreeObj("ulZTreeRegionAndDatas");
    var pNode = treeObj.getNodeByParam("id", crtRegionId, null);
    var node = treeObj.getNodeByParam("name", cellText, pNode);
    if (node) {
        treeObj.checkNode(node, checked, true, false);
    }
}

function getneedDate(reginid) {
    var allDates = [];
    $('#tblDataList_' + reginid).find('th').each(function () {
        if (!$(this).hasClass('choiced')) {
            allDates.push($(this).text());
        }
    });
    return allDates.splice(1, allDates.length).join(',')
}