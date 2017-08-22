/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/jquery-1.7.2.min.js" />
/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/PoolCutCommon.js" />
var PoolCutPurpose = 'pool cut';
var TargetSqlConnection;
var PoolId;
var PoolHeader;
var TaskCodes = { 4: 'ConsumerLoanPoolBaseReRun', 5: 'PoolTargetParentTarget', 6: 'PoolTargetChildTarget' };//task codes for pool rerun

$(function () {
    PoolId = getQueryString('PoolId');
    if (!PoolId || isNaN(PoolId)) {
        alert('PoolId is required!');
        return;
    }

    BindingPoolInfo(PoolId);
    new Vue(ECPreviewControl);

    $("#TransPoolName").click(function () {
        window.location.href='BasePoolContent.html?PoolId={0}&PoolName={1}'.format(sessionStorage.PoolId, sessionStorage.PoolName);
    })
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

        var PoolTypeId = poolHeader.PoolTypeId;
        var html = { '4': '资产筛选', '5': '目标化', '6': '额度调整' };
        $('#spanPageTitle').html(html[PoolTypeId]);
    });
}

function RerunTask() {
    //console.log(PoolId);
    GetAssetTypeById(PoolId);
}




function GetAssetTypeById(PoolId) {
    var executeParam = { SPName: 'dbo.usp_GetPoolHeaderExtById', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'PoolId', Value: PoolId, DBType: 'int' });

    var executeParams = encodeURIComponent(JSON.stringify(executeParam));
    var serviceUrl = GlobalVariable.PoolCutServiceURL + 'CommonGet?connName=DAL_SEC_PoolConfig&exeParams=' + executeParams;
    CallWCFSvc(serviceUrl, true, 'GET', function (data) {
        var DimAssetTypeID = data[0].DimAssetTypeId;
        console.log(data);
        console.log(DimAssetTypeID);
        CallTaskService(DimAssetTypeID);
    });

}

function CallTaskService(DimAssetTypeID) {
    console.log(DimAssetTypeID);
    var tpi = new TaskProcessIndicatorHelper();
    tpi.AddVariableItem('PoolID', PoolId, 'Int', 1, 1, 1);
    tpi.AddVariableItem('ParentPoolId', PoolHeader.ParentPoolId, 'Int', 1, 1, 1);
    tpi.AddVariableItem('IsParent', PoolHeader.ParentPoolId == 0, 'String', 1, 1, 0);
    tpi.AddVariableItem('ActionPoolType', '', 'String', 1);
    tpi.AddVariableItem('DimOrganisationId', PoolHeader.DimOrganisationID, 'String', 1);
    tpi.AddVariableItem('DimAssetTypeID', DimAssetTypeID, 'String', 1);
    console.log(TaskCodes[PoolHeader.PoolTypeId]);
    tpi.ShowIndicator('ConsumerLoan', TaskCodes[PoolHeader.PoolTypeId]);
}