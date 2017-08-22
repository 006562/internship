
var pageUrl, tid, mid, pid, bid;
$(function () {
    tid = getQueryString("tid");

    if (!tid || isNaN(tid)) {
        alert('Trust Id is Required!');
        return;
    }
    else {
        var $firstLi = $('.main-page-nav li').eq(0);

        pageUrl = $firstLi.data('url');
        pid = $firstLi.data('pid');
        mid = $firstLi.data('mid');
        loadIframePage();

        $("li").click(function () {
            var $clickedLi = $(this);
            if (!$(this).hasClass("active")) {
                $clickedLi.addClass('active').siblings().removeClass('active');

                pageUrl = $clickedLi.data('url');
                pid = $clickedLi.data('pid');
                mid = $clickedLi.data('mid');
                loadIframePage();
            }
        });
    }

    //changeMenu();
    myModel.Language = getLanguage(set);
    ko.applyBindings(myModel, $('.page')[0]);
});

function loadIframePage() {
    DataOperate.getGuid(tid, pid, mid, function (guid) {
        bid = guid;
        var iframePageUrl = pageUrl + '?tid=' + tid + '&pid=' + pid + '&mid=' + mid + '&bid=' + bid + '&set=' + set;
        var $iframe = $('.work iframe');
        $iframe.attr('src', iframePageUrl);
        $iframe.load(function () {
            $(this).fadeIn();
        });
    });    
}

function changeMenu() {
    var IsOpen = false;
    var $menu = $('.step-menu'),
        $aside = $('.page>.aside');

    $menu.unbind().click(function () {
        var $this = $(this), _left;

        if (IsOpen) {
            IsOpen = false;
            $aside.removeClass('menu');
            _left = 280;
        } else {
            IsOpen = true;
            $aside.addClass('menu');
            _left = 60;
        }
        $('.page').stop().animate({
            'padding-left': _left + 'px'
        }, 100);
    });
}