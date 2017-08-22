/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/jquery-1.7.2.min.js" />
/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/PoolCutCommon.js" />
var PoolCutPurpose = 'targeting';
var TargetSqlConnection;
var PoolId;
var PoolHeader;
var TaskCodes = { 4: 'PoolTargetParentInit', 5: 'PoolTargetChildInit', 6: 'PoolTargetChildInit' };//task codes for create subpool and make pool salable
$(function () {
    PoolId = getQueryString('PoolId');
    PoolCutPurpose = getQueryString('ActionPoolType');
    if (!PoolId || isNaN(PoolId)) {
        alert('PoolId is required!');
        return;
    }

    BindingPoolInfo(PoolId);
    new Vue(ECPreviewControl);
});

function BindingPoolInfo(poolId) {
    var executeParam = { SPName: 'config.usp_GetPoolHeaderById', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'PoolId', Value: poolId, DBType: 'int' });

    var executeParams = encodeURIComponent(JSON.stringify(executeParam));
    var serviceUrl = GlobalVariable.PoolCutServiceURL + 'CommonGet?connName=DAL_SEC_PoolConfig&exeParams=' + executeParams;
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        var poolHeader = data[0];
        $('.poolDetail').each(function (i, v) {
            var $this = $(this);
            var proName = $this.attr('data-name');
            if (proName && poolHeader[proName])
                $this.text(poolHeader[proName]);
        });

        TargetSqlConnection = poolHeader.TargetSqlConnection;
        PoolHeader = poolHeader;

        var html = { '4': '创建目标化资产池', '5': '创建子资产池', '6': '销售资产池' };
        $('#spanPageTitle, #btnRunTask').html(html[poolHeader.PoolTypeId]);
    });
}

function RerunTask() {
    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('PoolID', PoolId, 'Int', 1, 1, 1);
    tpi.AddVariableItem('ParentPoolId', PoolHeader.PoolId, 'Int', 1, 1, 1);
    tpi.AddVariableItem('IsParent', 0, 'String', 1, 1, 0);
    tpi.AddVariableItem('ActionPoolType', getQueryString('ActionPoolType'), 'String', 1);
    tpi.AddVariableItem('DimOrganisationId', PoolHeader.DimOrganisationID, 'String', 1);

    tpi.ShowIndicator('ConsumerLoan', TaskCodes[PoolHeader.PoolTypeId]);
}