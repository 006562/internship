/// Staging Environment
window.GlobalVariable = (function () {
    var protocol = location.protocol === 'https' ? 'https' : 'http';
    var domain = 'abss-staging.crctrust.com';

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
        SessionManagementServiceUrl: 'https://' + domain + '/TaskProcessEngine/SessionManagementService.svc/jsAccessEP/',
        LogoutUrl: '/QuickFrame/login.html'//'http://10.132.122.19:8080/oamsso/logout.html?end_url=https://'+ domain +'/QuickFrame/ssologin.aspx'
    }
}());