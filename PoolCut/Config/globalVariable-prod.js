/// Product Environment
window.GlobalVariable = (function () {
    var protocol = location.protocol === 'https' ? 'https' : 'http';
    var domain = 'abss.crctrust.com';

    return {
        Host: 'http://' + domain + '/',
        SslHost: 'https://' + domain + '/'
    }
}());