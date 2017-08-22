(function (doc,win) {
    var userName = $.cookie('gs_UserName');
    RoleOperate.getApplicationsByUserName(userName, function (data) {
        $.each(data, function (i, d) {
            $("#" + d.AppName).show();
        });
        
    });
   

    var dashBoard = doc.getElementById('dashBoard'),
        ribbonBoxs = doc.getElementsByClassName('ribbonBox'),
        page = doc.getElementById('page'); // 异步载入页面的插槽

    var bindMenu = null, //绑定菜单
        bindButton = null, //绑定按钮
        ribbonId = null; // 记录打开的RibbonBox

    if (dashBoard) dashBoard.addEventListener('click', function (event) {
        var event = event || win.event;
        event.preventDefault();
        event.stopPropagation();
        var currentMenu = event.target;
        var silbings = this.children;

        // 向下广播，移除菜单焦点样式
        for (var i = 0; i < silbings.length; i++) {
            var a = silbings[i].querySelector('a');
            if (a != currentMenu && currentMenu.tagName == 'A') {
                if (a.classList.contains('active'))
                    a.classList.remove('active');
                if (a.classList.contains('current'))
                    a.classList.remove('current');
                if (ribbonId != null) {
                    if (doc.getElementById(ribbonId) != null) { doc.getElementById(ribbonId).style.display = 'none'; }
                }
            }
        }
        // 点击浏览时不做任何操作
        if (this.getElementsByTagName('li')[0] != currentMenu.parentNode) {

            if(currentMenu.tagName == 'A'){
                ribbonId = 'ribbonBox-' + currentMenu.getAttribute('bind-id');
                var ribbonBox = doc.getElementById(ribbonId);

                if (ribbonBox != null) {


                    if (currentMenu.classList.contains('current')) {
                        currentMenu.classList.remove('current');
                        currentMenu.classList.add('active');
                        ribbonBox.style.display = 'block';
                    } else {
                        if (currentMenu.classList.contains('active')) {
                            currentMenu.classList.remove('active');
                            ribbonBox.style.display = 'none';
                            if (bindButton != null)
                                (bindMenu == currentMenu && bindButton.classList.contains('ribbonButtonActive')) ?
                                    currentMenu.classList.add('current') :
                                    bindMenu.classList.add('current');
                        } else {
                            currentMenu.classList.add('active');
                            ribbonBox.style.display = 'block';
                        }
                    }
                    var handler = function (event) {
                        var event = event || win.event;
                        var element = event.target;
                        if (element.matches) {
                            if (!element.matches('#' + ribbonId)) {
                                currentMenu.classList.remove('active');
                                ribbonBox.style.display = 'none';
                                if (bindButton != null) bindMenu.classList.add('current');
                            }
                        } else if (element.msMatchesSelector) {// fix ie
                            if (!element.msMatchesSelector('#' + ribbonId)) {
                                currentMenu.classList.remove('active');
                                ribbonBox.style.display = 'none';
                                if (bindButton != null) bindMenu.classList.add('current');
                            }
                        }
                    }
                    doc.removeEventListener('click', handler);
                    page.contentDocument.removeEventListener('click', handler);
                    doc.addEventListener('click', handler);
                    page.contentDocument.addEventListener('click', handler);
                }
            }
        }else{
            if(bindButton!=null) bindMenu.classList.add('current');
        }
    });

    if (ribbonBoxs) for (var i = 0; i < ribbonBoxs.length; i++) {
        ribbonBoxs[i].addEventListener('click', function (event) {
            var event = event || win.event;
            event.preventDefault();
            event.stopPropagation();
        });
        var ribbonButtons = ribbonBoxs[i].querySelectorAll('a');
        for (var r = 0; r < ribbonButtons.length; r++) {
            ribbonButtons[r].index = r;
            ribbonButtons[r].addEventListener('click', function (event) {
                var cateId = ribbonId.replace('ribbonBox-','');
                go('post-'+cateId+'-'+(this.index+1));
            });
        }
    }

    var menu = doc.getElementsByClassName('navbar-top-links')[0];
    var dropDown = menu.getElementsByClassName('toggle');

    if (dropDown) for (var i = 0 ; i < dropDown.length; i++) {
        dropDown[i].addEventListener('click', function (e) {
            var e = e || win.event;
            e.preventDefault();
            e.stopPropagation();
            var angleIcon = this.querySelectorAll('i')[1];
            var dropDownList = this.nextElementSibling;
            var silbings = menu.children;
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

    // 获取URL中的Hash值
    function getUrlHash(url){
        return url.indexOf('#') !== -1 ? url.substring(url.indexOf('#') + 2) : '/';
    }

    // 获取Hash中传递的参数 如 #/post-1-1，返回一个对象
    function getUrlHashParams(url) {
        if (url.indexOf('?') != -1) {
            var params = url.split('?');
            if (params[0].indexOf('-') != -1) {
                hash = params[0].split('-');
                return {
                    type: hash[0],
                    menuId: hash[1],
                    pageId: hash[2],
                    query: '?' + params[1],
                    url: '#/' + url
                }
            }
        } else {
            if(url.indexOf('-')!==-1){
                var hash = url.split('-');
                return {
                    type : hash[0],
                    menuId : hash[1],
                    pageId: hash[2],
                    query:null,
                    url: '#/' + url
                }
            }
        }
        return false;
    }

    function go(url){

        var hash = getUrlHashParams(url);

        if(hash && hash.type == 'post'){

            var ribbonBox = doc.getElementById('ribbonBox-' + hash.menuId);
            if (ribbonBox != null) {
                ribbonBox.style.display = 'none';
                if (bindMenu != null) bindMenu.classList.remove('current');
                bindMenu = dashBoard.querySelectorAll('li')[hash.menuId].querySelector('a');
                if (bindButton != null) bindButton.classList.remove('ribbonButtonActive');
                bindButton = ribbonBoxs[hash.menuId - 1].querySelectorAll('a')[hash.pageId - 1];
                var btnUrl = bindButton.href;
                if (typeof btnUrl != 'undefined' && btnUrl != 'javascript:;') {
                    if (hash.query) btnUrl = btnUrl + hash.query; // 如果存在参数，添加到页面url中
                    page.contentWindow.location.replace(btnUrl); // 在Iframe页面中发起一个访问请求 (这里不能跨域请求)
                }
                bindMenu.classList.remove('active');
                bindMenu.classList.add('current');
                bindButton.classList.add('ribbonButtonActive');
                location.hash = hash.url;
            }
        }
        hash = null;
    }

    win.onhashchange = function(){
        go(getUrlHash(win.location.href));
    };

    go(getUrlHash(win.location.href));

})(document,window);