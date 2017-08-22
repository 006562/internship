/// Dit Environment
window.GlobalVariable = (function () {
    var protocol = location.protocol === 'https' ? 'https' : 'http';
    var domain = 'abs-dit.goldenstand.cn';

    return {
        Host: 'http://' + domain + '/',
        SslHost: 'https://' + domain + '/'
    }
}());