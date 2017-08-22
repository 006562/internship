/// Product Environment
window.GlobalVariable = (function () {
    var protocol = location.protocol === 'https' ? 'https' : 'http';
    var domain = 'abss.crctrust.com';

    return {
        Host: 'http://' + domain + '/',
        SslHost: 'https://' + domain + '/',
        TaskProcessEngineServiceHostURL: 'https://' + domain + '/TaskProcessEngine/',
        TrustManagementServiceHostURL: 'https://' + domain + '/TrustManagementService/',
        CashFlowEngineServiceHostURL: 'https://' + domain + '/CashFlowEngine/',
        DataProcessServiceUrl: 'https://' + domain + '/TrustManagementService/DataProcessService.svc/jsAccessEP/',
        TrustManagementServiceUrl: 'https://' + domain + '/TrustManagementService/TrustManagementService.svc/jsAccessEP/',
        BondPaymentScheduleServiceUrl: 'https://' + domain + '/TrustManagementService/BondPaymentScheduleService.svc/jsAccessEP/',
        PaymentScheduleServiceUrl: 'https://' + domain + '/TrustManagementService/PaymentScheduleService.svc/jsAccessEP/',
        CashFlowStudioServiceUrl: 'https://' + domain + '/TaskProcessEngine/CashFlowStudioService.svc/jsAccessEP/',
        SessionManagementServiceUrl: 'https://' + domain + '/TaskProcessEngine/SessionManagementService.svc/jsAccessEP/'
    }
}());