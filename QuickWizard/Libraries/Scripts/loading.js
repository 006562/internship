var Loading = (function () {
    
    function show(text) {
        close();
        if (typeof (text) == undefined || text == null) {
            text = '页面加载中，请稍后...';
        }
        var html = '<div id="loading" class="loadpage">' +
             '<div class="loading-wraper">' +
             ' <i class="icon-cog bigicon am-rotate pa"></i>' +
             ' <i class="icon-cog smicon am-rotate pa"></i>' +
             ' <p class="text pa">' + text + '</p>' +
             '</div>' +
             '</div>'

        var div = document.createElement("div");
        div.innerHTML = html;
        document.body.appendChild(div);
    }
 

    function close() {
        var _element = document.getElementById('loading');
        if (_element) {
            var _parentElement = _element.parentNode;
            if (_parentElement) {
                _parentElement.removeChild(_element);
            }
        }
    }

    return {
        Show: show,
        Close: close,
    }
})();