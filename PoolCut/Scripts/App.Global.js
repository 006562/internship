var uriHostInfo= location.protocol + "//" + location.host;
//console.log(uriHostInfo);
var GlobalVariable = {
    SslHost: uriHostInfo + '/',
    TaskProcessEngineServiceURL: uriHostInfo + '/TaskProcessEngine/SessionManagementService.svc/jsAccessEP/',
    PoolCutServiceURL: uriHostInfo + '/PoolCut/PoolCutService.svc/jsAccessEP/',
    DataProcessServiceUrl: uriHostInfo + "/TrustManagementService/DataProcessService.svc/jsAccessEP/",

    QuickFrame:uriHostInfo+"/Quickframe"
}

