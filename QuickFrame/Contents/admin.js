(function (doc, win) {
    // 获取URL中的Hash值
    var getUrlHash = function (url) {
        return url.indexOf('#') !== -1 ? url.substring(url.indexOf('#') + 1) : '/';
    }
    var getModuleId = function (url) {
        var hash = getUrlHash(url);
        var params = hash.split('=');
        if (params && params[0] == 'moduleId') {
            return parseInt(params[1]) - 1;
        } else {
            return 0;
        }
    }
    var menu = function (title, id, url, selected, permission) {
        this.title = title;
        this.url = url;
        this.isPermission = permission(id);
        this.isSelected = ko.computed(function () {
            if (this == selected()) {
                var m = selected(), $page = $('#page');
                $page[0].contentWindow.location.replace(m.url);
                return true;
            }
            return false;
        }, this);
    }
    var userAdmin = function () {
        var self = this;
        this.userName = RoleOperate.cookieName();
        this.website = GlobalVariable.SslHost;
        this.trustManagement = this.website + 'TrustManagementService/';
        this.poolcut = this.website + 'poolcut/';
        this.quantanalysis = this.website + 'QuickWizardService/';
        this.currentMenu = ko.observable();
        this.menu = [];
        this.welcome = ko.computed(function () {
            var now = new Date(), hour = now.getHours();
            switch (true) {
                case hour > 22 || hour < 4:
                    return '夜深了，注意休息';
                    break;
                case hour < 10:
                    return '早上好';
                    break;
                case hour < 12:
                    return '上午好';
                    break;
                case hour < 14:
                    return '中午好';
                    break;
                case hour < 17:
                    return '下午好';
                    break;
                case hour <= 22:
                    return '晚上好';
                    break;
            }
        }, this);
        this.showOperationList = function () {
            $.anyDialog({
                width: 1000,	// 弹出框内容宽度
                height: 600, // 弹出框内容高度
                title: '统计视图',	// 弹出框标题
                url: 'history.html' //展示页面
            })
        };
        this.loginOut = function () {
            if (confirm('确定要退出登录？')) {
                RoleOperate.cookieNameRemove();
                window.top.location.href = GlobalVariable.LogoutUrl; //"/QuickFrame/login.html";
            }
        }
    }

    var data = new userAdmin();

    (data.userName) ? RoleOperate.getApplicationsByUserName(data.userName, function (response) {

        var isPermission = function (id) {
            var a = [];
            $.each(response, function (k, v) {
                a.push(v.AppName);
            });
            return ($.inArray(id, a) != -1) ? true : false;
        };

        data.currentMenu.subscribe(function (newVal) {
            var i = data.menu().indexOf(newVal);
            location.hash = 'moduleId=' + (i + 1);
        });

        data.menu = ko.observableArray([
            new menu('专项计划中心', 'TrustManagementService', data.trustManagement + 'UIFrame/Index.html', data.currentMenu, isPermission),
            new menu('资产池中心', 'PoolCut', data.poolcut + 'Index.html', data.currentMenu, isPermission),
            new menu('量化分析中心', 'QuickWizardService', data.quantanalysis + 'Index.html', data.currentMenu, isPermission),
            new menu('用户管理', 'QuickFrame', '/QuickFrame/Pages/roles.html', data.currentMenu, isPermission)
        ]);

        win.onhashchange = function () {
            var url = win.location.href;
            var moduleId = getModuleId(url);
            data.currentMenu(data.menu()[moduleId]);
        };

        var url = win.location.href;
        var moduleId = getModuleId(url);
        data.currentMenu(data.menu()[moduleId]);
        ko.applyBindings(data);
    }) : (function () { window.location.href = '/QuickFrame/login.html'; })();

    var navbar = doc.getElementsByClassName('navbar-top-links')[0];
    var dropDown = navbar.getElementsByClassName('toggle');

    if (dropDown) for (var i = 0 ; i < dropDown.length; i++) {
        dropDown[i].addEventListener('click', function (e) {
            var e = e || win.event;
            e.preventDefault();
            e.stopPropagation();
            var angleIcon = this.querySelectorAll('i')[1];
            var dropDownList = this.nextElementSibling;
            var silbings = navbar.children;
            if (silbings.length > 0) {
                for (var s = 0; s < silbings.length; s++) {
                    var a = silbings[s].querySelectorAll('.toggle')[0];
                    var aIcon = a.querySelectorAll('i')[1];
                    if (typeof a != 'undefined' && a != this) {
                        aIcon.className = aIcon.className.replace('up', 'down');
                        a.parentNode.classList.remove('active');
                    }
                }
            }
            if (dropDownList && angleIcon) {
                if (this.parentNode.classList.contains('active')) {
                    this.parentNode.classList.remove('active');
                    angleIcon.className = angleIcon.className.replace('up', 'down');
                } else {
                    this.parentNode.classList.add('active');
                    angleIcon.className = angleIcon.className.replace('down', 'up');
                }
                var handler = function (event) {
                    this.parentNode.classList.remove('active');
                    angleIcon.className = angleIcon.className.replace('up', 'down');
                }
                doc.removeEventListener('click', handler.bind(this));
                page.contentDocument.removeEventListener('click', handler.bind(this));
                doc.addEventListener('click', handler.bind(this));
                page.contentDocument.addEventListener('click', handler.bind(this));
            }
        });
    }
})(document, window);