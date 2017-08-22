$(function () {
    var bid = getQueryString("bid");
    var tid = getQueryString("tid");

    if (bid == null) {
        if(confirm("是否加载新页面"))
        {
            DataOperate.getGuid(renderURL);
        }
        else
        {
            bid=$.cookie('businessid');
            if(bid=='null')
            {
                DataOperate.getGuid(renderURL);
            }
            else
            {
                renderURL(bid);
            }
        }
    }
    else {
        var dUrl = $("li").eq(0).data('url') + "&bid=" + bid+"&set="+set + "&tid=" + tid;
        var $iframe = $('.work iframe');
        $iframe.attr('src', dUrl);
        $iframe.load(function () {
            $(this).fadeIn();
        });
        $("li").click(function () {
            if (!$(this).hasClass("active")) {
                var url = $(this).data('url');
                url = url + "&bid=" + bid + "&set="+set + "&tid=" + tid;
                $iframe.hide();
                $iframe.attr('src', url);
                $iframe.load(function () {
                    $(this).fadeIn();
                });
                $("li").each(function () {
                    $(this).removeClass("active");
                    $(this).css("cursor", "pointer");
                })
                $(this).addClass("active");
                $(this).css("cursor", "default");
            }
        });
    }
    ko.applyBindings(myModel);

    function renderURL(bid) {
        $.cookie('businessid',bid,{expires: 7});
        //$.cookie('set',set,{expires: 7});
        var currentURL = window.location + "&bid=" + bid + "&set=" + set;
        window.location.href = currentURL;
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
    changeMenu();
});

