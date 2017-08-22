/// <reference path="jquery-1.12.1.min.js" />
/// <reference path="App.Global.js" />
/// <reference path="common.js" />

////////////Ribbon Button Events Regisition////////////
function DownAssetTemplates() {
    GSDialog.Open('数据模板文件下载', 'Pages/AssetTemplates.html', null, function (result) {
        if (result) {
            window.location.reload();
        }
    }, 600, 300);
}
function OpenDataCheckPage() {
    GSDialog.Open('数据校验', 'Pages/DataCheck.html', null, function (result) {
        if (result) {
            window.location.reload();
        }
    }, 600, 300);
}
function OpenUploadPage() {
    GSDialog.Open('导入数据', 'Pages/UploadImportData.html', 0, function (result) {
        if (result) {
            window.location.reload();
        }
    }, 600, 400);
}

function OpenUploadTrustPage() {
    GSDialog.Open('导入循环购买资产', 'Pages/UploadImportData.html', 1, function (result) {
        if (result) {
            window.location.reload();
        }
    }, 600, 400);
}

function DownloadReport() {
    //下载'透视报表'
    
    var fileUrl = location.protocol + '//' + location.host + '/PoolCut/Files/Reports/DailyReport/资产池日统计报表.xlsm';
    //console.log(fileUrl);
    //.format(Math.random(100, 1000000), Math.random(1, 1000000));
    //var winObj = window.open(fileUrl, "_blank", "height=200,width=150,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no");
    //winObj.document.execCommand("SaveAs");
    //winObj.window.close();
    //winObj.close();
    //var fileUrl = "https://goldenstandabs/PoolCut/Files/Reports/DailyReport/资产池日统计报表.xlsm";
    window.location.href = fileUrl;
}
function GenerateDoc() {
    var ckdPool = GetCheckedPool();
    if (!ckdPool) return;
    GSDialog.Open('项目计划书', 'Pages/AssignTrust.html'
        ,{ title: '生成项目计划书', TaskCode: 'DocxCreation', Pool: ckdPool }
        ,function (result) {
            if (result) {
                window.location.reload();
            }
        }
        , 600, 400);
}
function OpenCashflowPage() {
    var ckdPool = GetCheckedPool();
    if (!ckdPool) return;

    var pageUrl = 'Pages/CashflowPage.html';
    //var pageUrl = 'https://poolcutwcf/TaskProcessServices/UITaskStudio/paymentSchedule.html?PoolId=' + ckdPool.PoolId;
    GSDialog.Open('现金流日历', pageUrl, ckdPool, null, 950, 550);
}
function OpenPoolCreationPage() {
    GSDialog.Open('基础资产池', 'Pages/PoolCreation.html', null, function (result) {
        if (result) {
            window.location.reload();
        }
    }, 600, 400);
}
function OpenPoolTargetingPage() {//generate a subpool
    var ckdPool = GetCheckedPool();
    if (!ckdPool) return;
    if (ckdPool.PoolTypeId == 6) {
        alert('不适用于当前所选择的资产池！');
        return;
    }
    var actionType = 'PoolTargetChild';
    if (ckdPool.PoolTypeId == 4) {
        actionType = 'PoolTargetParent';
    }
    var page = 'Pages/PoolTargeting.html?PoolId={0}&ActionPoolType={1}'.format(ckdPool.PoolId, actionType);
    window.open(page, '_blank');
}
function OpenSalablePoolPage() {//make pool salable
    var ckdPool = GetCheckedPool();
    if (!ckdPool) return;
    if (ckdPool.PoolTypeId == 6) {
        alert('不适用于当前所选择的资产池！');
        return;
    }
    var page = 'Pages/PoolTargeting.html?PoolId={0}&ActionPoolType=PoolTargetChild'.format(ckdPool.PoolId);
    window.open(page, '_blank');
    //GSDialog.Open('目标资产池', 'Pages/PoolTargeting.html?PoolId=' + ckdPool.PoolId, null, function (result) {
    //    if (result) {
    //        window.location.reload();
    //    }
    //}, 950, 550);
}
function PreSales() {
    var ckdPool = GetCheckedPool();
    if (!ckdPool) return;
    GSDialog.Open('预销售', 'Pages/AssignTrust.html'
    , { title: '预销售', TaskCode: 'PreSale', Pool: ckdPool }
    , function (result) {
        if (result) {
            window.location.reload();
        }
    }
    , 600, 400);
}
function DeleteAssetPool() {
    var ckdPool = GetCheckedPool();
    if (!ckdPool) return;

    var taskCode, warnMsg;
    if (ckdPool.PoolTypeId==4) {
        taskCode = 'JobRemove';
        warnMsg='此资产池集合将被永久删除，请再次确认？'
    }else{
        taskCode = 'PoolRemove';
        warnMsg = '此资产池及其子资产池将被永久删除，请再次确认？';
    }
    if (!confirm(warnMsg)) { return; }
    
    var tpi = new parent.TaskProcessIndicatorHelper();
    //tpi.AddVariableItem('PoolID', $('#txtPoolName').val(), 'String', 1, 1, 1);
    tpi.AddVariableItem('PoolID', ckdPool.PoolId, 'String', 1, 0, 1);
    tpi.ShowIndicator('ConsumerLoan', taskCode);
}


///////////Others//////////////
function PoolProcess(poolId) {
    window.open('PoolProcess.html?PoolId=' + poolId, '_blank');
    //GSDialog.Open('资产切割', 'Pages/PoolProcess.html?PoolId=' + poolId, null, function (result) {
    //    if (result) {
    //        window.location.reload();
    //    }
    //}, 950, 550);
}

//////////Common Helper Methods/////////////
function GetCheckedPool() {
    //var $selectedItem=$('#divDataList input.datalist-item:checked');
    var Pool = getPoolHeader();
    //if (!$selectedItem || $selectedItem.length == 0) {
    //    alert('请选择需要操作的资产池！');
    //    return null;
    //}

    //var htmlPoolHeader = decodeURIComponent($selectedItem.attr('poolHeader'));
    return Pool;
}

function CallWCFSvc(svcUrl, isAsync, rqstType, fnCallback) {
    var sourceData;

    $.ajax({
        cache: false,
        type: rqstType,
        async: isAsync,
        url: svcUrl,
        dataType: "json",
        contentType: "application/xml;charset=utf-8",
        data: {},
        success: function (response) {
            if (typeof response=='string') 
                sourceData = JSON.parse(response);
            else
                sourceData = response;
            if (fnCallback) fnCallback(sourceData);
        },
        error: function (response) { alert('Error occursed while requiring the remote source data!'); }
    });

    if (!isAsync) { return sourceData; }
}
function UploadFile(fileCtrlId, fileName, folder, fnCallback) {
    var fileData = document.getElementById(fileCtrlId).files[0];
    var svcUrl = GlobalVariable.PoolCutServiceURL + 'FileUpload?fileName={0}&fileFolder={1}'.format(
        encodeURIComponent(fileName), encodeURIComponent(folder));
    $.ajax({
        url: svcUrl,
        type: 'POST',
        data: fileData,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        //contentType: "application/octet-stream", // Set content type to false as jQuery will tell the server its a query string request
        success: function (response) {
            var sourceData;
            if (typeof response == 'string')
                sourceData = JSON.parse(response);
            else
                sourceData = response;
            if (fnCallback) fnCallback(sourceData);
        },
        error: function (data) {
            alert('File upload failed!');
        }
    });
}