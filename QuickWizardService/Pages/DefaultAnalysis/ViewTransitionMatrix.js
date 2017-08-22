/// <reference path="E:\dev_tfs02\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery-1.7.2.min.js" />


var orgCode;
var assetType;

var set;
var viewModel;
var dataModel = {
    'zh-CN': { PageTitle: '违约数据', DefaultIntervals: '选择违约区间：', Intervals: [], EmptyMsg: '没有数据', MuValueLabel: '均值', SigmaValueLabel: '标准差', MuLabel: '均值加压', SigmaLabel: '方差加压', RecoveryLabel: '指定回收率'},
    'en-US': { PageTitle: 'Default Data', DefaultIntervals: 'Choose Interval:', Intervals: [], EmptyMsg: 'No Records Here', MuValueLabel: 'u', SigmaValueLabel: 'sigma', MuLabel: 'u Multiplier', SigmaLabel: 'var Multiplier', RecoveryLabel: 'Recovery Ratio' },
    Model: function(set) { return dataModel[set]; }
};

$(function () {
    set = getLanguageSet();
    orgCode = getQueryString('orgCode');
    assetType = getQueryString('assetType');
    if (!orgCode || !assetType) {
        alert('Organisation Code and Asset Type are Required!');
        return;
    }

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

    $('#loading').fadeOut();
}


var DefaultDataOperation = {
    getIntervalsList: function (callback) {
        var executeParam = { SPName: 'dbo.usp_GetStaticPoolRegions_tree', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', callback);
    }

    , ckbCheckedChange: function (event, treeId, treeNode) {
        var oprtObj = DefaultDataOperation;

        var isChecked = treeNode.checked;
        var isParent = treeNode.isParent;
        var regionId = isParent ? treeNode.id : treeNode.getParentNode().id;
        var rootLiId = isParent ? treeNode.tId : treeNode.parentTId;
        var index = treeNode.getIndex();

        var $rootLiId = $('#' + rootLiId).toggleClass('selected', isChecked);

        if (isParent) {
            isChecked ? oprtObj.showIntervalData(regionId) : $('#divDefaultData_' + regionId).addClass('hidden');
        } else {
            setDateCheckUnCheck(regionId, (index + 1), treeNode.name, isChecked);
        }
    }
    , showIntervalData: function (id) {
        var $section = $('#divDefaultData_' + id);
        if ($section.attr('data-loaded') === '1') {
            $section.removeClass('hidden');
        } else {
            var $tabel = $('#tblDataList_' + id);
            this.getIntervalData(id, function (rows) {
                if (rows && rows.length > 0) {
                    var tblThs = [];
                    var row = rows[0];
                    for (var col in row) {
                        var th = { field: col, title: col, align: 'center' }
                        tblThs.push(th);
                    }

                    $tabel.bootstrapTable({ columns: tblThs, data: rows });
                    $tabel.removeClass('hidden');
                    $('#divOperations_' + id).removeClass('hidden');

                    setTableThsEvent(id);
                } else {
                    $section.find('.emptymsg').removeClass('hidden');
                }
                $section.attr('data-loaded', 1);
                $section.removeClass('hidden');

            });
        }
    }
    , getIntervalData: function (id, callback) {
        //for test
        //callback([{ a: 1, b: 2, c: 3 }, { a: 11, b: 22, c: 33 }, { a: 111, b: 222, c: 333 }]);
        //callback(null);
        //return;
        var executeParam = { SPName: 'dbo.GetStaticPoolInvertedtriangleView', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'OrganisationCode', Value: orgCode, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'AssetType', Value: assetType, DBType: 'string' });
        executeParam.SQLParams.push({ Name: 'RegionId', Value: id, DBType: 'int' });

        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, true, 'GET', callback);
    },

	calculateLossDistribution: function(obj) {
		var $obj=$(obj);
		var regionId=$obj.attr('regionId');
		var regionCode=$obj.attr('regionCode');
		
		var muMultiplier = $('#inputMuMultiplier_'+regionId).val();
		if (muMultiplier == '') muMultiplier = '1.0';
		
		var sigmaMultiplier = $('#inputSigmaMultiplier_'+regionId).val();
		if (sigmaMultiplier == '') sigmaMultiplier = '1.0';

		var recoveryRatio = $('#inputRecovery_'+regionId).val();
		
        var allDates = getneedDate(regionId);

		var tpi = new top.TaskProcessIndicatorHelper();
		tpi.AddVariableItem('OrganisationCode', orgCode, 'string');
		tpi.AddVariableItem('AssetType', assetType, 'string');
		tpi.AddVariableItem('Section', regionCode, 'string');
		tpi.AddVariableItem('muMultiplier', muMultiplier, 'string');
		tpi.AddVariableItem('sigmaMultiplier', sigmaMultiplier, 'string');
		tpi.AddVariableItem('RecoveryRatio', recoveryRatio, 'string');
		tpi.AddVariableItem('SelectedDates', allDates, 'string');

		tpi.ShowIndicator('Task', 'CalculateLossDistribution', function(result) {
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